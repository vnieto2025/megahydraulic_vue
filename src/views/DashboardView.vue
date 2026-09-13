<template>
    <LayoutView>
      <div class="container-dashboard">
            <div class="form-container-dashboard">
                <div class="card-container-dashboard">
                    <div class="card-dashboard" v-for="(modulo, index) in modulos" :key="index" @click="go_action(modulo.action)">
                      <div class="card-header">
                        <img :src="`/${modulo.icon}`" :alt=modulo.icon>
                        <h5 class="card-title">{{modulo.name}}</h5>
                      </div>
                      <div class="card-body">
                        <p class="card-text">{{ modulo.description }}</p>
                      </div>
                    </div>
                </div>
            </div>
        </div>
      
  </LayoutView>
</template>

<script setup>
import { useRouter } from "vue-router";
import LayoutView from '../views/Layouts/LayoutView.vue';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const modulos = auth.permissions;

// Accede al enrutador
const router = useRouter();

const go_action = async (action) => {
  router.push(`${action}`);
}

</script>

<style scoped>

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body,
html {
  height: 100%;
  font-size: 62.5%;
  font-family: var(--font-sans, 'Inter', sans-serif);
}

.container-dashboard {
    max-width: 100%;
    margin: 0 auto;
    padding: 0;
}

.form-container-dashboard {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    margin-top: 8px;
}

.card-container-dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.card-dashboard {
    background: var(--color-surface, #fff);
    padding: 24px 20px;
    border-radius: var(--radius-md, 10px);
    border: 1px solid var(--color-border, #e2e8f0);
    box-shadow: var(--shadow-sm, 0 1px 3px rgba(16,24,40,.08));
    transition: transform 0.22s var(--ease, ease), box-shadow 0.22s var(--ease, ease), border-color 0.22s ease;
    position: relative;
    overflow: hidden;
}

.card-dashboard::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-primary, #2a475f), var(--color-accent, #d97706));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s var(--ease, ease);
}

.card-dashboard:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md, 0 6px 20px rgba(16,24,40,.1));
    border-color: transparent;
    cursor: pointer;
}

.card-dashboard:hover::before {
    transform: scaleX(1);
}

.card-dashboard .card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 4px;
}

.card-dashboard .card-header img {
  width: 3.6rem;
  margin-bottom: 6px;
}

.card-dashboard .card-header h5 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary-dark, #1c3242);
}

.card-dashboard .card-body {
  padding-left: 5px;
  flex-grow: 1;
  flex-shrink: 1;
}

.card-dashboard .card-body .card-text{
  text-align: center;
  color: var(--color-text-muted, #64748b);
  font-size: 0.92rem;
}

.card-dashboard {
  animation: cardFadeUp 0.4s var(--ease, ease) both;
}

.card-dashboard:nth-child(1) { animation-delay: 0.02s; }
.card-dashboard:nth-child(2) { animation-delay: 0.06s; }
.card-dashboard:nth-child(3) { animation-delay: 0.10s; }
.card-dashboard:nth-child(4) { animation-delay: 0.14s; }
.card-dashboard:nth-child(5) { animation-delay: 0.18s; }
.card-dashboard:nth-child(6) { animation-delay: 0.22s; }

@keyframes cardFadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-dashboard .card-footer {
  padding: 10px;
  display: flex;
  justify-content: center;
}

.primary-button {
    background-color: #2a475f;
    border-radius: 8px;
    border: none;
    color: white;
    width: 80%;
    cursor: pointer;
    font-size: 1.0rem;
    font-weight: bold;
    height: 30px;
}

/* Media Query para pantallas pequeñas */
@media (max-width: 768px) {
  .card-container {
    flex-direction: column; /* Las cards se organizan una encima de otra en pantallas pequeñas */
    align-items: center; /* Centra las cards */
  }

  .card {
    max-width: 100%; /* Las cards toman el 100% del ancho disponible en pantallas pequeñas */
  }

  .card .card-header img {
    width: 4rem; /* Reducimos el tamaño de la imagen en pantallas pequeñas */
  }
}
</style>
