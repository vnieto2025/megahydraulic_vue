<template>
    <LayoutView>
      <h1>Parámetros</h1>
      <p class="subtitle">Administra los catálogos usados en Reportes, Reportes ACESCO, Control de Servicio y Cotizaciones. Anular no elimina la información, solo la desactiva.</p>

      <div class="cards-grid">
        <div
          v-for="card in CATALOG_CARDS"
          :key="card.entity"
          class="param-card"
          :class="{ 'param-card--active': selectedCard === card.entity }"
          @click="selectCard(card.entity)"
        >
          <div class="param-card-icon">{{ card.emoji }}</div>
          <div class="param-card-title">{{ card.title }}</div>
        </div>
        <div
          class="param-card"
          :class="{ 'param-card--active': selectedCard === 'task_equipment' }"
          @click="selectCard('task_equipment')"
        >
          <div class="param-card-icon">🛠️</div>
          <div class="param-card-title">Tareas por Equipo</div>
        </div>
      </div>

      <!-- Tabla genérica de catálogo -->
      <div v-if="currentCard" class="catalog-section">
        <div class="catalog-header">
          <h2>{{ currentCard.title }}</h2>
          <button type="button" class="btn-add" @click="openCreateModal">+ Agregar</button>
        </div>
        <div class="table-wrapper">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th v-for="f in currentCard.fields" :key="f.key">{{ f.label }}</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in catalogList" :key="item.id">
                <td v-for="f in currentCard.fields" :key="f.key">{{ item[f.key] }}</td>
                <td>
                  <span :class="item.status === 1 ? 'badge-activo' : 'badge-anulado'">
                    {{ item.status === 1 ? 'ACTIVO' : 'ANULADO' }}
                  </span>
                </td>
                <td class="th-icons">
                  <img :src="gestion" alt="editar" title="Editar" @click="openEditModal(item)">
                  <img v-if="item.status === 1" :src="desactivar" alt="anular" title="Anular" @click="confirmToggle(item)">
                  <img v-else :src="activar" alt="activar" title="Activar" @click="confirmToggle(item)">
                </td>
              </tr>
              <tr v-if="catalogList.length === 0">
                <td :colspan="currentCard.fields.length + 2">No hay registros para mostrar.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Panel especial: Tareas por Equipo -->
      <div v-if="selectedCard === 'task_equipment'" class="catalog-section">
        <div class="catalog-header">
          <h2>Tareas por Equipo</h2>
        </div>
        <div class="form-group task-equipment-select">
          <label for="taskEquipmentSelect">Tipo de Equipo</label>
          <select id="taskEquipmentSelect" v-model="selectedEquipmentId" class="form-control">
            <option value="">-- Seleccione --</option>
            <option v-for="eq in equipment_type_list" :key="eq.id" :value="eq.id">{{ eq.name }}</option>
          </select>
        </div>
        <ul v-if="selectedEquipmentId" class="task-checklist">
          <li v-for="task in taskEquipmentList" :key="task.id">
            <label>
              <input type="checkbox" :checked="task.assigned" @change="onToggleTask(task)">
              {{ task.name }}
            </label>
          </li>
          <li v-if="taskEquipmentList.length === 0" class="task-checklist-empty">No hay tareas activas en "Lista de Tareas".</li>
        </ul>
      </div>

      <!-- Modal crear/editar -->
      <div class="modal fade" id="formModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" ref="formModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ formMode === 'create' ? 'Agregar' : 'Editar' }} - {{ currentCard?.title }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveForm">
                <div class="form-group" v-for="f in currentCard?.fields || []" :key="f.key">
                  <label>{{ f.label }}</label>
                  <input
                    v-if="f.type === 'number'"
                    type="number"
                    v-model.number="formValues[f.key]"
                    class="form-control"
                  >
                  <input
                    v-else
                    type="text"
                    v-model="formValues[f.key]"
                    class="form-control"
                  >
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" :disabled="isCreating || isUpdating" @click="saveForm">Guardar</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal confirmación anular/activar -->
      <div class="modal fade" id="preguntaModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" ref="preguntaModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmar</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">{{ pregunta }}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" @click="doToggle">Sí</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal éxito -->
      <div class="modal fade" id="exitoModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Módulo Parámetros</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">{{ msg }}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal error -->
      <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" ref="errorModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Módulo Parámetros</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
