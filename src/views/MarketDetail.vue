<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import Swal from "sweetalert2";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";
import moment from "moment-with-locales-es6";

const mainStore = useMainStore();
const router = useRouter();
const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;

const CustomerFarmLat = computed(() => mainStore.CustomerFarmLat);
const CustomerFarmLon = computed(() => mainStore.CustomerFarmLon);


let url = new URL(window.location.href);
let place_id = url.searchParams.get("place_id");

let photo_reference = ref('');
let image_detail = ref('');

let user_fixed = ref('/icons/user.png');
let dataDetail = ref([]);
let title_detail = ref('');


let latitude = ref('');
let longitude = ref('');

let destination_addresses = ref('');
let distance_km = ref('');
let duration = ref('');

let isShow = ref(false);


onMounted(async () => {

  ApiMain.get(`/market/detail?placeId=${place_id}&language=th`).then((res) => {

    title_detail.value = res.data.data.result.name;
    dataDetail.value.push(res.data.data.result);

    console.log(res.data.data.result);

    latitude.value = res.data.data.result.geometry.location.lat;
    longitude.value = res.data.data.result.geometry.location.lng;
    if (res.data.data.result.photos != undefined) {
      photo_reference.value = res.data.data.result.photos[0].photo_reference;
      ApiMain.get(`/market/photo?photoReference=${photo_reference.value}&maxHeight=400&maxWidth=400`).then((result) => {
        image_detail.value = result.data.data;
      }).catch((error) => {
        console.log(error.messag);
      });
    }
    else {
      image_detail.value = '/img/defult_img.png';
    }

    ApiMain.get(`/market/distance?origins=${CustomerFarmLat.value}%2C${CustomerFarmLon.value}&destinations=${latitude.value}%2C${longitude.value}&language=th`).then((response)=>{

      destination_addresses.value = response.data.data.destination_addresses[0] ;
        let dis_obj = response.data.data.rows ;

        distance_km.value = dis_obj[0].elements[0].distance.text;
        duration.value = dis_obj[0].elements[0].duration.text ;
    });
  }).catch((error) => {
    console.log(error);
  });

});


const toggle = () => {
  isShow.value = !isShow.value;

};


