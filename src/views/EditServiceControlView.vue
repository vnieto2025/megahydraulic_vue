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

            <!-- Fotos existentes -->
            <div class="fotos-section">
                <div class="fotos-header">
                    <h5 class="fotos-title">Fotos</h5>
                    <button type="button" class="btn-add-foto" @click="abrirSelectorFoto">
                        + Agregar foto
                    </button>
                    <input
                        ref="fotoInputRef"
                        type="file"
                        accept="image/*"
                        multiple
                        style="display:none"
                        @change="onFotosSeleccionadas"
                    >
                </div>

                <div v-if="fotosExistentes.length > 0 || fotosNuevas.length > 0" class="fotos-grid">
                    <!-- Fotos ya guardadas -->
                    <div v-for="foto in fotosExistentes" :key="foto.id" class="foto-card">
                        <img
                            :src="`${apiUrl}/${foto.path}`"
                            class="foto-preview"
                            alt="foto"
                            @click="ampliarFoto(`${apiUrl}/${foto.path}`)"
                        >
                        <p class="foto-desc-text">{{ foto.description || '' }}</p>
                        <button
                            type="button"
                            class="btn-remove-foto"
                            @click="eliminarFotoExistente(foto)"
                            title="Eliminar foto"
                        >✕</button>
                    </div>
                    <!-- Fotos nuevas (aún no guardadas) -->
                    <div v-for="(foto, index) in fotosNuevas" :key="'new-' + index" class="foto-card foto-card--nueva">
                        <img :src="foto.img" class="foto-preview" alt="nueva foto">
                        <input
                            type="text"
                            class="foto-desc"
                            v-model="foto.description"
                            placeholder="Descripción (opcional)"
                        >
                        <button type="button" class="btn-remove-foto" @click="fotosNuevas.splice(index, 1)">✕</button>
                        <span class="badge-nueva">Nueva</span>
                    </div>
                </div>
                <p v-else class="fotos-empty">Sin fotos.</p>
            </div>

            <!-- Modal ampliar imagen -->
            <div v-if="fotoAmpliada" class="foto-overlay" @click="fotoAmpliada = null">
                <img :src="fotoAmpliada" class="foto-ampliada" @click.stop>
                <button class="btn-close-overlay" @click="fotoAmpliada = null">✕</button>
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
import { ref, computed, watch, onMounted } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useRouter, useRoute } from 'vue-router';
import LayoutView from '../views/Layouts/LayoutView.vue';
import { Modal } from 'bootstrap';
import { useAuthStore } from '../stores/auth.js';
import {
    useParamClients, useParamLinesByClient, useParamUsersByClient,
    useParamServiceStatuses, useParamReportStatuses, useParamComponents,
} from '../composables/useParams.js';
import { useServiceControl, useUpdateServiceControl, useDeleteScFile } from '../composables/useServiceControl.js';
import apiUrl from '../../config.js';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const record_id = route.params.id;
const queryClient = useQueryClient();

// ── Campos del formulario ─────────────────────────────────────────────────────
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

// ── Control UI ────────────────────────────────────────────────────────────────
const isLoading = ref(false);
const isLoadingData = ref(true);
const msg = ref('');
const errorMsg = ref('');
const modalInstance = ref(null);
const modalErrorInstance = ref(null);

// Consecutivo es de solo lectura cuando el SC ya está vinculado a un reporte
const readonly = computed(() => !!recordData.value?.consecutive);

// ── Fotos ─────────────────────────────────────────────────────────────────────
const fotosExistentes = ref([]);
const fotosNuevas = ref([]);
const fotoInputRef = ref(null);
const fotoAmpliada = ref(null);

const abrirSelectorFoto = () => fotoInputRef.value.click();

const onFotosSeleccionadas = (event) => {
    Array.from(event.target.files).forEach(archivo => {
        const reader = new FileReader();
        reader.onload = (e) => fotosNuevas.value.push({ img: e.target.result, description: '' });
        reader.readAsDataURL(archivo);
    });
    event.target.value = '';
};

const ampliarFoto = (src) => { fotoAmpliada.value = src; };

const { mutate: deleteScFileMutate } = useDeleteScFile();

const eliminarFotoExistente = (foto) => {
    deleteScFileMutate(
        { fileId: foto.id, serviceControlId: parseInt(record_id) },
        {
            onSuccess: () => {
                fotosExistentes.value = fotosExistentes.value.filter(f => f.id !== foto.id);
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || 'Error al eliminar la foto';
                modalErrorInstance.value.show();
            },
        }
    );
};

// ── Queries de parámetros ─────────────────────────────────────────────────────
const { data: clientsParamData } = useParamClients();
const client_list = computed(() => clientsParamData.value ?? []);

const { data: linesData } = useParamLinesByClient(cliente);
const line_list = computed(() => linesData.value ?? []);

const { data: personsData } = useParamUsersByClient(cliente);
const person_list = computed(() => personsData.value ?? []);

