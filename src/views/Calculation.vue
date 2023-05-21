
<script setup>
// import { click } from "dom7";
import { ref, reactive, onMounted, computed, onBeforeMount } from "vue";
import NavbarMain from "../layouts/NavbarMain.vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { MailOpenIcon } from "@heroicons/vue/outline";
import axios from "axios";

const router = useRouter();
const mainStore = useMainStore();

const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;
const CustomerFarmLat = computed(() => mainStore.CustomerFarmLat);
const CustomerFarmLon = computed(() => mainStore.CustomerFarmLon);

let active_btn = ref(1);

let show_data = ref(true);

const data_rating = reactive([
  {
    id: 1,
    title: "เหมาะสมมาก",
    status: "verygood",
    class_icon: "very-smile bg-[#9BD226]",
    arrow: "bg-[#9BD226]",
    rating: 5,
    percent_max: 100,
    percent_min: 70
  },
  {
    id: 2,
    title: "เหมาะสม",
    status: "good",
    class_icon: "normal-smile bg-[#C7CE3B]",
    arrow: "bg-[#C7CE3B]",
    rating: 4,
    percent_max: 69,
    percent_min: 41
  },
  {
    id: 3,
    title: "พอใช้",
    status: "fair",
    class_icon: "notbad-smile bg-[#F2CA50]",
    arrow: "bg-[#F2CA50]",
    rating: 3,
    percent_max: 40,
    percent_min: 1
  },
]);
let state = reactive({
  status: "",
  cat: "1",
  boards: [], //2309SWCSTXJ47BC
  serial: "",
  geo: [],
  breed: [],
  breed_cat: [],

  airTemperature: 0,
  soilTemperature: 0,
  soilMoisture: 0,
  soilPh: 0,
  soilEc: 0,
  nitrogen: 0,
  phosphorus: 0,
  potassium: 0,
  amountOfWater: 0,
  lightIntensity: 0,

  debug: false,

  percent_max: 0,
  percent_min: 0,
  percent_color: "",
  total_verygood: 0,
  total_good: 0,
  total_fair: 0,
  categorise: []

});


let count_farm = ref(0);


onMounted(() => {

   ApiCore.get("v2/projects/?limit=all")
    .then((response) => {
      count_farm.value = response.data.data.length;
      let element = document.querySelector('#no_data') ;
      element.classList.remove("hidden");
    })
});
const router_path = (status) => {
  router.push("/calculation-result?status=" + status);
};
const boards_select = computed(() => {
  //console.log("lat",CustomerFarmLat.value)
  //console.log("lon",CustomerFarmLon.value)
if (CustomerFarmLat.value!="" && CustomerFarmLon.value!="") {
  if (CustomerFarmLat.value && CustomerFarmLon.value) { //มี lat logn
    ApiCore.get("v2/projects/" + mainStore.CustomerFarmId + "/boards").then(
      (response) => {
        if (typeof response.data.data[0] !== 'undefined') { //กรณี มีบอร์ด
          state.serial = response.data.data[0].serial;
          set_have_boards()
        } else { //ไม่มีบอร์ด
          set_not_boards()
        }
      }
    );
  } else { //ไมมี lat,long
    state.airTemperature = mainStore.CustomerTemperature
    ApiCore.get("v2/projects/" + mainStore.CustomerFarmId + "/boards").then(
      (response) => {
        if (typeof response.data.data[0] !== 'undefined') { //กรณี มีบอร์ด
          state.serial = response.data.data[0].serial;
          set_have_boards()
        } else { //ไม่มีบอร์ด
          set_not_boards()
        }
      }
    );
  }
}

})