import { ref, computed, reactive, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { useRouter } from 'vue-router';
import LayoutView from './Layouts/LayoutView.vue';
import gestion from '@/assets/icons/gestion.png';
import desactivar from '@/assets/icons/desactivar.png';
import activar from '@/assets/icons/activar.png';
import { useAuthStore } from '../stores/auth.js';
import { useParamTypeEquipments } from '../composables/useParams.js';
import {
    useCatalogList, useCreateCatalogItem, useUpdateCatalogItem, useToggleCatalogStatus,
    useTaskEquipmentList, useToggleTaskEquipment,
} from '../composables/useCatalogParams.js';

const auth = useAuthStore();
const router = useRouter();

const CATALOG_CARDS = [
    {
        entity: 'labor_types', title: 'Tipos de Mano de Obra', emoji: '👷',
        fields: [
            { key: 'code', label: 'Código', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'unit', label: 'Unidad', type: 'text' },
            { key: 'value', label: 'Valor', type: 'number' },
        ],
    },
    {
        entity: 'equipment_tools', title: 'Herramientas y Equipos', emoji: '🔧',
        fields: [
            { key: 'name', label: 'Nombre', type: 'text' },
            { key: 'unit', label: 'Unidad', type: 'text' },
            { key: 'unit_price', label: 'Valor Unit.', type: 'number' },
        ],
    },
    {
        entity: 'service_activities', title: 'Actividades de Servicio', emoji: '📋',
        fields: [
            { key: 'sap_code', label: 'Código SAP', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'unit_price', label: 'Valor Unit.', type: 'number' },
        ],
    },
    {
        entity: 'components', title: 'Componentes', emoji: '⚙️',
        fields: [{ key: 'name', label: 'Nombre', type: 'text' }],
    },
    {
        entity: 'type_service', title: 'Tipos de Servicio', emoji: '🗂️',
        fields: [{ key: 'name', label: 'Nombre', type: 'text' }],
    },
    {
        entity: 'type_equipment', title: 'Tipos de Equipo Intervenido', emoji: '🏭',
        fields: [
            { key: 'order', label: 'Orden', type: 'number' },
            { key: 'name', label: 'Nombre', type: 'text' },
        ],
    },
    {
        entity: 'service_status', title: 'Estados de Servicio', emoji: '🔵',
        fields: [{ key: 'name', label: 'Nombre', type: 'text' }],
    },
    {
        entity: 'report_status', title: 'Estados de Informe', emoji: '🟢',
        fields: [{ key: 'name', label: 'Nombre', type: 'text' }],
    },
    {
        entity: 'task_list', title: 'Lista de Tareas', emoji: '✅',
        fields: [{ key: 'name', label: 'Nombre', type: 'text' }],
    },
];

// ── Selección de tarjeta ──────────────────────────────────────────────────────
const selectedCard = ref('');
const currentCard = computed(() => CATALOG_CARDS.find(c => c.entity === selectedCard.value) || null);
const selectCard = (entity) => {
    selectedCard.value = selectedCard.value === entity ? '' : entity;
};

// ── Listado del catálogo seleccionado ─────────────────────────────────────────
const listEntity = computed(() => currentCard.value ? selectedCard.value : '');
const { data: catalogData } = useCatalogList(listEntity);
const catalogList = computed(() => catalogData.value ?? []);

const { mutate: createItem, isPending: isCreating } = useCreateCatalogItem();
const { mutate: updateItem, isPending: isUpdating } = useUpdateCatalogItem();
const { mutate: toggleItem } = useToggleCatalogStatus();

// ── Modal crear/editar ────────────────────────────────────────────────────────
const formModal = ref(null);
const formModalInstance = ref(null);
const formMode = ref('create');
const formValues = reactive({});
const editingId = ref(null);

const resetFormValues = (source = {}) => {
    Object.keys(formValues).forEach(k => delete formValues[k]);
    (currentCard.value?.fields || []).forEach(f => {
        formValues[f.key] = source[f.key] ?? (f.type === 'number' ? 0 : '');
    });
};

const openCreateModal = () => {
    formMode.value = 'create';
    editingId.value = null;
    resetFormValues();
    formModalInstance.value?.show();
};

const openEditModal = (item) => {
    formMode.value = 'edit';
    editingId.value = item.id;
    resetFormValues(item);
    formModalInstance.value?.show();
};

const saveForm = () => {
    const entity = selectedCard.value;
    const dataPayload = { ...formValues };

    if (formMode.value === 'create') {
        createItem({ entity, data: dataPayload }, {
            onSuccess: () => {
                formModalInstance.value?.hide();
                msg.value = 'Registro creado correctamente.';
                modalInstanceExito.value?.show();
            },
            onError: showError,
        });
    } else {
        updateItem({ entity, id: editingId.value, data: dataPayload }, {
            onSuccess: () => {
                formModalInstance.value?.hide();
                msg.value = 'Registro actualizado correctamente.';
                modalInstanceExito.value?.show();
            },
            onError: showError,
        });
    }
};

// ── Modal confirmación anular/activar ─────────────────────────────────────────
const preguntaModal = ref(null);
const modalInstancePregunta = ref(null);
const itemToToggle = ref(null);
const pregunta = computed(() => itemToToggle.value?.status === 1
    ? '¿Seguro desea anular este registro?'
    : '¿Seguro desea activar este registro?');

const confirmToggle = (item) => {
    itemToToggle.value = item;
    modalInstancePregunta.value?.show();
};

const doToggle = () => {
    const entity = selectedCard.value;
    const newStatus = itemToToggle.value.status === 1 ? 0 : 1;
    toggleItem({ entity, id: itemToToggle.value.id, status: newStatus }, {
        onSuccess: () => { modalInstancePregunta.value?.hide(); },
        onError: (err) => { modalInstancePregunta.value?.hide(); showError(err); },
    });
};

// ── Modales éxito / error ─────────────────────────────────────────────────────
const exitoModal = ref(null);
const modalInstanceExito = ref(null);
const msg = ref('');
const errorModal = ref(null);
const modalErrorInstance = ref(null);
const errorMsg = ref('');
const token_status = ref(0);

const showError = (err) => {
    errorMsg.value = err.response?.data?.message || 'Error inesperado.';
    token_status.value = err.response?.status || 0;
    modalErrorInstance.value?.show();
};

function logout() { auth.clearSession(); router.push('/'); }
function redirigir_dashboard() { router.push('/dashboard'); }

// ── Panel especial: Tareas por Equipo ─────────────────────────────────────────
const { data: equipmentTypesData } = useParamTypeEquipments();
const equipment_type_list = computed(() => equipmentTypesData.value ?? []);
const selectedEquipmentId = ref('');
const { data: taskEquipmentData } = useTaskEquipmentList(selectedEquipmentId);
const taskEquipmentList = computed(() => taskEquipmentData.value ?? []);
const { mutate: toggleTaskMutate } = useToggleTaskEquipment();

const onToggleTask = (task) => {
    toggleTaskMutate({ equipmentId: selectedEquipmentId.value, taskId: task.id, assign: !task.assigned });
};

onMounted(() => {
    formModalInstance.value = new Modal(formModal.value);
    modalInstancePregunta.value = new Modal(preguntaModal.value);
    modalInstanceExito.value = new Modal(exitoModal.value);
    modalErrorInstance.value = new Modal(errorModal.value);
});
</script>

<style scoped>
.subtitle {
  color: #666;
  margin-bottom: 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.param-card {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 18px 10px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s;
}

.param-card:hover {
  border-color: #2a475f;
  box-shadow: 0 2px 10px rgba(42, 71, 95, 0.15);
  transform: translateY(-2px);
}

.param-card--active {
  border-color: #2a475f;
  background: #eef3f7;
}

.param-card-icon {
  font-size: 1.8rem;
  margin-bottom: 6px;
}

.param-card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2a475f;
}

.catalog-section {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 24px;
}

.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.catalog-header h2 {
  font-size: 1.2rem;
  margin: 0;
}

.btn-add {
  background-color: #2a475f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-add:hover {
  background-color: #1c3242;
}

.table-wrapper {
  overflow-x: auto;
}

.badge-activo {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 0.78rem;
  font-weight: 600;
}

.badge-anulado {
  background-color: #fdecea;
  color: #c62828;
  border: 1px solid #ef9a9a;
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 0.78rem;
  font-weight: 600;
}

.th-icons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.th-icons img {
  width: 22px;
  cursor: pointer;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.form-group label {
  margin-bottom: 4px;
  font-weight: 600;
}

.task-equipment-select {
  max-width: 400px;
  margin-bottom: 16px;
}

.task-checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 8px;
}

.task-checklist li {
  background: #f7f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 12px;
}

.task-checklist label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin: 0;
  font-weight: 400;
}

.task-checklist-empty {
  background: none;
  border: none;
  color: #888;
}
</style>
