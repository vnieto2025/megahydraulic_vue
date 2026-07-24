<template>
    <LayoutView>
        <!-- Cabecera con volver y badge número -->
        <div class="page-header">
            <button type="button" class="btn-volver" @click="router.back()">← Volver</button>
            <div class="nro-preview" v-if="quotation_number">
                <span class="nro-label">N° Cotización:</span>
                <span class="nro-valor">{{ quotation_number }}</span>
            </div>
        </div>

        <div v-if="isLoadingDetail" class="loading-state">Cargando cotización...</div>

        <form v-else @submit.prevent="guardarEdicion" @keydown.enter.prevent>
            <h2>Editar Cotización</h2>

            <!-- ── Datos generales ──────────────────────────────────────────── -->
            <div class="seccion-titulo">Datos Generales</div>

            <div class="row g-3">
                <div class="col-md-4 form-group">
                    <label>Ciudad:</label>
                    <input type="text" v-model="ciudad" placeholder="Ej: Bogotá">
                </div>
                <div class="col-md-4 form-group">
                    <label>Fecha:</label>
                    <input type="date" v-model="fecha" required>
                </div>
                <div class="col-md-4 form-group">
                    <label>Planta:</label>
                    <input type="text" :value="plant_name" readonly class="input-readonly">
                </div>
            </div>

            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label>Señores (Cliente): <span class="req">*</span></label>
                    <select v-model="cliente" @change="onClienteChange" required>
                        <option value="" disabled>-- Seleccione --</option>
                        <option v-for="c in client_list" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label>Interventor (Responsable):</label>
                    <select v-model="responsable" :disabled="!cliente">
                        <option value="">-- Seleccione --</option>
                        <option v-for="p in person_list" :key="p.id" :value="p.id">{{ p.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label>Área (Línea):</label>
                    <select v-model="linea" :disabled="!cliente">
                        <option value="">-- Seleccione --</option>
                        <option v-for="l in line_list" :key="l.id" :value="l.id">{{ l.name }}</option>
                    </select>
                </div>
            </div>

            <div class="row g-3 mt-1">
                <div class="col-md-6 form-group">
                    <label>Dirigido a:</label>
                    <input type="text" v-model="dirigido_a" placeholder="Nombre del destinatario...">
                </div>
            </div>

            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label>Cotizante:</label>
                    <input type="text" value="MEGA HYDRAULIC S.A.S" readonly class="input-readonly">
                </div>
                <div class="col-md-4 form-group">
                    <label>Teléfono:</label>
                    <input type="text" v-model="telefono" readonly class="input-readonly">
                </div>
                <div class="col-md-4 form-group">
                    <label>NIT:</label>
                    <input type="text" v-model="nit" readonly class="input-readonly">
                </div>
            </div>

            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label>Componente:</label>
                    <select v-model="componente">
                        <option value="">-- Seleccione --</option>
                        <option v-for="ts in component_list" :key="ts.id" :value="ts.id">{{ ts.name }}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label>¿Fue ejecutado?</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" v-model="fue_ejecutado" :value="1"> Sí
                        </label>
                        <label class="radio-label">
                            <input type="radio" v-model="fue_ejecutado" :value="0"> No
                        </label>
                    </div>
                </div>
            </div>

            <div class="row g-3 mt-1">
                <div class="col-12 form-group">
                    <label>Alcance de la actividad:</label>
                    <textarea v-model="alcance" rows="4"></textarea>
                </div>
            </div>

            <div class="row g-3 mt-1">
                <div class="col-md-4 form-group">
                    <label>Tiempo de entrega:</label>
                    <input type="text" v-model="tiempo_entrega">
                </div>
                <div class="col-md-4 form-group">
                    <label>Descripción de la actividad:</label>
                    <input type="text" v-model="descripcion_actividad">
                </div>
                <div class="col-md-4 form-group">
                    <label>¿Dónde se ejecuta?:</label>
                    <input type="text" v-model="donde_ejecuta">
                </div>
            </div>

            <!-- ── Totales generales ────────────────────────────────────────── -->
            <div class="row g-3 mt-3">
                <div class="col-md-6 form-group">
                    <label>Valor de la actividad (sin IVA):</label>
                    <input type="text" :value="formatCurrency(subtotal)" readonly class="input-readonly input-valor">
                </div>
                <div class="col-md-6 form-group">
                    <label>Valor de la actividad (con IVA 19%):</label>
                    <input type="text" :value="formatCurrency(subtotalConIva)" readonly class="input-readonly input-valor">
                </div>
            </div>

            <!-- ── Tabla de ítems ───────────────────────────────────────────── -->
            <div class="seccion-titulo" style="margin-top:20px">Cuadro de Cantidades</div>

            <div class="items-table-wrapper">
                <table class="items-table">
                    <thead>
                        <tr>
                            <th class="th-item">Ítem</th>
                            <th class="th-sap">Cód. SAP</th>
                            <th class="th-desc">Descripción</th>
                            <th class="th-un">UN</th>
                            <th class="th-cant">Cant.</th>
                            <th class="th-vunit">Valor Unit.</th>
                            <th class="th-vtotal">Valor Total</th>
                            <th class="th-accion"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Fila auto: suma Mano de Obra + Equipos + Recargo Horas -->
                        <tr v-if="autoLaborTotal > 0" class="tr-auto-generated">
                            <td class="td-center">1</td>
                            <td></td>
                            <td><input type="text" v-model="autoLaborDesc" class="input-table input-desc" placeholder="Descripción..."></td>
                            <td><input type="text" v-model="autoLaborUnit" class="input-table input-un"></td>
                            <td><input type="number" v-model.number="autoLaborQty" min="0" class="input-table input-num"></td>
                            <td class="td-total">{{ formatCurrency(autoLaborTotal) }}</td>
                            <td class="td-total">{{ formatCurrency(autoLaborTotal * (autoLaborQty || 1)) }}</td>
                            <td></td>
                        </tr>
                        <!-- Fila auto: Materiales -->
                        <tr v-if="autoMaterialsTotal > 0" class="tr-auto-generated">
                            <td class="td-center">{{ autoLaborTotal > 0 ? 2 : 1 }}</td>
                            <td></td>
                            <td><input type="text" v-model="autoMaterialsDesc" class="input-table input-desc"></td>
                            <td><input type="text" v-model="autoMaterialsUnit" class="input-table input-un"></td>
                            <td><input type="number" v-model.number="autoMaterialsQty" min="0" class="input-table input-num"></td>
                            <td class="td-total">{{ formatCurrency(autoMaterialsTotal) }}</td>
                            <td class="td-total">{{ formatCurrency(autoMaterialsTotal * (autoMaterialsQty || 1)) }}</td>
                            <td></td>
                        </tr>
                        <tr v-for="(item, idx) in items" :key="item._id">
                            <td class="td-center">{{ idx + 1 + (autoLaborTotal > 0 ? 1 : 0) + (autoMaterialsTotal > 0 ? 1 : 0) }}</td>
                            <td><input v-model="item.codigo_sap" class="input-table input-sap" placeholder="—"></td>
                            <td><input v-model="item.descripcion" class="input-table input-desc" placeholder="Descripción del servicio"></td>
                            <td><input v-model="item.un" class="input-table input-un"></td>
                            <td><input v-model.number="item.cant" type="number" min="0" class="input-table input-num"></td>
                            <td><input v-model.number="item.valor_unit" type="number" min="0" class="input-table input-num"></td>
                            <td class="td-total">{{ formatCurrency(itemTotal(item)) }}</td>
                            <td class="td-accion">
                                <button type="button" class="btn-remove-item" @click="removeItem(idx)" title="Eliminar fila">✕</button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <!-- Logística -->
                        <tr class="tr-fixed">
                            <td colspan="2" class="td-label-fixed">Logística</td>
                            <td class="td-fixed-name">LOGÍSTICA Y TRANSPORTE</td>
                            <td><input v-model="logistica.un" class="input-table input-un"></td>
                            <td><input v-model.number="logistica.cant" type="number" min="0" class="input-table input-num"></td>
                            <td><input v-model.number="logistica.valor_unit" type="number" min="0" class="input-table input-num"></td>
                            <td class="td-total">{{ formatCurrency((logistica.cant || 0) * (logistica.valor_unit || 0)) }}</td>
                            <td></td>
                        </tr>
                        <!-- Recargos -->
                        <tr class="tr-fixed">
                            <td colspan="2" class="td-label-fixed">Recargos</td>
                            <td class="td-fixed-name">TRABAJO EN ALTURA</td>
                            <td><input v-model="recargos.un" class="input-table input-un"></td>
                            <td><input v-model.number="recargos.cant" type="number" min="0" class="input-table input-num"></td>
                            <td class="td-total">{{ formatCurrency(recargosValorUnit) }}</td>
                            <td class="td-total">{{ formatCurrency((recargos.cant || 0) * recargosValorUnit) }}</td>
                            <td></td>
                        </tr>
                        <!-- Subtotal -->
                        <tr class="tr-subtotal">
                            <td colspan="5" class="td-label-subtotal">SUBTOTAL</td>
                            <td colspan="2" class="td-subtotal-valor">{{ formatCurrency(subtotal) }}</td>
                            <td></td>
                        </tr>
                        <tr class="tr-subtotal">
                            <td colspan="5" class="td-label-subtotal">SUBTOTAL + IVA (19%)</td>
                            <td colspan="2" class="td-subtotal-valor">{{ formatCurrency(subtotalConIva) }}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="btn-add-row-wrapper">
                <button type="button" class="btn-add-row" @click="addItem">+ Agregar fila</button>
            </div>

            <hr>

            <!-- ── Sección 2: Mano de Obra ──────────────────────────────────── -->
            <div class="seccion-titulo" style="margin-top:24px">Mano de Obra</div>

            <div class="items-table-wrapper">
                <table class="items-table">
                    <thead>
                        <tr>
                            <th class="th-item">#</th>
                            <th class="th-labor-type">Tipo de mano de obra</th>
                            <th class="th-sap">Código</th>
                            <th class="th-un">UN</th>
                            <th class="th-cant">Cantidad</th>
                            <th class="th-vunit">Valor Unit.</th>
                            <th class="th-vtotal">Total</th>
                            <th class="th-labor-desc">Descripción</th>
                            <th class="th-accion"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, idx) in labor_items" :key="row._id">
                            <td class="td-center">{{ idx + 1 }}</td>
                            <td>
                                <select v-model="row.labor_type_id" @change="onLaborTypeChange(row)" class="input-table">
                                    <option value="">-- Seleccione --</option>
                                    <option v-for="lt in labor_types_list" :key="lt.id" :value="lt.id">{{ lt.description }}</option>
                                </select>
                            </td>
                            <td class="td-center">{{ row.code || '—' }}</td>
                            <td class="td-center">{{ row.unit || '—' }}</td>
                            <td><input v-model.number="row.quantity" type="number" min="0" class="input-table input-num"></td>
                            <td class="td-total">{{ formatCurrency(row.unit_price) }}</td>
                            <td class="td-total">{{ formatCurrency((row.quantity || 0) * (row.unit_price || 0)) }}</td>
                            <td><textarea v-model="row.description" rows="2" class="input-table input-labor-desc" placeholder="Descripción de la actividad..."></textarea></td>
                            <td class="td-accion">
                                <button type="button" class="btn-remove-item" @click="removeLaborItem(idx)" title="Quitar">✕</button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="tr-subtotal">
                            <td colspan="7" class="td-label-subtotal">TOTAL MANO DE OBRA</td>
                            <td class="td-subtotal-valor">{{ formatCurrency(totalLabor) }}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="btn-add-row-wrapper">
                <button type="button" class="btn-add-row" @click="addLaborItem">+ Agregar mano de obra</button>
            </div>

            <!-- ── Sección 3: Análisis APU. Materiales ─────────────────────── -->
            <div class="seccion-titulo" style="margin-top:24px">Análisis APU. Materiales</div>
            <div class="items-table-wrapper">
                <table class="items-table">
                    <thead>
                        <tr>
                            <th class="th-item">#</th>
                            <th class="th-sap">Código</th>
                            <th class="th-desc">Descripción</th>
                            <th class="th-un">UN</th>
                            <th class="th-cant">Cant.</th>
                            <th class="th-vunit">Valor Unit.</th>
                            <th class="th-vtotal">Subtotal</th>
                            <th class="th-labor-desc">Desar. Actividad</th>
                            <th class="th-accion"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, idx) in material_items" :key="row._id">
                            <td class="td-center">{{ idx + 1 }}</td>
                            <td><input v-model="row.sap_code" class="input-table"></td>
                            <td><input v-model="row.description" class="input-table input-desc"></td>
                            <td><input v-model="row.unit" class="input-table input-un"></td>
                            <td><input v-model.number="row.quantity" type="number" min="0" class="input-table input-num"></td>
                            <td><input v-model.number="row.unit_price" type="number" min="0" class="input-table input-num"></td>
                            <td class="td-total">{{ formatCurrency((row.quantity||0)*(row.unit_price||0)) }}</td>
                            <td><textarea v-model="row.row_description" rows="2" class="input-table input-labor-desc" placeholder="Desarrollo de la actividad..."></textarea></td>
                            <td class="td-accion">
                                <button type="button" class="btn-remove-item" @click="removeMaterialItem(idx)">✕</button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="tr-subtotal">
                            <td colspan="6" class="td-label-subtotal">TOTAL MATERIALES</td>
                            <td class="td-subtotal-valor">{{ formatCurrency(totalMaterials) }}</td>
                            <td colspan="2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="btn-add-row-wrapper">
                <button type="button" class="btn-add-row" @click="addMaterialItem">+ Agregar material</button>
            </div>

            <!-- ── Sección 4: Análisis APU. Equipos y Herramientas ───────────── -->
            <div class="seccion-titulo" style="margin-top:24px">Análisis APU. Equipos y Herramientas</div>
            <div class="items-table-wrapper">
                <table class="items-table">
                    <thead>
                        <tr>
                            <th class="th-item">#</th>
                            <th class="th-desc">Descripción</th>
                            <th class="th-un">UN</th>
                            <th class="th-cant">Cant.</th>
                            <th class="th-vunit">Valor Unit.</th>
                            <th class="th-vtotal">Subtotal</th>
                            <th class="th-labor-desc">Desar. Actividad</th>
                            <th class="th-accion"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, idx) in equipment_items" :key="row._id">
                            <td class="td-center">{{ idx + 1 }}</td>
                            <td><input v-model="row.description" class="input-table input-desc"></td>
                            <td><input v-model="row.unit" class="input-table input-un"></td>
                            <td><input v-model.number="row.quantity" type="number" min="0" class="input-table input-num"></td>
                            <td><input v-model.number="row.unit_price" type="number" min="0" class="input-table input-num"></td>
                            <td class="td-total">{{ formatCurrency((row.quantity||0)*(row.unit_price||0)) }}</td>
                            <td><textarea v-model="row.row_description" rows="2" class="input-table input-labor-desc" placeholder="Desarrollo de la actividad..."></textarea></td>
                            <td class="td-accion">
                                <button type="button" class="btn-remove-item" @click="removeEquipmentItem(idx)">✕</button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="tr-subtotal">
                            <td colspan="5" class="td-label-subtotal">TOTAL EQUIPOS Y HERRAMIENTAS</td>
                            <td class="td-subtotal-valor">{{ formatCurrency(totalEquipment) }}</td>
                            <td colspan="2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="btn-add-row-wrapper">
                <button type="button" class="btn-add-row" @click="addEquipmentItem">+ Agregar equipo/herramienta</button>
            </div>

            <!-- ── Sección 5: Análisis APU. Recargo Horas Adicional ──────────── -->
            <div class="seccion-titulo" style="margin-top:24px">Análisis APU. Recargo Horas Adicional</div>
            <div class="items-table-wrapper">
                <table class="items-table">
                    <thead>
                        <tr>
                            <th class="th-item">#</th>
                            <th class="th-desc">Descripción</th>
                            <th class="th-un">UN</th>
                            <th class="th-cant">Cant.</th>
                            <th class="th-vunit">Valor Unit.</th>
                            <th class="th-recargo">Recargo %</th>
                            <th class="th-vtotal">Subtotal</th>
                            <th class="th-labor-desc">Desar. Actividad</th>
                            <th class="th-accion"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, idx) in surcharge_hour_items" :key="row._id">
                            <td class="td-center">{{ idx + 1 }}</td>
                            <td><input v-model="row.description" class="input-table input-desc"></td>
                            <td><input v-model="row.unit" class="input-table input-un"></td>
                            <td><input v-model.number="row.quantity" type="number" min="0" class="input-table input-num"></td>
                            <td><input v-model.number="row.unit_price" type="number" min="0" class="input-table input-num"></td>
                            <td><input v-model.number="row.surcharge_percent" type="number" min="0" step="0.01" class="input-table input-num" placeholder="25"></td>
                            <td class="td-total">{{ formatCurrency((row.quantity||0)*(row.unit_price||0)*((row.surcharge_percent||0)/100)) }}</td>
                            <td><textarea v-model="row.row_description" rows="2" class="input-table input-labor-desc" placeholder="Desarrollo de la actividad..."></textarea></td>
                            <td class="td-accion">
                                <button type="button" class="btn-remove-item" @click="removeSurchargeHourItem(idx)">✕</button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="tr-subtotal">
                            <td colspan="6" class="td-label-subtotal">TOTAL RECARGO HORAS ADICIONAL</td>
                            <td class="td-subtotal-valor">{{ formatCurrency(totalSurchargeHours) }}</td>
                            <td colspan="2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="btn-add-row-wrapper">
                <button type="button" class="btn-add-row" @click="addSurchargeHourItem">+ Agregar recargo</button>
            </div>

            <hr>

            <!-- ── Fotos ──────────────────────────────────────────────────────── -->
            <div class="seccion-titulo">Fotos</div>

            <!-- Fotos existentes -->
            <div class="fotos-grid" v-if="fotosExistentes.length">
                <div class="foto-item" v-for="f in fotosExistentes" :key="f.id">
                    <img :src="`${apiUrl}/${f.path}`" class="foto-preview" @click="fotoActiva = `${apiUrl}/${f.path}`">
                    <button type="button" class="btn-remove-foto" @click="eliminarFotoExistente(f.id)">✕</button>
                </div>
            </div>

            <!-- Nuevas fotos a subir -->
            <div class="fotos-upload-area">
                <label class="btn-agregar-foto">
                    + Agregar fotos
                    <input type="file" accept="image/*" multiple @change="onFotosSeleccionadas" style="display:none">
                </label>
            </div>
            <div class="fotos-grid" v-if="fotosNuevas.length">
                <div class="foto-item" v-for="(f, i) in fotosNuevas" :key="i">
                    <img :src="f.preview" class="foto-preview" @click="fotoActiva = f.preview">
                    <button type="button" class="btn-remove-foto" @click="removeFotoNueva(i)">✕</button>
                </div>
            </div>

            <!-- Lightbox -->
            <div class="lightbox" v-if="fotoActiva" @click="fotoActiva = null">
                <img :src="fotoActiva" class="lightbox-img" @click.stop>
                <button class="lightbox-close" @click="fotoActiva = null">✕</button>
            </div>

            <!-- Acciones -->
            <div class="form-actions">
                <button type="submit" :disabled="isLoading">
                    {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
                </button>
            </div>
        </form>

        <!-- Modal éxito -->
        <div class="modal fade" id="exitoModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Cotización</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
                        <h5 class="modal-title">Error</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">{{ errorMsg }}</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </LayoutView>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import LayoutView from './Layouts/LayoutView.vue';
import { useAuthStore } from '../stores/auth.js';
import { useParamClients, useParamLinesByClient, useParamUsersByClient, useParamComponents } from '../composables/useParams.js';
import { useQuotationDetail, useEditQuotation, useQuotationLaborTypes, useDeleteQuotationPhoto } from '../composables/useQuotation.js';
import apiUrl from '../../config.js';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const quotationId = computed(() => Number(route.params.id));

// ── Modales ────────────────────────────────────────────────────────────────────
const exitoModal = ref(null);
const errorModal = ref(null);
const modalInstanceExito = ref(null);
const modalErrorInstance = ref(null);
const msg = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

// ── Campos ─────────────────────────────────────────────────────────────────────
const quotation_number = ref('');
const plant_name = ref('');
const ciudad = ref('');
const fecha = ref('');
const cliente = ref('');
const responsable = ref('');
const dirigido_a = ref('');
const linea = ref('');
const telefono = ref('3156528752');
const nit = ref('900670270');
const componente = ref('');
const fue_ejecutado = ref(null);
const fotosExistentes = ref([]);
const fotosNuevas = ref([]);
const fotoActiva = ref(null);

const { mutate: deletePhotoMutate } = useDeleteQuotationPhoto();

const onFotosSeleccionadas = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            fotosNuevas.value.push({ img: ev.target.result, preview: ev.target.result });
        };
        reader.readAsDataURL(file);
    });
    e.target.value = '';
};

