<template>
    <LayoutView>

        <form @submit.prevent="guardarServicio">
            <h2>Control de Servicio</h2>

            <!-- Fila 1: Fecha, Cliente, LÃ­nea -->
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

            <!-- Fila 2: Responsable, Componente, Cantidad Componentes -->
            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label for="select_responsable">Responsable:</label>
                    <select id="select_responsable" v-model="responsable" required>
                        <option value="" disabled>-- Seleccione --</option>
                        <option v-for="person in person_list" :key="person.id" :value="person.id">{{ person.name }}</option>
                    </select>
                </div>
            </div>

            <!-- Fila 7: DescripciÃ³n (ancho completo) -->
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

            <!-- Fila 3: Orden de Servicio, # CotizaciÃ³n/Servicio, Valor -->
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

            <!-- Fila 4: Solped, OC, PosiciÃ³n -->
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

            <!-- Fila 5: Estado, Informe, Consecutivo -->
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
                    <input type="number" id="txt_factura" v-model="factura" step="0.01" min="0">
                </div>
            </div>

            <!-- Fila 6: Factura, Fecha FacturaciÃ³n -->
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
                {{ isLoading ? 'Guardando...' : 'Guardar' }}
            </button>
        </form>

        <!-- Modal de Ã©xito -->
        <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exitoModalLabel">Control de Servicio</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        {{ msg }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="irAlListado">Cerrar</button>
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
import apiUrl from "../../config.js";
import { ref, onMounted, readonly } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import LayoutView from '../views/Layouts/LayoutView.vue';
import { Modal } from 'bootstrap';

const token = localStorage.getItem('token');
const user_id = localStorage.getItem('user_id');
const router = useRouter();

// Listas desplegables
const client_list = ref([]);
const line_list = ref([]);
const person_list = ref([]);
const service_status_list = ref([]);
const report_status_list = ref([]);
const component_list = ref([]);

// Campos del formulario
const fecha = ref('');
const fecha_formateada = ref('');
const cliente = ref('');
const linea = ref('');
const responsable = ref('');
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
const factura = ref(0);
const fecha_facturacion = ref('');
const fecha_facturacion_formateada = ref('');
const nota = ref('');

// Control UI
const isLoading = ref(false);
const msg = ref('');
const errorMsg = ref('');
const token_status = ref(0);
const modalInstance = ref(null);
const modalErrorInstance = ref(null);

const guardarServicio = async () => {
    try {
        if (!token) { router.push('/'); return; }
        isLoading.value = true;

        const [year, month, day] = fecha.value.split("-");
        fecha_formateada.value = `${day}-${month}-${year}`;

        if (fecha_facturacion.value) {
            const [year_f, month_f, day_f] = fecha_facturacion.value.split("-");
            fecha_facturacion_formateada.value = `${day_f}-${month_f}-${year_f}`;
        } else {
            fecha_facturacion_formateada.value = null;
        }

        const response = await axios.post(
            `${apiUrl}/service_control/create`,
            {
                activity_date: fecha_formateada.value,
                client_id: cliente.value,
                client_line_id: linea.value,
                responsible_id: responsable.value,
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
                invoice_date: fecha_facturacion_formateada.value || null,
                note: nota.value,
                user_id: user_id,
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (response.status === 201) {
            msg.value = response.data.message;
            modalInstance.value.show();
        }
    } catch (error) {
        console.error('Error al guardar servicio:', error);
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

const onClienteChange = async () => {
    try {
        linea.value = '';
        responsable.value = '';
        line_list.value = [];
        person_list.value = [];

        const [resLineas, resPersonas] = await Promise.all([
            axios.post(`${apiUrl}/params/get_lines_by_client`, { client: cliente.value }, {
                headers: { Accept: "application/json", Authorization: `Bearer ${token}` }
            }),
            axios.post(`${apiUrl}/params/get_users_by_client`, { client: cliente.value }, {
                headers: { Accept: "application/json", Authorization: `Bearer ${token}` }
            })
        ]);
        line_list.value = resLineas.data.data || [];
        person_list.value = resPersonas.data.data || [];
    } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
        errorMsg.value = error.response?.data?.message || 'Error al cargar datos';
        modalErrorInstance.value.show();
    }
};

const cargarDatos = async () => {
    try {
        const [resClients, resServiceStatus, resReportStatus, resComponents] = await Promise.all([
            axios.post(`${apiUrl}/params/get_clients`, {}, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_service_statuses`, {}, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_report_statuses`, {}, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_components`, {}, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
        ]);
        client_list.value = resClients.data.data || [];
        service_status_list.value = resServiceStatus.data.data || [];
        report_status_list.value = resReportStatus.data.data || [];
        component_list.value = resComponents.data.data || [];
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        errorMsg.value = error.response?.data?.message || 'Error al cargar datos';
        if (error.response?.status === 401) {
            token_status.value = 401;
            errorMsg.value = error.response.data.detail;
        }
        modalErrorInstance.value.show();
    }
};

function logout() {
    localStorage.clear();
    router.push('/');
}
function redirigir_dashboard() {
    router.push('/dashboard');
}
function irAlListado() {
    router.push('/ver-lista-control-servicio');
}

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

button {
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