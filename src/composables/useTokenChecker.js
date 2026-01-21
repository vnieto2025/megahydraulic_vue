import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import apiUrl from '../../config.js';

export function useTokenChecker() {
  const showWarningModal = ref(false);
  const minutesRemaining = ref(0);
  let intervalId = null;

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
        
        // Mostrar modal de advertencia si quedan 5 minutos o menos
        if (data.is_about_to_expire && !showWarningModal.value) {
          showWarningModal.value = true;
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
    }
  };

  const closeWarning = () => {
    showWarningModal.value = false;
  };

  onMounted(() => {
    const token = localStorage.getItem('token');
    if (token) {
      startChecking();
    }
  });

  onUnmounted(() => {
    stopChecking();
  });

  return {
    showWarningModal,
    minutesRemaining,
    closeWarning,
    checkToken
  };
}