const removeFotoNueva = (index) => {
    fotosNuevas.value.splice(index, 1);
};

const eliminarFotoExistente = (photoId) => {
    deletePhotoMutate(photoId, {
        onSuccess: () => {
            fotosExistentes.value = fotosExistentes.value.filter(f => f.id !== photoId);
        },
        onError: (err) => {
            errorMsg.value = err.response?.data?.message || 'Error al eliminar la foto.';
            modalErrorInstance.value?.show();
        },
    });
};

const autoLaborDesc = ref('');
const autoLaborUnit = ref('UND');
const autoLaborQty  = ref(1);
const autoMaterialsDesc = ref('MATERIALES');
const autoMaterialsUnit = ref('UND');
const autoMaterialsQty  = ref(1);
const alcance = ref('');
const tiempo_entrega = ref('');
const descripcion_actividad = ref('');
const donde_ejecuta = ref('');

// ── Carga detalle ──────────────────────────────────────────────────────────────
const { data: detailData, isLoading: isLoadingDetail } = useQuotationDetail(quotationId);

// ── Parámetros ─────────────────────────────────────────────────────────────────
const { data: clientsData } = useParamClients();
const client_list = computed(() => clientsData.value ?? []);

const { data: typeServiceData } = useParamComponents();
const component_list = computed(() => typeServiceData.value ?? []);

