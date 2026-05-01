<template>
    <LayoutView>

        <!-- Selector de tipo de reporte -->
        <div class="form-group mb-4">
            <label for="select_tipo_reporte"><strong>Tipo de Reporte:</strong></label>
            <select id="select_tipo_reporte" v-model="tipo_reporte" class="form-select">
                <option value="" disabled>-- Seleccione un tipo de reporte --</option>
                <option :value="0">Reporte Estándar</option>
                <option :value="1">Reporte Acesco</option>
            </select>
        </div>

        <!-- Formulario Reporte Estándar -->
        <form v-if="tipo_reporte === 0" @submit.prevent="createReport">
            <h2>Formulario de Creación de Reporte</h2>

            <!-- Fila 1: Fecha, Cliente, Línea -->
            <div class="row g-3">
                <div class="col-md-4 form-group">
                    <label for="txt_fecha_actividad">Fecha Actividad:</label>
                    <input type="date" id="txt_fecha_actividad" v-model="fecha_actividad">
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_cliente">Cliente:</label>
                    <select id="select_cliente" v-model="cliente" @change="onClienteChange" required>
                        <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_linea">Línea:</label>
                    <select id="select_linea" v-model="linea" required>
                        <option v-for="line in line_list" :key="line.id" :value="line.id">{{ line.name }}</option>
                    </select>
                </div>
            </div>

            <!-- Fila 2: Persona, OM, Solped -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="select_persona">Persona que recibe:</label>
                    <select id="select_persona" v-model="persona" required>
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

            <div class="form-group table-responsive mt-3">
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
                {{ isLoading ? 'Guardando...' : 'Crear' }}
            </button>
        </form>

        <!-- Formulario Reporte Acesco -->
        <form v-else-if="tipo_reporte === 1" @submit.prevent="createReportAcesco">
            <h2>Formulario de Creación de Reporte Acesco</h2>

            <!-- Fila 1: Fecha, Cliente, Línea -->
            <div class="row g-3">
                <div class="col-md-4 form-group">
                    <label for="txt_fecha_actividad_acesco">Fecha Actividad:</label>
                    <input type="date" id="txt_fecha_actividad_acesco" v-model="acesco_fecha_actividad" required>
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_cliente_acesco">Cliente:</label>
                    <select id="select_cliente_acesco" v-model="acesco_cliente" @change="onClienteChangeAcesco" required>
                        <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_linea_acesco">Línea:</label>
                    <select id="select_linea_acesco" v-model="acesco_linea" required>
                        <option v-for="line in acesco_line_list" :key="line.id" :value="line.id">{{ line.name }}</option>
                    </select>
                </div>
            </div>

            <!-- Fila 2: Persona, Zona de Trabajo, OM -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="select_persona_acesco">Persona que recibe:</label>
                    <select id="select_persona_acesco" v-model="acesco_persona" required>
                        <option v-for="person in acesco_person_list" :key="person.id" :value="person.id">{{ person.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_zona_trabajo">Zona de Trabajo:</label>
                    <input type="text" id="txt_zona_trabajo" v-model="acesco_zona_trabajo" required>
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_om_acesco">OM:</label>
                    <input type="text" id="txt_om_acesco" v-model="acesco_om">
                </div>
            </div>

            <!-- Fila 3: Solped, Orden de compra, Posición -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="txt_solped_acesco">Solped:</label>
                    <input type="text" id="txt_solped_acesco" v-model="acesco_solped">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_orden_acesco">Orden de compra:</label>
                    <input type="text" id="txt_orden_acesco" v-model="acesco_orden_compra">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_posicion_acesco">Posición:</label>
                    <input type="text" id="txt_posicion_acesco" v-model="acesco_posicion">
                </div>
            </div>

            <!-- Fila 4: Descripción del servicio, Información -->
            <div class="row g-3 mt-1">
                <div class="col-md-6 form-group">
                    <label for="txt_descripcion_servicio_acesco">Descripción del servicio:</label>
                    <textarea id="txt_descripcion_servicio_acesco" v-model="acesco_descripcion_servicio" rows="4" required></textarea>
                </div>
                <div class="col-md-6 form-group">
                    <label for="txt_informacion_acesco">Información:</label>
                    <textarea id="txt_informacion_acesco" v-model="acesco_informacion" rows="4" required></textarea>
                </div>
            </div>

            <!-- Fila 5: Valor del servicio -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="txt_valor_servicio">Valor del Servicio:</label>
                    <input type="number" id="txt_valor_servicio" v-model="acesco_valor_servicio">
                </div>
            </div>

            <!-- Fila 6: Conclusiones, Recomendaciones -->
            <div class="row g-3 mt-1">
                <div class="col-md-6 form-group">
                    <label for="txt_conclusiones">Conclusiones:</label>
                    <textarea id="txt_conclusiones" v-model="acesco_conclusiones" rows="4"></textarea>
                </div>
                <div class="col-md-6 form-group">
                    <label for="txt_recomendaciones">Recomendaciones:</label>
                    <textarea id="txt_recomendaciones" v-model="acesco_recomendaciones" rows="4"></textarea>
                </div>
            </div>

            <hr>

            <!-- Fila 7: Evidencias fijas -->
            <div class="row g-3">
                <div class="col-md-6 form-group">
                    <label for="registro_evidencia_antes">Registro Evidencia Antes:</label>
                    <input type="file" id="registro_evidencia_antes" @change="handleImageChangeAcesco($event, 0)" accept="image/*" class="form-control" required>
                </div>
                <div class="col-md-6 form-group">
                    <label for="registro_evidencia_despues">Registro Evidencia Después:</label>
                    <input type="file" id="registro_evidencia_despues" @change="handleImageChangeAcesco($event, 1)" accept="image/*" class="form-control" required>
                </div>
            </div>

            <hr>

            <!-- Anexos dinámicos -->
            <div class="form-group mt-3">
                <h5>Anexos</h5>
                <div v-for="(anexo, index) in acesco_anexos" :key="index" class="row g-3 mb-2 align-items-end">
                    <div class="col-md-10">
                        <input
                            type="file"
                            @change="handleImageChangeDinamicAcesco($event, index)"
                            class="form-control"
                            accept="image/*"
                        />
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-danger w-100" @click="removeAnexoInput(index)">Eliminar</button>
                    </div>
                </div>
                <button type="button" class="btn btn-primary mt-2" @click="addAnexoInput">
                    Agregar Anexo
                </button>
            </div>

            <hr>

            <!-- Fila 8: Técnico 1, Técnico 2 -->
            <div class="row g-3">
                <div class="col-md-6 form-group">
                    <label for="txt_tecnico1">Técnico 1:</label>
                    <input type="text" id="txt_tecnico1" v-model="acesco_tecnico1" required>
                </div>
                <div class="col-md-6 form-group">
                    <label for="txt_tecnico2">Técnico 2:</label>
                    <input type="text" id="txt_tecnico2" v-model="acesco_tecnico2">
                </div>
            </div>
            
            <button type="submit" class="btn btn-primary mt-4" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                {{ isLoading ? 'Guardando...' : 'Crear' }}
            </button>
        </form>

        <!-- Modal de éxito -->
        <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exitoModalLabel">Modal Reporte</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="goListaReportes"></button>
                    </div>
                    <div class="modal-body">
                        {{ msg }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="generar_pdf">Generar PDF</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="goListaReportes">Cerrar</button>
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
import { Modal } from 'bootstrap';
import { useAuthStore } from '../stores/auth.js';
import {
    useParamClients, useParamLinesByClient, useParamUsersByClient,
    useParamTypeService, useParamTypeEquipments, useParamTasksByEquipment,
} from '../composables/useParams.js';
import { useCreateReport, useGenerateReport } from '../composables/useReports.js';
import { useCreateReportAcesco, useGenerateReportAcesco } from '../composables/useReportsAcesco.js';

const auth = useAuthStore();
const router = useRouter();

// ── Estado general ───────────────────────────────────────────────────────────
const tipo_reporte = ref('');
const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const report_id = ref('');
const msg = ref('');
const error = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

// ── Variables Reporte Estándar ───────────────────────────────────────────────
const servicios_seleccionados = ref([]);
const tasks_list = ref([]);
const tasks = ref([]);
const imagenes = ref([]);
const fecha_actividad = ref('');
const cliente = ref('');
const linea = ref('');
const persona = ref('');
const om = ref('');
const solped = ref('');
const orden_compra = ref('');
const posicion = ref('');
const tipo_equipo = ref('');
const nombre_equipo = ref('');
const descripcion_servicio = ref('');
const informacion = ref('');

// ── Variables Reporte Acesco ─────────────────────────────────────────────────
const acesco_imagenes = ref([null, null]);
const acesco_anexos = ref([]);
const acesco_fecha_actividad = ref('');
const acesco_cliente = ref('');
const acesco_linea = ref('');
const acesco_persona = ref('');
const acesco_zona_trabajo = ref('');
const acesco_om = ref('');
const acesco_solped = ref('');
const acesco_orden_compra = ref('');
const acesco_posicion = ref('');
const acesco_descripcion_servicio = ref('');
const acesco_informacion = ref('');
const acesco_valor_servicio = ref(0);
const acesco_conclusiones = ref('');
const acesco_recomendaciones = ref('');
const acesco_tecnico1 = ref('');
const acesco_tecnico2 = ref('');

// ── Queries de parámetros ────────────────────────────────────────────────────
const { data: clientsParamData } = useParamClients();
const client_list = computed(() => clientsParamData.value ?? []);

const { data: serviciosData } = useParamTypeService();
const servicios_list = computed(() => serviciosData.value ?? []);

const { data: equiposData } = useParamTypeEquipments();
const equipos_list = computed(() => equiposData.value ?? []);

const { data: linesData } = useParamLinesByClient(cliente);
const line_list = computed(() => linesData.value ?? []);

const { data: personsData } = useParamUsersByClient(cliente);
const person_list = computed(() => personsData.value ?? []);

const { data: acescoLinesData } = useParamLinesByClient(acesco_cliente);
const acesco_line_list = computed(() => acescoLinesData.value ?? []);

const { data: acescoPersonsData } = useParamUsersByClient(acesco_cliente);
const acesco_person_list = computed(() => acescoPersonsData.value ?? []);

const { data: rawTasksData } = useParamTasksByEquipment(tipo_equipo);
watch([rawTasksData, tipo_equipo], ([rawTasks, tipoEquip]) => {
    if (tipoEquip === 5) { tasks_list.value = []; return; }
    tasks_list.value = (rawTasks ?? []).map(task => ({
        ...task,
        positive: 1,
        description: '',
    }));
});

// ── Mutations ────────────────────────────────────────────────────────────────
const { mutate: createReportMutate } = useCreateReport();
const { mutate: createReportAcescoMutate } = useCreateReportAcesco();
const { mutate: generateReportMutate } = useGenerateReport();
const { mutate: generateReportAcescoMutate } = useGenerateReportAcesco();

// ── Funciones Reporte Estándar ───────────────────────────────────────────────
const createReport = () => {
    isLoading.value = true;
    const [year, month, day] = fecha_actividad.value.split('-');
    const fecha_formateada = `${day}-${month}-${year}`;
    tasks.value = tasks_list.value.map((task) => ({
        task_id: task.id,
        positive: task.positive,
        negative: task.positive === 1 ? 0 : 1,
        description: task.description,
    }));
    createReportMutate(
        {
            activity_date: fecha_formateada,
            client_id: cliente.value,
            client_line_id: linea.value,
            person_receives: persona.value,
            om: om.value,
            solped: solped.value,
            buy_order: orden_compra.value,
            position: posicion.value,
            type_service: servicios_seleccionados.value,
            equipment_type_id: tipo_equipo.value,
            equipment_name: nombre_equipo.value,
            service_description: descripcion_servicio.value,
            information: informacion.value,
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
                errorMsg.value = err.response?.data?.message || 'Error al guardar reporte';
                modalErrorInstance.value.show();
            },
            onSettled: () => { isLoading.value = false; },
        }
    );
};

// ── Funciones Reporte Acesco ─────────────────────────────────────────────────
const createReportAcesco = () => {
    isLoading.value = true;
    const [year, month, day] = acesco_fecha_actividad.value.split('-');
    const fecha_formateada = `${day}-${month}-${year}`;
    const tech1 = acesco_tecnico1.value?.toUpperCase() || '';
    const tech2 = acesco_tecnico2.value?.toUpperCase() || '';
    const zona = acesco_zona_trabajo.value?.toUpperCase() || '';
    createReportAcescoMutate(
        {
            activity_date: fecha_formateada,
            client_id: acesco_cliente.value,
            client_line_id: acesco_linea.value,
            person_receives: acesco_persona.value,
            work_zone: zona,
            om: acesco_om.value,
            solped: acesco_solped.value,
            buy_order: acesco_orden_compra.value,
            position: acesco_posicion.value,
            service_description: acesco_descripcion_servicio.value,
            information: acesco_informacion.value,
            service_value: acesco_valor_servicio.value,
            conclutions: acesco_conclusiones.value,
            recommendations: acesco_recomendaciones.value,
            tech_1: tech1,
            tech_2: tech2,
            files: acesco_imagenes.value,
            anexos: acesco_anexos.value,
            user_id: auth.userId,
        },
        {
            onSuccess: (response) => {
                msg.value = response.data.message;
                report_id.value = response.data.data;
                modalInstance.value.show();
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || 'Error al guardar reporte Acesco';
                modalErrorInstance.value.show();
            },
            onSettled: () => { isLoading.value = false; },
        }
    );
};

// ── PDF ──────────────────────────────────────────────────────────────────────
const generar_pdf = () => {
    const isAcesco = tipo_reporte.value === 1;
    const generateFn = isAcesco ? generateReportAcescoMutate : generateReportMutate;
    const prefix = isAcesco ? 'reporte_acesco' : 'reporte';
    generateFn(
        { reportId: report_id.value, flag: true },
        {
            onSuccess: (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${prefix}_${report_id.value}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                goListaReportes();
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || 'Error al generar PDF';
                modalErrorInstance.value.show();
            },
        }
    );
};

// ── Imágenes Estándar ────────────────────────────────────────────────────────
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

// ── Imágenes Acesco ──────────────────────────────────────────────────────────
const handleImageChangeAcesco = (event, index) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => { acesco_imagenes.value[index] = reader.result; };
        reader.readAsDataURL(file);
    }
};
const addAnexoInput = () => { acesco_anexos.value.push({ img: '' }); };
const removeAnexoInput = (index) => { acesco_anexos.value.splice(index, 1); };
const handleImageChangeDinamicAcesco = (event, index) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => { acesco_anexos.value[index] = reader.result; };
        reader.readAsDataURL(file);
    }
};

// ── Navegación ───────────────────────────────────────────────────────────────
const goListaReportes = () => {
    if (tipo_reporte.value === 1) router.push('/reports-acesco');
    else router.push('/reports');
};
function logout() { auth.clearSession(); router.push('/'); }
function redirigir_dashboard() { router.push('/dashboard'); }

// Mantenidos como no-ops para compatibilidad con el template
const onClienteChange = () => {};
const onClienteChangeAcesco = () => {};
const onChangeTasks = () => {};

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
