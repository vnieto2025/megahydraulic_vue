<template>
  <div id="main-data">
    <Navbar />

    <div class="layout-body">
      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'sidebar--collapsed': sidebarCollapsed }">
        <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'">
          <span class="toggle-icon">{{ sidebarCollapsed ? '›' : '‹' }}</span>
        </button>

        <nav class="sidebar-nav">
          <router-link
            v-for="(mod, index) in modulos"
            :key="index"
            :to="mod.action"
            class="sidebar-link"
            :title="mod.name"
          >
            <img :src="`/${mod.icon}`" :alt="mod.name" class="sidebar-icon">
            <span class="sidebar-label">{{ mod.name }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- Contenido principal -->
      <div class="main-content container-fluid mt-4">
        <slot></slot>
      </div>
    </div>

    <Footer />

    <!-- Reloj flotante animado - Se mantiene visible mientras queden 5 minutos o menos -->
    <FloatingTimer 
      :show="showFloatingTimer" 
      :minutes="minutesRemaining"
    />

    <!-- Modal de advertencia de token por expirar -->
    <div 
      class="modal fade" 
      id="tokenWarningModal" 
      tabindex="-1" 
      aria-labelledby="tokenWarningModalLabel" 
      aria-hidden="true" 
      data-bs-backdrop="false"
      data-bs-keyboard="true"
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
  import FloatingTimer from '../../components/FloatingTimer.vue';
  import { useTokenChecker } from '../../composables/useTokenChecker';
  import { watch, ref, onMounted } from 'vue';
  import { Modal } from 'bootstrap';

  const { showWarningModal, showFloatingTimer, minutesRemaining, closeWarning } = useTokenChecker();
  const tokenWarningModal = ref(null);
  const modalInstance = ref(null);
  const sidebarCollapsed = ref(false);
  const modulos = ref(JSON.parse(localStorage.getItem('permissions') || '[]'));

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

/* ── Cuerpo (sidebar + contenido) ── */
.layout-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* ── Sidebar ── */
.sidebar {
  width: 200px;
  min-width: 200px;
  background-color: #2a475f;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease, min-width 0.25s ease;
  position: relative;
  flex-shrink: 0;
}

.sidebar--collapsed {
  width: 56px;
  min-width: 56px;
}

/* Botón toggle */
.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px 0;
  width: 100%;
  font-size: 1.2rem;
  line-height: 1;
  transition: background 0.2s;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toggle-icon {
  font-size: 1.4rem;
  font-weight: bold;
}

/* Navegación */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  overflow: hidden;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #cfd8dc;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
  border-left: 3px solid transparent;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.sidebar-link.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: #90caf9;
}

.sidebar-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  filter: brightness(0) invert(1);
  opacity: 0.85;
}

.sidebar-label {
  font-size: 0.78rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.sidebar--collapsed .sidebar-label {
  opacity: 0;
  width: 0;
}

/* Contenido */
.main-content {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
}

</style>
  