const { data: linesData } = useParamLinesByClient(cliente);
const line_list = computed(() => linesData.value ?? []);

const { data: personsData } = useParamUsersByClient(cliente);
const person_list = computed(() => personsData.value ?? []);

const onClienteChange = () => { responsable.value = ''; linea.value = ''; };

// ── Mano de obra ──────────────────────────────────────────────────────────────
const { data: laborTypesData } = useQuotationLaborTypes();
const labor_types_list = computed(() => laborTypesData.value ?? []);

let _laborNextId = 1;
const newLaborItem = () => ({ _id: _laborNextId++, labor_type_id: '', code: '', unit: '', unit_price: 0, quantity: 1, description: '' });
const labor_items = ref([newLaborItem()]);

const addLaborItem = () => labor_items.value.push(newLaborItem());
const removeLaborItem = (idx) => { if (labor_items.value.length > 1) labor_items.value.splice(idx, 1); };

const onLaborTypeChange = (row) => {
    const lt = labor_types_list.value.find(l => l.id === row.labor_type_id);
    if (lt) { row.code = lt.code; row.unit = lt.unit; row.unit_price = lt.value; }
    else { row.code = ''; row.unit = ''; row.unit_price = 0; }
};

const totalLabor = computed(() =>
    labor_items.value.reduce((acc, r) => acc + (r.quantity || 0) * (r.unit_price || 0), 0)
);

