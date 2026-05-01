<template>
    <LayoutView>

    <div class="change-password">
        <form @submit.prevent="cambiarPassword">
            <h2>Cambiar Contraseña</h2>
            <div class="form-group">
                <label for="currentPassword">Contraseña Actual</label>
                <div class="group-button">
                    <input
                        :type="showCurrentPassword ? 'text' : 'password'"
                        id="currentPassword"
                        v-model="currentPassword"
                        placeholder="Ingresa tu contraseña actual"
                    />
                    <button type="button" @click="toggleShow('current')">
                        <span v-if="showCurrentPassword">🙈</span>
                        <span v-else>👁️</span>
                    </button>
                </div>
            </div>

            <div class="form-group">
                <label for="newPassword">Nueva Contraseña</label>
                <div class="group-button">
                    <input
                        :type="showNewPassword ? 'text' : 'password'"
                        id="newPassword"
                        v-model="newPassword"
                        placeholder="Ingresa tu nueva contraseña"
                    />
                    <button type="button" @click="toggleShow('new')">
                        <span v-if="showNewPassword">🙈</span>
                        <span v-else>👁️</span>
                    </button>
                </div>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirmar Nueva Contraseña</label>
                <div class="group-button">
                    <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        id="confirmPassword"
                        v-model="confirmPassword"
                        placeholder="Confirma tu nueva contraseña"
                    />
                    <button type="button" @click="toggleShow('confirm')">
                        <span v-if="showConfirmPassword">🙈</span>
                        <span v-else>👁️</span>
                    </button>
                </div>
            </div>

            <button type="submit">Cambiar Contraseña</button>
  
        </form>
    </div>


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
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="logout">Cerrar</button>
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
import { ref, onMounted } from 'vue';
import LayoutView from '../views/Layouts/LayoutView.vue';
import { Modal } from 'bootstrap';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useChangePassword } from '../composables/useUsers.js';

const auth = useAuthStore();
const router = useRouter();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const msg = ref('');
const errorMsg = ref('');
const token_status = ref(0);

const { mutate: changePassword } = useChangePassword();

const toggleShow = (field) => {
    if (field === "current") showCurrentPassword.value = !showCurrentPassword.value;
    if (field === "new") showNewPassword.value = !showNewPassword.value;
    if (field === "confirm") showConfirmPassword.value = !showConfirmPassword.value;
};

const cambiarPassword = () => {
    if (newPassword.value !== confirmPassword.value) {
        errorMsg.value = "La nueva contraseña y la confirmación no coinciden.";
        modalErrorInstance.value.show();
        return;
    }
    changePassword(
        {
            user_id: auth.userId,
            current_password: currentPassword.value,
            new_password: newPassword.value
        },
        {
            onSuccess: (response) => {
                msg.value = response.data.message;
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
    align-items: center;
    flex-direction: column;
    width: 50%;
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

.group-button {
    display: flex;
}

label {
    margin-bottom: 1px;
}

input, textarea, select {
    width: 250px;
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
    margin-bottom: 2px;
}

@media (max-width: 768px) {
    .form-check {
        width: 100%; /* En pantallas pequeñas, cada checkbox ocupará todo el ancho disponible */
    }
}

</style>