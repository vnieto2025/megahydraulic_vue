<template>
  <transition name="float-in">
    <div v-if="show" class="floating-timer" :class="{ 'critical': isCritical }">
      <div class="timer-container">
        <div class="clock-icon">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Círculo exterior del reloj -->
            <circle cx="50" cy="50" r="45" 
                    fill="none" 
                    :stroke="clockColor" 
                    stroke-width="4"
                    class="clock-circle"/>
            
            <!-- Marcas de las horas -->
            <g class="clock-marks">
              <line x1="50" y1="10" x2="50" y2="15" :stroke="clockColor" stroke-width="2"/>
              <line x1="50" y1="85" x2="50" y2="90" :stroke="clockColor" stroke-width="2"/>
              <line x1="10" y1="50" x2="15" y2="50" :stroke="clockColor" stroke-width="2"/>
              <line x1="85" y1="50" x2="90" y2="50" :stroke="clockColor" stroke-width="2"/>
            </g>
            
            <!-- Manecilla de minutos (animada) -->
            <line x1="50" y1="50" x2="50" y2="20" 
                  :stroke="clockColor" 
                  stroke-width="3" 
                  stroke-linecap="round"
                  class="minute-hand"
                  :style="{ transform: `rotate(${minuteRotation}deg)`, transformOrigin: '50% 50%' }"/>
            
            <!-- Manecilla de horas -->
            <line x1="50" y1="50" x2="50" y2="30" 
                  :stroke="clockColor" 
                  stroke-width="4" 
                  stroke-linecap="round"
                  class="hour-hand"
                  :style="{ transform: `rotate(${hourRotation}deg)`, transformOrigin: '50% 50%' }"/>
            
            <!-- Centro del reloj -->
            <circle cx="50" cy="50" r="4" :fill="clockColor"/>
            
            <!-- Efecto de explosión cuando es crítico -->
            <g v-if="isCritical" class="explosion-lines">
              <line x1="50" y1="50" x2="30" y2="30" :stroke="explosionColor" stroke-width="2" opacity="0.6"/>
              <line x1="50" y1="50" x2="70" y2="30" :stroke="explosionColor" stroke-width="2" opacity="0.6"/>
              <line x1="50" y1="50" x2="30" y2="70" :stroke="explosionColor" stroke-width="2" opacity="0.6"/>
              <line x1="50" y1="50" x2="70" y2="70" :stroke="explosionColor" stroke-width="2" opacity="0.6"/>
            </g>
          </svg>
        </div>
        
        <div class="timer-text">
          <div class="minutes">{{ minutes }}</div>
          <div class="label">{{ minutes === 1 ? 'minuto' : 'minutos' }}</div>
        </div>
      </div>
      
      <div class="timer-message">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  minutes: {
    type: Number,
    default: 5
  }
});

// Calcular si está en estado crítico (2 minutos o menos)
const isCritical = computed(() => props.minutes <= 2);

// Colores dinámicos según el tiempo restante
const clockColor = computed(() => {
  if (props.minutes <= 1) return '#dc3545'; // Rojo
  if (props.minutes <= 2) return '#fd7e14'; // Naranja
  if (props.minutes <= 3) return '#ffc107'; // Amarillo
  return '#ff9800'; // Naranja claro
});

const explosionColor = computed(() => '#ff0000');

// Mensaje dinámico
const message = computed(() => {
  if (props.minutes <= 1) return '¡Sesión por expirar!';
  if (props.minutes <= 2) return '¡Tiempo crítico!';
  if (props.minutes <= 3) return '¡Guarda tu trabajo!';
  return 'Sesión próxima a expirar';
});

// Rotación de las manecillas
const minuteRotation = ref(0);
const hourRotation = ref(0);

// Animar las manecillas del reloj
watch(() => props.minutes, (newMinutes) => {
  // La manecilla de minutos rota según los minutos restantes
  minuteRotation.value = (5 - newMinutes) * 72; // 360/5 = 72 grados por minuto
  hourRotation.value = (5 - newMinutes) * 36; // 180/5 = 36 grados por minuto
}, { immediate: true });
</script>

<style scoped>
.floating-timer {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 180px;
  animation: pulse 2s ease-in-out infinite;
  border: 3px solid #ff9800;
}

.floating-timer.critical {
  animation: shake 0.5s ease-in-out infinite, pulse 1s ease-in-out infinite;
  border-color: #dc3545;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
}

.timer-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.clock-icon {
  width: 70px;
  height: 70px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

.clock-icon svg {
  width: 100%;
  height: 100%;
}

.clock-circle {
  animation: glow 2s ease-in-out infinite;
}

.critical .clock-circle {
  animation: glow-critical 0.5s ease-in-out infinite;
}

.minute-hand {
  animation: tick 1s ease-in-out infinite;
}

.explosion-lines {
  animation: explode 0.5s ease-in-out infinite;
}

.timer-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
}

.minutes {
  font-size: 36px;
  line-height: 1;
  color: #ff9800;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.critical .minutes {
  color: #dc3545;
  animation: number-pulse 0.5s ease-in-out infinite;
}

.label {
  font-size: 12px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

.timer-message {
  font-size: 13px;
  font-weight: 600;
  color: #ff9800;
  text-align: center;
  padding: 8px 12px;
  background: rgba(255, 152, 0, 0.1);
  border-radius: 10px;
  white-space: nowrap;
}

.critical .timer-message {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

/* Animaciones */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-5px) rotate(-2deg);
  }
  75% {
    transform: translateX(5px) rotate(2deg);
  }
}

@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px currentColor);
  }
  50% {
    filter: drop-shadow(0 0 10px currentColor);
  }
}

@keyframes glow-critical {
  0%, 100% {
    filter: drop-shadow(0 0 10px #dc3545);
  }
  50% {
    filter: drop-shadow(0 0 20px #dc3545);
  }
}

@keyframes tick {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-5deg);
  }
}

@keyframes explode {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes number-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Transición de entrada */
.float-in-enter-active {
  animation: float-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.float-in-leave-active {
  animation: float-out 0.3s ease-in;
}

@keyframes float-in {
  0% {
    transform: translateY(100px) scale(0);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes float-out {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(100px) scale(0);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .floating-timer {
    bottom: 20px;
    right: 20px;
    padding: 15px;
    min-width: 150px;
  }

  .clock-icon {
    width: 60px;
    height: 60px;
  }

  .minutes {
    font-size: 28px;
  }

  .timer-message {
    font-size: 11px;
  }
}
</style>