// ── Materiales ────────────────────────────────────────────────────────────────
let _matNextId = 1;
const newMaterialItem = () => ({ _id: _matNextId++, sap_code: '', description: '', unit: 'UND', quantity: 1, unit_price: 0, row_description: '' });
const material_items = ref([newMaterialItem()]);
const addMaterialItem = () => material_items.value.push(newMaterialItem());
const removeMaterialItem = (idx) => { if (material_items.value.length > 1) material_items.value.splice(idx, 1); };
const totalMaterials = computed(() => material_items.value.reduce((acc, r) => acc + (r.quantity || 0) * (r.unit_price || 0), 0));

// ── Equipos y Herramientas ────────────────────────────────────────────────────
let _eqNextId = 1;
const newEquipmentItem = () => ({ _id: _eqNextId++, description: '', unit: 'HRS', quantity: 0, unit_price: 0, row_description: '' });
const equipment_items = ref([newEquipmentItem()]);
const addEquipmentItem = () => equipment_items.value.push(newEquipmentItem());
const removeEquipmentItem = (idx) => { if (equipment_items.value.length > 1) equipment_items.value.splice(idx, 1); };
const totalEquipment = computed(() => equipment_items.value.reduce((acc, r) => acc + (r.quantity || 0) * (r.unit_price || 0), 0));

