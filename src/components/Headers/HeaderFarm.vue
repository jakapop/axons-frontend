<script setup>
import { computed } from "vue";
import { useMainStore } from "@/stores/main";
import moment from 'moment-with-locales-es6';
import farmimg from '@/assets/img/img_landingpage/bg-device.png'
const mainStore = useMainStore();

const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;
//console.log("CustomerFarmId "+CustomerFarmId)

const daynow = moment().locale('th').format('dddd');
const datenow = moment().format('DD/MM/YYYY');

const CustomerFarmName = computed(() => mainStore.CustomerFarmName);
const CustomerProvinceName = computed(() => mainStore.CustomerProvinceName);
const CustomerDistrictName = computed(() => mainStore.CustomerDistrictName);
const CustomerFarmLat = computed(() => mainStore.CustomerFarmLat);
const CustomerFarmLon = computed(() => mainStore.CustomerFarmLon);
const CustomerTemperature = computed(() => mainStore.CustomerTemperature + "℃");
const CustomerFarmImage = computed(() => mainStore.CustomerFarmImage ? mainStore.CustomerFarmImage : farmimg);

</script>
<template>
  <div class="bg-white">
    <div :style="`background-image: url(${CustomerFarmImage})`"
      class="relative rounded-t-[16px] md:rounded-none grid grid-cols-1 gap-1 text-center place-items-center bg-cover bg-center bg-no-repeat overflow-hidden p-5 pt-8 w-full object-cover">
      <div class="tracking-tight font-medium text-white" style="z-index: 1">


        <h1 class="block text-[40px] md:text-6xl">{{CustomerTemperature}}</h1>
        <span class="block font-mediem text-base md:text-md -mt-1 md:mt-2">
          <img class="inline w-4" src="@/assets/img/icons/location-icon.png" alt="" />
          {{CustomerDistrictName}} {{CustomerProvinceName}}
        </span>
        <span class="block mt-1 font-normal text-base md:text-md">{{CustomerFarmLat}},{{CustomerFarmLon}}</span>
        <div class="grid grid-cols-2">
          <span class="block mt-1 text-base md:text-md">วัน{{daynow}}</span>
          <span class="block mt-1 text-base md:text-md">{{datenow}}</span>
        </div>
      </div>
      <div class="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-b from-transparent bg-[#000] bg-opacity-50">
      </div>
    </div>
  </div>
</template>
