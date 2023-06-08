<script setup>
import SensorChart from "./SensorChart.vue";
import NavbarMain from "../layouts/NavbarMain.vue";
import { defineComponent, onMounted, reactive, ref, computed } from "vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import MapTest from "../components/Maps/MapTest.vue";
import MapExampleVue from "@/components/Maps/MapExample.vue";
// import moment from 'moment'
import moment from "moment-with-locales-es6";
import ModalLoading from "@/components/Modal/ModalLoading.vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import farmimg from "@/assets/img/img_landingpage/bg-device.png";
import "vue3-carousel/dist/carousel.css";

import SwiperClass, { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";

// import swiper module styles
import "swiper/css";
import "swiper/css/pagination";
// more module style...

const mainStore = useMainStore();

const CustomerId = mainStore.CustomerId;
const CustomerFarmId = computed(() => mainStore.CustomerFarmId);
const CustomerFarmLat = computed(() => mainStore.CustomerFarmLat);
const CustomerFarmLon = computed(() => mainStore.CustomerFarmLon);
const CustomerFarmName = computed(() => mainStore.CustomerFarmName);
const CustomerProvinceId = computed(() => mainStore.CustomerProvinceId);
const CustomerTemperature = computed(() => mainStore.CustomerTemperature);
const CustomerFarmImage = computed(() => mainStore.CustomerFarmImage);
const CustomerProvinceName = computed(() => mainStore.CustomerProvinceName);
const CustomerDistrictName = computed(() => mainStore.CustomerDistrictName);

// const selectedFarm = computed(() => {
//   weatherForecastByLatLon()
//   return
// })

const tokenCustomer = localStorage.getItem("astk");
const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM0NzA3ZTBkZDYzMjYwYTZkNjRlNGEwNzhkY2E5ZDYyMTVhNTUyMzFjNTE0OTQxOTZlYTI0M2RkZjBjYzE0NDU4YWE1ZGFjODE2YmJmMGUwIn0.eyJhdWQiOiIyIiwianRpIjoiMzQ3MDdlMGRkNjMyNjBhNmQ2NGU0YTA3OGRjYTlkNjIxNWE1NTIzMWM1MTQ5NDE5NmVhMjQzZGRmMGNjMTQ0NThhYTVkYWM4MTZiYmYwZTAiLCJpYXQiOjE2NjE3NjM5NjAsIm5iZiI6MTY2MTc2Mzk2MCwiZXhwIjoxNjkzMjk5OTYwLCJzdWIiOiIyMTI3Iiwic2NvcGVzIjpbXX0.HG2opljn5zqQ4wKvLaomYKOVJHF4txs6iQhmMVMEZCkx0NZ4OQz_9InejmpYA-HHlKuJxxQ4MopvjIV0Uu0j04BMHhVgDjGfSpUnpOZFVhHeOZr8UbDpvRqgSo-1RyRYMYXqK8DCkUFSuAX06bbHCkoPc57I68_bcmS8bAc9KPo-PfS0NfosTIBarmCQHaw0ur2diPS20e38U3DmKIGymrCQ_3Lj6fSuZD1mBGtj4twSw1TCq9Xhu-eOoRo5jTxnLL7gagT6iG0nnPwNJIWfcAAumO9ta_bYYemQB4KGSx4qu8mzt27DPG9BclV9EDvv5sPUZ-QQ_vrb_3it6fLNhImxjNuQDG6Lccu-i0FZMPYrKV5PqnZkukOdDHCgkFNOyJrMkq-UwyGH5WtNtxzqdlHM_j78ZrvV38HCdeuoCupHEaaQIB0AhCGZOAJbogSQn6en8V-YrmoAhMoq_ca14VRt5fy9CviVRo4JaRp5Bmo2nd9pJLKBLF_CttI14H3BXLR7U0nrri6tKJhEoJI15nsUep8apCHhTIaqaywtTRA7gJBV19OYdMutdvAKLg9hahS5WIkVpB3F3OoG_Cd0LNyufoXnRa1hZ41s4t-zoZdAYJURs56ZGm8rCWxyIsAYT6lz-yR7KgP0SXzsZdO1Cra3bStUOYDoY8nXIPFGN84";

// group เพื่อแบ่งสี icon และ background (สภาพอากาศโดยทั่วไป)
// 1 = ท้องฟ้าแจ่มใส (Clear)
// 2 = มีเมฆบางส่วน (Partly cloudy)
// 3 = เมฆเป็นส่วนมาก (Cloudy)
// 4 = มีเมฆมาก (Overcast)
// 5 = ฝนตกเล็กน้อย (Light rain)
// 6 = ฝนปานกลาง (Moderate rain)
// 7 = ฝนตกหนัก (Heavy rain)
// 8 = ฝนฟ้าคะนอง (Thunderstorm)
// 9 = อากาศหนาวจัด (Very cold)
// 10 = อากาศหนาว (Cold)
// 11 = อากาศเย็น (Cool)
// 12 = อากาศร้อนจัด (Very hot)
const arr1 = [1, 12];
const arr2 = [2];
const arr3 = [3, 4];
const arr4 = [5, 6, 7];
const arr5 = [8];
const arr6 = [9, 10, 11];

const location = reactive({
  lat: "",
  lon: "",
  geoId: "50",
});

const states = reactive({
  modules: [Pagination],
  weather: {},
  weatherForecast: {},
  weatherForecastHourByLatLon: {},
  rains: [],
  isLoading: false,
});
const weatherNow = reactive({
  time: "",
  tc: "",
  cond: "",
  relativeHumidity: "",
  precipitation: "",
  windSpeed: "",
  windDirection: "",
  SeaLevelPressure: "",
  rain: "",
  maxRain: "",
  minRain: "",
  maxTem: "",
  minTem: "",
});
// const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM0NzA3ZTBkZDYzMjYwYTZkNjRlNGEwNzhkY2E5ZDYyMTVhNTUyMzFjNTE0OTQxOTZlYTI0M2RkZjBjYzE0NDU4YWE1ZGFjODE2YmJmMGUwIn0.eyJhdWQiOiIyIiwianRpIjoiMzQ3MDdlMGRkNjMyNjBhNmQ2NGU0YTA3OGRjYTlkNjIxNWE1NTIzMWM1MTQ5NDE5NmVhMjQzZGRmMGNjMTQ0NThhYTVkYWM4MTZiYmYwZTAiLCJpYXQiOjE2NjE3NjM5NjAsIm5iZiI6MTY2MTc2Mzk2MCwiZXhwIjoxNjkzMjk5OTYwLCJzdWIiOiIyMTI3Iiwic2NvcGVzIjpbXX0.HG2opljn5zqQ4wKvLaomYKOVJHF4txs6iQhmMVMEZCkx0NZ4OQz_9InejmpYA-HHlKuJxxQ4MopvjIV0Uu0j04BMHhVgDjGfSpUnpOZFVhHeOZr8UbDpvRqgSo-1RyRYMYXqK8DCkUFSuAX06bbHCkoPc57I68_bcmS8bAc9KPo-PfS0NfosTIBarmCQHaw0ur2diPS20e38U3DmKIGymrCQ_3Lj6fSuZD1mBGtj4twSw1TCq9Xhu-eOoRo5jTxnLL7gagT6iG0nnPwNJIWfcAAumO9ta_bYYemQB4KGSx4qu8mzt27DPG9BclV9EDvv5sPUZ-QQ_vrb_3it6fLNhImxjNuQDG6Lccu-i0FZMPYrKV5PqnZkukOdDHCgkFNOyJrMkq-UwyGH5WtNtxzqdlHM_j78ZrvV38HCdeuoCupHEaaQIB0AhCGZOAJbogSQn6en8V-YrmoAhMoq_ca14VRt5fy9CviVRo4JaRp5Bmo2nd9pJLKBLF_CttI14H3BXLR7U0nrri6tKJhEoJI15nsUep8apCHhTIaqaywtTRA7gJBV19OYdMutdvAKLg9hahS5WIkVpB3F3OoG_Cd0LNyufoXnRa1hZ41s4t-zoZdAYJURs56ZGm8rCWxyIsAYT6lz-yR7KgP0SXzsZdO1Cra3bStUOYDoY8nXIPFGN84'
const formatDate = (dateTime) => {
  return moment(dateTime).format("D-M-YYYY HH:mm");
};

const bgWeatherCondition = (cond) => {
  if (arr1.includes(cond)) {
    return `bg-[url('@/assets/img/sky/bg-1.png')]`;
  } else if (arr2.includes(cond)) {
    return `bg-[url('@/assets/img/sky/bg-2.png')]`;
  } else if (arr3.includes(cond)) {
    return `bg-[url('@/assets/img/sky/bg-3.png')]`;
  } else if (arr4.includes(cond)) {
    return `bg-[url('@/assets/img/sky/bg-4.png')]`;
  } else if (arr5.includes(cond)) {
    return `bg-[url('@/assets/img/sky/bg-5.png')]`;
  } else if (arr6.includes(cond)) {
    return `bg-[url('@/assets/img/sky/bg-2.png')]`;
  } else {
    return `bg-[url('@/assets/img/sky/bg-2.png')]`;
  }
};

const bgWeatherConditionDaily = (cond) => {
  if (arr1.includes(cond)) {
    return "rounded-[10px] bg-gradient-to-b from-[#81CAFF] via-[#fff] to-white w-[125px] py-4 mx-auto";
  } else if (arr2.includes(cond)) {
    return "rounded-[10px] bg-gradient-to-b from-[#AADCFB] via-[#fff] to-white w-[125px] py-4 mx-auto";
  } else if (arr3.includes(cond)) {
    return "rounded-[10px] bg-gradient-to-b from-[#D4EEF6] via-[#fff] to-white w-[125px] py-4 mx-auto";
  } else if (arr4.includes(cond)) {
    return "rounded-[10px] bg-gradient-to-b from-[#ACB9BD] via-[#fff] to-white w-[125px] py-4 mx-auto";
  } else if (arr5.includes(cond)) {
    return "rounded-[10px] bg-gradient-to-b from-[#7E7E7E] via-[#fff] to-white w-[125px] py-4 mx-auto";
  } else if (arr6.includes(cond)) {
    return "rounded-[10px] bg-gradient-to-b from-[#fff] via-[#fff] to-white w-[125px] py-4 mx-auto";
  } else {
    return "rounded-[10px] bg-gradient-to-b from-[#fff] via-[#fff] to-white w-[125px] py-4 mx-auto";
  }
};
const weatherCondition = (cond) => {
  if (!cond) {
    return "-";
  } else {
    if (cond == 1) {
      return "ท้องฟ้าแจ่มใส";
    } else if (cond == 2) {
      return "มีเมฆบางส่วน";
    } else if (cond == 3) {
      return "เมฆเป็นส่วนมาก";
    } else if (cond == 4) {
      return "มีเมฆมาก";
    } else if (cond == 5) {
      return "ฝนตกเล็กน้อย";
    } else if (cond == 6) {
      return "ฝนปานกลาง";
    } else if (cond == 7) {
      return "ฝนตกหนัก";
    } else if (cond == 8) {
      return "ฝนฟ้าคะนอง";
    } else if (cond == 9) {
      return "อากาศหนาวจัด";
    } else if (cond == 10) {
      return "อากาศหนาว";
    } else if (cond == 11) {
      return "อากาศเย็น";
    } else if (cond == 12) {
      return "อากาศร้อนจัด";
    }
  }
};
// get lat,long customer from customerId
// const getPointCustomerByFarmId = () => {
//   const tokenCustomer = localStorage.getItem("astk");
//   ApiMain.get(`/customer/${CustomerId}/get-point?projectId=${CustomerFarmId}`, {
//     header: {
//       Authorization: 'Bearer' + tokenCustomer,
//     }
//   }).then((res) => {
//     console.log('getPointCustomerByFarmId', res.data.data.lat)
//     location.lat = res.data.data.lat
//     location.lon = res.data.data.lon
//   }).then(() => {
//     weatherForecastByLatLon()
//     weatherForecastHourByLatLon()
//   }).catch((err) => {
//     console.log(err)
//   })

// }

const weatherByLatLon = () => {
  ApiMain.get(`/weather/by-latlon?lat=${CustomerFarmLat.value}&lon=${CustomerFarmLon.value}`).then((res) => {
    console.log(res.data);
    states.weather = res.data;

    weatherNow.tc = ""; // อุณหภูมิปัจจุบัน
    weatherNow.cond = res.data.weatherCondition;
    weatherNow.relativeHumidity = res.data.relativeHumidity; // ความชื้นสัมพัทธ์
    weatherNow.precipitation = ""; // หยาดน้ำฟ้า
    weatherNow.windSpeed = res.data.windSpeed;
    weatherNow.windDirection = Math.floor(res.data.windDirection);
    weatherNow.SeaLevelPressure = res.data.seaLevelPressure; // ความกดอากาศที่ระดับน้ำทะเล
    weatherNow.rain = res.data.rainVolume;
    weatherNow.maxRain = res.data.rainVolume;
    weatherNow.minRain = "0";
    weatherNow.maxTem = res.data.maxTemperatrue;
    weatherNow.minTem = res.data.minTemperatrue;
  }).catch((error) =>{
    console.log(error);
  });
};
const getTemByGeoId = () => {
  ApiMain.get(`weather/temperature?id=${CustomerProvinceId.value}`, {
    header: {
      Authorization: "Bearer" + tokenCustomer,
    },
  }).then((res) => {

    console.log('getTemByGeoId == ',res);
    weatherNow.tc = res.data.temperature;
  });
};



let serverWheather_week = ref(true);

// ดึงข้อมูลมาจากเว็บพยากรณ์อากาศ ล่วงหน้า 7 วัน
const weatherForecastByLatLon = computed(() => {
  if (CustomerFarmLat.value && CustomerFarmLon.value) {
    const date = moment().format("YYYY-MM-DD"); //2022-09-07
    const duration = 7; // จำนวนวันล่วงหน้าที่ต้องการแสดง
    // let url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/daily/at?lat=${CustomerFarmLat.value}&lon=${CustomerFarmLon.value}&fields=tc_min,tc_max,rh,cond,rain&date=${date}&duration=${duration}`;
    let url = `/weather/7daily?lat=${CustomerFarmLat.value}&lon=${CustomerFarmLon.value}&date=${date}&fields=tc_min%2Ctc_max%2Crh%2Ccond%2Crain&duration=${duration}`;
    ApiMain.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${tokenCustomer}`,
      },
    }).then((res) => {
      // console.log('status : '+res.status +'  ดึงข้อมูลมาจากเว็บพยากรณ์อากาศ == ', res)
      if(res.status == 200){
        states.weatherForecast = res.data.WeatherForecasts[0];
        // console.log( states.weatherForecast);
      }
      else{
        // ใช้ฟังก์ชัน ดึงข้อมูล 7 วัน
        console.log(res.status);
        serverWheather_week.value = false ;
      }

    }).catch((error)=>{
      serverWheather_week.value = false ;
      // weatherByLatLon();
    })
  }
});

// พยากรณ์อากาศ รายชั่วโมง จากเว็บพยากรณ์อากาศ
const weatherForecastHourByLatLon = computed(() => {
  if (CustomerFarmLat.value && CustomerFarmLon.value) {
    const date = moment().format("YYYY-MM-DD"); //2022-09-07
    console.log(date);
    const duration = 24; // จำนวนเวลาล่วงหน้าที่ต้องการแสดง
    // let url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/at?lat=${CustomerFarmLat.value}&lon=${CustomerFarmLon.value}&fields=tc,rh,cond,rain,slp,wd10m,ws10m&hour=1&duration=${duration}`;
    let my_url = `weather/24hourly?lat=${CustomerFarmLat.value}&lon=${CustomerFarmLon.value}&date=${date}&hour=1&fields=tc%2Crh%2Ccond%2Crain%2Cslp%2Cwd10m%2Cws10m&duration=${duration}`;
    console.log(CustomerFarmLat.value,CustomerFarmLon.value);
    ApiMain.get(my_url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${tokenCustomer}`,
      },
    }).then((res) => {
        // console.log('รายชั่วโมง  status :',res.status);
        console.log('Check API กรมอุตุ',res);
        if (res.status == 200) {
          states.weatherForecastHourByLatLon = res.data.WeatherForecasts[0];
          checkWeatherNow(states.weatherForecastHourByLatLon.forecasts);
          console.log('api กรมอุตุ ปกติ',states.weatherForecastHourByLatLon);
        } else {
          // กรณีที่เว็บ tmd error จะดึงจาก database
          weatherByLatLon();
        }
      })
      .catch((err) => {
        weatherByLatLon();
      });
  }
});

const checkWeatherNow = (forecasts) => {

  // console.log(forecasts);
  const now = moment().format("YYYY-MM-DD HH");
  forecasts.forEach((item) => {
    const itemNow = moment(item.time).format("YYYY-MM-DD HH");
    if (itemNow == now) {
      weatherNow.time = item.time;
      // weatherNow.tc = item.data.tc
      weatherNow.cond = item.data.cond;
      weatherNow.relativeHumidity = Math.floor(item.data.rh);
      weatherNow.precipitation = "";
      weatherNow.windSpeed = item.data.ws10m;
      weatherNow.windDirection = Math.floor(item.data.wd10m);
      weatherNow.SeaLevelPressure = Math.floor(item.data.slp); // ความกดอากาศที่ระดับน้ำทะเล
      weatherNow.rain = item.data.rain;
    }
    states.rains.push(item.data.rain);
  });
  if (states.rains.length > 0) {
    weatherNow.maxRain = Math.max(...states.rains);
    weatherNow.minRain = Math.min(...states.rains);
  }
  else if(states.rains.length == 0){
    weatherByLatLon();


  }
};

</script>
<template>
  <NavbarMain>
    <ModalLoading v-if="states.isLoading"></ModalLoading>
    <div id="home" v-if="!states.isLoading">
      <div class="mt-16 md:mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <p class="text-[22px] md:text-2xl font-bold mt-[15px] pl-5">
            พยากรณ์อากาศ
          </p>
        </div>
        <div class="mt-4">
          <div
            class="content-center grid grid-cols-2 xl:grid-cols-3 gap-2 p-4 pt-0"
          >
            <div
              class="mx-auto align-middle overflow-hidden w-full rounded-[16px] bg-white py-1"
              style=""
            >
              <div class="">
                <div
                  class="font-bold text-[12px] md:text-base truncate pr-1 mb-2 ml-1 md:ml-[12px]"
                >
                  <div
                    class="font-bold text-[12px] md:text-base truncate pr-1"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->

                    <div class="flex flex-row items-center">
                      <div class="mr-1 w-[34px]">
                        <!-- <img alt="" class="inline location-icon lg:mt-0 bg-[#01893D]" style="width: 20px; height: 20px"/> -->
                        <img src="../assets/img/icons/location.svg" alt="" class="w-[24px] h-[24px]">
                      </div>
                      <h5 class="truncate w-[200px]">{{ CustomerFarmName }}</h5>
                    </div>

                  </div>
                  {{ weatherForecastHourByLatLon }}{{ weatherForecastByLatLon }}
                </div>
                <!-- <p class="text-[12px] text-center text-[40px] my-6 md:text-[54px] xl:text-[64px]">
                      test
                    </p> -->
                <div class="px-1 w-full">
                  <!-- <map-example-vue></map-example-vue> -->
                  <!-- <map-test width="100%" height="122" style="border:0;" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade" :lat="states.weather.lat" :lng="states.weather.lon"></map-test> -->
                  <img
                    class="rounded-[16px] object-cover h-[88px] md:h-[130px] lg:h-[195px] w-full"
                    :src="CustomerFarmImage ? CustomerFarmImage : farmimg"
                    alt=""
                  />
                  <!-- <div class="relative place-items-center bg-cover bg-center bg-no-repeat overflow-hidden w-full object-cover header-img"></div> -->
                  <p class="font-bold text-[12px] md:text-base truncate pr-1 mt-2 text-center">{{ CustomerDistrictName }} {{ CustomerProvinceName }}</p>
                </div>
              </div>
            </div>

            <div
              class="mx-auto align-middle overflow-hidden w-full rounded-[16px] bg-white py-1"
              style=""
            >
            <div
              class="font-bold text-[12px] md:text-base truncate pr-1 ml-1 md:ml-[12px]"
            >
              <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt=""> -->



              <div class="flex flex-row items-center">
                      <div class="mr-2 ml-2">
                        <img
                alt=""
                class="inline temp lg:mt-0 bg-[#01893D]"
                style="width: 20px; height: 20px"
              />
                      </div>
                      <h5 class="truncate w-[200px] font-bold text-[12px] md:text-base">อุณหภูมิคาดการณ์</h5>
                    </div>
            </div>
              <div class="lg:mt-6">
                <p
                  class="text-[12px] text-center mt-1 text-[40px] md:text-[54px] xl:text-[64px]"
                >
                  <!-- {{ weatherNow ?  Math.floor(weatherNow.tc) : '-' }} -->
                  {{ CustomerTemperature }}
                </p>
                <p
                  class="text-[12px] text-center  md:text-base"
                >
                  องศาเซลเซียส ( °C)
                </p>
                <div
                  class="font-bold text-[12px] md:text-base truncate pr-1 text-center"
                >
                  สูงสุด&nbsp;<span class="text-[#01893D]"
                    >{{
                      states.weatherForecast && states.weatherForecast.forecasts
                        ? Math.floor(
                            states.weatherForecast.forecasts[0].data.tc_max
                          )
                        : "-"
                    }}
                    °</span
                  >&nbsp;&nbsp;/&nbsp;&nbsp;ต่ำสุด&nbsp;<span
                    class="text-[#01893D]"
                    >{{
                      states.weatherForecast && states.weatherForecast.forecasts
                        ? Math.floor(
                            states.weatherForecast.forecasts[0].data.tc_min
                          )
                        : "-"
                    }}
                    °
                  </span>
                </div>
              </div>
            </div>

            <div
              class="mx-auto align-middle overflow-hidden w-full rounded-[16px] bg-white py-1">
              <div class="">
                <div class="flex flex-row items-center">
                      <div class="mr-1 ml-2 w-[36px]">
                        <img src="../assets/img/icons/cloud.svg" alt="" class="w-[24px] h-[24px]">
                      </div>
                      <h5 class="truncate w-[200px] font-bold text-[12px] md:text-base">สภาพอากาศ</h5>
                    </div>

                <div class="px-1 pt-2 w-full">
                  <img
                    v-if="weatherNow && weatherNow.cond == 1"
                    src="@/assets/img/sky/1.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 2"
                    src="@/assets/img/sky/2.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 3"
                    src="@/assets/img/sky/3.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 4"
                    src="@/assets/img/sky/4.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 5"
                    src="@/assets/img/sky/5.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 6"
                    src="@/assets/img/sky/6.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 7"
                    src="@/assets/img/sky/7.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 8"
                    src="@/assets/img/sky/8.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 9"
                    src="@/assets/img/sky/9.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 10"
                    src="@/assets/img/sky/10.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 11"
                    src="@/assets/img/sky/11.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                  <img
                    v-else-if="weatherNow && weatherNow.cond == 12"
                    src="@/assets/img/sky/12.png"
                    alt=""
                    class="w-full md:object-contain object-coverrounded-lg"
                  />
                  <img
                    v-else
                    src="@/assets/img/sky/4.png"
                    alt=""
                    class="rounded-[16px] object-cover h-[133px] md:h-[160px] w-full"
                  />
                </div>
                <div
                  class="font-bold text-[12px] md:text-base truncate pr-1 mt-2 text-center"
                >
                  <template
                    v-if="weatherNow && Number.isFinite(weatherNow.cond)"
                    >{{
                      weatherNow ? weatherCondition(weatherNow.cond) : ""
                    }}</template
                  >
                  <template v-else>{{
                    weatherNow ? weatherNow.cond : ""
                  }}</template>
                </div>
              </div>
            </div>

            <div
              class="mx-auto align-middle overflow-hidden w-full rounded-[16px] bg-white py-2"
              style=""
            >
              <div class="">
                <div>
                 <div class="flex flex-row items-center">
                  <div class="mr-2 ml-2">
                    <img src="@/assets/img/icons/cloudy_snowing.svg" alt="" width="24" height="24">
                  </div>
                  <h5 class="font-bold text-[12px] md:text-base truncate ">ปริมาณน้ำฝน</h5>
                 </div>
                </div>
                <p
                  class="text-[12px] text-center text-[40px] md:text-[54px] xl:text-[64px]"
                >
                  {{ weatherNow ? weatherNow.rain : "" }}
                </p>
                <p
                  class="text-[12px] text-center md:text-lg -mt-2"
                >
                  มิลลิเมตร (mm.)
                </p>
              </div>
              <div
                class="border-[#01893D] border-t mx-auto text-center w-11/12 mt-3.5"
              >
                <p class="text-[10px] md:text-[18px] font-bold my-4 mb-2">
                  สูงสุด&nbsp;<span class="text-[#01893D]"
                    >{{ weatherNow ? weatherNow.maxRain : "-" }} มม.</span
                  >&nbsp;ต่ำสุด<span class="text-[#01893D]"
                    >&nbsp;{{
                      weatherNow ? weatherNow.minRain : "-"
                    }}&nbsp;มม.</span
                  >
                </p>

                <div class="text-[10px] md:text-base">
                  <p>ปริมาณน้ำฝนสูงสุด-ต่ำสุด</p>
                  <p>(24 ชั่วโมง)</p>
                </div>
              </div>
              <!-- <SensorChart/> -->
              <!-- <div class="grid grid-cols-8 mt-12 mb-20">
                <div class="relative -ml-6 md:-ml-4" v-for="(rain, index) in states.rains" :key="index">
                  <div class="overflow-hidden h-[6px] xl:h-[16px] w-[73px] flex rounded-full bg-[#F2F2F0] -rotate-90">
                    <div
                      class="flex justify-center items-center rounded-full text-xs font-medium bg-[#01893D] text-white"
                      :style="`width: ${rain.data.rain * 100}%;`"></div>
                  </div>
                  <p class="text-[#01893D] text-[10px] text-sm md:text-[16px] mt-1 absolute left-[27px] top-[45px]">{{ moment(rain.time).format('HH') }}</p>
                  <p class="text-[#01893D] text-xs md:text-[16px] mt-1 absolute left-[27px] top-[45px]">{{ moment(rain.time).format('HH A') }}</p>
                </div>

              </div> -->
              <!-- <p class="text-[12px] text-center text-sm md:text-[10px] mt-3">ข้อมูลย้อนหลัง 8 ชั่วโมง</p> -->
            </div>

            <div
              class="mx-auto align-middle overflow-hidden w-full rounded-[16px] bg-white py-2"
              style=""
            >

            <div class="flex flex-row items-center">
                  <div class="mr-2 ml-2">
                    <img
                    alt=""
                    class="inline humidity_low lg:mt-0 bg-[#01893D]"
                    style="width: 24px; height: 24px"
                  />
                  </div>
                  <h5  class="font-bold text-[12px] md:text-base truncate ">ความชื้นสัมพัทธ์</h5>
                 </div>
              <!-- <div class="">
                <div
                  class="font-bold text-[12px] md:text-base truncate pr-1 ml-1 md:ml-[12px]"
                >

                  <img
                    alt=""
                    class="inline humidity_low lg:mt-0 bg-[#01893D]"
                    style="width: 20px; height: 20px"
                  />
                  ความชื้นสัมพัทธ์
                </div>
              </div> -->

              <div class="">
                <div class="single-chart">
                  <svg viewBox="0 0 36 36" class="circular-chart green">
                    <path
                      class="circle-bg"
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      class="circle"
                      :stroke-dasharray="`${weatherNow.relativeHumidity}, 100`"
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">
                      {{ weatherNow ? Math.ceil(weatherNow.relativeHumidity) : "" }}%
                    </text>
                  </svg>
                </div>
              </div>
              <!-- <div class="pie" style="--p:61;--c:#01893D;--b:20px"> 61%</div> -->
            </div>

            <div class="grid grid-cols-1 gap-2">
              <div
                class="mx-auto h-full flex justify-between items-center align-middle overflow-hidden w-full rounded-[16px] bg-white"
                style=""
              >
                  <div
                    class="font-bold text-[12px] md:text-base truncate pr-1 ml-1 md:ml-[12px] col-span-2 my-auto"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                    <img
                      alt=""
                      class="inline air lg:mt-0 bg-[#01893D]"
                      style="width: 20px; height: 20px"
                    />
                    ความเร็วลม
                  </div>
                  <div class="mr-1 md:mr-[12px]">
                    <p
                      class="font-medium text-[12px] md:text-base xl:text-lg md:ml-[12px] text-center"
                    >
                      {{ weatherNow ? Math.floor(weatherNow.windSpeed) : "-" }}
                    </p>

                    <p
                      class="text-[12px] text-center text-sm md:text-[16px] -mt-1 font-medium"
                    >
                      m/s
                    </p>
                  </div>
              </div>

              <div
                class="py-1.5 mx-auto h-full flex justify-between items-center align-middle overflow-hidden w-full rounded-[16px] bg-white"
                style=""
              >
                  <div
                    class="font-bold text-[12px] md:text-base truncate pr-1 ml-1 md:ml-[12px] col-span-2 my-auto"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                    <img
                      alt=""
                      class="inline explore lg:mt-0 bg-[#01893D]"
                      style="width: 20px; height: 20px"
                    />
                    ทิศทางลม
                  </div>
                  <div class="mr-1 md:mr-[12px]">
                    <p
                      class="font-medium text-[12px] md:text-base xl:text-lg text-center"
                    >
                      {{ weatherNow ? weatherNow.windDirection : "-" }} °
                    </p>
                    <!-- <p class="text-[12px] text-center text-sm md:text-[16px] -mt-1">degree</p> -->
                  </div>
              </div>

              <div
                class="mx-auto h-full flex justify-between items-center align-middle overflow-hidden w-full rounded-[16px] bg-white"
                style=""
              >
                  <div
                    class="font-bold text-[12px] md:text-base truncate pr-1 ml-1 md:ml-[12px] col-span-2 my-auto"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                    <img
                      alt=""
                      class="inline airware lg:mt-0 bg-[#01893D]"
                      style="width: 20px; height: 20px"
                    />
                    ความกดอากาศ
                  </div>
                  <div class="mr-1 md:mr-[12px]">
                    <p
                      class="font-medium text-[12px] md:text-base xl:text-lg text-center"
                    >
                      {{ weatherNow ? weatherNow.SeaLevelPressure : "-" }}
                    </p>

                    <p
                      class="text-[12px] text-center text-sm md:text-[16px] -mt-1 font-medium "
                    >
                      hpa
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <p class="text-[22px] md:text-2xl font-bold my-[20px] pl-5">
        พยากรณ์อากาศล่วงหน้า 7 วัน
      </p> -->

      <div
        class="pb-4 relative w-full h-full flex flex-col items-center justify-center"
        :class="[
          states.weatherForecast.forecasts
            ? bgWeatherCondition(states.weatherForecast.forecasts[0].data.cond)
            : `bg-[url('@/assets/img/sky/bg-1.png')]`]"
      >
        <div v-if="serverWheather_week == false" class="absolute inset-0 z-20 bg-opacity-50 transition-opacity" style="background: rgba(0, 0, 0, 0.2);"></div>
        <div v-if="serverWheather_week == false" class="absolute z-50 bg-white w-[288px] md:w-[550px] h-[153px] rounded-lg" >
          <div class="flex justify-center items-center mt-4">
            <img src="/icons/error.png" alt="">
          </div>
          <p class="text-center mt-4 text-[#827C7B] font-medium text-base">แหล่งข้อมูลพยากรณ์อากาศขัดข้อง</p>
          <p class="text-center mt-4 text-[#827C7B] font-medium text-sm">กรุณาลองใหม่อีกครั้งในภายหลัง</p>
        </div>
        <div v-if="serverWheather_week == true" class="w-11/12 mx-auto">
          <swiper
            class="swiper"
            :modules="states.modules"
            :slides-per-view="1"
            :space-between="10"
            :pagination="{ clickable: true }"
            :breakpoints="{
              '320': {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              '424': {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              '768': {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              '1024': {
                slidesPerView: 5,
                spaceBetween: 10,
              },
              '1440': {
                slidesPerView: 7,
                spaceBetween: 30,
              },
            }"
          >
            <swiper-slide
              v-for="(item, slide) in states.weatherForecast.forecasts"
              :key="slide"
            >
              <div
                :class="bgWeatherConditionDaily(item.data.cond)"
                class="h-[300px]"
              >
                <div
                  class="font-medium text-center text-base xl:text-lg mb-2"
                >

                  <p v-if="moment(item.time).locale('th').format('ddd') == 'พฤหัส'">พฤหัสบดี</p>
                  <p v-else >{{ moment(item.time).locale("th").format("ddd") }}</p>
                  <p>{{ moment(item.time).locale("th").format("D MMM") }}</p>
                  <!-- <p>{{ formatDate(item.time) }}</p> -->
                </div>
                <div>
                  <img
                    v-if="arr1.includes(item.data.cond)"
                    class="mx-auto"
                    src="@/assets/img/icons/weather-forecast/bright.svg"
                    alt=""
                  />
                  <img
                    v-else-if="arr2.includes(item.data.cond)"
                    class="mx-auto"
                    src="@/assets/img/icons/weather-forecast/sume-cloud.svg"
                    alt=""
                  />
                  <img
                    v-else-if="arr3.includes(item.data.cond)"
                    class="mx-auto"
                    src="@/assets/img/icons/weather-forecast/cloud.svg"
                    alt=""
                  />
                  <img
                    v-else-if="arr4.includes(item.data.cond)"
                    class="mx-auto"
                    src="@/assets/img/icons/weather-forecast/raining.svg"
                    alt=""
                  />
                  <img
                    v-else-if="arr5.includes(item.data.cond)"
                    class="mx-auto"
                    src="@/assets/img/icons/weather-forecast/super-rain.svg"
                    alt=""
                  />
                  <img
                    v-else-if="arr6.includes(item.data.cond)"
                    class="mx-auto"
                    src="@/assets/img/icons/weather-forecast/super-rain.svg"
                    alt=""
                  />
                </div>
                <p
                  class="font-medium text-center text-sm md:text-[16px] mt-1"
                >
                  {{ weatherCondition(item.data.cond) }}
                </p>

                <p
                  class="mt-4 text-[14px] text-center text-sm md:text-[16px] mt-1"
                >
                  โอกาสฝนตก
                </p>

                <div
                  class="font-bold text-center text-[14px] md:text-base xl:text-lg mb-2"
                >
                  <p class="text-[#01893D]">
                    {{ item.data ? Math.floor(item.data.rh) : "-" }} %
                  </p>
                </div>

                <p
                  class="font-medium text-[14px] text-center md:text-[16px] mt-4"
                >
                  สูงสุด
                  <span class="text-[#01893D]"
                    >{{ item ? Math.floor(item.data.tc_max) : "-" }}°</span
                  >
                </p>

                <p
                  class="font-medium text-[14px] text-center md:text-[16px] mt-1"
                >
                  ต่ำสุด
                  <span class="text-[#01893D]"
                    >{{ item ? Math.floor(item.data.tc_min) : "-" }}°</span
                  >
                </p>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <!-- กรณี error หรือ ไม่มีข้อมูล -->
        <div v-else class="w-11/12 mx-auto " >
          <swiper
            class="swiper "
            :modules="states.modules"
            :slides-per-view="1"
            :space-between="10"
            :pagination="{ clickable: true }"
            :breakpoints="{
              '320': {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              '424': {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              '768': {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              '1024': {
                slidesPerView: 5,
                spaceBetween: 10,
              },
              '1440': {
                slidesPerView: 7,
                spaceBetween: 30,
              },
            }"
          >
            <swiper-slide
              v-for="(item, slide) in 7"
              :key="slide"
            >
              <div class="h-[400px] mt-2" >
                <div class="w-full h-full rounded-lg" style="background: linear-gradient(180deg, #81CAFF 0%, rgba(255, 255, 255, 0) 100%), #FFFFFF;"></div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <p class="self-end mr-4 mt-4 text-right text-[10px] font-bold ">
          แหล่งข้อมูลจาก <span class="text-[#01893D]">กรมอุตุนิยมวิทยา</span>
        </p>
      </div>
    </div>
  </NavbarMain>
</template>



<style>
@import "@/assets/styles/custom-icons.css";

.text-custom-head-img-farm.nameday {
  font-size: clamp(5px, 10vw + 10px, 128px);
}

.text-custom-head-img-farm.day {
  font-size: clamp(0.875rem, 4vw + 1rem, 3rem);
}

.btn-custom-see-chart:hover span {
  color: #01893D;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 700, "GRAD" 0, "opsz" 48;
}

.flex-wrapper {
  display: flex;
  flex-flow: row nowrap;
}

.single-chart {
  width: 100%;
  justify-content: space-around;
}

.circular-chart {
  display: block;
  margin: 10px auto;
  max-width: 90%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 2.8;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.circular-chart.green .circle {
  stroke: #01893D;
}

.percentage {
  fill: #000000;
  font-size: 0.6em;
  text-anchor: middle;
  font-family: 'IBM Plex Sans Thai';
}

.carousel__track {
  justify-content: center;
}

/* .carousel__viewport {
    padding: 0 40px 0 40px;
  } */

.carousel__prev,
.carousel__next {
  display: none !important;
}
</style>