// ── Recargo Horas Adicional ───────────────────────────────────────────────────
let _surNextId = 1;
const newSurchargeHourItem = () => ({ _id: _surNextId++, description: '', unit: 'HRS', quantity: 0, unit_price: 0, surcharge_percent: 0, row_description: '' });
const surcharge_hour_items = ref([newSurchargeHourItem()]);
const addSurchargeHourItem = () => surcharge_hour_items.value.push(newSurchargeHourItem());
const removeSurchargeHourItem = (idx) => { if (surcharge_hour_items.value.length > 1) surcharge_hour_items.value.splice(idx, 1); };
const totalSurchargeHours = computed(() => surcharge_hour_items.value.reduce((acc, r) => acc + (r.quantity || 0) * (r.unit_price || 0) * ((r.surcharge_percent || 0) / 100), 0));

// ── Filas automáticas en Cuadro de Cantidades ─────────────────────────────────
const autoLaborTotal = computed(() => totalLabor.value + totalEquipment.value + totalSurchargeHours.value);
const autoMaterialsTotal = computed(() => totalMaterials.value);

// ── Items ──────────────────────────────────────────────────────────────────────
let _nextId = 1;
const newItem = () => ({ _id: _nextId++, codigo_sap: '', descripcion: '', un: 'UND', cant: 1, valor_unit: 0 });

const items = ref([newItem()]);
const logistica = ref({ un: 'UND', cant: 0, valor_unit: 147300 });
const recargos  = ref({ un: 'UND', cant: 1 });
const recargosValorUnit = computed(() => Math.round(totalLabor.value * 0.10));

