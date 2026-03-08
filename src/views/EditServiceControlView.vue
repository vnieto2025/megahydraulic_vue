<template>
    <LayoutView>
        <div class="container-header">
            <button type="button" class="btn-volver" @click="volver">← Volver</button>
        </div>

        <form @submit.prevent="guardarCambios" v-if="!isLoadingData">
            <h2>Editar Control de Servicio #{{ record_id }}</h2>

            <!-- Fila 1: Fecha, Cliente, Línea -->
            <div class="row g-3">
                <div class="col-md-4 form-group">
                    <label for="txt_fecha">Fecha:</label>
                    <input type="date" id="txt_fecha" v-model="fecha" required>
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_cliente">Cliente:</label>
                    <select id="select_cliente" v-model="cliente" @change="onClienteChange" required>
                        <option value="" disabled>-- Seleccione --</option>
                        <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_linea">Línea:</label>
                    <select id="select_linea" v-model="linea" required>
                        <option value="" disabled>-- Seleccione --</option>
                        <option v-for="line in line_list" :key="line.id" :value="line.id">{{ line.name }}</option>
                    </select>
                </div>
            </div>

            <!-- HES -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="select_responsable">Responsable:</label>
                    <select id="select_responsable" v-model="responsable" required>
                        <option value="" disabled>-- Seleccione --</option>
                        <option v-for="person in person_list" :key="person.id" :value="person.id">{{ person.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_gestor">Gestor:</label>
                    <input type="text" id="txt_gestor" v-model="gestor">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_hes">HES:</label>
                    <input type="text" id="txt_hes" v-model="hes">
                </div>
            </div>

            <!-- Descripción -->
            <div class="row g-3 mt-1">
                <div class="col-6 form-group">
                    <label for="txt_descripcion">Descripción:</label>
                    <textarea id="txt_descripcion" v-model="descripcion" rows="3"></textarea>
                </div>
                <div class="col-6 form-group">
                    <label for="txt_informacion">Información:</label>
                    <textarea id="txt_informacion" v-model="informacion" rows="3"></textarea>
                </div>
            </div>

            <!-- Fila 3: Orden Servicio, Cotización, Componente -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="txt_orden_servicio">Orden de Servicio:</label>
                    <input type="text" id="txt_orden_servicio" v-model="orden_servicio">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_cotizacion"># Cotización / Servicio:</label>
                    <input type="text" id="txt_cotizacion" v-model="cotizacion">
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_componente">Componente:</label>
                    <select id="select_componente" v-model="componente" required>
                        <option value="" disabled>-- Seleccione --</option>
                        <option v-for="comp in component_list" :key="comp.id" :value="comp.id">{{ comp.name }}</option>
                    </select>
                </div>
            </div>

            <!-- Fila 4: Cantidad, Valor, Solped -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="txt_cantidad_componentes">Cantidad Componentes:</label>
                    <input type="number" id="txt_cantidad_componentes" v-model="cantidad_componentes" min="0">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_valor">Valor:</label>
                    <input type="number" id="txt_valor" v-model="valor" step="0.01" min="0">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_solped">Solped:</label>
                    <input type="text" id="txt_solped" v-model="solped">
                </div>
            </div>

            <!-- Fila 5: OC, Posición, Estado -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="txt_oc">OC:</label>
                    <input type="text" id="txt_oc" v-model="oc">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_posicion">Posición:</label>
                    <input type="text" id="txt_posicion" v-model="posicion">
                </div>
                <div class="col-md-4 form-group">
                    <label for="select_estado">Estado:</label>
                    <select id="select_estado" v-model="estado" required>
                        <option value="" disabled>-- Seleccione --</option>
                        <option v-for="ss in service_status_list" :key="ss.id" :value="ss.id">{{ ss.name }}</option>
                    </select>
                </div>
            </div>

            <!-- Fila 6: Informe, Consecutivo, Factura -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="select_informe">Informe:</label>
                    <select id="select_informe" v-model="informe" required>
                        <option value="" disabled>-- Seleccione --</option>
                        <option v-for="rs in report_status_list" :key="rs.id" :value="rs.id">{{ rs.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_consecutivo">Consecutivo:</label>
                    <input type="number" id="txt_consecutivo" v-model="consecutivo" min="0" :readonly="readonly">
                </div>
                <div class="col-md-4 form-group">
                    <label for="txt_factura">Factura:</label>
                    <input type="number" id="txt_factura" v-model="factura" min="0">
                </div>
            </div>

            <!-- Fila 7: Fecha Facturación, Nota -->
            <div class="row g-3 mt-1">
                <div class="col-md-6 form-group">
                    <label for="txt_fecha_facturacion">Fecha Facturación:</label>
                    <input type="date" id="txt_fecha_facturacion" v-model="fecha_facturacion">
                </div>
                <div class="col-md-6 form-group">
                    <label for="txt_nota">Nota:</label>
                    <textarea id="txt_nota" v-model="nota" rows="3"></textarea>
                </div>
            </div>

            <hr>

            <button type="submit" class="btn btn-primary mt-3" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
            </button>
        </form>

        <div v-else class="text-center mt-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Cargando datos...</p>
        </div>

        <!-- Modal de éxito -->
        <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exitoModalLabel">Control de Servicio</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">{{ msg }}</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de error -->
        <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="errorModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="errorModalLabel">Error</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">{{ errorMsg }}</div>
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
import apiUrl from "../../config.js";
import { ref, onMounted, readonly } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import LayoutView from '../views/Layouts/LayoutView.vue';
import { Modal } from 'bootstrap';

const token = localStorage.getItem('token');
const user_id = localStorage.getItem('user_id');
const router = useRouter();
const route = useRoute();
const record_id = route.params.id;

// Listas desplegables
const client_list = ref([]);
const line_list = ref([]);
const person_list = ref([]);
const service_status_list = ref([]);
const report_status_list = ref([]);
const component_list = ref([]);

// Campos del formulario
const fecha = ref('');
const cliente = ref('');
const linea = ref('');
const hes = ref('');
const responsable = ref('');
const gestor = ref('');
const descripcion = ref('');
const informacion = ref('');
const orden_servicio = ref('');
const cotizacion = ref('');
const componente = ref('');
const cantidad_componentes = ref(0);
const valor = ref(0);
const solped = ref('');
const oc = ref('');
const posicion = ref('');
const estado = ref('');
const informe = ref('');
const consecutivo = ref('');
const factura = ref('');
const fecha_facturacion = ref('');
const nota = ref('');

// Control UI
const isLoading = ref(false);
const isLoadingData = ref(true);
const msg = ref('');
const errorMsg = ref('');
const token_status = ref(0);
const modalInstance = ref(null);
const modalErrorInstance = ref(null);

const cargarDatos = async () => {
    try {
        const [resRecord, resClients, resServiceStatus, resReportStatus, resComponents] = await Promise.all([
            axios.post(`${apiUrl}/service_control/get`, { record_id: parseInt(record_id) },
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_clients`, {},
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_service_statuses`, {},
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_report_statuses`, {},
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_components`, {},
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
        ]);

        client_list.value = resClients.data.data || [];
        service_status_list.value = resServiceStatus.data.data || [];
        report_status_list.value = resReportStatus.data.data || [];
        component_list.value = resComponents.data.data || [];

        const d = resRecord.data.data;
        fecha.value = d.activity_date;
        cliente.value = d.client_id;
        hes.value = d.hes || '';
        descripcion.value = d.description || '';
        informacion.value = d.information || '';
        orden_servicio.value = d.service_order || '';
        cotizacion.value = d.quotation || '';
        componente.value = d.component;
        cantidad_componentes.value = d.component_quantity || 0;
        valor.value = d.value || 0;
        solped.value = d.solped || '';
        oc.value = d.oc || '';
        posicion.value = d.position || '';
        estado.value = d.service_status;
        informe.value = d.report_status;
        consecutivo.value = d.consecutive || '';
        factura.value = d.invoice || '';
        fecha_facturacion.value = d.invoice_date || '';
        nota.value = d.note || '';

        // Cargar líneas y responsables del cliente
        const [resLineas, resPersonas] = await Promise.all([
            axios.post(`${apiUrl}/params/get_lines_by_client`, { client: d.client_id },
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_users_by_client`, { client: d.client_id },
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
        ]);
        line_list.value = resLineas.data.data || [];
        person_list.value = resPersonas.data.data || [];
        linea.value = d.client_line_id;
        responsable.value = d.responsible_id;
        gestor.value = d.gestor || '';

    } catch (error) {
        console.error('Error al cargar datos:', error);
        errorMsg.value = error.response?.data?.message || 'Error al cargar los datos';
        if (error.response?.status === 401) {
            token_status.value = 401;
            errorMsg.value = error.response.data.detail;
        } else if (error.response?.status === 403) {
            token_status.value = 403;
            errorMsg.value = error.response.data.detail;
        }
        modalErrorInstance.value.show();
    } finally {
        isLoadingData.value = false;
    }
};

const onClienteChange = async () => {
    try {
        linea.value = '';
        responsable.value = '';
        line_list.value = [];
        person_list.value = [];

        const [resLineas, resPersonas] = await Promise.all([
            axios.post(`${apiUrl}/params/get_lines_by_client`, { client: cliente.value },
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_users_by_client`, { client: cliente.value },
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
        ]);
        line_list.value = resLineas.data.data || [];
        person_list.value = resPersonas.data.data || [];
    } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
    }
};

const guardarCambios = async () => {
    try {
        if (!token) { router.push('/'); return; }
        isLoading.value = true;

        const [year, month, day] = fecha.value.split("-");
        const fechaFormateada = `${day}-${month}-${year}`;

        let fechaFacturacionFormateada = null;
        if (fecha_facturacion.value) {
            const [yf, mf, df] = fecha_facturacion.value.split("-");
            fechaFacturacionFormateada = `${df}-${mf}-${yf}`;
        }

        const response = await axios.post(
            `${apiUrl}/service_control/update`,
            {
                record_id: parseInt(record_id),
                activity_date: fechaFormateada,
                client_id: cliente.value,
                client_line_id: linea.value,
                hes: hes.value,
                responsible_id: responsable.value,
                gestor: gestor.value,
                description: descripcion.value,
                information: informacion.value,
                service_order: orden_servicio.value,
                quotation: cotizacion.value,
                component: componente.value,
                component_quantity: cantidad_componentes.value,
                value: valor.value,
                solped: solped.value,
                oc: oc.value,
                position: posicion.value,
                service_status: estado.value,
                report_status: informe.value,
                consecutive: consecutivo.value || null,
                invoice: factura.value || null,
                invoice_date: fechaFacturacionFormateada,
                note: nota.value,
                user_id: user_id,
            },
            { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            msg.value = response.data.message;
            modalInstance.value.show();
        }
    } catch (error) {
        console.error('Error al guardar cambios:', error);
        errorMsg.value = error.response?.data?.message || 'Error inesperado';
        if (error.response?.status === 401) {
            token_status.value = 401;
            errorMsg.value = error.response.data.detail;
        } else if (error.response?.status === 403) {
            token_status.value = 403;
            errorMsg.value = error.response.data.detail;
        }
        modalErrorInstance.value.show();
    } finally {
        isLoading.value = false;
    }
};

function volver() { router.push('/ver-lista-control-servicio'); }
function logout() { localStorage.clear(); router.push('/'); }
function redirigir_dashboard() { router.push('/dashboard'); }

onMounted(() => {
    modalInstance.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
    if (!token) { router.push('/'); return; }
    cargarDatos();
});
</script>

<style scoped>

body, html {
    height: 100%;
    font-size: 62.5%;
    font-family: "DM Sans", serif;
}

.container-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.btn-volver {
    background-color: #2a475f;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

.btn-volver:hover {
    background-color: #1c3342;
}

form {
    display: flex;
    flex-direction: column;
    width: 100%;
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
    margin-bottom: 2px;
    font-weight: 500;
}

input, textarea, select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
}

button[type="submit"] {
    background-color: #2a475f;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

hr {
    margin-top: 10px;
    margin-bottom: 20px;
}
</style>
