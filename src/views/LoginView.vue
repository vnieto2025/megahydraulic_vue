<template>
  <div class="main-container">
    <div class="form-container">
      <div class="form-header">
        <img :src="logo" alt="logo" class="logo" />
        <h1 class="title">Mega login</h1>
      </div>
      <form @submit.prevent="login" class="form">
        <label class="label" for="document">Documento</label>
        <input
          type="number"
          class="input input-password"
          v-model="document"
          id="document"
          placeholder="11111111"
          required
        />

        <label class="label" for="password">Password</label>
        <input
          type="password"
          v-model="password"
          class="input input-password"
          id="password"
          placeholder="Password"
          required
        />

        <button class="primary-button login-button" type="submit">
          Log In
        </button>
        <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>
        <p class="mt-5 mb-3 text-body-secondary">&copy; 2023–{{ fecha }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import apiUrl from "../../config.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import logo from "@/assets/icons/logo.jpg";

// Variables reactivas
const document = ref("");
const password = ref("");
const error = ref("");
const fecha = new Date().getFullYear();
const apiProdUrl = "";
const router = useRouter();

// Función de inicio de sesión
const login = async () => {
  try {
    const response = await axios.post(
      `${apiUrl}/login`,
      {
        document: document.value.toString(),
        password: password.value,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
      const token = response.data.data.token;
      const first_name = response.data.data.first_name;
      const last_name = response.data.data.last_name;
      const user_type_id = response.data.data.user_type_id;
      const user_id = response.data.data.id;
      const permissions = JSON.stringify(response.data.data.permission);
      const photo = response.data.data.photo;

      localStorage.setItem("token", token);
      localStorage.setItem("first_name", first_name);
      localStorage.setItem("last_name", last_name);
      localStorage.setItem("user_type_id", user_type_id);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("permissions", permissions);
      localStorage.setItem("photo", photo);

      router.push("/dashboard");
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Error al iniciar sesión";
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 62.5%;
  font-family: "DM Sans", serif;
}

body,
html {
  height: 100%;
  overflow: hidden; /* Evita scrollbars por la animación del fondo */
}

.main-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  /* Animated Background */
  background: linear-gradient(-45deg, #0e5500, #2300eb, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.form-header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 32px; /* Más espacio interno */
  background-color: rgba(255, 255, 255, 0.9); /* Ligeramente transparente */
  border-radius: 16px; /* Bordes más redondeados */
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); /* Glassmorphism shadow */
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  
  /* Entrance Animation */
  animation: slideUpFade 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideUpFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo {
  width: 150px; /* Un poco más pequeño para balancear */
  margin-bottom: 24px;
  justify-self: center;
  border-radius: 10%; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.title {
  font-size: 2.4rem;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
  font-weight: 700;
}

.form {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
  transition: color 0.3s ease;
}

.input {
  background-color: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  height: 48px;
  font-size: 1.4rem;
  padding: 0 16px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  outline: none;
}

.input:focus {
  border-color: #23a6d5;
  box-shadow: 0 0 0 4px rgba(35, 166, 213, 0.1);
  background-color: #fff;
}

.input:focus + .label,
.input:not(:placeholder-shown) + .label {
    /* Si quisieras animar el label basado en el input, necesitarías cambiar el orden en el HTML */
}

.primary-button {
  background: linear-gradient(to right, #2a475f, #1c3342);
  border-radius: 12px;
  border: none;
  color: white;
  width: 100%;
  cursor: pointer;
  font-size: 1.6rem;
  font-weight: bold;
  height: 52px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.15);
  background: linear-gradient(to right, #375a75, #264255);
}

.primary-button:active {
  transform: translateY(0);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.login-button {
  margin-top: 24px;
}

.alert {
  font-size: 1.2rem;
  color: #e74c3c;
  background-color: #fdecea;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #fadbd8;
  text-align: center;
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.text-body-secondary {
    text-align: center;
    color: #777;
    font-size: 1.2rem;
}

@media (max-width: 768px) {
  .form-container {
    padding: 24px;
    max-width: 90%;
  }

  .title {
    font-size: 2rem;
  }

  .input {
    font-size: 1.4rem;
  }

  .primary-button {
    font-size: 1.4rem;
    height: 48px;
  }
}
</style>