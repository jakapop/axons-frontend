<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import { ref, reactive, onMounted, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import farmimg from "@/assets/img/img_landingpage/bg-device.png";
import slope from "@/assets/img/icons/slope.svg";

const mainStore = useMainStore();
const CustomerId = mainStore.CustomerId;
const CustomerFarmId = computed(() => mainStore.CustomerFarmId);
const CustomerFarmLat = computed(() => mainStore.CustomerFarmLat);
const CustomerFarmLon = computed(() => mainStore.CustomerFarmLon);
const CustomerFarmName = computed(() => mainStore.CustomerFarmName);
const CustomerFarmImage = computed(() => mainStore.CustomerFarmImage);
const CustomerProvinceName = computed(() => mainStore.CustomerProvinceName);
const CustomerDistrictName = computed(() => mainStore.CustomerDistrictName);

const states = reactive({
  isOpen: false,
  geo: "",
});

const phValueText = (value) => {
  if (!value) {
    return;
  } else {
    if (value >= 0 && value < 3.5) {
      return "กรดแรงที่สุด";
    } else if (value >= 3.5 && value < 4.6) {
      return "กรดรุนแรงมาก";
    } else if (value >= 4.6 && value < 5.1) {
      return "กรดจัดมาก";
    } else if (value >= 5.1 && value < 6.1) {
      return "กรดปานกลาง";
    } else if (value >= 6.1 && value < 6.6) {
      return "กรดเล็กน้อย";
    } else if (value >= 6.6 && value < 7.4) {
      return "กลาง";
    } else if (value >= 7.4 && value < 7.9) {
      return "ด่างเล็กน้อย";
    } else if (value >= 7.9 && value < 8.5) {
      return "ด่างปานกลาง";
    } else if (value >= 8.5 && value <= 9) {
      return "ด่างจัด";
    } else if (value > 9) {
      return "ด่างจัดมาก";
    }
  }
};

let show_data = ref(false) ;
const getGeographyByLatLon = computed(() => {
  if (CustomerFarmLat.value && CustomerFarmLon.value) {
    ApiMain.get(
      `geo/by-latlon?lat=${CustomerFarmLat.value}&lon=${CustomerFarmLon.value}`
    ).then((res) => {

      states.geo = res.data;

      if(res.status == 200){
        if(states.geo.status=="active"){
          show_data.value = true ;
        }else{
          show_data.value = false ;
        }
      }else {
        show_data.value = false  ;
      }

    });
  }
});
</script>
<template>
  <NavbarMain>
    <div>
      <div class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <p class="text-[22px] md:text-2xl font-bold mt-[20px] pl-5">
            ภูมิศาสตร์
          </p>
        </div>
        <!-- start กรณีไม่มีข้อมูล -->
        <div :class="show_data?'hidden':''" class="m-4">
          <div class="rounded-[16px] bg-white p-4">
            <div class="mb-3 text-base  md:text-lg text-center text-[#827C7B] font-medium">
              <p>กำลังรวบรวมข้อมูล</p>
            </div>
            <div class="text-center">
              <div class="mb-3 text-sm md:text-base md:text-center text-[#827C7B] font-medium">
                <p>โปรดกลับมาอีกครั้งในภายหลัง</p>
              </div>
              <router-link to="/contact">
              <button
                class="bg-[#01893D] hover:bg-[#fff] text-white font-32ld py-2 px-4 hover:text-[#01893D] rounded-[10px] w-[256px] h-[36px] btn-custom-add">
                <img alt="" class="inline support lg:mt-0 bg-[#fff]" style="width: 20px; height: 20px" />
                <span class="text-sm ml-1">ติดต่อเรา</span>
              </button>
              </router-link>
            </div>
          </div>
        </div>
        <!-- end กรณีไม่มีข้อมูล -->
        <div :class="show_data?'':'hidden'" class="mt-4">
          <div
            class="content-center grid md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 pt-0"
          >
            <div class="grid grid-cols-1 gap-4">
              <div
                class="mx-auto overflow-hidden w-full rounded-[16px] bg-white py-4 pb-0"
                style=""
              >
                <div class="">
                  <div
                    class="font-bold text-[12px] md:text-base text-[#302520] ml-1 md:ml-[12px]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                    <img
                      alt=""
                      class="inline location-icon lg:mt-0 bg-[#01893D] mr-1"
                      style="width: 20px; height: 20px"
                    />
                    {{ CustomerFarmName }} {{ getGeographyByLatLon }}
                  </div>
                  <!-- <p class="text-gray-700 text-base text-center text-[40px] my-6 md:text-[54px] xl:text-[64px]">
                      test
                    </p> -->
                  <div class="p-2 w-full">
                    <!-- <map-example-vue></map-example-vue> -->
                    <!-- <map-test width="100%" height="122" style="border:0;" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade" :lat="states.weather.lat" :lng="states.weather.lon"></map-test> -->
                    <img
                      class="rounded-[16px] object-cover h-20 md:h-48 w-full"
                      :src="CustomerFarmImage ? CustomerFarmImage : farmimg"
                      alt=""
                    />
                    <!-- <div class="relative place-items-center bg-cover bg-center bg-no-repeat overflow-hidden w-full object-cover header-img"></div> -->
                    <p
                      class="font-bold text-[12px] md:text-base text-[#302520] mt-2 text-center"
                    >
                    {{CustomerDistrictName}} {{CustomerProvinceName}}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div
                  v-on:click="states.isOpen = !states.isOpen"
                  class="md:hidden mx-auto w-full rounded-[16px] bg-white py-4"
                  style=""
                >
                  <div
                    class="font-medium text-base ml-1 md:ml-[12px] text-[#01893D] relative"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt=""> -->
                    คุณสมบัติของดิน
                    <!-- <img alt="" class="inline select-down lg:mt-0 bg-[#01893D] mr-1 absolute right-[-5px] top-[-5px]"
                      style="width: 25px; height: 25px;" :class="states.isOpen == true ? 'rotate-180' : ''"> -->
                    <img
                      class="flex absolute right-[11px] top-[5px] md:top-3.5 w-2.5 md:w-4 bg-transparent rounded text-base text-gray-600"
                      src="@/assets/img/icons/select-down.svg"
                      alt=""
                      :class="states.isOpen == true ? 'rotate-180' : ''"
                    />
                  </div>
                  <div
                    class="mt-4 p-2 indent-8 text-base font-medium text-[#302520]"
                    :class="states.isOpen ? 'd-block' : 'hidden'"
                  >
                    <slot>
                      <span v-html="states.geo.soilProperties"></span>
                    </slot>
                  </div>
                </div>

                <div
                  class="hidden md:block mx-auto w-full rounded-[16px] bg-white py-4"
                  style=""
                >
                  <div
                    class="font-medium text-base ml-1 md:ml-[12px] text-[#01893D]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt=""> -->
                    คุณสมบัติของดิน
                  </div>
                  <div
                    class="mt-4 p-2 indent-8 text-base font-medium text-[#302520] h-[322px] overflow-x-auto"
                  >
                    <slot>
                      <!-- <textarea v-model="states.geo.soilProperties"></textarea> -->
                      <span v-html="states.geo.soilProperties"></span>
                    </slot>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div
                class="mx-auto rounded overflow-hidden w-full rounded-[16px] bg-white py-4 pb-2"
                style=""
              >
                <div class="">
                  <div
                    class="font-bold text-[12px] md:text-base text-[#302520] ml-1 md:ml-[12px]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                    <img
                      alt=""
                      class="inline layers-soil lg:mt-0 bg-[#01893D] mr-1"
                      style="width: 20px; height: 20px"
                    />
                    ดินชั้นบน
                  </div>
                  <!-- <p class="text-gray-700 text-base text-center text-[40px] my-6 md:text-[54px] xl:text-[64px]">
                  test
                </p> -->
                  <p
                    class="mt-4 p-2 text-base font-medium  text-[#302520]"
                  >
                    {{ states.geo ? states.geo.topsoilDetail : "-" }}
                  </p>
                  <p
                    class="p-2 text-base font-medium text-[#302520]"
                  >
                    ปฏิกิริยาดินเป็น{{
                      phValueText(states.geo.topsoilValueMin)
                    }}ถึงเป็น{{ phValueText(states.geo.topsoilValueMax) }}
                  </p>
                  <div class="w-full mt-0 md:mt-4">
                    <div
                      class="w-full flex text-md flex-col text-center justify-center"
                    >
                      <div
                        class="w-full text-[10px] md:text-base font-bold flex justify-between text-center items-center px-2 relative"
                      >
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 0 &&
                            states.geo.topsoilValueAgv < 0.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 0.5 &&
                            states.geo.topsoilValueAgv < 1
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 1 &&
                            states.geo.topsoilValueAgv < 1.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 1.5 &&
                            states.geo.topsoilValueAgv < 2
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 2 &&
                            states.geo.topsoilValueAgv < 2.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 2.5 &&
                            states.geo.topsoilValueAgv < 3
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 3 &&
                            states.geo.topsoilValueAgv < 3.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 3.5 &&
                            states.geo.topsoilValueAgv < 4
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 4 &&
                            states.geo.topsoilValueAgv < 4.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 4.5 &&
                            states.geo.topsoilValueAgv < 5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 5 &&
                            states.geo.topsoilValueAgv < 5.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 5.5 &&
                            states.geo.topsoilValueAgv < 6
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 6 &&
                            states.geo.topsoilValueAgv < 6.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 6.5 &&
                            states.geo.topsoilValueAgv < 7
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 7 &&
                            states.geo.topsoilValueAgv < 7.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 7.5 &&
                            states.geo.topsoilValueAgv < 8
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 8 &&
                            states.geo.topsoilValueAgv < 8.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 8.5 &&
                            states.geo.topsoilValueAgv < 9
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 9 &&
                            states.geo.topsoilValueAgv < 9.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 9.5 &&
                            states.geo.topsoilValueAgv < 10
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 10 &&
                            states.geo.topsoilValueAgv < 10.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 10.5 &&
                            states.geo.topsoilValueAgv < 11
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 11 &&
                            states.geo.topsoilValueAgv < 11.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 11.5 &&
                            states.geo.topsoilValueAgv < 12
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 12 &&
                            states.geo.topsoilValueAgv < 12.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 12.5 &&
                            states.geo.topsoilValueAgv < 13
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 13 &&
                            states.geo.topsoilValueAgv < 13.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 13.5 &&
                            states.geo.topsoilValueAgv < 14
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.topsoilValueAgv >= 14 &&
                            states.geo.topsoilValueAgv < 15
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.topsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div
                        class="w-full text-[10px] md:text-base font-bold flex justify-between text-center items-center px-2 -mt-4"
                      >
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 0 &&
                            Math.floor(states.geo.topsoilValueMax) >= 0
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          0
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 1 &&
                            Math.floor(states.geo.topsoilValueMax) >= 1
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          1
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 2 &&
                            Math.floor(states.geo.topsoilValueMax) >= 2
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          2
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 3 &&
                            Math.floor(states.geo.topsoilValueMax) >= 3
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          3
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 4 &&
                            Math.floor(states.geo.topsoilValueMax) >= 4
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          4
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 5 &&
                            Math.floor(states.geo.topsoilValueMax) >= 5
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          5
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 6 &&
                            Math.floor(states.geo.topsoilValueMax) >= 6
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          6
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 7 &&
                            Math.floor(states.geo.topsoilValueMax) >= 7
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          7
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 8 &&
                            Math.floor(states.geo.topsoilValueMax) >= 8
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          8
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 9 &&
                            Math.floor(states.geo.topsoilValueMax) >= 9
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          9
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 10 &&
                            Math.floor(states.geo.topsoilValueMax) >= 10
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          10
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 11 &&
                            Math.floor(states.geo.topsoilValueMax) >= 11
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          11
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 12 &&
                            Math.floor(states.geo.topsoilValueMax) >= 12
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          12
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 13 &&
                            Math.floor(states.geo.topsoilValueMax) >= 13
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          13
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 14 &&
                            Math.floor(states.geo.topsoilValueMax) >= 14
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          14
                        </span>
                      </div>
                      <div
                        class="w-full flex justify-between text-center items-center px-2"
                      >
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 0 &&
                            Math.floor(states.geo.topsoilValueMax) >= 0
                              ? 'bg-[#EF1818] text-white'
                              : 'bg-[#EF1818] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 1 &&
                            Math.floor(states.geo.topsoilValueMax) >= 1
                              ? 'bg-[#F4670D] text-white'
                              : 'bg-[#F4670D] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 2 &&
                            Math.floor(states.geo.topsoilValueMax) >= 2
                              ? 'bg-[#FAC600] text-white'
                              : 'bg-[#FAC600] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 3 &&
                            Math.floor(states.geo.topsoilValueMax) >= 3
                              ? 'bg-[#F6EF00] text-white'
                              : 'bg-[#F6EF00] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 4 &&
                            Math.floor(states.geo.topsoilValueMax) >= 4
                              ? 'bg-[#B4D419] text-white'
                              : 'bg-[#B4D419] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 5 &&
                            Math.floor(states.geo.topsoilValueMax) >= 5
                              ? 'bg-[#82C537] text-white'
                              : 'bg-[#82C537] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 6 &&
                            Math.floor(states.geo.topsoilValueMax) >= 6
                              ? 'bg-[#48B943] text-white'
                              : 'bg-[#48B943] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 7 &&
                            Math.floor(states.geo.topsoilValueMax) >= 7
                              ? 'bg-[#2BA943] text-white'
                              : 'bg-[#2BA943] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 8 &&
                            Math.floor(states.geo.topsoilValueMax) >= 8
                              ? 'bg-[#11B567] text-white'
                              : 'bg-[#11B567] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 9 &&
                            Math.floor(states.geo.topsoilValueMax) >= 9
                              ? 'bg-[#00B8B6] text-white'
                              : 'bg-[#00B8B6] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 10 &&
                            Math.floor(states.geo.topsoilValueMax) >= 10
                              ? 'bg-[#418FCF] text-white'
                              : 'bg-[#418FCF] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 11 &&
                            Math.floor(states.geo.topsoilValueMax) >= 11
                              ? 'bg-[#3652A6] text-white'
                              : 'bg-[#3652A6] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 12 &&
                            Math.floor(states.geo.topsoilValueMax) >= 12
                              ? 'bg-[#5A4EA2] text-white'
                              : 'bg-[#5A4EA2] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 13 &&
                            Math.floor(states.geo.topsoilValueMax) >= 13
                              ? 'bg-[#63429F] text-white'
                              : 'bg-[#63429F] text-[#827C7B] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.topsoilValueMin) <= 14 &&
                            Math.floor(states.geo.topsoilValueMax) >= 14
                              ? 'bg-[#462985] text-white'
                              : 'bg-[#462985] text-[#827C7B] opacity-20'
                          "
                        >
                        </span>
                      </div>

                      <p
                        class="pt-2 md:pt-6 text-[12px] md:text-base text-[#302520] font-bold"
                      >
                        pH
                        {{ states.geo ? states.geo.topsoilValueMin : "" }}-{{
                          states.geo ? states.geo.topsoilValueMax : ""
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="mx-auto overflow-hidden w-full rounded-[16px] bg-white py-4 pb-2"
                style=""
              >
                <div class="">
                  <div
                    class="font-bold text-[12px] md:text-base text-[#302520] ml-1 md:ml-[12px]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                    <img
                      alt=""
                      class="inline layers-soil lg:mt-0 bg-[#01893D] mr-1"
                      style="width: 20px; height: 20px"
                    />
                    ดินชั้นล่าง
                  </div>
                  <!-- <p class="text-gray-700 text-base text-center text-[40px] my-6 md:text-[54px] xl:text-[64px]">
                  test
                </p> -->
                  <p
                    class="mt-4 p-2 text-base text-[#302520] font-medium"
                  >
                    {{ states.geo ? states.geo.subsoilDetail : "-" }}
                  </p>
                  <p
                    class="p-2 text-base text-[#302520] font-medium"
                  >
                    ปฏิกิริยาดินเป็น{{
                      phValueText(states.geo.subsoilValueMin)
                    }}ถึงเป็น{{ phValueText(states.geo.subsoilValueMax) }}
                  </p>
                  <div class="w-full mt-0 md:mt-4">
                    <div
                      class="w-full flex text-md flex-col text-center justify-center"
                    >
                      <div
                        class="w-full text-[10px] md:text-base font-bold flex justify-between text-center items-center px-2 relative"
                      >
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 0 &&
                            states.geo.subsoilValueAgv < 0.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 0.5 &&
                            states.geo.subsoilValueAgv < 1
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 1 &&
                            states.geo.subsoilValueAgv < 1.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 1.5 &&
                            states.geo.subsoilValueAgv < 2
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 2 &&
                            states.geo.subsoilValueAgv < 2.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 2.5 &&
                            states.geo.subsoilValueAgv < 3
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 3 &&
                            states.geo.subsoilValueAgv < 3.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 3.5 &&
                            states.geo.subsoilValueAgv < 4
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 4 &&
                            states.geo.subsoilValueAgv < 4.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 4.5 &&
                            states.geo.subsoilValueAgv < 5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 5 &&
                            states.geo.subsoilValueAgv < 5.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 5.5 &&
                            states.geo.subsoilValueAgv < 6
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 6 &&
                            states.geo.subsoilValueAgv < 6.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 6.5 &&
                            states.geo.subsoilValueAgv < 7
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 7 &&
                            states.geo.subsoilValueAgv < 7.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 7.5 &&
                            states.geo.subsoilValueAgv < 8
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 8 &&
                            states.geo.subsoilValueAgv < 8.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 8.5 &&
                            states.geo.subsoilValueAgv < 9
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 9 &&
                            states.geo.subsoilValueAgv < 9.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 9.5 &&
                            states.geo.subsoilValueAgv < 10
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 10 &&
                            states.geo.subsoilValueAgv < 10.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 10.5 &&
                            states.geo.subsoilValueAgv < 11
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 11 &&
                            states.geo.subsoilValueAgv < 11.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 11.5 &&
                            states.geo.subsoilValueAgv < 12
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 12 &&
                            states.geo.subsoilValueAgv < 12.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 12.5 &&
                            states.geo.subsoilValueAgv < 13
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 13 &&
                            states.geo.subsoilValueAgv < 13.5
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 13.5 &&
                            states.geo.subsoilValueAgv < 14
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo.subsoilValueAgv >= 14 &&
                            states.geo.subsoilValueAgv < 15
                              ? ''
                              : 'opacity-0'
                          "
                        >
                          <p
                            class="absolute mt-0 md:-mt-2 top-0 text-[#01893D]"
                          >
                            {{ states.geo.subsoilValueAgv }}
                          </p>
                          <img
                            class="mt-0"
                            src="@/assets/img/icons/triangle-down.svg"
                            alt=""
                          />
                        </span>
                      </div>
                      <div
                        class="w-full text-[10px] md:text-base font-bold flex justify-between text-center items-center px-2 -mt-4"
                      >
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 0 &&
                            Math.floor(states.geo.subsoilValueMax) >= 0
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          0
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 1 &&
                            Math.floor(states.geo.subsoilValueMax) >= 1
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          1
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 2 &&
                            Math.floor(states.geo.subsoilValueMax) >= 2
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          2
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 3 &&
                            Math.floor(states.geo.subsoilValueMax) >= 3
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          3
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 4 &&
                            Math.floor(states.geo.subsoilValueMax) >= 4
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          4
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 5 &&
                            Math.floor(states.geo.subsoilValueMax) >= 5
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          5
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 6 &&
                            Math.floor(states.geo.subsoilValueMax) >= 6
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          6
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 7 &&
                            Math.floor(states.geo.subsoilValueMax) >= 7
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          7
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 8 &&
                            Math.floor(states.geo.subsoilValueMax) >= 8
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          8
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 9 &&
                            Math.floor(states.geo.subsoilValueMax) >= 9
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          9
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 10 &&
                            Math.floor(states.geo.subsoilValueMax) >= 10
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          10
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 11 &&
                            Math.floor(states.geo.subsoilValueMax) >= 11
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          11
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 12 &&
                            Math.floor(states.geo.subsoilValueMax) >= 12
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          12
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 13 &&
                            Math.floor(states.geo.subsoilValueMax) >= 13
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          13
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 14 &&
                            Math.floor(states.geo.subsoilValueMax) >= 14
                              ? ''
                              : 'opacity-20'
                          "
                        >
                          14
                        </span>
                      </div>
                      <div
                        class="w-full flex justify-between text-center items-center px-2"
                      >
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 0 &&
                            Math.floor(states.geo.subsoilValueMax) >= 0
                              ? 'bg-[#EF1818] text-white'
                              : 'bg-[#EF1818] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 1 &&
                            Math.floor(states.geo.subsoilValueMax) >= 1
                              ? 'bg-[#F4670D] text-white'
                              : 'bg-[#F4670D] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 2 &&
                            Math.floor(states.geo.subsoilValueMax) >= 2
                              ? 'bg-[#FAC600] text-white'
                              : 'bg-[#FAC600] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 3 &&
                            Math.floor(states.geo.subsoilValueMax) >= 3
                              ? 'bg-[#F6EF00] text-white'
                              : 'bg-[#F6EF00] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 4 &&
                            Math.floor(states.geo.subsoilValueMax) >= 4
                              ? 'bg-[#B4D419] text-white'
                              : 'bg-[#B4D419] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 5 &&
                            Math.floor(states.geo.subsoilValueMax) >= 5
                              ? 'bg-[#82C537] text-white'
                              : 'bg-[#82C537] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 6 &&
                            Math.floor(states.geo.subsoilValueMax) >= 6
                              ? 'bg-[#48B943] text-white'
                              : 'bg-[#48B943] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 7 &&
                            Math.floor(states.geo.subsoilValueMax) >= 7
                              ? 'bg-[#2BA943] text-white'
                              : 'bg-[#2BA943] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 8 &&
                            Math.floor(states.geo.subsoilValueMax) >= 8
                              ? 'bg-[#11B567] text-white'
                              : 'bg-[#11B567] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 9 &&
                            Math.floor(states.geo.subsoilValueMax) >= 9
                              ? 'bg-[#00B8B6] text-white'
                              : 'bg-[#00B8B6] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 10 &&
                            Math.floor(states.geo.subsoilValueMax) >= 10
                              ? 'bg-[#418FCF] text-white'
                              : 'bg-[#418FCF] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 11 &&
                            Math.floor(states.geo.subsoilValueMax) >= 11
                              ? 'bg-[#3652A6] text-white'
                              : 'bg-[#3652A6] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 12 &&
                            Math.floor(states.geo.subsoilValueMax) >= 12
                              ? 'bg-[#5A4EA2] text-white'
                              : 'bg-[#5A4EA2] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 13 &&
                            Math.floor(states.geo.subsoilValueMax) >= 13
                              ? 'bg-[#63429F] text-white'
                              : 'bg-[#63429F] text-[#827C7B] opacity-20'
                          "
                        >
                        </span>
                        <span
                          class="h-[32px] w-full cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            Math.floor(states.geo.subsoilValueMin) <= 14 &&
                            Math.floor(states.geo.subsoilValueMax) >= 14
                              ? 'bg-[#462985] text-white'
                              : 'bg-[#462985] text-[#827C7B] opacity-20'
                          "
                        >
                        </span>
                      </div>

                      <p
                        class="pt-2 md:pt-6 text-[12px] md:text-base text-[#302520] font-bold"
                      >
                        pH {{ states.geo ? states.geo.subsoilValueMin : "" }} -
                        {{ states.geo ? states.geo.subsoilValueMax : "" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div
                class="mx-auto overflow-hidden w-full rounded-[16px] bg-white py-4"
                style=""
              >
                <div class="">
                  <div
                    class="font-bold text-[12px] md:text-base text-[#302520] ml-1 md:ml-[12px]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                    <img
                      alt=""
                      class="inline potted_plant lg:mt-0 bg-[#01893D] mr-1"
                      style="width: 20px; height: 20px"
                    />
                    ความอุดมสมบูรณ์
                  </div>
                  <!-- <p class="text-gray-700 text-base text-center text-[40px] my-6 md:text-[54px] xl:text-[64px]">
                      test
                    </p> -->
                  <div class="w-full pt-6">
                    <div
                      class="w-full flex text-md flex-col text-center justify-center"
                    >
                      <div
                        class="w-full flex justify-between text-center items-center"
                      >
                        <span
                          class="h-[36px] text-sm font-bold md:text-base w-full mx-2 rounded-[8px] cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo && states.geo.soilFertility === 'low'
                              ? 'bg-[#E04C4F] text-white'
                              : 'bg-[#F2F2F0] text-[#827C7B]'
                          "
                        >
                          <p>ต่ำ</p>
                        </span>
                        <span
                          class="h-[36px] text-sm font-bold md:text-base w-full mx-2 rounded-[8px] cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo && states.geo.soilFertility === 'medium'
                              ? 'bg-[#FAAF3F] text-white'
                              : 'bg-[#F2F2F0] text-[#827C7B]'
                          "
                        >
                          <p>กลาง</p>
                        </span>
                        <span
                          class="h-[36px] text-sm font-bold md:text-base w-full mx-2 rounded-[8px] cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo && states.geo.soilFertility === 'high'
                              ? 'bg-[#9BD226] text-white'
                              : 'bg-[#F2F2F0] text-[#827C7B]'
                          "
                        >
                          <p>สูง</p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="mx-auto overflow-hidden w-full rounded-[16px] bg-white py-4"
                style=""
              >
                <div class="">
                  <div
                    class="font-bold text-[12px] md:text-base text-[#302520] ml-1 md:ml-[12px]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                    <img
                      alt=""
                      class="inline water lg:mt-0 bg-[#01893D] mr-1"
                      style="width: 20px; height: 20px"
                    />
                    การระบายน้ำ
                  </div>
                  <!-- <p class="text-gray-700 text-base text-center text-[40px] my-6 md:text-[54px] xl:text-[64px]">
                      test
                    </p> -->
                  <div class="w-full pt-6">
                    <div
                      class="w-full flex text-md flex-col text-center justify-center"
                    >
                      <div
                        class="w-full flex justify-between text-center items-center"
                      >
                        <span
                          class="h-[36px] text-sm font-bold md:text-base w-full mx-2 rounded-[8px] cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo && states.geo.drainage === 'low'
                              ? 'bg-[#E04C4F] text-white'
                              : 'bg-[#F2F2F0] text-[#827C7B]'
                          "
                        >
                          <p>ต่ำ</p>
                        </span>
                        <span
                          class="h-[36px] text-sm font-bold md:text-base w-full mx-2 rounded-[8px] cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo && states.geo.drainage === 'medium'
                              ? 'bg-[#FAAF3F] text-white'
                              : 'bg-[#F2F2F0] text-[#827C7B]'
                          "
                        >
                          <p>กลาง</p>
                        </span>
                        <span
                          class="h-[36px] text-sm font-bold md:text-base w-full mx-2 rounded-[8px] cursor-pointer transition-all flex justify-center items-center"
                          :class="
                            states.geo && states.geo.drainage === 'high'
                              ? 'bg-[#9BD226] text-white'
                              : 'bg-[#F2F2F0] text-[#827C7B]'
                          "
                        >
                          <p>ดี</p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="mx-auto overflow-hidden w-full rounded-[16px] bg-white py-4 h-[135px]"
                style=""
              >
                <div class="">
                  <div
                    class="font-bold text-[12px] md:text-base text-[#302520] ml-1 md:ml-[12px]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                    <img
                      alt=""
                      class="inline warning lg:mt-0 bg-[#01893D] mr-1"
                      style="width: 20px; height: 20px"
                    />
                    ข้อจํากัดของดิน
                  </div>
                  <!-- <p class="text-gray-700 text-base text-center text-[40px] my-6 md:text-[54px] xl:text-[64px]">
                  test
                </p> -->
                  <div class="w-full">
                    <div
                      class="w-full flex text-md flex-col px-2 justify-center"
                    >
                      <p
                        class="pt-4 font-medium text-base text-[#302520] "
                      >
                        {{ states.geo ? states.geo.soilRestrictions : "" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="mx-auto overflow-hidden w-full rounded-[16px] bg-white py-4"
                style=""
              >
                <div class="">
                  <div
                    class="font-bold text-[12px] md:text-base text-[#302520] ml-1 md:ml-[12px]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt=""> -->
                    <img
                      alt=""
                      class="inline mountain lg:mt-0 bg-[#01893D] mr-1"
                      style="width: 20px; height: 20px"
                    />
                    ความลาดชัน
                  </div>
                  <div class="my-auto">
                    <p
                      class="text-gray-700 text-base text-center text-[40px] mt-6 mb-3 md:text-[54px] xl:text-[64px]"
                    >
                      1-{{ states.geo ? states.geo.slope : "-" }} %
                    </p>
                    <div class="text-center">
                      <div>
                        <p class="font-medium text-base inline mr-1">
                          {{ states.geo ? states.geo.slope : "-" }} เมตร
                        </p>
                        <img class="mx-auto inline" :src="slope" alt="" />
                      </div>
                      <p class="font-medium text-base mt-1">100 เมตร</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div
                class="mx-auto overflow-hidden w-full rounded-[16px] bg-white py-4"
                style=""
              >
                <div class="">
                  <div
                    class="font-bold text-[12px] md:text-base text-[#302520] ml-1 md:ml-[12px] mb-6"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt=""> -->
                    <img
                      alt=""
                      class="inline mountain lg:mt-0 bg-[#01893D] mr-1"
                      style="width: 20px; height: 20px"
                    />
                    ลักษณะของพื้นที่
                  </div>
                  <!-- <div class="grid md:grid-cols-2 gap-4"> -->
                  <div
                    :class="[
                      'font-medium text-base text-[#01893D] mb-4 ml-1 md:ml-[12px]',
                      states.geo && states.geo.spaceNaturePlain === 'true'
                        ? 'text-[#01893D]'
                        : 'text-[#827C7B] pl-3',
                    ]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt=""> -->
                    <img
                      v-if="
                        states.geo && states.geo.spaceNaturePlain === 'true'
                      "
                      alt=""
                      class="inline triangle -mt-1 lg:mt-0 bg-[#01893D] w-2.5 h-2.5"
                    />
                    <span>ที่ราบเรียบ</span>
                  </div>
                  <div
                    :class="[
                      'font-medium text-base text-[#01893D] mb-4 ml-1 md:ml-[12px]',
                      states.geo && states.geo.spaceNaturePlateau === 'true'
                        ? 'text-[#01893D]'
                        : 'text-[#827C7B] pl-3',
                    ]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt=""> -->
                    <img
                      v-if="
                        states.geo && states.geo.spaceNaturePlateau === 'true'
                      "
                      alt=""
                      class="inline triangle -mt-1 lg:mt-0 bg-[#01893D] w-2.5 h-2.5"
                    />
                    <span>ที่ราบสูง</span>
                  </div>
                  <div
                    :class="[
                      'font-medium text-base text-[#01893D] mb-4 ml-1 md:ml-[12px]',
                      states.geo && states.geo.spaceNatureHill === 'true'
                        ? 'text-[#01893D]'
                        : 'text-[#827C7B] pl-3',
                    ]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt=""> -->
                    <img
                      alt=""
                      v-if="states.geo && states.geo.spaceNatureHill === 'true'"
                      class="inline triangle -mt-1 lg:mt-0 bg-[#01893D] w-2.5 h-2.5"
                    />
                    <span>เนินเขา</span>
                  </div>
                  <div
                    :class="[
                      'font-medium text-base text-[#01893D] mb-4 ml-1 md:ml-[12px]',
                      states.geo && states.geo.spaceNatureMountain === 'true'
                        ? 'text-[#01893D]'
                        : 'text-[#827C7B] pl-3',
                    ]"
                  >
                    <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt=""> -->
                    <img
                      v-if="
                        states.geo && states.geo.spaceNatureMountain === 'true'
                      "
                      alt=""
                      class="inline triangle -mt-1 lg:mt-0 bg-[#01893D] w-2.5 h-2.5"
                    />
                    <span>ภูเขา</span>
                  </div>
                  <!-- </div> -->
                </div>
                <div
                  class="w-full flex text-md flex-col text-center justify-center"
                >
                  <p class="text-base text-[#302520] font-bold">
                    {{ states.geo ? states.geo.spaceNatureDetail : "" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- <div class="grid grid-cols-1 gap-4"> -->

            <div
              class="md:col-span-2 xl:col-span-1 mx-auto overflow-hidden w-full rounded-[16px] bg-white py-4"
              style=""
            >
              <div class="">
                <div
                  class="font-bold text-[12px] md:text-base text-[#302520] ml-1 md:ml-[12px] mb-6"
                >
                  <!-- <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="'@/assets/img/icons/sensor/'+sensor.icon+'.png'" alt="">   -->
                  <img
                    alt=""
                    class="inline water lg:mt-0 bg-[#01893D] mr-1"
                    style="width: 20px; height: 20px"
                  />
                  แหล่งน้ำใกล้เคียง
                </div>
                <!-- <p class="text-gray-700 text-base text-center text-[40px] my-6 md:text-[54px] xl:text-[64px]">
                  test
                </p> -->
                <div
                  :class="[
                    states.geo && states.geo.nearbyNaturalWater === 0
                      ? 'text-[#827C7B]'
                      : '',
                    'font-medium text-sm md:text-base mb-4 ml-1 md:ml-[12px]',
                  ]"
                >
                  แหล่งน้ำธรรมชาติ :
                  <span
                    :class="
                      states.geo && states.geo.nearbyNaturalWater > 0
                        ? 'text-[#01893D]'
                        : ''
                    "
                  >
                    {{
                      states.geo ? states.geo.nearbyNaturalWater : ""
                    }}
                    แหล่ง</span
                  >
                </div>
                <div
                  :class="[
                    states.geo && states.geo.nearbyInfarmWater === 0
                      ? 'text-[#827C7B]'
                      : '',
                    'font-medium text-sm md:text-base  mb-4 ml-1 md:ml-[12px]',
                  ]"
                >
                  แหล่งน้ำในไร่นานอกเขตชลประทาน :
                  <span
                    :class="
                      states.geo && states.geo.nearbyInfarmWater > 0
                        ? 'text-[#01893D]'
                        : ''
                    "
                    >{{
                      states.geo ? states.geo.nearbyInfarmWater : ""
                    }}
                    แหล่ง</span
                  >
                </div>
                <div
                  :class="[
                    states.geo && states.geo.nearbySmallWater === 0
                      ? 'text-[#827C7B]'
                      : '',
                    'font-medium text-sm md:text-base mb-4 ml-1 md:ml-[12px]',
                  ]"
                >
                  แหล่งน้ำขนาดเล็ก :
                  <span
                    :class="
                      states.geo && states.geo.nearbySmallWater > 0
                        ? 'text-[#01893D]'
                        : ''
                    "
                    >{{
                      states.geo ? states.geo.nearbySmallWater : ""
                    }}
                    แหล่ง</span
                  >
                </div>
                <div
                  :class="[
                    states.geo && states.geo.nearbyGroundWater === 0
                      ? 'text-[#827C7B]'
                      : '',
                    'font-medium text-sm md:text-base mb-4 ml-1 md:ml-[12px]',
                  ]"
                >
                  บ่อน้ำบาดาล :
                  <span
                    :class="
                      states.geo && states.geo.nearbyGroundWater > 0
                        ? 'text-[#01893D]'
                        : ''
                    "
                    >{{
                      states.geo ? states.geo.nearbyGroundWater : ""
                    }}
                    แหล่ง</span
                  >
                </div>
              </div>
            </div>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>

<style land="scss">
@import "@/assets/styles/custom-icons.css";
</style>

<style>
.rain {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 1;
  background-image: url("https://cdn.discordapp.com/attachments/744182992037216260/990016273008177242/rain1.png"),
    url("https://cdn.discordapp.com/attachments/744182992037216260/990016273217900584/rain2.png"),
    url("https://cdn.discordapp.com/attachments/744182992037216260/990016273456988240/rain3.png");

  animation: rain 1.5s linear infinite;
}

@keyframes rain {
  0% {
    background-position: 0px 0px, 0px 0px, 0px 0px;
  }

  100% {
    background-position: 500px 1000px, 400px 400px, 300px 300px;
  }
}

.cloud {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 0;
  background-image: url("https://s.cdpn.io/15514/clouds_2.png"),
    url("https://s.cdpn.io/15514/clouds_1.png"),
    url("https://s.cdpn.io/15514/clouds_3.png");

  animation: cloud 60s linear infinite;
}

@keyframes cloud {
  0% {
    background-position: 0px 0px, 0px 0px, 0px 0px;
  }

  100% {
    background-position: 500px 0, 400px 0, 300px 0;
  }
}

.icon-chart {
  background-color: rgb(255, 255, 255);
  mask: url("@/assets/img/icons/chart.png") no-repeat right / contain;
  height: 15px;
  margin-right: 10px;
}

.btn-custom-see-chart:hover .icon-chart {
  background-color: #01893D;
}

.btn-custom-add:hover img {
  background-color: #01893D;
}

.header-img {
  background-image: url("@/assets/img/img_landingpage/bg-device.png");
  height: 90px;
}
</style>