const addItem    = () => items.value.push(newItem());
const removeItem = (idx) => { if (items.value.length > 1) items.value.splice(idx, 1); };

// ── Poblar formulario cuando lleguen los datos ─────────────────────────────────
watch(detailData, (d) => {
    if (!d) return;
    quotation_number.value = d.quotation_number;
    plant_name.value       = d.plant_name;
    ciudad.value           = d.city || '';
    fecha.value            = d.activity_date;
    cliente.value          = d.client_id;
    responsable.value      = d.responsible_id || '';
    dirigido_a.value       = d.directed_to || '';
    linea.value            = d.client_line_id || '';
    telefono.value         = d.phone || '3156528752';
    nit.value              = d.nit || '';
    componente.value    = d.component_id || '';
    fue_ejecutado.value = d.executed ?? null;
    fotosExistentes.value = d.photos || [];
    fotosNuevas.value = [];
    alcance.value          = d.scope || '';
    tiempo_entrega.value   = d.delivery_time || '';
    descripcion_actividad.value = d.activity_description || '';
    donde_ejecuta.value         = d.execution_place || '';

    const rawLabor = d.labor_items || [];
    labor_items.value = rawLabor.length
        ? rawLabor.map(l => ({ _id: _laborNextId++, labor_type_id: l.labor_type_id, code: l.code, unit: l.unit, unit_price: l.unit_price, quantity: l.quantity, description: l.row_description || '' }))
        : [newLaborItem()];

    const rawItems = d.items || [];

    const autoLabor = rawItems.find(i => i.item_type === 'auto_labor');
    autoLaborDesc.value = autoLabor?.description || '';
    autoLaborUnit.value = autoLabor?.unit || 'UND';
    autoLaborQty.value  = autoLabor?.quantity ?? 1;

    const autoMats = rawItems.find(i => i.item_type === 'auto_materials');
    autoMaterialsDesc.value = autoMats?.description || 'MATERIALES';
    autoMaterialsUnit.value = autoMats?.unit || 'UND';
    autoMaterialsQty.value  = autoMats?.quantity ?? 1;

    let idCounter = 1;
    items.value = rawItems
        .filter(i => i.item_type === 'item')
        .map(i => ({ _id: idCounter++, codigo_sap: i.sap_code || '', descripcion: i.description || '', un: i.unit || 'UND', cant: i.quantity, valor_unit: i.unit_price }));

    if (items.value.length === 0) items.value = [newItem()];

    const log = rawItems.find(i => i.item_type === 'logistics');
    if (log) logistica.value = { un: log.unit || 'UND', cant: log.quantity, valor_unit: log.unit_price };

    const rec = rawItems.find(i => i.item_type === 'surcharge');
    if (rec) recargos.value = { un: rec.unit || 'UND', cant: rec.quantity ?? 1 };

    const rawMaterials = d.material_items || [];
    material_items.value = rawMaterials.length
        ? rawMaterials.map(i => ({ _id: _matNextId++, sap_code: i.sap_code || '', description: i.description || '', unit: i.unit || 'UND', quantity: i.quantity, unit_price: i.unit_price, row_description: i.row_description || '' }))
        : [newMaterialItem()];

    const rawEquipment = d.equipment_items || [];
    equipment_items.value = rawEquipment.length
        ? rawEquipment.map(i => ({ _id: _eqNextId++, description: i.description || '', unit: i.unit || 'HRS', quantity: i.quantity, unit_price: i.unit_price, row_description: i.row_description || '' }))
        : [newEquipmentItem()];

    const rawSurcharges = d.hourly_surcharge_items || [];
    surcharge_hour_items.value = rawSurcharges.length
        ? rawSurcharges.map(i => ({ _id: _surNextId++, description: i.description || '', unit: i.unit || 'HRS', quantity: i.quantity, unit_price: i.unit_price, surcharge_percent: i.surcharge_percent || 0, row_description: i.row_description || '' }))
        : [newSurchargeHourItem()];
}, { immediate: true });

// ── Cálculos ───────────────────────────────────────────────────────────────────
const itemTotal = (item) => (item.cant || 0) * (item.valor_unit || 0);

const subtotal = computed(() => {
    const s = items.value.reduce((a, i) => a + itemTotal(i), 0);
    const l = (logistica.value.cant || 0) * (logistica.value.valor_unit || 0);
    const r = (recargos.value.cant  || 0) * recargosValorUnit.value;
    return s + l + r
        + autoLaborTotal.value * (autoLaborQty.value || 1)
        + autoMaterialsTotal.value * (autoMaterialsQty.value || 1);
});

const subtotalConIva = computed(() => subtotal.value * 1.19);

const formatCurrency = (val) => '$' + Math.round(Number(val) || 0).toLocaleString('es-CO');

// ── Guardar ────────────────────────────────────────────────────────────────────
const { mutate: editMutate } = useEditQuotation();

