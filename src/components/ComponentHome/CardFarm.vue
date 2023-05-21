<template>
  <div  class="bg-white rounded-2xl p-2 pb-4 w-full">
    <div class="flex flex-col w-full">
      <div class="my-1.5 flex flex-row items-center">
        <div class="w-[28px]">
          <img class="inline location-icon lg:mt-0 bg-[#01893D]" style="width: 20px; height: 20px"/>
        </div>
        <div class="w-4/5">
          <span v-if="CustomerFarmName && countFarm > 0" class="block text-xs font-bold md:text-base md:font-medium truncate mt-0.5">{{ CustomerFarmName }}</span>
          <span v-else class="text-xs font-bold md:text-base md:font-medium ">-</span>
        </div>
      </div>
      <div>
        <img class="rounded-2xl object-cover h-[84px] w-full " :src="CustomerFarmImage ? CustomerFarmImage : farmimg" alt="farm"/>
        <p v-if="CustomerDistrictName && countFarm > 0" class="font-medium text-[12px] md:text-base text-[#302520] mt-1.5 text-center">{{ CustomerDistrictName }} {{ CustomerProvinceName }}</p>
        <p v-else class="font-bold text-[12px] md:text-base text-[#302520] mt-1.5 text-center">-</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref , reactive,computed, onMounted} from 'vue'
import { useMainStore } from "@/stores/main";
import farmimg from "@/assets/img/img_landingpage/bg-device.png";

const mainStore = useMainStore();
const CustomerId = mainStore.CustomerId;
const CustomerFarmId = computed(() => mainStore.CustomerFarmId);
const CustomerFarmLat = computed(() => mainStore.CustomerFarmLat);
const CustomerFarmLon = computed(() => mainStore.CustomerFarmLon);
const CustomerFarmName = computed(() => mainStore.CustomerFarmName);
const CustomerFarmImage = computed(() => mainStore.CustomerFarmImage);
const CustomerProvinceName = computed(() => mainStore.CustomerProvinceName);
const CustomerDistrictName = computed(() => mainStore.CustomerDistrictName);
const CustomerTemperature = computed(() => mainStore.CustomerTemperature);


let countFarm = ref(0);

onMounted(()=>{
  ApiCore.get("/v2/projects/?limit=all").then((response) => {
    countFarm.value = response.data.data.length ;

    console.log(countFarm.value);
  }).catch((error) => {
    console.log(error);
  })
});


</script>

<style scoped>

</style>