const get_breed = async () => {

  state.total_fair=0
  state.total_good=0
  state.total_verygood=0
  await ApiMain.get(`breed/1/ranking?airTemperature=${state.airTemperature}&soilTemperature=${state.soilTemperature}&soilMoisture=${state.soilMoisture}&soilPh=${state.soilPh}&soilEc=${state.soilEc}&nitrogen=${state.nitrogen}&phosphorus=${state.phosphorus}&potassium=${state.potassium}&amountOfWater=${state.amountOfWater}&lightIntensity=${state.lightIntensity}`
  ).then((res) => {
    state.breed = res.data.data;


    let obj = res.data.data;
    obj.forEach(item => {
      if (item.percent >= 1 && item.percent <= 40) {
        state.total_fair += 1;
      }
      else if (item.percent >= 41 && item.percent <= 69) {
        state.total_good += 1;
      }
      else if (item.percent >= 70 && item.percent <= 100) {
        state.total_verygood += 1;
      }
    });

  });
  await ApiMain.get(`breed/2/ranking?airTemperature=${state.airTemperature}&soilTemperature=${state.soilTemperature}&soilMoisture=${state.soilMoisture}&soilPh=${state.soilPh}&soilEc=${state.soilEc}&nitrogen=${state.nitrogen}&phosphorus=${state.phosphorus}&potassium=${state.potassium}&amountOfWater=${state.amountOfWater}&lightIntensity=${state.lightIntensity}`
  ).then((res) => {
    state.breed = res.data.data;


    let obj = res.data.data;
    obj.forEach(item => {
      if (item.percent >= 1 && item.percent <= 40) {
        state.total_fair += 1;
      }
      else if (item.percent >= 41 && item.percent <= 69) {
        state.total_good += 1;
      }
      else if (item.percent >= 70 && item.percent <= 100) {
        state.total_verygood += 1;
      }
    });
    console.log(state.total_fair);
    console.log(state.total_good);
    console.log(state.total_verygood);
  });
  await ApiMain.get(`breed/3/ranking?airTemperature=${state.airTemperature}&soilTemperature=${state.soilTemperature}&soilMoisture=${state.soilMoisture}&soilPh=${state.soilPh}&soilEc=${state.soilEc}&nitrogen=${state.nitrogen}&phosphorus=${state.phosphorus}&potassium=${state.potassium}&amountOfWater=${state.amountOfWater}&lightIntensity=${state.lightIntensity}`
  ).then((res) => {
    state.breed = res.data.data;


    let obj = res.data.data;
    obj.forEach(item => {
      if (item.percent >= 1 && item.percent <= 40) {
        state.total_fair += 1;
      }
      else if (item.percent >= 41 && item.percent <= 69) {
        state.total_good += 1;
      }
      else if (item.percent >= 70 && item.percent <= 100) {
        state.total_verygood += 1;
      }
    });
    console.log(state.total_fair);
    console.log(state.total_good);
    console.log(state.total_verygood);
  });
}

const set_have_boards = () => {
  state.airTemperature = mainStore.CustomerTemperature
  state.soilTemperature = 0
  state.soilMoisture = 0
  state.soilPh = 0
  state.soilEc = 0
  state.nitrogen = 0
  state.phosphorus = 0
  state.potassium = 0
  state.amountOfWater = 0
  state.lightIntensity = 0
  ApiCore.get("/v2/boards/" + state.serial + "/sensor").then((response) => {
    state.boards = response.data.data.sensors;

    console.log(state.boards);
    if (state.boards.length > 0) {
      Object.entries(state.boards).forEach(entry => {

        const [key, value] = entry;
        if (value.name.en == "Air temperature" && value.status == "active") {
          state.airTemperature = value.result_sensor
        }
        if (value.name.en == "soil temperature" && value.status == "active") {
          state.soilTemperature = value.result_sensor
        }
        if (value.name.en == "Soil Moisture" && value.status == "active") {
          state.soilMoisture = value.result_sensor
        }
        if (value.name.en == "Soil pH" && value.status == "active") {
          state.soilPh = value.result_sensor
        }
        if (value.name.en == "Electrical Conductivity Soil" && value.status == "active") {
          state.soilEc = value.result_sensor
        }
        if (value.name.en == "Nitrogen" && value.status == "active") {
          state.nitrogen = value.result_sensor
        }
        if (value.name.en == "phosphorus" && value.status == "active") {
          state.phosphorus = value.result_sensor
        }
        if (value.name.en == "potassium" && value.status == "active") {
          state.potassium = value.result_sensor
        }
        if (value.name.en == "Rainfall" && value.status == "active") {
          state.amountOfWater = value.result_sensor
        }
        if (value.name.en == "Light Intensity" && value.status == "active") {
          state.lightIntensity = value.result_sensor
        }
      });
    }
    get_breed()
  });
}

const set_not_boards = () => {
  state.serial = "Not Board"
  state.airTemperature = mainStore.CustomerTemperature
  state.soilTemperature = 0
  state.soilMoisture = 0
  state.soilPh = 0
  state.soilEc = 0
  state.nitrogen = 0
  state.phosphorus = 0
  state.potassium = 0
  state.amountOfWater = 0
  state.lightIntensity = 0

  if (CustomerFarmLat.value && CustomerFarmLon.value) {
    ApiMain.get("geo/by-latlon?lat=" + CustomerFarmLat.value + "&lon=" + CustomerFarmLon.value
    ).then((res) => {
      state.geo = res.data;
      if (res.data.topsoilValueAgv > 0) {
        state.soilPh = res.data.topsoilValueAgv
      }
      console.log("soilPh=", state.soilPh);
    })
  } else {
    state.soilPh = 0
    if (state.airTemperature == "") {
      state.airTemperature = 0
    }
  }
  get_breed()
}