</script>
<template>
  <NavbarMain>
    <div id="home">
      <div class="">
        <p class="text-[22px] md:text-2xl font-bold mt-[60px] md:mt-[20px] pl-5">{{ title_detail }}</p>
        <div class="mb-4">
          <div class="content-center grid grid-cols-1 md:gap-4 p-2 mb:pb-2 lg:pb-0">
            <div class="col-span-2 md:col-span-1">
              <div class="grid grid-cols-1 gap-2 md:gap-4" v-for="(item, index) in dataDetail" :key="index">
                <div class="grid md:grid-cols-2 gap-2 md:gap-4">
                  <div class="mx-auto overflow-hidden  w-full rounded-[16px] bg-white pb-0" style="">
                    <div class="">
                      <div class="p-2 w-full">
                        <img class="rounded-[16px] object-cover h-20 md:h-48 w-full" :src="image_detail" alt="">
                        <div class="flex flex-row items-center">
                          <div class="mt-2 ml-2">
                            <div v-if="Math.floor(item.rating) == 5" class="flex items-center text-[#01893D]">
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                            </div>
                            <div v-else-if="Math.floor(item.rating) == 4" class="flex items-center text-[#01893D]">
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                            </div>
                            <div v-else-if="Math.floor(item.rating) == 3" class="flex items-center mt-2 text-[#01893D]">
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                            </div>
                            <div v-else-if="Math.floor(item.rating) == 2" class="flex items-center mt-2 text-[#01893D]">
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                            </div>
                            <div v-else-if="Math.floor(item.rating) == 1" class="flex items-center mt-2 text-[#01893D]">
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#01893D]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                            </div>
                            <div v-else class="flex items-center mt-2 text-[#01893D]">
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                              <img alt="" class="inline star mb-2 lg:mt-0 bg-[#F2F2F0]" style="width: 24px; height: 24px" />
                            </div>
                          </div>
                          <div class="mt-1.5">
                            <p v-if="item.rating" class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400" > ( {{ item.rating }} )</p>
                            <p v-else class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400" > ( 0 )</p>
                          </div>
                          <div class="ml-auto mt-2">
                            <span v-if="item.user_ratings_total"
                              class="font-medium text-base text-[#302520]">{{ item.user_ratings_total }} รีวิว</span>
                            <span v-else class=" font-medium text-base text-[#302520]">0 รีวิว</span>
                          </div>
                        </div>
                        <div class="relative">
                          <div class="flex flex-row items-center mt-2 ml-2">
                            <div class="font-medium text-sm flex flex-row items-center">
                              <img alt="" class="inline clock lg:mt-0 bg-[#01893D] mr-1"
                                style="width: 20px; height: 20px;">
                              <div v-if="item.opening_hours != undefined">
                                <span v-if="item.opening_hours.open_now == true"
                                class="mr-2 text-sm font-medium text-[#01893D]">เปิดอยู่</span>
                              <span v-else class="mr-2 text-sm font-medium text-red-600">ปิดอยู่ </span>
                              </div>
                                <span v-else class="text-sm font-medium text-black opacity-70 mt-1">ยังไม่มีข้อมูลเวลาเปิด-ปิด</span>
                            </div>
                            <div v-if="item.opening_hours != undefined" @click="toggle()">
                              <span class="text-sm font-medium">- เวลาเปิด</span>
                              <img alt="" :class="isShow == true ? '-rotate-90' : 'rotate-90'"
                                class="inline arrow-right  lg:mt-0 bg-[#000000] mr-1"
                                style="width: 20px; height: 20px;">
                            </div>
                          </div>
                          <div v-if="isShow == true " class="mt-2">
                            <div class="ml-20">
                              <ul>
                                <li class="mb-1.5" v-for="(day, index) in item.opening_hours.weekday_text" :key="index">
                                  <span class="text-sm font-medium">{{ day.substring(0, day.indexOf(':')) }} :
                                    <span class="text-red-600" v-if="day.substring(day.indexOf(':') + 1) == ' ปิดทำการ'">ปิดทำการ</span>
                                    <span class="text-green-600" v-else-if="day.substring(day.indexOf(':') + 1) == ' เปิด 24 ชั่วโมง'">เปิดตลอด 24 ชั่วโมง</span>
                                    <span class="text-[#01893D]" v-else>{{ day.substring(day.indexOf(':') + 1) }} น.</span>
                                  </span>
                                </li>
                              </ul>
                            </div>
                            <hr class="my-2">
                          </div>
                        </div>

                        <div class="font-medium text-sm mt-2 ml-2 flex flex-row">
                          <img alt="" class="inline call lg:mt-0 bg-[#01893D] mr-1" style="width: 20px; height: 20px;">
                          <p v-if="item.formatted_phone_number == ''" class="text-sm font-medium text-[#01893D]">
                            เปิดอยู่</p>
                          <p v-else class="text-sm font-medium text-black opacity-70 mt-1">ไม่มีข้อมูลเบอร์ติดต่อ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mx-auto overflow-hidden  w-full rounded-[16px] bg-white pb-0" style="">
                    <div class="">
                      <div class="p-2 w-full">
                        <iframe :class="isShow == true ? 'md:h-[400px]' : 'md:h-48'"
                          class="rounded-[16px] object-cover h-40  w-full"
                          :src="'https://maps.google.com/maps?q=' + latitude + ',' + longitude + '&t=&z=15&ie=UTF8&iwloc=&output=embed'" />
                        <div class="font-medium text-sm ml-1 md:ml-[12px] mt-2">
                          {{ destination_addresses }}
                        </div>
                        <div class="font-medium text-sm ml-1 md:ml-[12px] mt-2">
                          ห่างจากคุณ <span class="text-[#74b55c]">{{ distance_km }}  ( {{ duration }} )</span>
                        </div>
                      </div>
                      <div class="flex p-2">
                        <div class="px-0.5 w-full">
                          <a :href="`https://www.google.com/maps/dir/?api=1&origin=${CustomerFarmLat},${CustomerFarmLon}&destination=${latitude},${longitude}`" target="_blank">
                            <button type="button"
                              class="text-[#fff] w-full hover:text-[#01893D] bg-[#01893D] hover:bg-[#fff] font-bold rounded-[8px] text-sm px-1 h-[40px] text-center items-center btn-custom">
                              <img alt="" class="inline map lg:mt-0 bg-[#fff] mr-1" style="width: 20px; height: 20px" />
                              <span>นำทาง</span>
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="item.reviews" class="bg-white rounded-lg p-2">
                  <h1 class="text-[22px] font-bold mb-4">รีวิวทั้งหมด</h1>
                  <div v-for="(user, index) in item.reviews" :key="index">
                    <div class="flex justify-start items-center">
                      <!-- <img  @error="handleError" :src="user.profile_photo_url"  alt="" class="w-[32px] h-[32px] mr-2"> -->
                      <img  src="/icons/user.svg"  alt="" class="w-[32px] h-[32px] mr-2 bg-[#9BD226] p-0.5 rounded-full">
                      <span class="font-bold text-sm md:text-base ">{{ user.author_name }}</span>
                    </div>
                    <div class="flex flex-row items-center my-2">

                      <div v-if="Math.floor(user.rating) == 5" class="mr-4">
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                      </div>
                      <div v-if="Math.floor(user.rating) == 4" class="mr-4">
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                      </div>
                      <div v-if="Math.floor(user.rating) == 3" class="mr-4">
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                      </div>
                      <div v-if="Math.floor(user.rating) == 2" class="mr-4">
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                      </div>
                      <div v-if="Math.floor(user.rating) == 1" class="mr-4">
                        <img alt="" class="inline star bg-[#01893D]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                        <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                      </div>

                      <p class="mt-2 opacity-50">{{ user.relative_time_description }}</p>
                    </div>
                    <p class="text-sm font-medium">{{ user.text }}</p>
                    <hr class="my-4">
                  </div>
                </div>
                <div v-else class="bg-white rounded-lg  w-full p-2">
                  <h1 class="text-[22px] font-bold mb-2">รีวิวทั้งหมด</h1>
                  <div class="flex justify-center items-center h-[250px]">
                    <p class="text-base font-medium opacity-60">ยังไม่มีรีวิว</p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>

<style>
@import "@/assets/styles/custom-icons.css";


.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
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
</style>
