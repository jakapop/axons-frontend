<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import {
  ref,
  reactive,
  onMounted,
  computed
} from "vue";
import {
  useRouter
} from "vue-router";
import {
  useMainStore
} from "@/stores/main";
import Swal from "sweetalert2";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";
import axios from "axios";

import useVuelidate from "@vuelidate/core";
import {required,email,sameAs,minLength,helpers} from "@vuelidate/validators";

const mainStore = useMainStore();
const router = useRouter();
const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;

const CustomerFarmLat = computed(() => mainStore.CustomerFarmLat);
const CustomerFarmLon = computed(() => mainStore.CustomerFarmLon);


let image_place = ref('');
const google_key = 'AIzaSyDtyR_cUT9culanLC6Jt8VJ-knPRZZ96kA';

const states = reactive({
  marketLists: [],

});

let place = reactive({
  data:""
})

let kilometer = [{ id: 1, km: 5 }, { id: 2, km: 10 }, { id: 3, km: 50 }, { id: 4, km: 100 }];
let spiner = ref(false);
const dataform = reactive({
  keywords: 'ล้งรับซื้อผลไม้',
  radius: '10',
  radius_custom: '',
});


let keyword_list = ref([]);

onMounted(() => {
  let keyword = 'ล้งรับซื้อผลไม้';
  placeDetails(CustomerFarmLat.value,CustomerFarmLon.value,10000,keyword);

  ApiMain.get('/market/keyword-lists').then((response) => {
    console.log(response.data);
    keyword_list.value = response.data ;
  })
});




// Haversine  วัดระยะห่าง
// solution 1

// var rad = function(x) {
//   return x * Math.PI / 180;
// };

// var getDistance = (lat1, lng1, lat2, lng2) => {
//   let R = 6371000; // Earth’s mean radius in meter : รัศมีทรงกลมของโลก
//   let dLat = rad(lat2 - lat1);  //คำนวณความต่างระหว่างจุดสองจุด latitude
//   let dLong = rad(lng2 - lng1);
//   let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *  Math.sin(dLong / 2) * Math.sin(dLong / 2);
//   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   let d = (R * c)/1000;
//   return d; // returns ระยะทางเป็นเมตร
// };
//  solution2
// คำนวณระยะทาง

// function haversine(lat1, lon1, lat2, lon2) {
//   var R = 6371; // radius of Earth in km
//   var dLat = (lat2 - lat1) * (Math.PI / 180); //คำนวณความต่างระหว่างจุดสองจุด latitude
//   var dLon = (lon2 - lon1) * (Math.PI / 180); //คำนวณความต่างระหว่างจุดสองจุด longitude
//   var a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//     Math.cos((lat2 * Math.PI) / 180) *
//     Math.sin(dLon / 2) *
//     Math.sin(dLon / 2);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   var d = R * c; //ระยะห่างระหว่างจุดสองจุด
//   return d; // returns ระยะทางเป็นเมตร
// }




const isDisabled = ref(false);
// เอาไว้ติดตามข้อมูลว่ากำลัง กรอกระยะทางหรือ เลือกจากระยะทางที่มีให้
const custom_radius = computed(() => {
  let radius = '';
  if (dataform.radius_custom != '') {
    dataform.radius = '';
    isDisabled.value = true ;
    const radio_km0 = document.getElementById('km0');
    const radio_km1 = document.getElementById('km1');
    const radio_km2 = document.getElementById('km2');
    const radio_km3 = document.getElementById('km3');
    radio_km0.value = false;
    radio_km1.value = false;
    radio_km2.value = false;
    radio_km3.value = false;
    return radius = dataform.radius_custom * 1000;
  }
  else {
    isDisabled.value = false ;
    return radius = dataform.radius * 1000;
  }

});




