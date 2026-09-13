<template>
    <footer>
        <div>
            <span>© {{ fecha }} Megahydraulic. Todos los derechos reservados.</span>
        </div>
    </footer>
</template>

<script setup>
const fecha = new Date().getFullYear();
</script>

<style scoped>

footer {
  padding: 12px;
  text-align: center;
  background-color: #1c3242;
}

footer div span {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.8rem;
    letter-spacing: 0.02em;
}

</style>
