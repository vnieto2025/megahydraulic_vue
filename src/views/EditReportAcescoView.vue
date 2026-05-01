<template>
    <LayoutView>
        <div class="container-header">
            <button type="button" class="btn-volver" @click="volver">
                ← Volver
            </button>
        </div>
        <form @submit.prevent="editReport">
            <h2>Formulario de Edición de Reporte Acesco</h2>

            <!-- Fila 1: Fecha, Cliente, Línea -->
            <div class="row g-3">
                <div class="col-md-4 form-group">
                    <label for="txt_fecha_actividad">Fecha Actividad:</label>
                    <input type="date" id="txt_fecha_actividad" v-model="fecha_actividad">
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_cliente">Cliente:</label>
                    <select id="select_cliente" v-model="cliente_seleccionado" @change="onClienteChange" required>
                        <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_linea">Línea:</label>
                    <select id="select_linea" v-model="linea_seleccionada" required>
                        <option v-for="line in line_list" :key="line.id" :value="line.id">{{ line.name }}</option>
                    </select>
                </div>
            </div>

            <!-- Fila 2: Persona, Zona de Trabajo, OM -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="select_persona">Persona que recibe:</label>
                    <select id="select_persona" v-model="persona_seleccionada" required>
                        <option v-for="person in person_list" :key="person.id" :value="person.id">{{ person.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_zona_trabajo">Zona de Trabajo:</label>
                    <input type="text" id="txt_zona_trabajo" v-model="zona_trabajo" required>
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_om">OM:</label>
                    <input type="text" id="txt_om" v-model="om">
                </div>
            </div>

            <!-- Fila 3: Solped, Orden de compra, Posición -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="txt_solped">Solped:</label>
                    <input type="text" id="txt_solped" v-model="solped">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_orden">Orden de compra:</label>
                    <input type="text" id="txt_orden" v-model="orden_compra">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_posicion">Posición:</label>
                    <input type="text" id="txt_posicion" v-model="posicion">
                </div>
            </div>

            <!-- Fila 4: Descripción del servicio, Información -->
            <div class="row g-3 mt-1">
                <div class="col-md-6 form-group">
                    <label for="txt_descripcion_servicio">Descripción del servicio:</label>
                    <textarea id="txt_descripcion_servicio" v-model="descripcion_servicio" rows="4"></textarea>
                </div>
                <div class="col-md-6 form-group">
                    <label for="txt_informacion">Información:</label>
                    <textarea id="txt_informacion" v-model="informacion" rows="4"></textarea>
                </div>
            </div>

            <!-- Fila 5: Valor del servicio -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="txt_valor_servicio">Valor del Servicio:</label>
                    <input type="number" id="txt_valor_servicio" v-model="valor_servicio">
                </div>
            </div>

            <!-- Fila 6: Conclusiones, Recomendaciones -->
            <div class="row g-3 mt-1">
                <div class="col-md-6 form-group">
                    <label for="txt_conclusiones">Conclusiones:</label>
                    <textarea id="txt_conclusiones" v-model="conclusiones" rows="4"></textarea>
                </div>
                <div class="col-md-6 form-group">
                    <label for="txt_recomendaciones">Recomendaciones:</label>
                    <textarea id="txt_recomendaciones" v-model="recomendaciones" rows="4"></textarea>
                </div>
            </div>

            <hr>

            <!-- Fila 7: Evidencias fijas -->
            <div class="row g-3">
                <div class="col-md-6 form-group">
                    <label for="registro_evidencia_antes">Registro Evidencia Antes:</label>
                    <div v-if="imagenes[0]">
                        <img
                            :src="imagenes[0].startsWith('data:') ? imagenes[0] : `${apiUrl}/${imagenes[0]}`"
                            alt="Vista previa"
                            class="img-thumbnail mb-1"
                            style="max-width: 150px; max-height: 100px; cursor: pointer;"
                            @click="enlargeImage(imagenes[0].startsWith('data:') ? imagenes[0] : `${apiUrl}/${imagenes[0]}`)"
                        />
                    </div>
                    <input type="file" id="registro_evidencia_antes" @change="handleImageChange($event, 0)" accept="image/*" class="form-control">
                </div>
                <div class="col-md-6 form-group">
                    <label for="registro_evidencia_despues">Registro Evidencia Después:</label>
                    <div v-if="imagenes[1]">
                        <img
                            :src="imagenes[1].startsWith('data:') ? imagenes[1] : `${apiUrl}/${imagenes[1]}`"
                            alt="Vista previa"
                            class="img-thumbnail mb-1"
                            style="max-width: 150px; max-height: 100px; cursor: pointer;"
                            @click="enlargeImage(imagenes[1].startsWith('data:') ? imagenes[1] : `${apiUrl}/${imagenes[1]}`)"
                        />
                    </div>
                    <input type="file" id="registro_evidencia_despues" @change="handleImageChange($event, 1)" accept="image/*" class="form-control">
                </div>
            </div>

            <hr>

            <!-- Anexos dinámicos -->
            <div class="form-group mt-3">
                <h5>Anexos</h5>
                <div v-for="(image, index) in anexos" :key="index" class="row g-3 mb-2 align-items-end">
                    <div class="col-md-4">
                        <div v-if="image">
                            <img
                                :src="image.startsWith('data:') ? image : `${apiUrl}/${image}`"
                                alt="Vista previa"
                                class="img-thumbnail mb-1"
                                style="max-width: 150px; max-height: 100px; cursor: pointer;"
                                @click="enlargeImage(image.startsWith('data:') ? image : `${apiUrl}/${image}`)"
                            />
                        </div>
                        <input
                            type="file"
                            @change="handleImageChangeDinamic($event, index)"
                            class="form-control"
                            accept="image/*"
                        />
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-danger w-100" @click="removeImageInput(index)">Eliminar</button>
                    </div>
                </div>
                <button type="button" class="btn btn-primary mt-2" @click="addImageInput">
                    Agregar Anexo
                </button>
            </div>

            <hr>

            <!-- Fila 8: Técnico 1, Técnico 2 -->
            <div class="row g-3">
                <div class="col-md-6 form-group">
                    <label for="txt_tecnico1">Técnico 1:</label>
                    <input type="text" id="txt_tecnico1" v-model="tecnico1" required>
                </div>
                <div class="col-md-6 form-group">
                    <label for="txt_tecnico2">Técnico 2:</label>
                    <input type="text" id="txt_tecnico2" v-model="tecnico2">
                </div>
            </div>

            <hr>

            <button type="submit" class="btn btn-primary mt-3" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                {{ isLoading ? 'Actualizando...' : 'Actualizar' }}
            </button>
        </form>

        <!-- Modal de éxito -->
        <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exitoModalLabel">Modal Reporte</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        {{ msg }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="generar_pdf()">Generar PDF</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LayoutView from '../views/Layouts/LayoutView.vue';
import { Modal } from 'bootstrap';
import { useAuthStore } from '../stores/auth.js';
import {
    useParamClients, useParamLinesByClient, useParamUsersByClient,
} from '../composables/useParams.js';
import { useEditReportAcesco, useGenerateReportAcesco } from '../composables/useReportsAcesco.js';
import { reportsAcescoApi } from '../api/reportsAcesco.js';
import { useMutation } from '@tanstack/vue-query';

const auth = useAuthStore();
const router = useRouter();

// ── Estado ────────────────────────────────────────────────────────────────────
const imagenes = ref([]);
const anexos = ref([]);
const fecha_actividad = ref('');
const cliente_seleccionado = ref(null);
const linea_seleccionada = ref(null);
const persona_seleccionada = ref(null);
const zona_trabajo = ref('');
const om = ref('');
const solped = ref('');
const orden_compra = ref('');
const posicion = ref('');
const descripcion_servicio = ref('');
const informacion = ref('');
const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const report_id = ref('');
const msg = ref('');
const error = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const valor_servicio = ref(0);
const conclusiones = ref('');
const recomendaciones = ref('');
const tecnico1 = ref('');
const tecnico2 = ref('');

// ── Queries de parámetros ─────────────────────────────────────────────────────
const { data: clientsParamData } = useParamClients();
const client_list = computed(() => clientsParamData.value ?? []);

const { data: linesData } = useParamLinesByClient(cliente_seleccionado);
const line_list = computed(() => linesData.value ?? []);

const { data: personsData } = useParamUsersByClient(cliente_seleccionado);
const person_list = computed(() => personsData.value ?? []);

// ── Carga datos del reporte (flag=false) ──────────────────────────────────────
const { mutate: loadReportData } = useMutation({
    mutationFn: (id) => reportsAcescoApi.getData(id),
});

// ── Mutations ─────────────────────────────────────────────────────────────────
const { mutate: editReportMutate } = useEditReportAcesco();
const { mutate: generateReportMutate } = useGenerateReportAcesco();

const editReport = () => {
    isLoading.value = true;
    const [year, month, day] = fecha_actividad.value.split('-');
    const fecha_formateada = `${day}-${month}-${year}`;
    editReportMutate(
        {
            report_id: report_id.value,
            activity_date: fecha_formateada,
            client_id: cliente_seleccionado.value,
            client_line_id: linea_seleccionada.value,
            person_receives: persona_seleccionada.value,
            work_zone: zona_trabajo.value,
            om: om.value,
            solped: solped.value,
            buy_order: orden_compra.value,
            position: posicion.value,
            service_description: descripcion_servicio.value,
            information: informacion.value,
            service_value: valor_servicio.value,
            conclutions: conclusiones.value,
            recommendations: recomendaciones.value,
            files: imagenes.value,
            anexos: anexos.value,
            tech_1: tecnico1.value,
            tech_2: tecnico2.value,
            user_id: auth.userId,
        },
        {
            onSuccess: (response) => {
                msg.value = response.data.message;
                report_id.value = response.data.data;
                modalInstance.value.show();
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || 'Error al editar reporte';
                modalErrorInstance.value.show();
            },
            onSettled: () => { isLoading.value = false; },
        }
    );
};

const generar_pdf = () => {
    generateReportMutate(
        { reportId: report_id.value, flag: true },
        {
            onSuccess: (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `reporte_${report_id.value}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || 'Error al generar PDF';
                modalErrorInstance.value.show();
            },
        }
    );
};

const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => { imagenes.value[index] = reader.result; };
        reader.readAsDataURL(file);
    }
};
const enlargeImage = (path) => { window.open(path, '_blank'); };
const addImageInput = () => { anexos.value.push(''); };
const removeImageInput = (index) => { anexos.value.splice(index, 1); };
const handleImageChangeDinamic = (event, index) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => { anexos.value[index] = reader.result; };
        reader.readAsDataURL(file);
    }
};

function logout() { auth.clearSession(); router.push('/'); }
function redirigir_dashboard() { router.push('/dashboard'); }
function volver() { router.push('/reports-acesco'); }

const onClienteChange = () => {};

onMounted(() => {
    report_id.value = router.currentRoute.value.params.id;
    modalInstance.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
    loadReportData(report_id.value, {
        onSuccess: (response) => {
            const val = response.data.data;
            fecha_actividad.value = val.activity_date;
            zona_trabajo.value = val.work_zone;
            om.value = val.om;
            solped.value = val.solped;
            orden_compra.value = val.buy_order;
            posicion.value = val.position;
            cliente_seleccionado.value = val.client_id;
            linea_seleccionada.value = val.client_line_id;
            persona_seleccionada.value = val.person_receive_id;
            descripcion_servicio.value = val.service_description;
            informacion.value = val.information;
            valor_servicio.value = val.service_value;
            conclusiones.value = val.conclutions;
            recomendaciones.value = val.recommendations;
            imagenes.value = val.files.map(file => file.path);
            anexos.value = val.anexos.map(file => file.path);
            tecnico1.value = val.tech_1;
            tecnico2.value = val.tech_2;
        },
    });
});
</script>

<style scoped>

body,
html {
  height: 100%;
  font-size: 62.5%;
  font-family: "DM Sans", serif;
}

.container-header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.btn-volver {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-volver:hover {
  background-color: #545b62;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: flex-start;
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

.img-thumbnail {
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  margin-right: 10px;
}

hr {
    margin-top: 10px;
    margin-bottom: 20px;
}

</style>