const guardarEdicion = () => {
    if (!cliente.value) {
        errorMsg.value = 'Debe seleccionar un cliente.';
        modalErrorInstance.value?.show();
        return;
    }

    isLoading.value = true;

    const filledItems = items.value.filter(i => i.descripcion?.trim() || i.valor_unit > 0);

    const autoItemsList = [];
    if (autoLaborTotal.value > 0) {
        autoItemsList.push({
            sap_code: null,
            description: autoLaborDesc.value || null,
            unit: autoLaborUnit.value || 'UND',
            quantity: autoLaborQty.value || 1,
            unit_price: autoLaborTotal.value,
            total_price: autoLaborTotal.value * (autoLaborQty.value || 1),
            item_type: 'auto_labor',
        });
    }
    if (autoMaterialsTotal.value > 0) {
        autoItemsList.push({
            sap_code: null,
            description: autoMaterialsDesc.value || 'MATERIALES',
            unit: autoMaterialsUnit.value || 'UND',
            quantity: autoMaterialsQty.value || 1,
            unit_price: autoMaterialsTotal.value,
            total_price: autoMaterialsTotal.value * (autoMaterialsQty.value || 1),
            item_type: 'auto_materials',
        });
    }

    const allItems = [
        ...autoItemsList,
        ...filledItems.map(i => ({
            sap_code: i.codigo_sap || null,
            description: i.descripcion || null,
            unit: i.un || null,
            quantity: i.cant || 0,
            unit_price: i.valor_unit || 0,
            total_price: itemTotal(i),
            item_type: 'item',
        })),
        {
            description: 'LOGÍSTICA Y TRANSPORTE',
            unit: logistica.value.un || null,
            quantity: logistica.value.cant || 0,
            unit_price: logistica.value.valor_unit || 0,
            total_price: (logistica.value.cant || 0) * (logistica.value.valor_unit || 0),
            item_type: 'logistics',
        },
        {
            description: 'TRABAJO EN ALTURA',
            unit: recargos.value.un || null,
            quantity: recargos.value.cant || 0,
            unit_price: recargosValorUnit.value,
            total_price: (recargos.value.cant || 0) * recargosValorUnit.value,
            item_type: 'surcharge',
        },
    ];

    editMutate(
        {
            quotation_id: quotationId.value,
            city: ciudad.value || null,
            activity_date: fecha.value,
            client_id: cliente.value,
            client_line_id: linea.value || null,
            responsible_id: responsable.value || null,
            directed_to: dirigido_a.value || null,
            phone: telefono.value || null,
            nit: nit.value || null,
            component_id: componente.value || null,
            executed: fue_ejecutado.value,
            scope: alcance.value || null,
            delivery_time: tiempo_entrega.value || null,
            activity_description: descripcion_actividad.value || null,
            execution_place: donde_ejecuta.value || null,
            subtotal: subtotal.value,
            subtotal_with_iva: subtotalConIva.value,
            user_id: auth.userId,
            items: allItems,
            labor_items: labor_items.value
                .filter(r => r.labor_type_id)
                .map(r => ({
                    labor_type_id: r.labor_type_id,
                    quantity: r.quantity || 0,
                    unit_price: r.unit_price || 0,
                    total_price: (r.quantity || 0) * (r.unit_price || 0),
                    description: r.description || null,
                })),
            material_items: material_items.value
                .filter(r => r.description?.trim() || r.unit_price > 0)
                .map(r => ({
                    sap_code: r.sap_code || null,
                    description: r.description || null,
                    unit: r.unit || null,
                    quantity: r.quantity || 0,
                    unit_price: r.unit_price || 0,
                    total_price: (r.quantity || 0) * (r.unit_price || 0),
                    row_description: r.row_description || null,
                })),
            equipment_items: equipment_items.value
                .filter(r => r.description?.trim() || r.unit_price > 0)
                .map(r => ({
                    description: r.description || null,
                    unit: r.unit || null,
                    quantity: r.quantity || 0,
                    unit_price: r.unit_price || 0,
                    total_price: (r.quantity || 0) * (r.unit_price || 0),
                    row_description: r.row_description || null,
                })),
            hourly_surcharge_items: surcharge_hour_items.value
                .filter(r => r.description?.trim() || r.unit_price > 0)
                .map(r => ({
                    description: r.description || null,
                    unit: r.unit || null,
                    quantity: r.quantity || 0,
                    unit_price: r.unit_price || 0,
                    surcharge_percent: r.surcharge_percent || 0,
                    total_price: (r.quantity || 0) * (r.unit_price || 0) * ((r.surcharge_percent || 0) / 100),
                    row_description: r.row_description || null,
                })),
            fotos_nuevas: fotosNuevas.value.map(f => ({ img: f.img })),
        },
        {
            onSuccess: () => {
                msg.value = 'Cotización actualizada correctamente.';
                modalInstanceExito.value?.show();
            },
            onError: (err) => {
                errorMsg.value = err.response?.data?.message || 'Error al actualizar la cotización.';
                modalErrorInstance.value?.show();
            },
            onSettled: () => { isLoading.value = false; },
        }
    );
};

onMounted(() => {
    modalInstanceExito.value = new Modal(exitoModal.value);
    modalErrorInstance.value = new Modal(errorModal.value);
});
</script>

<style scoped>
body, html {
    height: 100%;
    font-size: 62.5%;
    font-family: "DM Sans", serif;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 10px;
}

.btn-volver {
    background-color: #e8f0f7;
    color: #2a475f;
    border: 1px solid #b3cde0;
    padding: 7px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: background 0.15s;
}

