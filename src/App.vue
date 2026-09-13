<script setup>
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="page-fade" mode="out-in" type="transition">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<style scoped>
</style>
