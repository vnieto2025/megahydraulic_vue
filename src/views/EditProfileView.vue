<template>
    <LayoutView>
      <form @submit.prevent="actualizarPerfil">
            <h2>Editar Perfil</h2>

            <div class="form-group">
                <label for="documento">Documento:</label>
                <input type="text" id="documento" v-model="documento" readonly>
            </div>
            <div class="form-group">
                <label for="primer_nombre">Primer Nombre:</label>
                <input type="text" id="primer_nombre" v-model="primer_nombre">
            </div>
            <div class="form-group">
                <label for="segundo_nombre">Segundo Nombre:</label>
                <input type="text" id="segundo_nombre" v-model="segundo_nombre">
            </div>
            <div class="form-group">
                <label for="primer_apellido">Primer Apellido:</label>
                <input type="text" id="primer_apellido" v-model="primer_apellido">
            </div>
            <div class="form-group">
                <label for="segundo_apellido">Segundo Apellido:</label>
                <input type="text" id="segundo_apellido" v-model="segundo_apellido">
            </div>
            <div class="form-group">
                <label for="correo">Correo Eléctronico:</label>
                <input type="email" id="correo" v-model="correo">
            </div>
            <div class="form-group">
                <label for="foto">Foto:</label>
                <input
                    type="file"
                    class="form-control"
                    @change="handleFileUpload"
                />
            </div>

            <button type="submit">Actualizar</button>
            <div v-if="error" class="alert alert-danger mt-3" >
                {{ error }}
            </div>
      </form>

      <!-- Modal de éxito -->
        <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exitoModalLabel">Modal Usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        {{ msg }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="refresh">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

         <!-- Modal de error -->
         <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="errorModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="errorModalLabel">Modal Usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        {{ errorMsg }}
                    </div>
                    <div class="modal-footer" v-if="token_status===401">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="logout">Cerrar</button>
                    </div>
                    <div class="modal-footer" v-else-if="token_status===403">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="redirigir_dashboard">Cerrar</button>
                    </div>
                    <div class="modal-footer" v-else>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
  </LayoutView>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from "vue-router";
import LayoutView from '../views/Layouts/LayoutView.vue';
import { Modal } from 'bootstrap';
import { useAuthStore } from '../stores/auth.js';
import { useUpdateUser, useUser } from '../composables/useUsers.js';

const auth = useAuthStore();
const router = useRouter();

const documento = ref('');
const primer_nombre = ref('');
const segundo_nombre = ref('');
const primer_apellido = ref('');
const segundo_apellido = ref('');
const correo = ref('');
const foto = ref(null);
const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const msg = ref('');
const error = ref('');
const errorMsg = ref('');
const token_status = ref(0);

const { data: userData } = useUser(auth.userId);
watch(userData, (val) => {
    if (val) {
        documento.value = val.document;
        primer_nombre.value = val.first_name;
        segundo_nombre.value = val.second_name;
        primer_apellido.value = val.last_name;
        segundo_apellido.value = val.second_last_name;
        correo.value = val.email;
    }
}, { immediate: true });

const { mutate: updateUser } = useUpdateUser();

const actualizarPerfil = () => {
    updateUser(
        {
            user_id: auth.userId,
            document: documento.value,
            first_name: primer_nombre.value,
            second_name: segundo_nombre.value,
            last_name: primer_apellido.value,
            second_last_name: segundo_apellido.value,
            email: correo.value,
            photo: foto.value
        },
        {
            onSuccess: (response) => {
                msg.value = response.data.message;
                if (foto.value != null) {
                    auth.setSession({ ...auth.$state, photo: response.data.data });
                }
                modalInstance.value.show();
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || 'Error';
                token_status.value = err.response?.status || 0;
                if (err.response?.status === 401) errorMsg.value = err.response.data.detail;
                else if (err.response?.status === 403) errorMsg.value = err.response.data.detail;
                modalErrorInstance.value.show();
            }
        }
    );
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { foto.value = reader.result; };
    reader.readAsDataURL(file);
};

const refresh = () => { location.reload(); };
function logout() { auth.clearSession(); router.push('/'); };
function redirigir_dashboard() { router.push('/dashboard'); };

onMounted(() => {
    modalInstance.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
});

</script>

<style scoped>

body,
html {
  height: 100%;
  font-size: 62.5%;
  font-family: "DM Sans", serif;
}

form {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    margin-bottom: 20px;
}

form h2 {
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

label {
    margin-bottom: 1px;
}

input, textarea, select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

button {
    background-color: #2a475f;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.input {
    background-color: #F7F7F7;
    border: none;
    border-radius: 8px;
    height: 30px;
    font-size: 16px;
    padding: 6px;
    margin-bottom: 12px;
}

.checkbox-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap; /* Permite que los elementos se ajusten en varias filas si es necesario */
    gap: 5px; /* Espacio entre los checkboxes */
    width: 85%; /* Asegura que el contenedor ocupe todo el ancho */
    justify-content: space-between; /* Distribuye los elementos */
    margin-left: 25px;
}

.form-check {
    display: flex;
    align-items: center;
    width: calc(50% - 10px); /* Ajusta el ancho de cada checkbox (50% menos el espacio del gap) */
    box-sizing: border-box;
}

@media (max-width: 768px) {
    .form-check {
        width: 100%; /* En pantallas pequeñas, cada checkbox ocupará todo el ancho disponible */
    }
}

.form-check-input {
    margin-right: 8px; /* Espacio entre el checkbox y el texto */
}

.form-check-label {
    flex: 1;
    overflow: hidden; /* Evita que el texto se desborde */
    text-overflow: ellipsis;
    white-space: nowrap;
}

hr {
    margin-top: 10px;
    margin-bottom: 20px;
}

</style>