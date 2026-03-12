<template>
    <LayoutView>
      <div class="header-titulo">
        <h1>Control de Servicio</h1>
        <div class="total-valor" v-if="total_valor_formateado">
          <span class="total-label">Total:</span>
          <span class="total-amount">{{ total_valor_formateado }}</span>
        </div>
      </div>

      <!-- Acordeón de filtros -->
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
                  <label for="filterStartDate">Fecha inicio</label>
                  <input v-model="filters.start_date" type="date" id="filterStartDate" class="form-control">
                </div>
                <div class="form-group">
                  <label for="filterEndDate">Fecha fin</label>
                  <input v-model="filters.end_date" type="date" id="filterEndDate" class="form-control">
                </div>
                <div class="form-group">
                  <label for="filterSolped">Solped</label>
                  <div class="chips-container">
                    <div v-for="(chip, index) in filters.solped" :key="index" class="chip">
                      {{ chip }}
                      <span class="remove-chip" @click="removeSolped(index)">x</span>
                    </div>
                    <input
                      v-model="currentSolped"
                      @keydown.enter.prevent="addSolped"
                      type="text"
                      id="filterSolped"
                      class="form-control"
                      placeholder="Agregar solped y Enter"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <label for="filterClient">Cliente</label>
                  <select id="filterClient" v-model="filters.client_id" class="form-control" @change="onFilterClienteChange">
                    <option value="">-- Todos --</option>
                    <option v-for="c in client_list" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="filterClientLine">Línea</label>
                  <select id="filterClientLine" v-model="filters.client_line_id" class="form-control" @change="onFilterLineaChange" :disabled="!filters.client_id">
                    <option value="">-- Todas --</option>
                    <option v-for="l in filter_line_list" :key="l.id" :value="l.id">{{ l.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="filterResponsible">Responsable</label>
                  <select id="filterResponsible" v-model="filters.responsible_id" class="form-control" :disabled="!filters.client_id">
                    <option value="">-- Todos --</option>
                    <option v-for="p in filter_person_list" :key="p.id" :value="p.id">{{ p.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Estado</label>
                  <div class="custom-multiselect">
                    <div class="multiselect-trigger" @click="toggleDropdown">
                      <span v-if="filters.service_status.length === 0" class="placeholder">-- Seleccione estados --</span>
                      <span v-else>{{ filters.service_status.length }} estado(s) seleccionado(s)</span>
                      <span class="arrow">&#9660;</span>
                    </div>
                    <div class="multiselect-dropdown" v-show="dropdownOpen">
                      <label
                        v-for="ss in service_status_list"
                        :key="ss.id"
                        class="multiselect-option"
                      >
                        <input type="checkbox" :value="ss.id" v-model="filters.service_status">
                        {{ ss.name }}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Estado Reporte</label>
                  <div class="custom-multiselect">
                    <div class="multiselect-trigger" @click="toggleReportDropdown">
                      <span v-if="filters.report_status.length === 0" class="placeholder">-- Seleccione estados --</span>
                      <span v-else>{{ filters.report_status.length }} estado(s) seleccionado(s)</span>
                      <span class="arrow">&#9660;</span>
                    </div>
                    <div class="multiselect-dropdown" v-show="reportDropdownOpen">
                      <label
                        v-for="rs in report_status_list"
                        :key="rs.id"
                        class="multiselect-option"
                      >
                        <input type="checkbox" :value="rs.id" v-model="filters.report_status">
                        {{ rs.name }}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="filterConsecutivo">Consecutivo</label>
                  <input v-model="filters.consecutive" type="number" id="filterConsecutivo" class="form-control" placeholder="Ej: 1023" min="1">
                </div>
                <div class="filter-buttons">
                  <button class="btn-acordeon btn-color-apply" @click="applyFilters">Aplicar Filtros</button>
                  <button class="btn-acordeon btn-color-clean" @click="limpiarFiltros">Limpiar Filtros</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-list" v-if="record_list">
        <!-- Barra de acciones masivas -->
        <div class="bulk-actions" v-if="selectedRecords.length > 0">
          <span class="bulk-count">{{ selectedRecords.length }} registro(s) seleccionado(s)</span>
          <button class="btn btn-primary" @click="modalConfirmConvertirMasivo" :disabled="isConvertingMasivo">
            <span v-if="isConvertingMasivo" class="spinner-border spinner-border-sm"></span>
            {{ isConvertingMasivo ? 'Procesando...' : '📄 Convertir seleccionados' }}
          </button>
          <button class="btn btn-secondary" @click="limpiarSeleccion">Limpiar selección</button>
        </div>
        <div class="table-wrapper">
        <table class="table table-hover table-sm">
          <thead>
            <tr>
              <th>
                <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" title="Seleccionar todos los convertibles">
              </th>
              <th>#</th>
              <th>Fecha Actividad</th>
              <th>Cliente</th>
              <th>Línea</th>
              <th>Responsable</th>
              <th>Descripción</th>
              <th>Orden Servicio</th>
              <th>Cotización</th>
              <th>Componente</th>
              <th>Solped</th>
              <th>OC</th>
              <th>Posición</th>
              <th>HES</th>
              <th>Estado</th>
              <th>Informe</th>
              <th>Consecutivo</th>
              <th>Valor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in record_list" :key="record.id" :class="{ 'row-facturado': record.service_status === 4 }">
              <td data-label="Seleccionar">
                <input
                  v-if="!record.report_id"
                  type="checkbox"
                  :value="record.id"
                  v-model="selectedRecords"
                >
                <span v-else title="Ya convertido" style="color:#5cb85c;font-size:1rem;">✓</span>
              </td>
              <td data-label="#">{{ record.id }}</td>
              <td data-label="Fecha Actividad">{{ record.activity_date }}</td>
              <td data-label="Cliente">{{ record.client_name }}</td>
              <td data-label="Línea">{{ record.client_line }}</td>
              <td data-label="Responsable">{{ record.responsible }}</td>
              <td data-label="Descripción">{{ record.description }}</td>
              <td data-label="Orden Servicio">{{ record.service_order }}</td>
              <td data-label="Cotización">{{ record.quotation }}</td>
              <td data-label="Componente">{{ record.component_name }}</td>
              <td data-label="Solped">{{ record.solped }}</td>
              <td data-label="oc">{{ record.oc }}</td>
              <td data-label="Posición">{{ record.position }}</td>
              <td data-label="Hes">{{ record.hes }}</td>
              <td data-label="Estado">{{ record.service_status_name }}</td>
              <td data-label="Informe">{{ record.report_status_name }}</td>
              <td data-label="Consecutivo">
                <router-link
                  v-if="record.consecutive"
                  :to="`/${record.type_report === 1 ? 'report-acesco' : 'report'}/edit/${record.report_id}`"
                  class="link-consecutivo"
                >
                  {{ record.consecutive }}
                </router-link>
                <span v-else>-</span>
              </td>
              <td data-label="Valor">{{ record.valor_formateado  }}</td>
              <td data-label="Acciones" class="th-icons">
                <router-link :to="`/service-control/edit/${record.id}`" class="icon-btn">
                  <img :src="ojo" alt="ver">
                </router-link>
                <button
                  class="btn-convertir"
                  :class="{ 'btn-convertir--done': record.report_id }"
                  :title="record.report_id ? 'Ya convertido (Reporte #' + record.report_id + ')' : 'Convertir en reporte'"
                  @click="!record.report_id && modalConfirmConvertir(record.id)"
                  :disabled="!!record.report_id"
                >
                  {{ record.report_id ? '✓ Reporte' : '📄 Convertir' }}
                </button>
                <span v-if="user_type_id == 1" class="icon-btn">
                  <img class="icon_deactivate" :src="desactivar" alt="desactivar" @click="modalConfirm(record.id)">
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
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

      <!-- Modal confirmación conversión masiva -->
      <div class="modal fade" id="convertirMasivoModal" tabindex="-1" aria-labelledby="convertirMasivoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="convertirMasivoModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="convertirMasivoModalLabel">Conversión masiva</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">¿Desea convertir los {{ selectedRecords.length }} registro(s) seleccionado(s) en reportes? Esta acción no se puede deshacer.</div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-primary" @click="convertirMasivo" :disabled="isConvertingMasivo">
                    <span v-if="isConvertingMasivo" class="spinner-border spinner-border-sm"></span>
                    {{ isConvertingMasivo ? 'Procesando...' : 'Sí, convertir todos' }}
                  </button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              </div>
              </div>
          </div>
      </div>

      <!-- Modal confirmación conversión -->
      <div class="modal fade" id="convertirModal" tabindex="-1" aria-labelledby="convertirModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="convertirModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="convertirModalLabel">Convertir en Reporte</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">¿Desea convertir el registro #{{ convert_record_id }} en un reporte? Esta acción no se puede deshacer.</div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-primary" @click="convertirServicio" :disabled="isConverting">
                    <span v-if="isConverting" class="spinner-border spinner-border-sm"></span>
                    {{ isConverting ? 'Procesando...' : 'Sí, convertir' }}
                  </button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              </div>
              </div>
          </div>
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

      <!-- Modal de confirmación -->
      <div class="modal fade" id="preguntaModal" tabindex="-1" aria-labelledby="preguntaModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="preguntaModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="preguntaModalLabel">Confirmación</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">¿Seguro desea eliminar el registro #{{ record_id }}?</div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-danger" @click="cambiarEstado">Si­, eliminar</button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import LayoutView from '../views/Layouts/LayoutView.vue';
import ojo from "@/assets/icons/ojo.png";
import desactivar from "@/assets/icons/trash.svg";
import { Modal } from 'bootstrap';

const token = localStorage.getItem('token');
const user_type_id = localStorage.getItem('user_type_id');
const router = useRouter();

const filters = ref({
    start_date: '',
    end_date: '',
    solped: [],
    service_status: [],
    report_status: [],
    client_id: '',
    client_line_id: '',
    responsible_id: '',
    consecutive: ''
});

const currentSolped = ref('');

const addSolped = () => {
    if (currentSolped.value.trim()) {
        if (!Array.isArray(filters.value.solped)) {
            filters.value.solped = [];
        }
        filters.value.solped.push(currentSolped.value.trim());
        currentSolped.value = '';
    }
};

const removeSolped = (index) => {
    filters.value.solped.splice(index, 1);
};

const dropdownOpen = ref(false);
const reportDropdownOpen = ref(false);

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const toggleReportDropdown = () => {
    reportDropdownOpen.value = !reportDropdownOpen.value;
};

const closeDropdown = (e) => {
    if (!e.target.closest('.custom-multiselect')) {
        dropdownOpen.value = false;
        reportDropdownOpen.value = false;
    }
};

const service_status_list = ref([]);
const report_status_list = ref([]);
const client_list = ref([]);
const filter_line_list = ref([]);
const filter_person_list = ref([]);
const record_list = ref([]);
const total_paginas = ref(0);
const total_registros = ref(0);
const total_valor_formateado = ref('');
const limit = ref(50);
const position = ref(1);

const msg = ref('');
const errorMsg = ref('');
const token_status = ref(0);
const record_id = ref(0);
const convert_record_id = ref(0);
const isConverting = ref(false);
const selectedRecords = ref([]);
const isConvertingMasivo = ref(false);

const isAllSelected = computed(() => {
    const convertibles = record_list.value.filter(r => !r.report_id);
    return convertibles.length > 0 && selectedRecords.value.length === convertibles.length;
});

const toggleSelectAll = (event) => {
    if (event.target.checked) {
        selectedRecords.value = record_list.value.filter(r => !r.report_id).map(r => r.id);
    } else {
        selectedRecords.value = [];
    }
};

const limpiarSeleccion = () => {
    selectedRecords.value = [];
};

const modalInstanceExito = ref(null);
const modalErrorInstance = ref(null);
const modalInstancePregunta = ref(null);
const modalInstanceConvertir = ref(null);
const modalInstanceConvertirMasivo = ref(null);

const get_records = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/service_control/list`,
            {
                limit: parseInt(limit.value),
                position: position.value,
                filters: filters.value
            },
            { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
            record_list.value = response.data.data.registros;
            total_paginas.value = response.data.data.total_pag;
            total_registros.value = response.data.data.total_registros;
            position.value = response.data.data.posicion_pag;
            total_valor_formateado.value = response.data.data.total_valor_formateado || '';
            selectedRecords.value = [];
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        errorMsg.value = error.response?.data?.message || 'Error inesperado';
        if (error.response?.status === 401) {
            token_status.value = 401;
            errorMsg.value = error.response.data.detail;
        } else if (error.response?.status === 403) {
            token_status.value = 403;
            errorMsg.value = error.response.data.detail;
        }
        modalErrorInstance.value.show();
    }
};

const cargarFiltros = async () => {
    try {
        const [resStatuses, resReportStatuses, resClients] = await Promise.all([
            axios.post(`${apiUrl}/params/get_service_statuses`, {},
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_report_statuses`, {},
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_clients`, {},
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
        ]);
        service_status_list.value = resStatuses.data.data || [];
        report_status_list.value = resReportStatuses.data.data || [];
        client_list.value = resClients.data.data || [];
    } catch (error) {
        console.error('Error al cargar filtros:', error);
    }
};

const onFilterClienteChange = async () => {
    filters.value.client_line_id = '';
    filters.value.responsible_id = '';
    filter_line_list.value = [];
    filter_person_list.value = [];
    if (!filters.value.client_id) return;
    try {
        const [resLineas, resPersonas] = await Promise.all([
            axios.post(`${apiUrl}/params/get_lines_by_client`, { client: filters.value.client_id },
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
            axios.post(`${apiUrl}/params/get_users_by_client`, { client: filters.value.client_id },
                { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
        ]);
        filter_line_list.value = resLineas.data.data || [];
        filter_person_list.value = resPersonas.data.data || [];
    } catch (error) {
        console.error('Error al cargar líneas/responsables:', error);
    }
};

const onFilterLineaChange = () => {
    filters.value.responsible_id = '';
};

const changePage = async (newPosition) => {
    position.value = newPosition;
    await get_records();
};

const applyFilters = async () => {
    position.value = 1;
    await get_records();
};

const limpiarFiltros = async () => {
    filters.value.start_date = '';
    filters.value.end_date = '';
    filters.value.solped = [];
    filters.value.service_status = [];
    filters.value.report_status = [];
    filters.value.client_id = '';
    filters.value.client_line_id = '';
    filters.value.responsible_id = '';
    filters.value.consecutive = '';
    filter_line_list.value = [];
    filter_person_list.value = [];
    currentSolped.value = '';
    position.value = 1;
    await get_records();
};

const modalConfirm = (id) => {
    record_id.value = id;
    modalInstancePregunta.value.show();
};

const modalConfirmConvertir = (id) => {
    convert_record_id.value = id;
    modalInstanceConvertir.value.show();
};

const modalConfirmConvertirMasivo = () => {
    if (selectedRecords.value.length === 0) return;
    modalInstanceConvertirMasivo.value.show();
};

const convertirMasivo = async () => {
    try {
        isConvertingMasivo.value = true;
        const response = await axios.post(
            `${apiUrl}/service_control/convert_multiple_to_report`,
            { record_ids: selectedRecords.value },
            { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
        );
        modalInstanceConvertirMasivo.value.hide();
        if (response.status === 200) {
            const { converted, errors } = response.data.data;
            let msgText = response.data.message;
            if (errors && errors.length > 0) {
                msgText += ` (${errors.length} con error: ${errors.map(e => `#${e.id}`).join(', ')})`;
            }
            msg.value = msgText;
            modalInstanceExito.value.show();
            await get_records();
        }
    } catch (error) {
        console.error('Error al convertir masivamente:', error);
        modalInstanceConvertirMasivo.value.hide();
        errorMsg.value = error.response?.data?.message || 'Error inesperado al convertir';
        if (error.response?.status === 401) {
            token_status.value = 401;
            errorMsg.value = error.response.data.detail;
        } else if (error.response?.status === 403) {
            token_status.value = 403;
            errorMsg.value = error.response.data.detail;
        }
        modalErrorInstance.value.show();
    } finally {
        isConvertingMasivo.value = false;
    }
};

const convertirServicio = async () => {
    try {
        isConverting.value = true;
        const response = await axios.post(
            `${apiUrl}/service_control/convert_to_report`,
            { record_id: convert_record_id.value },
            { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
        );
        modalInstanceConvertir.value.hide();
        if (response.status === 200) {
            msg.value = response.data.message;
            modalInstanceExito.value.show();
            await get_records();
        }
    } catch (error) {
        console.error('Error al convertir:', error);
        modalInstanceConvertir.value.hide();
        errorMsg.value = error.response?.data?.message || 'Error inesperado al convertir';
        if (error.response?.status === 401) {
            token_status.value = 401;
            errorMsg.value = error.response.data.detail;
        } else if (error.response?.status === 403) {
            token_status.value = 403;
            errorMsg.value = error.response.data.detail;
        }
        modalErrorInstance.value.show();
    } finally {
        isConverting.value = false;
    }
};

const cambiarEstado = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/service_control/change_status`,
            { record_id: record_id.value },
            { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
        );
        modalInstancePregunta.value.hide();
        if (response.status === 200) {
            msg.value = response.data.message;
            modalInstanceExito.value.show();
            await get_records();
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        modalInstancePregunta.value.hide();
        errorMsg.value = error.response?.data?.message || 'Error inesperado';
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

onMounted(() => {
    modalInstanceExito.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
    modalInstancePregunta.value = new Modal(preguntaModal);
    modalInstanceConvertir.value = new Modal(convertirModal);
    modalInstanceConvertirMasivo.value = new Modal(convertirMasivoModal);
    if (!token) { router.push('/'); return; }
    document.addEventListener('click', closeDropdown);
    cargarFiltros();
    get_records();
});

onBeforeUnmount(() => {
    document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>

body,
html {
  height: 100%;
  font-size: 62.5%;
  font-family: "DM Sans", serif;
}

.header-titulo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.total-valor {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #e8f5e9;
  border: 1px solid #a5d6a7;
  border-radius: 8px;
  padding: 6px 16px;
}

.total-label {
  font-size: 0.95rem;
  color: #388e3c;
  font-weight: 600;
}

.total-amount {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1b5e20;
}

.accordion {
  margin-top: 20px;
}

.filter-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.btn-acordeon {
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-color-apply {
  background-color: green;
}

.btn-color-clean {
  background-color: gray;
}

.bulk-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
  padding: 15px;
  background-color: #e8f4fd;
  border: 1px solid #bee5fd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.bulk-count {
  font-weight: 600;
  color: #2a475f;
  font-size: 0.9rem;
}

.bulk-actions button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bulk-actions .btn-primary {
  background-color: #007bff;
  color: white;
}

.bulk-actions .btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.bulk-actions .btn-secondary {
  background-color: #6c757d;
  color: white;
}

.bulk-actions .btn-secondary:hover {
  background-color: #545b62;
  transform: translateY(-2px);
}

.container-list {
  width: 100%;
  margin: 0 auto;
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
  border-spacing: 0;
  font-size: 0.78rem;
  width: 100%;
  min-width: 1400px;
  margin-bottom: 0;
}

.container-list thead th {
  background-color: #2a475f;
  color: white;
  white-space: nowrap;
  padding: 8px 10px;
  font-size: 0.78rem;
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

.container-list table img {
  width: 25px;
  transition: transform 0.2s ease;
}

.container-list table img:hover {
  transform: scale(1.2);
}

.th-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px; /* Espaciado entre botones de acciÃ³n */
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon_deactivate{
  cursor: pointer;
}

.link-consecutivo {
  color: #2a6496;
  font-weight: 600;
  text-decoration: none;
}

.link-consecutivo:hover {
  text-decoration: underline;
  color: #1a4a72;
}

.btn-convertir {
  background-color: #2a6496;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.78rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.btn-convertir:hover:not(:disabled) {
  background-color: #1a4a72;
}

.btn-convertir--done {
  background-color: #5cb85c;
  cursor: default;
}

.btn-convertir:disabled {
  opacity: 0.85;
  cursor: default;
}

/* Fila facturada (service_status = 4) */
.row-facturado td {
  background-color: #f7f0ab !important;
}

.table-hover tbody tr.row-facturado:hover td {
  background-color: #fff9c4 !important;
}

/* Table Hover Effects */
.table-hover tbody tr {
  transition: background-color 0.2s ease;
  background-color: white;
}

.table-hover tbody tr:hover td {
  background-color: #eef3f8 !important;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination label {
  margin-right: 10px;
  font-size: 1.2rem;
}

.pagination select {
  margin-right: 20px;
  padding: 5px;
  font-size: 1.2rem;
}

.pagination button {
  background-color: #2a475f;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:hover:not(:disabled) {
  background-color: #1c3342;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-size: 1.4rem;
}

/* Responsive Design for Mobile */
@media (max-width: 768px) {
  .filter-container {
    grid-template-columns: 1fr;
  }

  /* Force table to not be like tables anymore */
  table, thead, tbody, th, td, tr { 
    display: block; 
  }
  
  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr { 
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  
  tr { 
    border: 1px solid #ccc; 
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 10px;
  }
  
  td { 
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee; 
    position: relative;
    padding-left: 50%; 
    text-align: right;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  td:last-child {
    border-bottom: 0;
    justify-content: center;
    padding-top: 15px;
  }

  td::before { 
    /* Now like a table header */
    content: attr(data-label);
    font-weight: bold;
    text-align: left;
    color: #2a475f;
  }

  .th-icons {
    width: 100%;
    justify-content: space-evenly;
  }
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  border: 1px solid #ced4da;
  padding: 5px;
  border-radius: 0.25rem;
  align-items: center;
  min-height: 38px;
}

.chip {
  display: inline-flex;
  align-items: center;
  background-color: #2a475f;
  color: white;
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 0.78rem;
  gap: 6px;
}

.remove-chip {
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  line-height: 1;
  opacity: 0.8;
}

.remove-chip:hover {
  opacity: 1;
}

.chips-container .form-control {
  border: none;
  outline: none;
  box-shadow: none;
  min-width: 180px;
  flex: 1;
  padding: 2px 4px;
  font-size: 0.78rem;
}

.select-multiple {
  min-height: 100px;
}

.custom-multiselect {
  position: relative;
  user-select: none;
}

.multiselect-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  min-height: 36px;
}

.multiselect-trigger:hover {
  border-color: #adb5bd;
}

.multiselect-trigger .placeholder {
  color: #999;
}

.multiselect-trigger .arrow {
  font-size: 0.7rem;
  color: #666;
  margin-left: 8px;
}

.multiselect-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  z-index: 999;
  max-height: 200px;
  overflow-y: auto;
}

.multiselect-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: normal;
  margin: 0;
  transition: background 0.15s;
}

.multiselect-option:hover {
  background-color: #f0f4f8;
}

.multiselect-option input[type="checkbox"] {
  width: 15px;
  height: 15px;
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
}

.filter-buttons {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding-top: 24px;
}
</style>