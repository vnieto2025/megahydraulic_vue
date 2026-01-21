import { ref } from 'vue';
import axios from 'axios';
import apiUrl from '../../config.js';

// Estado global compartido entre todas las instancias
const showWarningModal = ref(false);
const showFloatingTimer = ref(false);
const minutesRemaining = ref(0);
let intervalId = null;
let isInitialized = false;

const checkToken = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/user/check_token`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        const data = response.data.data;
        minutesRemaining.value = data.minutes_remaining;
        
        // Mostrar tanto el modal como el reloj flotante si quedan 5 minutos o menos
        if (data.is_about_to_expire) {
          showFloatingTimer.value = true;
          if (!showWarningModal.value) {
            showWarningModal.value = true;
          }
        } else {
          // Si quedan más de 5 minutos, ocultar ambos
          showFloatingTimer.value = false;
          showWarningModal.value = false;
        }
        
        // Si el token expiró (0 o menos minutos)
        if (minutesRemaining.value <= 0) {
          stopChecking();
          localStorage.clear();
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
      // Si hay error 401, el token ya expiró
      if (error.response && error.response.status === 401) {
        stopChecking();
        localStorage.clear();
        window.location.href = '/';
      }
  }
};

const startChecking = () => {
  // Solo iniciar si no se ha inicializado antes
  if (isInitialized) {
    return;
  }
  
  isInitialized = true;
  
  // Verificar inmediatamente
  checkToken();
  
  // Luego verificar cada 1 minuto (60000 ms)
  intervalId = setInterval(() => {
    checkToken();
  }, 60000);
};

const stopChecking = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    isInitialized = false;
  }
};

const closeWarning = () => {
  showWarningModal.value = false;
};

export function useTokenChecker() {
  // Iniciar el checker solo si hay token y no está ya inicializado
  const token = localStorage.getItem('token');
  if (token && !isInitialized) {
    startChecking();
  }

  return {
    showWarningModal,
    showFloatingTimer,
    minutesRemaining,
    closeWarning,
    checkToken
  };
}