const placeDetails = (my_lat,my_lng,radius,keyword) => {

  // localStorage.setItem('my_position',JSON.stringify({'lat':my_lat,'lng':my_lng}));
  states.marketLists = [];

  ApiMain.get(`market?lat=${my_lat}&lon=${my_lng}&radius=${radius}&keyword=${keyword}`).then(async (res) => {
      let obj = res.data.data.results;
      place.data = '<div class="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-visible md:overflow-y-auto">'
      for (let index = 0; index < obj.length; index++) {
        const item = obj[index];
        let distance_lat = item.geometry.location.lat ;
        let distance_lng = item.geometry.location.lng ;
        try {

          if(item.photos != undefined){
            const response = await ApiMain.get(`/market/photo?photoReference=${item.photos[0].photo_reference}&maxHeight=400&maxWidth=400`);
            obj[index].img_detail =response.data.data;
            // obj[index].distance = distance;

          }
          else{
            obj[index].img_detail = '/img/defult_img.png';
          }

        }
        catch (error) {
          console.error(error);
        }
        //
        const distance_res = await ApiMain.get(`/market/distance?origins=${my_lat}%2C${my_lng}&destinations=${distance_lat}%2C${distance_lng}&language=th`);

        obj[index].destination_addresses = distance_res.data.data.destination_addresses[0] ;
        let dis_obj = distance_res.data.data.rows ;
        for (let j = 0; j < dis_obj.length; j++) {
          const data = dis_obj[j].elements;
          data.forEach(item => {

            obj[index].distance = item.distance.text ;
            obj[index].duration = item.duration.text ;

          });
        }

        place.data += '<div class="bg-white rounded-lg p-2">'+
        '<a href="/market-detail?place_id='+obj[index].place_id+'">'+
        '<div class="flex flex-row items-center"><div class="w-full md:w-10/12">'+
        '<img src="'+obj[index].img_detail+'" class="w-full md:w-[350px] h-[103px] object-cover rounded-[16px]" alt=""></div><div class="ml-2 w-full"><div class="flex flex-col justify-between w-full h-full"><div >'+
        '<h6 class="text-sm md:text-sm font-bold mb-2">'+obj[index].name+'</h6>'+
        '<p class="font-medium text-[10px] md:text-[12px] lg:text-sm text-[#01893D] ">ระยะทาง '+obj[index].distance+' <span class="ml-0.5">('+obj[index].duration+')</span></p></div><div>'+
        '<p class="text-[10px] md:text-[12px] font-bold md:font-medium">'+obj[index].destination_addresses+'</p>'+
        '</div></div></div></div></a></div>'

      }
      place.data+="</div>"
      states.marketLists = obj ;
      spiner.value = true ;

    }).catch((error) => {
      console.log(error.message);
      spiner.value = false;
    });


}
const submit = () => {
  place.data = ""
  spiner.value = false ;
  if(custom_radius.value == 0 || dataform.keywords == ''){
    Swal.fire({
      position: "center",
      icon: "warning",
      text: "กรุณาเลือกแหล่งรับซื้อ และ ระยะทาง",
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
    });
  }
  else {
    placeDetails(CustomerFarmLat.value,CustomerFarmLon.value,custom_radius.value,dataform.keywords);
  }

};

