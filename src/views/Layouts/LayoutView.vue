<template>
  <div id="main-data">
    <Navbar />
    <div class="main-content container mt-4">
      <slot></slot> <!-- Aquí se renderizará el contenido dinámico de cada página -->
    </div>
    <Footer />

    <!-- Modal de advertencia de token por expirar -->
    <div 
      class="modal fade" 
      id="tokenWarningModal" 
      tabindex="-1" 
      aria-labelledby="tokenWarningModalLabel" 
      aria-hidden="true" 
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      ref="tokenWarningModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title" id="tokenWarningModalLabel">
              ⚠️ Advertencia de Sesión
            </h5>
          </div>
          <div class="modal-body">
            <p class="mb-3">
              <strong>Tu sesión está por expirar en {{ minutesRemaining }} minuto(s).</strong>
            </p>
            <p class="mb-0">
              Por favor, guarda tu trabajo para evitar perder información.
              La sesión se cerrará automáticamente cuando expire el tiempo.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="handleCloseWarning">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  import Navbar from './NavbarView.vue';
  import Footer from './FooterView.vue';
  import { useTokenChecker } from '../../composables/useTokenChecker';
  import { watch, ref, onMounted } from 'vue';
  import { Modal } from 'bootstrap';

  const { showWarningModal, minutesRemaining, closeWarning } = useTokenChecker();
  const tokenWarningModal = ref(null);
  const modalInstance = ref(null);

  onMounted(() => {
    modalInstance.value = new Modal(tokenWarningModal.value);
  });

  // Watch para mostrar el modal cuando showWarningModal cambie a true
  watch(showWarningModal, (newValue) => {
    if (newValue && modalInstance.value) {
      modalInstance.value.show();
    }
  });

  // Función para cerrar el modal
  const handleCloseWarning = () => {
    if (modalInstance.value) {
      modalInstance.value.hide();
    }
    closeWarning();
  };
</script>

<style scoped>

html, body {
  height: 100%;
  margin: 0;
}

#main-data {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1; /* Este es el contenido dinámico que empuja el footer hacia abajo */
}

</style>
  