.btn-volver:hover { background-color: #cde0f0; }

.nro-preview {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #e8f4fd;
    border: 1px solid #b3d6f0;
    border-radius: 6px;
    padding: 6px 14px;
}

.nro-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

.nro-valor {
    font-size: 1rem;
    font-weight: 700;
    color: #2a475f;
    letter-spacing: 1px;
}

.loading-state {
    text-align: center;
    padding: 60px;
    color: #888;
    font-size: 0.95rem;
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
    margin-bottom: 16px;
    color: #2a475f;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

label {
    margin-bottom: 2px;
    font-weight: 500;
    font-size: 0.82rem;
    color: #444;
}

input, textarea, select {
    padding: 5px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    font-size: 0.85rem;
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #2a475f;
    box-shadow: 0 0 0 2px rgba(42,71,95,0.15);
}

.input-readonly {
    background-color: #f5f5f5;
    color: #555;
    cursor: default;
}

.seccion-titulo {
    font-size: 1.1rem;
    font-weight: 700;
    text-align: center;
    color: #fff;
    background-color: #2a475f;
    padding: 6px 12px;
    border-radius: 4px;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.req { color: #c0392b; }

.radio-group {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 6px 0;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    font-weight: 500;
    color: #333;
    cursor: pointer;
}

.radio-label input[type="radio"] {
    width: auto;
    cursor: pointer;
}

/* ── Tabla ───────────────────────────────────────────────────────────────────── */
.items-table-wrapper {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    margin-bottom: 8px;
}

.items-table {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
    font-size: 0.8rem;
}

.items-table thead th {
    background-color: #2a475f;
    color: #fff;
    padding: 8px 10px;
    text-align: center;
    white-space: nowrap;
    font-size: 0.75rem;
}

.items-table tbody tr:nth-child(even) { background-color: #f8f9fa; }
.items-table tbody tr:hover           { background-color: #eef3f8; }

.items-table td {
    padding: 4px 6px;
    vertical-align: middle;
    border-bottom: 1px solid #e9ecef;
}


.th-labor-type { min-width: 160px; }
.th-labor-desc { min-width: 220px; }
.th-recargo { width: 90px; }
.input-labor-desc { width: 100%; resize: vertical; font-size: 0.8rem; min-height: 38px; }
.th-item  { width: 50px; }
.th-sap   { width: 110px; }
.th-desc  { min-width: 260px; }
.th-un    { width: 70px; }
.th-cant  { width: 75px; }
.th-vunit { width: 110px; }
.th-vtotal{ width: 110px; }
.th-accion{ width: 36px; }

.input-table {
    border: 1px solid transparent;
    border-radius: 3px;
    padding: 3px 6px;
    width: 100%;
    font-size: 0.8rem;
    background: transparent;
    transition: border-color 0.15s, background 0.15s;
}

.input-table:hover  { border-color: #ced4da; background: #fff; }
.input-table:focus  { outline: none; border-color: #2a475f; background: #fff; box-shadow: 0 0 0 2px rgba(42,71,95,0.12); }

.input-sap  { width: 90px; }
.input-desc { min-width: 200px; }
.input-un   { width: 60px; text-align: center; }
.input-num  { width: 80px; text-align: right; }

.td-center { text-align: center; font-weight: 600; color: #555; }
.td-total  { text-align: right; font-weight: 600; color: #2a475f; white-space: nowrap; }
.td-accion { text-align: center; }

.tr-fixed td { background-color: #f0f4f8; border-top: 1px solid #cdd8e3; }

.td-label-fixed {
    font-weight: 700;
    font-size: 0.75rem;
    color: #2a475f;
    text-align: center;
    text-transform: uppercase;
    padding: 6px 8px;
}

.td-fixed-name { font-size: 0.78rem; color: #555; text-align: center; }

.tr-subtotal td { background-color: #2a475f; color: #fff; border-top: 2px solid #1c3342; }

.td-label-subtotal {
    font-weight: 700;
    font-size: 0.82rem;
    text-align: right;
    padding: 8px 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.td-subtotal-valor {
    text-align: right;
    font-weight: 700;
    font-size: 0.95rem;
    padding: 8px 10px;
    white-space: nowrap;
    background-color: #4caf50;
    color: #fff;
}

.btn-remove-item {
    background: none;
    border: none;
    color: #c0392b;
    cursor: pointer;
    font-size: 0.85rem;
    padding: 2px 6px;
    border-radius: 3px;
    transition: background 0.15s;
}

.btn-remove-item:hover { background: rgba(192,57,43,0.1); }

.btn-add-row-wrapper { display: flex; justify-content: flex-start; margin-top: 8px; }

.btn-add-row {
    background-color: #e8f4fd;
    color: #2a475f;
    border: 1px dashed #2a475f;
    padding: 6px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    transition: background 0.15s;
}

.btn-add-row:hover { background-color: #cde6f7; }

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}

.form-actions button[type="submit"] {
    background-color: #2a475f;
    color: white;
    padding: 10px 28px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.2s;
}

.form-actions button[type="submit"]:hover:not(:disabled) { background-color: #1c3342; }
.form-actions button[type="submit"]:disabled { opacity: 0.65; cursor: not-allowed; }

/* ── Fotos ─────────────────────────────────────────────────────────────────── */
.fotos-upload-area {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.btn-agregar-foto {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #2a475f;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.2s;
}

.btn-agregar-foto:hover {
    background: #1e3549;
}

.fotos-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
}

.foto-item {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ddd;
}

.foto-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: zoom-in;
}

.btn-remove-foto {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0,0,0,0.55);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.btn-remove-foto:hover {
    background: #c0392b;
}

.lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: zoom-out;
}

.lightbox-img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 6px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    cursor: default;
}

.lightbox-close {
    position: fixed;
    top: 18px;
    right: 24px;
    background: rgba(255,255,255,0.15);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-close:hover {
    background: #c0392b;
}
</style>