</script>
<template>
  <NavbarMain>
    <div class="m-4 mt-8 hidden">
      <h1 class="mb-4 font-bold text-[22px]">ตลาด</h1>
      <div class="bg-white rounded-2xl p-4 text-center h-[97px] md:h-[200px] flex justify-center items-center">
        <div>
          <p class="text-base md:text-xl font-medium mb-4 opacity-60">พบกันในเร็วๆ นี้</p>
        </div>
      </div>
    </div>
    <!-- <div v-html="place.data"></div> -->
    <div class="m-4 mt-16 md:mt-8">
      <!-- ฟังก์ชันไว้ตรวจสอบการกรอกข้อมูล ถ้ามีการกำหนดระยะทางเอง ก็จะ set ค่าที่เลือกเป้นค่าว่าง -->
      <div class="hidden">{{ custom_radius }} </div>
      <h1 class="font-bold text-[22px] mb-4">ตลาด</h1>
      <div class="bg-white rounded-lg p-2 lg:p-4 mb-4">
        <div class="flex flex-col">
          <form @submit.prevent="submit">
            <div class="mb-4">
              <div class="flex flex-row items-center">
                <label for="filter_type"
                  class="whitespace-nowrap block mr-1 md:mr-8  text-sm md:text-base font-medium text-gray-900 dark:text-white">แหล่งรับซื้อ</label>
                <div class="w-[400px]">
                  <select id="filter_type" v-model="dataform.keywords" :class="dataform.keywords!=''?'border-[#01893D] border-2':'border-gray-300'"
                    class="bg-gray-50 border text-[#01893D] text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full md:w-[256px] h-[36px] p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
                    <option value="" selected disabled>เลือกแหล่งรับซื้อ</option>
                    <option :value="key.keyword" v-for="key in keyword_list" :key="key.id">{{ key.keyword }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <div class="flex flex-row flex-wrap md:flex-nowrap items-center">
                <div class="mr-4 w-[150px]">
                  <span class="font-medium text-sm md:text-base truncate">ภายในบริเวณ (รัศมี)</span>
                </div>
                <div class="w-full">
                  <ul class="flex flex-row justify-center">
                    <li class="w-full" v-for="(m, index) in kilometer" :key="m.id">
                      <input type="radio" class="hidden peer" :id="'km' + index" name="kilomet" :disabled="isDisabled"
                        v-model="dataform.radius" :value="m.km">
                      <label :for="'km' + index"
                        class="text-sm font-bold peer-checked:bg-[#01893D] peer-checked:text-white text-gray-400 bg-[#F3F2F0] rounded-md text-center h-[36px] flex items-center justify-center mr-1 md:mr-2">{{ m.km }} กม.</label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- <div class="mb-6">
              <div class="flex flex-row items-center">
                <div class="mr-1 lg:mr-4 w-[100px] md:w-[120px]">
                  <span class="font-medium text-sm md:text-base truncate">หรือภายในบริเวณ</span>
                </div>
                <div class="w-full">
                  <div class="flex flex-row items-center">
                    <div class="w-[80px] sm:w-[120px] md:w-[200px]">
                      <input type="number" id="radius_custom" inputmode="numeric" pattern="[0-9]*" v-model="dataform.radius_custom"
                      :class="dataform.radius_custom!=''?'border-[#01893D] border-2':'border-gray-300'"  class="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-[78px] sm:w-full h-[36px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
                    </div>
                    <span class="ml-0 sm:ml-2 text-sm md:text-base font-medium">กิโลเมตร</span>
                  </div>
                </div>
              </div>
            </div> -->
            <div class="flex flex-row w-full justify-center">
              <div class="w-[500px]">
                <div  v-if="spiner == true">
                  <button type="submit" :class="spiner == false || custom_radius == 0 ?'bg-[#01893D] opacity-80':'bg-[#01893D]'"
                  class=" w-full h-[36px] rounded-lg flex flex-row items-center justify-center relative">
                  <div class="flex flex-row">
                    <img alt="" class="icon-search">
                    <span class="text-white text-base">ค้นหา</span>
                  </div>
                </button>
                </div>
                <div v-else>
                  <button type="button"
                  class=" w-full h-[36px] bg-[#01893D] opacity-80 rounded-lg flex flex-row items-center justify-center relative">
                  <div class="flex flex-row items-center" >
                    <span class="text-white text-base">กำลังค้นหา</span>
                    <div class="mt-1 ml-3.5 dot-flashing"></div>
                  </div>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- กรณีไม่พบข้อมูลที่ค้นหา -->

      <!-- <div v-if="spiner == false" class=" grid grid-cols-1 lg:grid-cols-2 gap-2 p-0 md:gap-4">
            <div role="status" class=" rounded-lg  bg-white pace-y-8 animate-pulse md:space-y-0 md:space-x-8 flex flex-row md:flex md:items-center shadow p-2" v-for="item in 6 " :key="item">
                <div class="flex items-center justify-center w-full h-28 md:h-48 bg-gray-300 rounded sm:w-full dark:bg-gray-900 mb-2 md:mb-0">
                    <svg class="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/></svg>
                </div>
                <div class="w-full ml-2 md:ml-0">
                    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-900 w-48 mb-4"></div>
                    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-900 max-w-[480px] mb-2.5"></div>
                    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-900 mb-2.5"></div>
                    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-900 max-w-[440px] mb-2.5"></div>
                    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-900 max-w-[460px] mb-2.5"></div>
                    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-900 max-w-[360px]"></div>
                </div>
                <span class="sr-only">Loading...</span>
            </div>

      </div> -->
      <!-- <div v-else> -->
          <!-- <div v-if="(states.marketLists).length == 0" class="bg-white w-full h-[300px] rounded-lg flex justify-center items-center">
            <h1 class="text-lg text-center font-medium opacity-60">ไม่พบข้อมูลที่ค้นหา</h1>
        </div> -->
        <!-- <div :class="(states.marketLists).length > 0 ? 'h-[650px] lg:h-[580px]':'h-auto'" class="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-visible md:overflow-y-auto">
        <div v-for="item in states.marketLists" :key="item.id" class="bg-white rounded-lg p-2">
          <router-link :to="`/market-detail?place_id=${item.place_id}`">
            <div class="flex flex-row items-center">
              <div class="w-full md:w-10/12">
                <img :src="item.img_detail" class="w-full md:w-[350px] h-[103px] object-cover rounded-[16px]" alt="">
              </div>
              <div class="ml-2 w-full">
                <div class="flex flex-col justify-between w-full h-full">
                  <div >
                    <h6 class="text-sm md:text-sm font-bold mb-2">{{ item.name }}</h6>
                    <p class="font-medium text-[10px] md:text-[12px] lg:text-sm text-[#01893D] ">ระยะทาง {{item.distance}} <span class="ml-0.5">({{ item.duration }})</span></p>
                  </div>
                  <div>
                    <p class="text-[10px] md:text-[12px] font-bold md:font-medium">{{item.destination_addresses}}</p>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div> -->

          <p v-html="place.data"></p>

      <!--</div>
       </div> -->

    </div>
  </NavbarMain>
</template>

<style scoped>
@import "@/assets/styles/custom-icons.css";


.icon-search {
  -webkit-mask: url(/icons/search.svg)no-repeat center / contain;
  mask: url(/icons/search.svg)no-repeat center / contain;
  -webkit-mask-size: contain;
  mask-size: contain;
  width: 25px;
  height: 25px;
  background: rgb(255, 255, 255);
}

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
  font-variation-settings:
    'FILL' 0,
    'wght' 700,
    'GRAD' 0,
    'opsz' 48
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
  fill: #666;
  font-family: sans-serif;
  font-size: 0.5em;
  text-anchor: middle;
}

.icon-chart {
  background-color: rgb(255, 255, 255);
  mask: url("@/assets/img/icons/chart.png") no-repeat center / contain;
  height: 15px;
}

.btn-custom-see-chart:hover .icon-chart {
  background-color: #01893D;
}

.btn-custom-add:hover img {
  background-color: #01893D;
}


.dot-flashing {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 5px;
  background-color: #80ffc4;
  color: #8bff80;
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}
.dot-flashing::before, .dot-flashing::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
}
.dot-flashing::before {
  left: -10px;
  width: 6px;
  height: 6px;
  border-radius: 5px;
  background-color: #ffffff;
  color: #80ffc8;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}
.dot-flashing::after {
  left: 10px;
  width: 6px;
  height: 6px;
  border-radius: 5px;
  background-color: #80ffc4;
  color: #8bff80;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dot-flashing {
  0% {
    background-color: #80ffa0;
  }
  50%, 100% {
    background-color: rgba(128, 255, 151, 0.2);
  }
}
</style>

