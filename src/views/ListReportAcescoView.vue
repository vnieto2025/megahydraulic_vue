<template>
    <LayoutView>
      <h1>Ver Reportes</h1>

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
              @click="get_clients"
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
                  <label for="filterOM">OM</label>
                  <input v-model="filters.om" type="text" id="filterOM" class="form-control">
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
                      placeholder="Add Solped and press Enter"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <label for="filterBuyOrder">Orden de Compra</label>
                  <input v-model="filters.buy_order" type="text" id="filterBuyOrder" class="form-control">
                </div>
                <div class="form-group">
                  <label for="filterClient">Cliente:</label>
                  <select class="form-control" id="filterClient" v-model="filters.client_id">
                      <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="filterStartDate">Fecha inicio</label>
                  <input v-model="filters.start_date" type="date" id="filterStartDate" class="form-control">
                </div>
                <div class="form-group">
                  <label for="filterEndDate">Fecha fin</label>
                  <input v-model="filters.end_date" type="date" id="filterEndDate" class="form-control">
                </div>
                <button class="btn-acordeon btn-color-apply" @click="applyFilters">Aplicar Filtros</button>
                <button class="btn-acordeon btn-color-clean" @click="limpiarFiltros">Limpiar Filtros</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de descarga masiva -->
      <div class="bulk-actions" v-if="selectedReports.length > 0">
        <button class="btn btn-primary" @click="descargarPDFsMasivo">
          Descargar {{ selectedReports.length }} PDF(s) seleccionados
        </button>
        <button class="btn btn-secondary" @click="limpiarSeleccion">
          Limpiar selección
        </button>
      </div>

      <div class="container-list" v-if="report_list">
        <div class="table-wrapper">
        <table class="table table-hover table-sm">
          <thead>
              <tr>
                  <th>
                    <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected">
                  </th>
                  <th>Consecutivo</th>
                  <th>Fecha Actividad</th>
                  <th>Cliente</th>
                  <th>Línea</th>
                  <th>Recibe</th>
                  <th>Zona de Trabajo</th>
                  <th>OM</th>
                  <th>Solped</th>
                  <th>Orden de Compra</th>
                  <th>Posición</th>
                  <th>Usuario</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="report in report_list" :key="report.id">
              <td data-label="Seleccionar">
                <input type="checkbox" :value="report.id" v-model="selectedReports">
              </td>
              <td data-label="Consecutivo">{{ report.id }}</td>
              <td data-label="Fecha Actividad">{{ report.activity_date }}</td>
              <td data-label="Cliente">{{ report.client_name }}</td>
              <td data-label="Línea">{{ report.client_line }}</td>
              <td data-label="Recibe">{{ report.person_receive_name }}</td>
              <td data-label="Zona de Trabajo">{{ report.work_zone }}</td>
              <td data-label="OM">{{ report.om }}</td>
              <td data-label="Solped">{{ report.solped }}</td>
              <td data-label="Orden de Compra">{{ report.buy_order }}</td>
              <td data-label="Posición">{{ report.position }}</td>
              <td data-label="Usuario">{{ report.user_name }}</td>
              <td data-label="Actions" class="th-icons">
                <router-link :to="`/report-acesco/edit/${report.id}`" class="icon-btn"><img :src="ojo" alt="eye icon"></router-link>
                <span class="icon-btn" @click="generar_pdf(report.id)"><img :src="pdf" alt="pdf icon"></span>
                <span v-if="user_type_id == 1" class="icon-btn">
                  <img class="icon_deactivate" :src="desactivar" alt="desactivar icon" @click="modalConfirm(report.id)">
                </span>
              </td>
              </tr>
          </tbody>
        </table>
        </div>
        <div class="pagination">
          <label for="records-per-page">Registros por página:</label>
          <select 
            id="records-per-page" 
            v-model="limit" 
            @change="changePage(1)"
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="150">150</option>
          </select>
          <button 
            :disabled="position <= 1" 
            @click="changePage(1)"
          >
            Primera
          </button>
          
          <button 
            :disabled="position <= 1" 
            @click="changePage(position - 1)"
          >
            Anterior
          </button>
          
          <span>Página {{ position }} de {{ total_paginas }}</span>
          
          <button 
            :disabled="position >= total_paginas" 
            @click="changePage(position + 1)"
          >
            Siguiente
          </button>
          
          <button 
            :disabled="position >= total_paginas" 
            @click="changePage(total_paginas)"
          >
            Última
          </button>
        </div>
      </div>

      <!-- Modal de éxito -->
      <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="exitoModalLabel">Módulo Usuario</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  {{ msg }}
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-success" data-bs-dismiss="modal">Cerrar</button>
              </div>
              </div>
          </div>
      </div>

      <!-- Modal de pregunta -->
      <div class="modal fade" id="preguntaModal" tabindex="-1" aria-labelledby="preguntaModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="preguntaModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="preguntaModalLabel">Question</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  {{ pregunta }} {{ report_id }}?
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-success" @click="cambiarEstado">Yes</button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from "vue-router";
import LayoutView from '../views/Layouts/LayoutView.vue';
import ojo from "@/assets/icons/ojo.png";
import pdf from "@/assets/icons/pdf.png";
import desactivar from "@/assets/icons/trash.svg";
import { Modal } from 'bootstrap';
import { useAuthStore } from '../stores/auth.js';
import { useParamClients } from '../composables/useParams.js';
import { useReportAcescoList, useGenerateReportAcesco, useGenerateMultipleReportsAcesco } from '../composables/useReportsAcesco.js';
import { useChangeStatusReport } from '../composables/useReports.js';

