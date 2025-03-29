<template>
    <LayoutView>
      <!-- <div class="card-container">
        <div class="card" v-for="(modulo, index) in modulos" :key="index">
          <div class="card-header">
            <img :src="`/${modulo.icon}`" :alt=modulo.icon>
            <h5 class="card-title">{{modulo.name}}</h5>
          </div>
          <div class="card-body">
            <p class="card-text">{{ modulo.description }}</p>
          </div>
          <div class="card-footer">
            <button class="primary-button login-button" @click="go_action(modulo.action)">Ir</button>
          </div>
        </div>
      </div> -->
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

// const user_id = localStorage.getItem('user_id');
const token = localStorage.getItem('token');
const modulos = JSON.parse(localStorage.getItem('permissions'));

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
  font-family: "DM Sans", serif;
}

.container-dashboard {
    max-width: 100%;
    margin: 0 auto;
    padding: 0;
}

.form-container-dashboard {
    background-color: #ffffff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 24px;
}

.card-container-dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.card-dashboard {
    background: #f2f2f2;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.card-dashboard:hover {
    transform: scale(1.05);
    cursor: pointer;
}

.card-dashboard .card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 4px;
}

.card-dashboard .card-header img {
  width: 5.0rem
}

.card-dashboard .card-header h5 {
  font-size: 1.2rem;
}

.card-dashboard .card-body {
  padding-left: 5px;
  flex-grow: 1;
  flex-shrink: 1;
}

.card-dashboard .card-body .card-text{
  text-align: center;
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
