<template>
    <LayoutView>
        <div class="container-header">
            <button type="button" class="btn-volver" @click="volver">
                ← Volver
            </button>
        </div>
        <form @submit.prevent="editReport">
            <h2>Formulario de Edición de Reporte</h2>

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

            <!-- Fila 2: Persona, OM, Solped -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="select_persona">Persona que recibe:</label>
                    <select id="select_persona" v-model="persona_seleccionada" required>
                        <option v-for="person in person_list" :key="person.id" :value="person.id">{{ person.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_om">OM:</label>
                    <input type="text" id="txt_om" v-model="om">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_solped">Solped:</label>
                    <input type="text" id="txt_solped" v-model="solped">
                </div>
            </div>

            <!-- Fila 3: Orden de compra, Posición -->
            <div class="row g-3 mt-1">
                <div class="col-md-6 form-group">
                    <label for="txt_orden">Orden de compra:</label>
                    <input type="text" id="txt_orden" v-model="orden_compra">
                </div>
                <div class="col-md-6 form-group">
                    <label for="txt_posicion">Posición:</label>
                    <input type="text" id="txt_posicion" v-model="posicion">
                </div>
            </div>

            <hr>

            <div class="form-group">
                <label>Tipo de servicios:</label>
            </div>
            <div class="form-group checkbox-container">
                <div v-for="option in servicios_list" :key="option.id" class="form-check">
                    <input 
                        type="checkbox" 
                        class="form-check-input" 
                        :id="'service-' + option.id" 
                        :value="option.id" 
                        v-model="servicios_seleccionados" 
                    />
                    <label :for="'service-' + option.id" class="form-check-label">
                        {{ option.name }}
                    </label>
                </div>
            </div>

            <hr>

            <!-- Fila 4: Nombre equipo, Tipo equipo -->
            <div class="row g-3">
                <div class="col-md-6 form-group">
                    <label for="txt_nombre_equipo">Nombre de equipo intervenido:</label>
                    <input type="text" id="txt_nombre_equipo" v-model="nombre_equipo">
                </div>
                <div class="col-md-6 form-group">
                    <label for="select_tipo_equipo">Tipo Equipo Intervenido:</label>
                    <select id="select_tipo_equipo" v-model="tipo_equipo" @change="onChangeTasks" required>
                        <option v-for="equip in equipos_list" :key="equip.id" :value="equip.id">{{ equip.name }}</option>
                    </select>
                </div>
            </div>

            <!-- Fila 5: Descripción, Información -->
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

            <div class="form-group table-responsive">
                <table class="table table-striped" v-if="tasks_list.length" border="1" cellspacing="0" cellpadding="5">
                    <thead class="table-dark">
                        <tr>
                            <th>Tarea</th>
                            <th>SI</th>
                            <th>NO</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="task in tasks_list" :key="task.id">
                            <td>{{ task.name }}</td>
                            <td>
                                <input
                                    type="radio"
                                    :id="'positive_' + task.id"
                                    v-model="task.positive"
                                    :value="1"
                                />
                            </td>
                            <td>
                                <input
                                    type="radio"
                                    :id="'negative_' + task.id"
                                    v-model="task.positive"
                                    :value="0"
                                />
                            </td>
                            <td>
                                <textarea v-model="task.description" rows="2" cols="25"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr>

            <!-- Imágenes dinámicas -->
            <div class="form-group mt-3">
                <h4>Imágenes</h4>
                <div v-for="(image, index) in imagenes" :key="index" class="row g-3 mb-3 align-items-end">
                    <div class="col-md-5">
                        <div v-if="image.img">
                            <img
                                :src="image.img.startsWith('data:') ? image.img : `${apiUrl}/${image.img}`"
                                alt="Vista previa"
                                class="img-thumbnail mb-1"
                                style="max-width: 150px; max-height: 100px; cursor: pointer;"
                                @click="enlargeImage(image.img.startsWith('data:') ? image.img : `${apiUrl}/${image.img}`)"
                            />
                        </div>
                        <input
                            type="file"
                            @change="handleImageChange($event, index)"
                            class="form-control"
                            accept="image/*"
                        />
                    </div>
                    <div class="col-md-5">
                        <textarea
                            v-model="image.description"
                            placeholder="Descripción de la imagen"
                            class="form-control"
                            rows="2"
                        ></textarea>
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-danger w-100" @click="removeImageInput(index)">Eliminar</button>
                    </div>
                </div>
                <button type="button" class="btn btn-primary mt-2" @click="addImageInput">
                    Agregar imagen
                </button>
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LayoutView from '../views/Layouts/LayoutView.vue';
import apiUrl from '../../config.js';
import { Modal } from 'bootstrap';
import { useAuthStore } from '../stores/auth.js';
import {
    useParamClients, useParamLinesByClient, useParamUsersByClient,
    useParamTypeService, useParamTypeEquipments, useParamTasksByEquipment,
} from '../composables/useParams.js';
import { useEditReport, useGenerateReport } from '../composables/useReports.js';
import { reportsApi } from '../api/reports.js';
import { useMutation } from '@tanstack/vue-query';

const auth = useAuthStore();
const router = useRouter();

// ── Estado ────────────────────────────────────────────────────────────────────
const tasks_list = ref([]);
const tasks = ref([]);
const imagenes = ref([]);
const fecha_actividad = ref('');
const cliente_seleccionado = ref(null);
const linea_seleccionada = ref(null);
const persona_seleccionada = ref(null);
const om = ref('');
const solped = ref('');
const orden_compra = ref('');
const posicion = ref('');
const tipo_equipo = ref('');
const nombre_equipo = ref('');
const descripcion_servicio = ref('');
const informacion = ref('');
const servicios_seleccionados = ref([]);
const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const report_id = ref('');
const msg = ref('');
const error = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

// ── Queries de parámetros ─────────────────────────────────────────────────────
const { data: clientsParamData } = useParamClients();
const client_list = computed(() => clientsParamData.value ?? []);

const { data: serviciosData } = useParamTypeService();
const servicios_list = computed(() => serviciosData.value ?? []);

const { data: equiposData } = useParamTypeEquipments();
const equipos_list = computed(() => equiposData.value ?? []);

const { data: linesData } = useParamLinesByClient(cliente_seleccionado);
const line_list = computed(() => linesData.value ?? []);

const { data: personsData } = useParamUsersByClient(cliente_seleccionado);
const person_list = computed(() => personsData.value ?? []);

const { data: rawTasksData } = useParamTasksByEquipment(tipo_equipo);
watch([rawTasksData, tipo_equipo], ([rawTasks, tipoEquip]) => {
    if (tipoEquip === 5) { tasks_list.value = []; return; }
    if (rawTasks?.length && !tasks_list.value.some(t => t.id === rawTasks[0]?.id)) {
        tasks_list.value = rawTasks.map(task => ({
            ...task, positive: task.positive ?? 1, description: task.description ?? '',
        }));
    }
});

// ── Carga datos del reporte (flag=false) ──────────────────────────────────────
const { mutate: loadReportData } = useMutation({
    mutationFn: (id) => reportsApi.getData(id),
});

// ── Mutations ─────────────────────────────────────────────────────────────────
const { mutate: editReportMutate } = useEditReport();
const { mutate: generateReportMutate } = useGenerateReport();

const editReport = () => {
    isLoading.value = true;
    const [year, month, day] = fecha_actividad.value.split('-');
    const fecha_formateada = `${day}-${month}-${year}`;
    tasks.value = tasks_list.value.map((task) => ({
        task_id: task.id,
        positive: task.positive,
        negative: task.positive === 1 ? 0 : 1,
        description: task.description,
    }));
    editReportMutate(
        {
            report_id: report_id.value,
            activity_date: fecha_formateada,
            client_id: cliente_seleccionado.value,
            client_line_id: linea_seleccionada.value,
            person_receives: persona_seleccionada.value,
            om: om.value,
            solped: solped.value,
            buy_order: orden_compra.value,
            position: posicion.value,
            information: informacion.value,
            type_service: servicios_seleccionados.value,
            equipment_type_id: tipo_equipo.value,
            equipment_name: nombre_equipo.value,
            service_description: descripcion_servicio.value,
            task_list: tasks.value,
            files: imagenes.value,
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

const addImageInput = () => { imagenes.value.push({ img: '', description: '' }); };
const removeImageInput = (index) => { imagenes.value.splice(index, 1); };
const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imagenes.value[index] = { img: reader.result, description: imagenes.value[index]?.description || '' };
        };
        reader.readAsDataURL(file);
    }
};
const enlargeImage = (path) => { window.open(path, '_blank'); };

function logout() { auth.clearSession(); router.push('/'); }
function redirigir_dashboard() { router.push('/dashboard'); }
function volver() { router.push('/reports'); }

const onClienteChange = () => {};
const onChangeTasks = () => {};

onMounted(() => {
    report_id.value = router.currentRoute.value.params.id;
    modalInstance.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
    loadReportData(report_id.value, {
        onSuccess: (response) => {
            const val = response.data.data;
            fecha_actividad.value = val.activity_date;
            om.value = val.om;
            solped.value = val.solped;
            orden_compra.value = val.buy_order;
            posicion.value = val.position;
            cliente_seleccionado.value = val.client_id;
            linea_seleccionada.value = val.client_line_id;
            persona_seleccionada.value = val.person_receive_id;
            servicios_seleccionados.value = val.type_service.map(s => s.id);
            nombre_equipo.value = val.equipment_name;
            descripcion_servicio.value = val.service_description;
            informacion.value = val.information;
            tipo_equipo.value = val.equipment_type_id;
            tasks_list.value = val.tasks;
            imagenes.value = val.files.map(file => ({ img: file.path, description: file.description }));
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
