<template>
    <LayoutView>
        <h1>Ver Cotizaciones</h1>

        <!-- Filtros -->
        <div class="accordion" id="filterAccordion">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingFilters">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFilters"
                        aria-expanded="false"
                        aria-controls="collapseFilters"
                    >
                        Filtros
                    </button>
                </h2>
                <div
                    id="collapseFilters"
                    class="accordion-collapse collapse"
                    aria-labelledby="headingFilters"
                    data-bs-parent="#filterAccordion"
                >
                    <div class="accordion-body">
                        <div class="filter-container">
                            <div class="form-group">
                                <label>N° Cotización</label>
                                <input v-model="filters.quotation_number" type="text" class="form-control" placeholder="Ej: MP1-00500">
                            </div>
                            <div class="form-group">
                                <label>Cliente</label>
                                <select v-model="filters.client_id" class="form-control">
                                    <option value="">-- Todos --</option>
                                    <option v-for="c in client_list" :key="c.id" :value="c.id">{{ c.name }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Planta</label>
                                <select v-model="filters.plant_id" class="form-control">
                                    <option value="">-- Todas --</option>
                                    <option v-for="p in plant_list" :key="p.id" :value="p.id">{{ p.name }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Fecha inicio</label>
                                <input v-model="filters.start_date" type="date" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Fecha fin</label>
                                <input v-model="filters.end_date" type="date" class="form-control">
                            </div>
                            <div class="filter-btns">
                                <button class="btn-acordeon btn-color-apply" @click="applyFilters">Aplicar Filtros</button>
                                <button class="btn-acordeon btn-color-clean" @click="limpiarFiltros">Limpiar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla -->
        <div class="container-list" v-if="quotation_list !== undefined">
            <div class="table-wrapper">
                <table class="table table-hover table-sm">
                    <thead>
                        <tr>
                            <th>N° Cotización</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Línea</th>
                            <th>Responsable</th>
                            <th>Ciudad</th>
                            <th>Planta</th>
                            <th>Subtotal</th>
                            <th>Subtotal + IVA</th>
                            <th>Creado por</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="quotation_list.length === 0">
                            <td colspan="11" class="td-empty">No hay cotizaciones que mostrar.</td>
                        </tr>
                        <tr v-for="q in quotation_list" :key="q.id">
                            <td data-label="N° Cotización">
                                <span class="badge-numero">{{ q.quotation_number }}</span>
                            </td>
                            <td data-label="Fecha">{{ q.activity_date }}</td>
                            <td data-label="Cliente">{{ q.client_name }}</td>
                            <td data-label="Línea">{{ q.client_line_name || '—' }}</td>
                            <td data-label="Responsable">{{ q.responsible_name || '—' }}</td>
                            <td data-label="Ciudad">{{ q.city || '—' }}</td>
                            <td data-label="Planta">{{ q.plant_name }}</td>
                            <td data-label="Subtotal" class="td-money">{{ formatCurrency(q.subtotal) }}</td>
                            <td data-label="Subtotal + IVA" class="td-money td-iva">{{ formatCurrency(q.subtotal_with_iva) }}</td>
                            <td data-label="Creado por">{{ q.user_name }}</td>
                            <td data-label="Acciones" class="th-icons">
                                <router-link :to="`/quotation/edit/${q.id}`" class="icon-btn" title="Ver / Editar"><img :src="ojo" alt="ver"></router-link>
                                <span class="icon-btn" title="Eliminar" @click="confirmarEliminar(q.id)"><img :src="desactivar" alt="eliminar" class="icon-trash"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <div class="pagination">
                <label for="records-per-page">Registros por página:</label>
                <select id="records-per-page" v-model="limit" @change="changePage(1)">
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="150">150</option>
                </select>
                <button :disabled="position <= 1" @click="changePage(1)">Primera</button>
                <button :disabled="position <= 1" @click="changePage(position - 1)">Anterior</button>
                <span>Página {{ position }} de {{ total_paginas }}</span>
                <button :disabled="position >= total_paginas" @click="changePage(position + 1)">Siguiente</button>
                <button :disabled="position >= total_paginas" @click="changePage(total_paginas)">Última</button>
            </div>
        </div>

        <!-- Modal confirmación eliminar -->
        <div class="modal fade" id="preguntaModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" ref="preguntaModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar eliminación</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ¿Seguro desea eliminar la cotización <strong>#{{ quotation_id_to_delete }}</strong>? Esta acción no se puede deshacer.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="eliminarCotizacion">Sí, eliminar</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal error -->
        <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" ref="errorModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Error</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">{{ errorMsg }}</div>
                    <div class="modal-footer" v-if="token_status === 401">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="logout">Cerrar</button>
                    </div>
                    <div class="modal-footer" v-else-if="token_status === 403">
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
import { Modal } from 'bootstrap';
import LayoutView from './Layouts/LayoutView.vue';
import ojo from '@/assets/icons/ojo.png';
import desactivar from '@/assets/icons/trash.svg';
import { useAuthStore } from '../stores/auth.js';
import { useParamClients } from '../composables/useParams.js';
import { useQuotationPlants, useQuotationList, useChangeStatusQuotation } from '../composables/useQuotation.js';

const auth = useAuthStore();
const router = useRouter();

const errorModal = ref(null);
const preguntaModal = ref(null);
const modalErrorInstance = ref(null);
const modalPreguntaInstance = ref(null);
const errorMsg = ref('');
const token_status = ref(0);
const quotation_id_to_delete = ref(null);

const limit = ref(50);
const position = ref(1);

const filters = ref({
    quotation_number: '',
    client_id: '',
    plant_id: '',
    start_date: '',
    end_date: '',
});

const payload = computed(() => ({
    limit: parseInt(limit.value),
    position: position.value,
    filters: filters.value,
}));

const { data: quotationsData } = useQuotationList(payload);
const quotation_list = computed(() => quotationsData.value?.quotations ?? []);
const total_paginas = computed(() => quotationsData.value?.total_pag ?? 1);

const { data: clientsData } = useParamClients();
const client_list = computed(() => clientsData.value ?? []);

const { data: plantsData } = useQuotationPlants();
const plant_list = computed(() => plantsData.value ?? []);

const formatCurrency = (val) => {
    const n = Number(val) || 0;
    return '$' + Math.round(n).toLocaleString('es-CO');
};

const applyFilters = () => { position.value = 1; };

const limpiarFiltros = () => {
    filters.value = { quotation_number: '', client_id: '', plant_id: '', start_date: '', end_date: '' };
    position.value = 1;
};

const changePage = (newPos) => { position.value = newPos; };

const { mutate: changeStatus } = useChangeStatusQuotation();

const confirmarEliminar = (id) => {
    quotation_id_to_delete.value = id;
    modalPreguntaInstance.value?.show();
};

const eliminarCotizacion = () => {
    changeStatus(quotation_id_to_delete.value, {
        onSuccess: () => {
            modalPreguntaInstance.value?.hide();
        },
        onError: (err) => {
            modalPreguntaInstance.value?.hide();
            errorMsg.value = err.response?.data?.message || 'Error al eliminar la cotización.';
            token_status.value = err.response?.status || 0;
            modalErrorInstance.value?.show();
        },
    });
};

const logout = () => { auth.clearSession(); router.push('/'); };
const redirigir_dashboard = () => router.push('/dashboard');

onMounted(() => {
    modalErrorInstance.value = new Modal(errorModal.value);
    modalPreguntaInstance.value = new Modal(preguntaModal.value);
});
</script>

<style scoped>
body, html {
    height: 100%;
    font-size: 62.5%;
    font-family: "DM Sans", serif;
}

.accordion {
    margin-top: 20px;
}

.filter-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding: 20px;
}

.filter-btns {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 0.82rem;
}

.btn-acordeon {
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.82rem;
    white-space: nowrap;
}

.btn-color-apply { background-color: #2a7f3f; }
.btn-color-clean  { background-color: #6c757d; }

.container-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 20px;
}

.table-wrapper {
    width: 100%;
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.container-list table {
    border-collapse: collapse;
    font-size: 0.78rem;
    width: 100%;
    min-width: 1000px;
    margin-bottom: 0;
}

.container-list thead th {
    background-color: #2a475f;
    color: white;
    white-space: nowrap;
    padding: 8px 10px;
    font-size: 0.75rem;
    position: sticky;
    top: 0;
    z-index: 1;
}

.container-list tbody td {
    padding: 6px 10px;
    vertical-align: middle;
    white-space: nowrap;
    font-size: 0.78rem;
    border-bottom: 1px solid #f0f0f0;
}

.table-hover tbody tr {
    transition: background-color 0.15s;
    background-color: white;
}

.table-hover tbody tr:hover td {
    background-color: #eef3f8 !important;
}

.td-empty {
    text-align: center;
    color: #888;
    padding: 30px !important;
    font-style: italic;
}

.badge-numero {
    display: inline-block;
    background-color: #e8f4fd;
    color: #2a475f;
    border: 1px solid #b3d6f0;
    border-radius: 4px;
    padding: 2px 8px;
    font-weight: 700;
    letter-spacing: 0.5px;
    font-size: 0.75rem;
}

.td-money {
    text-align: right;
    font-weight: 600;
    color: #2a475f;
}

.td-iva {
    color: #1a7f3c;
}

.th-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.icon-btn {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
}

.icon-btn img {
    width: 22px;
    transition: transform 0.2s;
}

.icon-btn img:hover {
    transform: scale(1.2);
}

.icon-trash {
    filter: invert(20%) sepia(80%) saturate(400%) hue-rotate(330deg);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 6px;
    flex-wrap: wrap;
}

.pagination label {
    margin-right: 6px;
    font-size: 0.82rem;
}

.pagination select {
    margin-right: 12px;
    padding: 4px 8px;
    font-size: 0.82rem;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.pagination button {
    background-color: #2a475f;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.78rem;
    transition: background-color 0.2s;
}

.pagination button:hover:not(:disabled) { background-color: #1c3342; }
.pagination button:disabled { background-color: #ccc; cursor: not-allowed; }

.pagination span {
    margin: 0 6px;
    font-size: 0.85rem;
}

@media (max-width: 768px) {
    .filter-container { grid-template-columns: 1fr; }
}
</style>
