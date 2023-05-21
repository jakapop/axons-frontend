<script setup>

import { ref,reactive,onMounted,computed,onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import moment from "moment-with-locales-es6";

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

const states = reactive({
  serial: "",
  sensor_id: 1, //อุณหภูมิ
  avg_all: 0,
  avg_max: 0,
  avg_min: 0,
  board: {},
  sensor_temp: 0,
  weatherForecast:{},
});
const token_weather ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM0NzA3ZTBkZDYzMjYwYTZkNjRlNGEwNzhkY2E5ZDYyMTVhNTUyMzFjNTE0OTQxOTZlYTI0M2RkZjBjYzE0NDU4YWE1ZGFjODE2YmJmMGUwIn0.eyJhdWQiOiIyIiwianRpIjoiMzQ3MDdlMGRkNjMyNjBhNmQ2NGU0YTA3OGRjYTlkNjIxNWE1NTIzMWM1MTQ5NDE5NmVhMjQzZGRmMGNjMTQ0NThhYTVkYWM4MTZiYmYwZTAiLCJpYXQiOjE2NjE3NjM5NjAsIm5iZiI6MTY2MTc2Mzk2MCwiZXhwIjoxNjkzMjk5OTYwLCJzdWIiOiIyMTI3Iiwic2NvcGVzIjpbXX0.HG2opljn5zqQ4wKvLaomYKOVJHF4txs6iQhmMVMEZCkx0NZ4OQz_9InejmpYA-HHlKuJxxQ4MopvjIV0Uu0j04BMHhVgDjGfSpUnpOZFVhHeOZr8UbDpvRqgSo-1RyRYMYXqK8DCkUFSuAX06bbHCkoPc57I68_bcmS8bAc9KPo-PfS0NfosTIBarmCQHaw0ur2diPS20e38U3DmKIGymrCQ_3Lj6fSuZD1mBGtj4twSw1TCq9Xhu-eOoRo5jTxnLL7gagT6iG0nnPwNJIWfcAAumO9ta_bYYemQB4KGSx4qu8mzt27DPG9BclV9EDvv5sPUZ-QQ_vrb_3it6fLNhImxjNuQDG6Lccu-i0FZMPYrKV5PqnZkukOdDHCgkFNOyJrMkq-UwyGH5WtNtxzqdlHM_j78ZrvV38HCdeuoCupHEaaQIB0AhCGZOAJbogSQn6en8V-YrmoAhMoq_ca14VRt5fy9CviVRo4JaRp5Bmo2nd9pJLKBLF_CttI14H3BXLR7U0nrri6tKJhEoJI15nsUep8apCHhTIaqaywtTRA7gJBV19OYdMutdvAKLg9hahS5WIkVpB3F3OoG_Cd0LNyufoXnRa1hZ41s4t-zoZdAYJURs56ZGm8rCWxyIsAYT6lz-yR7KgP0SXzsZdO1Cra3bStUOYDoY8nXIPFGN84";

const weatherForecastByLatLon = computed(() => {
  if (CustomerFarmLat.value && CustomerFarmLon.value) {
    const date = moment().format("YYYY-MM-DD"); //2022-09-07
    //let url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/daily/at?lat=${CustomerFarmLat.value}&lon=${CustomerFarmLon.value}&fields=tc_min,tc_max,rh,cond,rain&date=${date}`;
    // let url = `weather/7daily?lat=${CustomerFarmLat.value}&lon=${CustomerFarmLon.value}&date=${date}&fields=tc_min,tc_max,rh,cond,rain&duration=7`;
    let url = `/weather/7daily?lat=${CustomerFarmLat.value}&lon=${CustomerFarmLon.value}&date=${date}&fields=tc_min%2Ctc_max%2Crh%2Ccond%2Crain&duration=7`;
    ApiMain.get(url).then((res) => {
      states.weatherForecast = res.data.WeatherForecasts[0].forecasts[0].data;
    }).catch((e) => {
      states.weatherForecast = {tc_max:"",tc_min:""}
    })
  }else{
    states.weatherForecast = {tc_max:"",tc_min:""}
  }
});

</script>
<template>
  {{weatherForecastByLatLon}}
  <div class="bg-white p-2 rounded-2xl w-full h-full pb-4">
    <div class="flex flex-row items-center">
      <img alt="" class="inline temp lg:mt-0 bg-[#01893D]" style="width: 20px; height: 20px" />
      <h1 class="font-bold text-sm md:text-base">อุณหภูมิคาดการณ์</h1>
    </div>
    <div class="text-center mt-0 lg:mt-0 flex justify-center items-center w-full h-full">
      <div>
        <h1 v-if="CustomerTemperature" class="text-[50px] md:text-[64px] xl:text-[64px] leading-[1.10]">{{ CustomerTemperature }}</h1>
        <h1 v-else class="text-[50px] md:text-[64px] xl:text-[64px] leading-[1.10]">0</h1>
        <p class="font-bold text-sm md:text-lg text-center">องศาเซลเซียส (°C )</p>
        <div v-if="states.weatherForecast.tc_max!=''" class="flex flex-row justify-center">
          <span class="font-bold text-sm md:text-base xl:text-lg">สูงสุด {{ Math.floor(states.weatherForecast.tc_max) ? Math.floor(states.weatherForecast.tc_max) : "" }} ° /</span>
          <span class="font-bold text-sm md:text-base xl:text-lg">ต่ำสุด {{ Math.floor(states.weatherForecast.tc_min) ? Math.floor(states.weatherForecast.tc_min) : "" }} °</span>
        </div>
        <div v-else class="flex flex-row justify-center">
          <span class="font-bold text-sm md:text-base xl:text-lg">สูงสุด - ° /</span>
          <span class="font-bold text-sm md:text-base xl:text-lg">ต่ำสุด - °</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style>

</style>
