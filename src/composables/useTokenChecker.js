import { ref } from 'vue';
import http from '../api/http.js';
import { useAuthStore } from '../stores/auth.js';

// Estado global compartido entre todas las instancias
const showWarningModal = ref(false);
const showFloatingTimer = ref(false);
const minutesRemaining = ref(0);
let intervalId = null;
let isInitialized = false;

const checkToken = async () => {
    const auth = useAuthStore();

    if (!auth.isAuthenticated) {
      return;
    }

    try {
      const response = await http.post('/user/check_token', {});

      if (response.status === 200) {
        const data = response.data.data;
        minutesRemaining.value = data.minutes_remaining;

        if (data.is_about_to_expire) {
          showFloatingTimer.value = true;
          if (!showWarningModal.value) {
            showWarningModal.value = true;
          }
        } else {
          showFloatingTimer.value = false;
          showWarningModal.value = false;
        }

        if (minutesRemaining.value <= 0) {
          stopChecking();
          auth.clearSession();
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
      if (error.response && error.response.status === 401) {
        stopChecking();
        const auth = useAuthStore();
        auth.clearSession();
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
  const auth = useAuthStore();
  if (auth.isAuthenticated && !isInitialized) {
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