const setActive = (status, cat) => {
  state.cat = cat
  get_breed()
  if (status == 1) {
    active_btn.value = 1;
  } else if (status == 2) {
    active_btn.value = 2;
  } else if (status == 3) {
    active_btn.value = 3;
  }
};

const viewDetail = (id) => {
  let path = "/calulation-detail?result=" + id;
  router.push(path);
};
</script>


<template>
  <NavbarMain>
    <!-- Calculation Page1 -->
    <div class="m-4 mt-16 md:mt-8 ">
      <div class="hidden">{{ boards_select }}</div>
      <div class="mb-2">
        <h1 class="text-[22px] font-bold mb-4">ประมวลผล</h1>
      </div>
      <!-- start กรณีไม่มีข้อมูล -->
      <div id="no_data" v-if="count_farm == 0" class="hidden">
        <div class="rounded-[16px] bg-white p-4">
          <div class="mb-3 text-base  md:text-lg text-center text-[#827C7B] font-medium">
            <p>ข้อมูลไม่เพียงพอในการประมวลผล</p>
          </div>

          <div class="text-center">
            <div class="mb-3 text-sm md:text-base md:text-center text-[#827C7B] font-medium">
              <p>กรุณาเพิ่มฟาร์ม หรือ แก้ไขฟาร์ม โปรดระบุ ตำบล,อำเภอ,จังหวัด</p>
              <p>และ ตำแหน่งพิกัดที่ตั้ง ละติจูด,ลองจิจูด ฟาร์มของคุณ</p>
            </div>
            <router-link to="/manageFarm">
              <button
                class="bg-[#01893D] hover:bg-[#fff] text-white font-32ld py-2 px-4 hover:text-[#01893D] rounded-[10px] w-[256px] h-[36px] btn-custom-add">
                <img alt="" class="inline add lg:mt-0 bg-[#fff]" style="width: 20px; height: 20px" />
                <span class="text-sm ml-1">จัดการฟาร์มของคุณ</span>
              </button>
            </router-link>
          </div>
        </div>
      </div>
      <!-- end กรณีไม่มีข้อมูล -->
      <div v-else>
        <div class="mb-2">
          <span>เลือกระดับความเหมาะสม<br />ของผลิตผลทางการเกษตรที่ต้องการ</span>
        </div>
        <div class="grid grid-cols-1 gap-2 items-center justify-center">
          <div v-for="item of data_rating" :key="item.id" @click="router_path(item.status)"
            class="bg-white w-full rounded-2xl py-[8px] px-[9px] cursor-pointer">
            <div class="flex flex-row items-center justify-between">
              <div class="flex flex-row items-center">
                <div class="mr-2">
                  <img alt="" :class="item.class_icon" class="inline " style="width: 48px; height: 48px" />
                </div>
                <div class="flex flex-col">
                  <div v-if="item.rating == 5" class="flex flex-row">
                    <img alt="" class="inline star bg-[#9BD226]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#9BD226]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#9BD226]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#9BD226]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#9BD226]" style="width: 24px; height: 24px" />
                  </div>
                  <div v-if="item.rating == 4" class="flex flex-row">
                    <img alt="" class="inline star bg-[#C7CE3B]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#C7CE3B]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#C7CE3B]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#C7CE3B]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                  </div>
                  <div v-if="item.rating == 3" class="flex flex-row">
                    <img alt="" class="inline star bg-[#F2CA50]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#F2CA50]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#F2CA50]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                    <img alt="" class="inline star bg-[#F3F2F0]" style="width: 24px; height: 24px" />
                  </div>
                  <div class="mt-2 font-medium text-[#302520] text-sm md:text-base">
                    <span v-if="item.rating == 5">เหมาะสมมาก</span>
                    <span v-if="item.rating == 4">เหมาะสม</span>
                    <span v-if="item.rating == 3">พอใช้</span>
                  </div>
                </div>
              </div>
              <div class="flex flex-row items-center">
                <span v-if="item.rating == 5" class="text-sm  md:text-base font-medium">({{ state.total_verygood }}
                  ชนิด)</span>
                <span v-if="item.rating == 4" class="text-sm  md:text-base font-medium">({{ state.total_good }}
                  ชนิด)</span>
                <span v-if="item.rating == 3" class="text-sm  md:text-base font-medium">({{ state.total_fair }}
                  ชนิด)</span>
                <img :class="item.arrow" class="arrow-right" alt="" style="width: 48px; height: 48px" />
              </div>
            </div>
          </div>
        </div>
      </diV>

    </div>
  </NavbarMain>
</template>

<style scoped>
@import "@/assets/styles/custom-icons.css";
</style>
