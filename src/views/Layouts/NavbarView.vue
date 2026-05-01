<template>
    <header>
      <div class="profile-container">
        <!-- Foto con dropdown -->
        <div class="avatar-wrapper" @click="toggleDropdown" ref="avatarWrapper">
          <img :src="foto" alt="foto perfil">
          <span class="avatar-caret">&#9660;</span>

          <!-- Dropdown -->
          <div class="profile-dropdown" v-show="dropdownOpen" @click.stop>
            <div class="dropdown-header">
              <span class="dropdown-name">{{ primer_nombre }} {{ primer_apellido }}</span>
            </div>
            <router-link class="dropdown-item" :to="{ name: 'dashboard' }" @click="dropdownOpen = false">
              🏠 Menú Principal
            </router-link>
            <router-link class="dropdown-item" :to="{ name: 'profile/edit/', params: { id: usuario } }" @click="dropdownOpen = false">
              ✏️ Editar Perfil
            </router-link>
            <router-link class="dropdown-item" :to="{ name: 'profile/change_password/', params: { id: usuario } }" @click="dropdownOpen = false">
              🔒 Cambiar Contraseña
            </router-link>
            <a class="dropdown-item dropdown-item--danger" href="#" @click.prevent="logout">
              🚪 Salir
            </a>
          </div>
        </div>

        <h1>Bienvenido, {{ primer_nombre }} {{ primer_apellido }}</h1>
      </div>
    </header>
</template>

<script setup>
import apiUrl from "../../../config.js";
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.js';

const auth = useAuthStore();
const dropdownOpen = ref(false);
const avatarWrapper = ref(null);
const router = useRouter();

const primer_nombre = auth.firstName;
const primer_apellido = auth.lastName;
const foto = `${apiUrl}/${auth.photo}`;
const usuario = auth.userId;

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeOnOutsideClick = (e) => {
  if (avatarWrapper.value && !avatarWrapper.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
};

function logout() {
  auth.clearSession();
  router.push('/');
}

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.push('/');
  }
  document.addEventListener('click', closeOnOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
}

header {
  padding: 16px 24px;
  background-color: #2a475f;
}

.profile-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* ── Avatar + dropdown wrapper ── */
.avatar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-wrapper img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4);
  transition: border-color 0.2s;
  display: block;
}

.avatar-wrapper:hover img {
  border-color: rgba(255,255,255,0.9);
}

.avatar-caret {
  color: rgba(255,255,255,0.7);
  font-size: 0.65rem;
  line-height: 1;
  align-self: flex-end;
  margin-bottom: 6px;
}

/* ── Dropdown ── */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 200px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.18);
  z-index: 1050;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.dropdown-header {
  padding: 10px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.dropdown-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #2a475f;
  white-space: nowrap;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  font-size: 0.82rem;
  transition: background 0.15s;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #f0f4f8;
  color: #2a475f;
}

.dropdown-item--danger {
  color: #c62828;
  border-top: 1px solid #eee;
}

.dropdown-item--danger:hover {
  background-color: #fdecea;
  color: #b71c1c;
}

/* ── Título de bienvenida ── */
header h1 {
  color: white;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
}
</style>
