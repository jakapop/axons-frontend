<template>
  <NavbarMain>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 m-4 gap-2 ">
      <div>
        <div class="mt-8 md:mt-0 ">
          <CardFarm/>
        </div>
        <div class="mb-4">
          <AirTemperatureCard/>
        </div>
      </div>
      <div>
        <div class="mb-4 bg-white rounded-2xl">
          <ForecastTemperature />
        </div>
        <div class="mb-4 bg-white rounded-2xl ">
          <ActivityToday/>
        </div>
      </div>
      <div >
        <ActivityComponent :showhome="false" />
      </div>
    </div>
  </NavbarMain>
</template>
<script setup>
import NavbarMain from '@/layouts/NavbarMain.vue';
import CardFarm from '@/components/ComponentHome/CardFarm.vue';
import AirTemperatureCard from '@/components/ComponentHome/AirTemperatureCard.vue';
import ForecastTemperature from '@/components/ComponentHome/ForecastTemperature.vue';
import ActivityToday from '@/components/ComponentHome/ActivityToday.vue';
import ActivityComponent from '@/components/ComponentHome/ActivityComponent.vue';
</script>