const { data: serviceStatusData } = useParamServiceStatuses();
const service_status_list = computed(() => serviceStatusData.value ?? []);

const { data: reportStatusData } = useParamReportStatuses();
const report_status_list = computed(() => reportStatusData.value ?? []);

const { data: componentsData } = useParamComponents();
const component_list = computed(() => componentsData.value ?? []);

// ── Carga datos del registro ──────────────────────────────────────────────────
const recordIdRef = computed(() => record_id);
const { data: recordData, isError: queryError } = useServiceControl(recordIdRef);

// Si la query falla, isLoadingData nunca llegaría a false sin este watch
watch(queryError, (hasError) => {
    if (hasError) {
        isLoadingData.value = false;
        errorMsg.value = 'No se pudo cargar el registro.';
        modalErrorInstance.value?.show();
    }
});

watch(recordData, (val) => {
    if (!val) return;
    fecha.value = val.activity_date;
    cliente.value = val.client_id;
    hes.value = val.hes || '';
    descripcion.value = val.description || '';
    informacion.value = val.information || '';
    orden_servicio.value = val.service_order || '';
    cotizacion.value = val.quotation || '';
    componente.value = val.component;
    cantidad_componentes.value = val.component_quantity || 0;
    valor.value = val.value || 0;
    solped.value = val.solped || '';
    oc.value = val.oc || '';
    posicion.value = val.position || '';
    estado.value = val.service_status;
    informe.value = val.report_status;
    consecutivo.value = val.consecutive || '';
    factura.value = val.invoice || '';
    fecha_facturacion.value = val.invoice_date || '';
    nota.value = val.note || '';
    linea.value = val.client_line_id;
    responsable.value = val.responsible_id;
    gestor.value = val.gestor || '';
    fotosExistentes.value = val.files ?? [];
    fotosNuevas.value = [];
    isLoadingData.value = false;
}, { immediate: true });

// ── Mutations ─────────────────────────────────────────────────────────────────
const { mutate: updateServiceControlMutate } = useUpdateServiceControl();

const guardarCambios = () => {
    isLoading.value = true;
    const [year, month, day] = fecha.value.split('-');
    const fechaFormateada = `${day}-${month}-${year}`;
    let fechaFacturacionFormateada = null;
    if (fecha_facturacion.value) {
        const [yf, mf, df] = fecha_facturacion.value.split('-');
        fechaFacturacionFormateada = `${df}-${mf}-${yf}`;
    }
    updateServiceControlMutate(
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
            user_id: auth.userId,
            fotos_nuevas: fotosNuevas.value.map(f => ({ img: f.img, description: f.description || null })),
        },
        {
            onSuccess: (response) => {
                msg.value = response.data.message;
                fotosNuevas.value = [];
                queryClient.refetchQueries({ queryKey: ['service-control', 'detail'] });
                modalInstance.value.show();
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || 'Error inesperado';
                modalErrorInstance.value.show();
            },
            onSettled: () => { isLoading.value = false; },
        }
    );
};

const onClienteChange = () => {};

function volver() { router.push('/ver-lista-control-servicio'); }
function logout() { auth.clearSession(); router.push('/'); }
function redirigir_dashboard() { router.push('/dashboard'); }

onMounted(() => {
    modalInstance.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
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

/* ── Fotos ─────────────────────────────────────────────────────────────────── */
.fotos-section { margin-top: 16px; }

.fotos-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.fotos-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #2a475f;
}

.btn-add-foto {
    background-color: #2a475f;
    color: white;
    padding: 6px 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
}

.btn-add-foto:hover { background-color: #1c3342; }

.fotos-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.foto-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 140px;
}

.foto-card--nueva { outline: 2px dashed #2a6496; border-radius: 6px; padding: 2px; }

.foto-preview {
    width: 140px;
    height: 110px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #ccc;
    cursor: zoom-in;
}

.foto-desc-text {
    font-size: 0.75rem;
    color: #555;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.foto-desc {
    padding: 3px 6px;
    font-size: 0.78rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
}

.btn-remove-foto {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0,0,0,0.55);
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.btn-remove-foto:hover { background: rgba(200,0,0,0.8); }

.badge-nueva {
    position: absolute;
    bottom: 40px;
    left: 4px;
    background: #2a6496;
    color: white;
    font-size: 0.65rem;
    padding: 1px 5px;
    border-radius: 3px;
}

.fotos-empty { font-size: 0.85rem; color: #999; margin: 0; }

/* ── Overlay ampliar ───────────────────────────────────────────────────────── */
.foto-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.82);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.foto-ampliada {
    max-width: 90vw;
    max-height: 88vh;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.btn-close-overlay {
    position: fixed;
    top: 20px;
    right: 28px;
    background: rgba(255,255,255,0.15);
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-close-overlay:hover { background: rgba(255,255,255,0.3); }
</style>
