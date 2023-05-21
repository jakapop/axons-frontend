<script setup>
import ActivityComponent from '@/components/ComponentHome/ActivityComponent.vue';
import NavbarMain from '@/layouts/NavbarMain.vue';
</script>

<template>
  <NavbarMain>
    <div class="m-4">
      <ActivityComponent :showhome="true" />
    </div>
  </NavbarMain>
</template>
<style>
@import "@/assets/styles/custom-icons.css";
</style>
