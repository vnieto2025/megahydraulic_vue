<template>
    <LayoutView>
        <form @submit.prevent="createReport">
            <h2>Formulario de Creación de Reporte Acesco</h2>
            <div class="form-group">
                <label for="txt_fecha_actividad">Fecha Actividad:</label>
                <input type="date" id="txt_fecha_actividad" v-model="fecha_actividad" required>
            </div>
            <div class="form-group">
                <label for="select_cliente">Cliente:</label>
                <select id="select_cliente" v-model="cliente" @change="onClienteChange" required>
                    <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="select_linea">Línea:</label>
                <select id="select_linea" v-model="linea" required>
                    <option v-for="line in line_list" :key="line.id" :value="line.id">{{ line.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="select_persona">Persona que recibe:</label>
                <select id="select_persona" v-model="persona" required>
                    <option v-for="person in person_list" :key="person.id" :value="person.id">{{ person.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="txt_zona_trabajo">Zona de Trabajo:</label>
                <input type="text" id="txt_zona_trabajo" v-model="zona_trabajo" required>
            </div>
            <div class="form-group">
                <label for="txt_om">OM:</label>
                <input type="text" id="txt_om" v-model="om">
            </div>

            <div class="form-group">
                <label for="txt_solped">Solped:</label>
                <input type="text" id="txt_solped" v-model="solped">
            </div>

            <div class="form-group">
                <label for="txt_orden">Orden de compra:</label>
                <input type="text" id="txt_orden" v-model="orden_compra">
            </div>

            <div class="form-group">
                <label for="txt_posicion">Posición:</label>
                <input type="text" id="txt_posicion" v-model="posicion">
            </div>

            <div class="form-group">
                <label for="txt_descripcion_servicio">Descripción del servicio:</label>
                <textarea id="txt_descripcion_servicio" v-model="descripcion_servicio" required></textarea>
            </div>

            <div class="form-group">
                <label for="txt_informacion">Información:</label>
                <textarea id="txt_informacion" v-model="informacion" required></textarea>
            </div>

            <div class="form-group">
                <label for="txt_valor_servicio">Valor del Servicio:</label>
                <input type="number" id="txt_valor_servicio" v-model="valor_servicio">
            </div>

            <div class="form-group">
                <label for="txt_conclusiones">Conclusiones:</label>
                <textarea id="txt_conclusiones" v-model="conclusiones"></textarea>
            </div>

            <div class="form-group">
                <label for="txt_recomendaciones">Recomendaciones:</label>
                <textarea id="txt_recomendaciones" v-model="recomendaciones"></textarea>
            </div>

            <hr>

            <!-- Input de imágenes fijos -->
            <div class="form-group">
                <label for="registro_evidencia_antes">Registro Evidencia Antes:</label>
                <input type="file" id="registro_evidencia_antes" @change="handleImageChange($event, 0)" accept="image/*" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="registro_evidencia_despues">Registro Evidencia Despues:</label>
                <input type="file" id="registro_evidencia_despues" @change="handleImageChange($event, 1)" accept="image/*" class="form-control" required>
            </div>

            <hr>

            <div class="form-group">
                <label for="txt_tecnico1">Técnico 1:</label>
                <input type="text" id="txt_valor_servicio" v-model="tecnico1" required>
            </div>

            <div class="form-group">
                <label for="txt_tecnico2">Técnico 2</label>
                <input type="text" id="txt_valor_servicio" v-model="tecnico2">
            </div>
            
            <button type="submit" class="btn btn-primary mt-3" :disabled="isLoading">
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
import apiUrl from "../../config.js";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import LayoutView from '../views/Layouts/LayoutView.vue';
import { Modal } from 'bootstrap';

// Variables reactivas para los datos
const client_list = ref([]);
const line_list = ref([]);
const person_list = ref([]);
const servicios_list = ref([]);
const equipos_list = ref([]);
const imagenes = ref([null, null]);
const fecha_actividad = ref('');
const fecha_actividad_formateada = ref('');
const cliente = ref('');
const linea = ref('');
const persona = ref('');
const zona_trabajo = ref('');
const om = ref('');
const solped = ref('');
const orden_compra = ref('');
const posicion = ref('');
const descripcion_servicio = ref('');
const informacion = ref('');
const user_id = localStorage.getItem('user_id');
const token = localStorage.getItem('token');
const modalInstance = ref(null);
const report_id = ref('');
const msg = ref('');
const error = ref('');
const modalErrorInstance = ref(null);
const errorMsg = ref('');
const token_status = ref(0);
const isLoading = ref(false);
const valor_servicio = ref(0);
const conclusiones = ref('');
const recomendaciones = ref('');
const tecnico1 = ref('');
const tecnico2 = ref('');

// Acceder al enrutador
const router = useRouter();

const createReport = async () => {
    try {
        if (!token) {
            router.push('/'); // Redirigir al login si no hay token
        }

        isLoading.value = true; // Activar la espera

        const [year, month, day] = fecha_actividad.value.split("-");

        fecha_actividad_formateada.value = `${day}-${month}-${year}`

        if (tecnico1.value) {
            tecnico1.value = tecnico1.value.toUpperCase();
        }
        if (tecnico2.value) {
            tecnico2.value = tecnico2.value.toUpperCase();
        }
        if (zona_trabajo.value) {
            zona_trabajo.value = zona_trabajo.value.toUpperCase();
        }

        const response = await axios.post(
            `${apiUrl}/reports/create_report_acesco`,
            {
                activity_date: fecha_actividad_formateada.value,
                client_id: cliente.value,
                client_line_id: linea.value,
                person_receives: persona.value,
                work_zone: zona_trabajo.value,
                om: om.value,
                solped: solped.value,
                buy_order: orden_compra.value,
                position: posicion.value,
                service_description: descripcion_servicio.value,
                information: informacion.value,
                service_value: valor_servicio.value,
                conclutions: conclusiones.value,
                recommendations: recomendaciones.value,
                tech_1: tecnico1.value,
                tech_2: tecnico2.value,
                files: imagenes.value,
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
            msg.value = response.data.message
            report_id.value = response.data.data
            modalInstance.value.show();                    
        }else if (response.status === 200) {
            error.value = response.data.message
        }
    } catch (error) {
        console.error('Error al guardar reporte:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
        if (error.response.status === 401) {
          token_status.value = error.response.status
          errorMsg.value = error.response.data.detail;
        } else if (error.response.status === 403) {
            token_status.value = error.response.status
            errorMsg.value = error.response.data.detail;
        }
    } finally {
        isLoading.value = false; // Desactivar la espera
    }
};
const generar_pdf = async () => {
    try {
        if (!token) {
            router.push('/'); // Redirigir al login si no hay token
        }
        const response = await axios.post(
            `${apiUrl}/reports/generate_report_acesco`,
            {
                report_id: report_id.value,
                flag: true
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                responseType: "blob",  // Indicar que esperamos un archivo binario
            }
        );
        if (response.status === 200) {
            // Crear una URL para el blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            // Crear un enlace temporal para descargar el archivo
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `reporte_${report_id.value}.pdf`);  // Definir el nombre del archivo
            document.body.appendChild(link);
            link.click();  // Ejecutar el click para descargar el archivo
            document.body.removeChild(link);  // Limpiar el DOM
            goListaReportes();
        }
    } catch (error) {
        console.error('Error al generar pdf:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
        if (error.response.status === 401) {
          token_status.value = error.response.status
          errorMsg.value = "El token ha expirado.";
        } else if (error.response.status === 403) {
            token_status.value = error.response.status
            errorMsg.value = error.response.data.detail;
        }
    }
};
const cargarDatos = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/get_clients`, {},
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            msg.value = response.data.message;
            client_list.value = response.data.data;
        }

        const responseServices = await axios.post(
            `${apiUrl}/params/get_type_service`, {},
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (responseServices.status === 200) {
            msg.value = responseServices.data.message;
            servicios_list.value = responseServices.data.data;
        }

        const responseEquipments = await axios.post(
            `${apiUrl}/params/get_type_equipments`, {},
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (responseEquipments.status === 200) {
            msg.value = responseEquipments.data.message;
            equipos_list.value = responseEquipments.data.data;
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
        if (error.response.status === 401) {
          token_status.value = error.response.status
          errorMsg.value = error.response.data.detail;
        } else if (error.response.status === 403) {
            token_status.value = error.response.status
            errorMsg.value = error.response.data.detail;
        }
    }

};
const onClienteChange = async () => {
    try {
        // Carga de líneas asociadas al cliente seleccionado
        const responseLineas = await axios.post(
            `${apiUrl}/params/get_lines_by_client`, 
            { client: cliente.value },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        line_list.value = responseLineas.data.data || [];

        // Carga de personas asociadas al cliente seleccionado
        const responsePersonas = await axios.post(
            `${apiUrl}/params/get_users_by_client`, 
            { client: cliente.value },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        person_list.value = responsePersonas.data.data || [];

    } catch (error) {
        console.error('Error al cargar datos dinámicos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
        if (error.response.status === 401) {
          token_status.value = error.response.status
          errorMsg.value = error.response.data.detail;
        }  else if (error.response.status === 403) {
            token_status.value = error.response.status
            errorMsg.value = error.response.data.detail;
        }
    }
};
const handleImageChange = async (event, index) => {
    const file = event.target.files[0]; // Obtenemos el archivo cargado
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imagenes.value[index] = reader.result; // Base64 de la imagen
        };
        reader.readAsDataURL(file);
    }
};
const goListaReportes = () => {
    router.push('/reports-acesco');
};
// Función para manejar el cierre de sesión
function logout() {
  localStorage.clear();
  router.push('/'); // Redirigir al login
};
function redirigir_dashboard() {
  router.push('/dashboard'); // Redirigir al dashboard
};

// Código que se ejecuta al montar el componente
onMounted(() => {
    modalInstance.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
    if (!token) {
        router.push('/'); // Redirigir al login si no hay token
    }
    // Cargar los datos para los select inputs cuando se monta el componente
    cargarDatos();
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