const auth = useAuthStore();
const router = useRouter();

const filters = ref({
  om: '',
  solped: [],
  buy_order: '',
  client_id: '',
  start_date: '',
  end_date: ''
});
const currentSolped = ref('');
const limit = ref(50);
const position = ref(1);
const report_id = ref(0);
const msg = ref('');
const errorMsg = ref('');
const token_status = ref(0);
const pregunta = ref('');
const selectedReports = ref([]);

const modalInstanceExito  = ref(null);
const modalErrorInstance = ref(null);
const modalInstancePregunta = ref(null);

const payload = computed(() => ({
    limit: parseInt(limit.value),
    position: position.value,
    state: auth.userTypeId == 1,
    filters: filters.value,
    user_id: auth.userId
}));

const { data: reportsData } = useReportAcescoList(payload);
const report_list = computed(() => reportsData.value?.reportes ?? []);
const total_paginas = computed(() => reportsData.value?.total_pag ?? 0);

const { data: clientsParamData } = useParamClients();
const client_list = computed(() => clientsParamData.value ?? []);

const { mutate: generateReport } = useGenerateReportAcesco();
const { mutate: generateMultiple } = useGenerateMultipleReportsAcesco();
const { mutate: changeStatus } = useChangeStatusReport();

const addSolped = () => {
    if (currentSolped.value.trim()) {
        if (!Array.isArray(filters.value.solped)) filters.value.solped = [];
        filters.value.solped.push(currentSolped.value.trim());
        currentSolped.value = '';
    }
};
const removeSolped = (index) => { filters.value.solped.splice(index, 1); };

const changePage = (newPosition) => {
    position.value = newPosition;
    selectedReports.value = [];
};

const isAllSelected = computed(() =>
    report_list.value.length > 0 && selectedReports.value.length === report_list.value.length
);
const toggleSelectAll = (event) => {
    selectedReports.value = event.target.checked ? report_list.value.map(r => r.id) : [];
};
const limpiarSeleccion = () => { selectedReports.value = []; };

const generar_pdf = (id) => {
    generateReport(
        { reportId: id, flag: true },
        {
            onSuccess: (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `reporte_${id}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || "Error al generar el PDF";
                token_status.value = err.response?.status || 0;
                modalErrorInstance.value.show();
            }
        }
    );
};

const descargarPDFsMasivo = () => {
    if (selectedReports.value.length === 0) return;
    generateMultiple(
        selectedReports.value,
        {
            onSuccess: (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/zip" }));
                const link = document.createElement("a");
                link.href = url;
                const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                link.setAttribute("download", `reportes_acesco_multiples_${fecha}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                selectedReports.value = [];
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || "Error al generar los PDFs";
                token_status.value = err.response?.status || 0;
                modalErrorInstance.value.show();
            }
        }
    );
};

const applyFilters = () => { position.value = 1; };
const limpiarFiltros = () => {
    filters.value = { om: '', solped: [], buy_order: '', client_id: '', start_date: '', end_date: '' };
    position.value = 1;
};
const get_clients = () => {};

const modalConfirm = (id_reporte) => {
    pregunta.value = "¿Seguro desea eliminar el reporte: ";
    modalInstancePregunta.value.show();
    report_id.value = id_reporte;
};

const cambiarEstado = () => {
    changeStatus(
        report_id.value,
        {
            onSuccess: (response) => {
                modalInstancePregunta.value.hide();
                msg.value = response.data.message;
                modalInstanceExito.value.show();
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
function redirigir_dashboard() { router.push('/dashboard'); }

onMounted(() => {
    modalInstanceExito.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
    modalInstancePregunta.value = new Modal(preguntaModal);
});
</script>

<style scoped>

body,
html {
  height: 100%;
  font-size: 62.5%;
  font-family: "DM Sans", serif;
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
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.bulk-actions .btn-secondary {
  background-color: #6c757d;
  color: white;
}

.bulk-actions .btn-secondary:hover {
  background-color: #545b62;
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
  min-width: 900px;
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
  gap: 12px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon_deactivate {
  cursor: pointer;
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
  background-color: #fff;
}

.chip {
  background-color: #e0e0e0;
  padding: 2px 8px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  font-size: 0.9em;
}

.remove-chip {
  margin-left: 5px;
  cursor: pointer;
  font-weight: bold;
  color: #888;
}

.remove-chip:hover {
  color: #000;
}

.chips-container input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 5px;
}
</style>
