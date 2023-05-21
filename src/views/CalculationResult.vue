<script setup>
// import { click } from "dom7";
import { ref, reactive, onMounted, computed } from "vue";
import NavbarMain from "../layouts/NavbarMain.vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { MailOpenIcon } from "@heroicons/vue/outline";

const router = useRouter();
const mainStore = useMainStore();

const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;
const CustomerFarmLat = computed(() => mainStore.CustomerFarmLat);
const CustomerFarmLon = computed(() => mainStore.CustomerFarmLon);

let active_btn = ref(1);

let state = reactive({
  status: "",
  cat:"1",
  boards: [], //2309SWCSTXJ47BC
  serial:"",
  geo: [],
  breed: [],
  breed_cat:[],

  airTemperature:0,
  soilTemperature:0,
  soilMoisture:0,
  soilPh:0,
  soilEc:0,
  nitrogen:0,
  phosphorus:0,
  potassium:0,
  amountOfWater:0,
  lightIntensity:0,

  debug:false,

  percent_max:0,
  percent_min:0,
  percent_color:""
});

onMounted(() => {
  let url = new URL(window.location.href);
  state.status = url.searchParams.get("status");
  state.debug = url.searchParams.get("debug");
  //state.debug=1
  if (state.status == "" || state.status == null) {
      router.push("/calculate");
  }else{
    if(state.status == "verygood"){
      state.percent_min = 70
      state.percent_max = 100
      state.percent_color = "green1"
    }else if(state.status == "good"){
      state.percent_min = 41
      state.percent_max = 69
      state.percent_color = "green2"
    }else{
      state.percent_min = 1
      state.percent_max = 40
      state.percent_color = "green3"
    }
  }

  ApiCore.get("v2/projects/?limit=all")
  .then((response) => {
    const count_farm = response.data.data.length
    console.log(count_farm)
    if (count_farm == 0){
      router.push("/calculate");
    }
  })
});

const boards_select = computed(() => {
  //console.log("lat",CustomerFarmLat.value)
  //console.log("lon",CustomerFarmLon.value)
  if (CustomerFarmLat.value && CustomerFarmLon.value) { //มี lat logn
    ApiCore.get("v2/projects/" + mainStore.CustomerFarmId + "/boards").then(
      (response) => {
        if(typeof response.data.data[0] !== 'undefined'){ //กรณี มีบอร์ด
          state.serial = response.data.data[0].serial;
          set_have_boards()
        }else{ //ไม่มีบอร์ด
          set_not_boards()
        }
      }
    );
  }else{ //ไมมี lat,long
    state.airTemperature = mainStore.CustomerTemperature
    ApiCore.get("v2/projects/" + mainStore.CustomerFarmId + "/boards").then(
      (response) => {
        if(typeof response.data.data[0] !== 'undefined'){ //กรณี มีบอร์ด
          state.serial = response.data.data[0].serial;
          set_have_boards()
        }else{ //ไม่มีบอร์ด
          set_not_boards()
        }
      }
    );
  }

})


const get_breed = () => {
  console.log(`breed/${state.cat}/ranking?airTemperature=${state.airTemperature}&soilTemperature=${state.soilTemperature}&soilMoisture=${state.soilMoisture}&soilPh=${state.soilPh}&soilEc=${state.soilEc}&nitrogen=${state.nitrogen}&phosphorus=${state.phosphorus}&potassium=${state.potassium}&amountOfWater=${state.amountOfWater}&lightIntensity=${state.lightIntensity}`)
  ApiMain.get(`breed/${state.cat}/ranking?airTemperature=${state.airTemperature}&soilTemperature=${state.soilTemperature}&soilMoisture=${state.soilMoisture}&soilPh=${state.soilPh}&soilEc=${state.soilEc}&nitrogen=${state.nitrogen}&phosphorus=${state.phosphorus}&potassium=${state.potassium}&amountOfWater=${state.amountOfWater}&lightIntensity=${state.lightIntensity}`
  ).then((res) => {
    state.breed = res.data.data;
  });
}

const set_have_boards = () => {
  ApiCore.get("/v2/boards/" + state.serial + "/sensor").then((response) => {
    state.boards = response.data.data.sensors;
    if(state.boards.length>0){
      Object.entries(state.boards).forEach(entry => {
        const [key, value] = entry;
        if(value.name.en == "Air temperature" && value.status == "active"){
          state.airTemperature = value.result_sensor
        }
        if(value.name.en == "soil temperature" && value.status == "active"){
          state.soilTemperature = value.result_sensor
        }
        if(value.name.en == "Soil Moisture" && value.status == "active"){
          state.soilMoisture = value.result_sensor
        }
        if(value.name.en == "Soil pH" && value.status == "active"){
          state.soilPh = value.result_sensor
        }
        if(value.name.en == "Electrical Conductivity Soil" && value.status == "active"){
          state.soilEc = value.result_sensor
        }
        if(value.name.en == "Nitrogen" && value.status == "active"){
          state.nitrogen = value.result_sensor
        }
        if(value.name.en == "phosphorus" && value.status == "active"){
          state.phosphorus = value.result_sensor
        }
        if(value.name.en == "potassium" && value.status == "active"){
          state.potassium = value.result_sensor
        }
        if(value.name.en == "Rainfall" && value.status == "active"){
          state.amountOfWater = value.result_sensor
        }
        if(value.name.en == "Light Intensity" && value.status == "active"){
          state.lightIntensity = value.result_sensor
        }
      });
    }
    get_breed()
  });
}

const set_not_boards = () => {
  state.serial = "Not Board"
  state.airTemperature=mainStore.CustomerTemperature
  state.soilTemperature=0
  state.soilMoisture=0
  state.soilPh=0
  state.soilEc=0
  state.nitrogen=0
  state.phosphorus=0
  state.potassium=0
  state.amountOfWater=0
  state.lightIntensity=0

  if (CustomerFarmLat.value && CustomerFarmLon.value) {
    ApiMain.get("geo/by-latlon?lat=" +CustomerFarmLat.value +"&lon=" +CustomerFarmLon.value
    ).then((res) => {
      state.geo = res.data;
      if(res.data.topsoilValueAgv>0){
          state.soilPh = res.data.topsoilValueAgv
      }
      console.log("soilPh=",state.soilPh);
    })
  }else{
    state.soilPh = 0
    if(state.airTemperature==""){
      state.airTemperature = 0
    }
  }
  get_breed()
}

const setActive = (status,cat) => {
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

const viewDetail = (id,item) => {
  console.log('item detail =',item);
  let path = "/calulation-detail?result=" + id;
  router.push(path);
};
</script>

<template>
  <NavbarMain>
    <div class="hidden">{{ boards_select }}</div>
    <div v-if="state.debug">
    Categories {{state.cat}}<br>
    เปอเซ็นต่ำสุด{{state.percent_min}} เปอเซ็นสูงสุด{{state.percent_max}}<br />
    FarmId {{ mainStore.CustomerFarmId }}<br />
    airTemperature จากกรมอุตุ {{ mainStore.CustomerTemperature }}<br />
    soilPh จากภูมิศาสตร์ {{ state.soilPh }}<br /><br />

    ข้อมูลจาก บอร์ด {{state.serial}}<br />
    airTemperature{{state.airTemperature}}<br />
    soilTemperature {{state.soilTemperature}}<br />
    soilMoisture {{state.soilMoisture}}<br />
    soilPh {{state.soilPh}}<br />
    soilEc {{state.soilEc}}<br />
    nitrogen {{state.nitrogen}}<br />
    phosphorus {{state.phosphorus}}<br />
    potassium {{state.potassium}}<br />
    amountOfWater {{state.amountOfWater}}<br />
    lightIntensity {{state.lightIntensity}}<br />
    </div>
    <div class="m-4 mt-16 md:mt-8">
      <div class="mb-2">
        <h1 class="text-[22px] font-bold mb-4">ประมวลผล</h1>
      </div>
      <div class="grid grid-cols-3 gap-2 justify-center items-center mb-4">
        <div
          @click="setActive(1,1)"
          :class="{ active: active_btn == 1 }"
          class="bg-white w-full rounded-lg py-2 text-center"
        >
          <span class="font-bold text-sm md:text-base">ผลไม้</span>
        </div>
        <div
          @click="setActive(2,2)"
          :class="{ active: active_btn == 2 }"
          class="bg-white w-full rounded-lg py-2 text-center"
        >
          <span class="font-bold text-sm md:text-base">พืชผัก</span>
        </div>
        <div
          @click="setActive(3,3)"
          :class="{ active: active_btn == 3 }"
          class="bg-white w-full rounded-lg py-2 text-center"
        >
          <span class="font-bold text-sm md:text-base">พืชไร่</span>
        </div>
      </div>
      <div
        class="text-base font-medium bg-white p-2 rounded-2xl leading-3 w-full md:w-1/2 lg:w-2/5"
      >
        <span>
          ผลิตผลที่
          <span class="text-[#01893D]">
            <span v-if="state.status == 'verygood'">เหมาะสมมาก</span>
            <span v-if="state.status == 'good'">เหมาะสม</span>
            <span v-if="state.status == 'fair'">พอใช้</span>
          </span>
          กับ
          <span class="text-[#01893D] text-base md:text-lg">{{
            mainStore.CustomerFarmName
          }}</span></span
        >
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center my-4">
        <template v-for="(item, index) in state.breed" :key="index">
        <div
          v-if="item.percent>0 && item.percent >= state.percent_min && item.percent <= state.percent_max"
          @click="viewDetail(item.id,item)"
          class="cursor-pointer flex flex-col justify-center items-center  bg-white rounded-2xl p-4 w-full h-full"
        >
          <div   class="mt-2">
            <div class="relative single-chart">
              <svg viewBox="0 0 36 36" :class="`circular-chart1 ${state.percent_color}`">
                <path
                  class="circle-bg"
                  d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                <path
                  class="circle"
                  :stroke-dasharray="`${item.percent} , 100`"
                  d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
              </svg>
              <img v-if="item.image!=''"
                id="item1"
                :src="`https://farmworld.farm/api-main/image/${item.image}?imageableType=breed`"
                alt="fruit1"
              />
            </div>
            <h1 class="text-center text-[#01893D] text-[22px] font-medium my-2">
              {{item.name}}
            </h1>
            <p class="text-center text-[#030a0a]">
              ความเหมาะสม :
              <span class="text-[22px] font-bold text-[#01893D]">{{item.percent}}%</span>
            </p>
          </div>
        </div>
      </template>

        <!-- <div
          @click="viewDetail(2)"
          class="cursor-pointer flex justify-center items-center bg-white rounded-2xl p-4 w-full h-full"
        >
          <div class="mt-2 md:mt-[24px]">
            <div class="relative single-chart">
              <svg viewBox="0 0 36 36" class="circular-chart2 green2">
                <path
                  class="circle-bg"
                  d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                <path
                  class="circle"
                  stroke-dasharray="79, 100"
                  d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
              </svg>
              <img
                id="item2"
                src="../assets/img/Calculation/orange.png"
                alt="fruit2"
              />
            </div>
            <h1 class="text-center text-[#01893D] text-[22px] font-medium my-2">
              ฝรั่งกิมจู
            </h1>
            <p class="text-center text-[#030a0a]">
              ความเหมาะสม :
              <span class="text-[22px] font-bold text-[#01893D]">90%</span>
            </p>
          </div>
        </div>
        <div
          @click="viewDetail(3)"
          class="cursor-pointer flex justify-center items-center bg-white rounded-2xl p-4 w-full h-full"
        >
          <div class="mt-2 md:mt-[44px]">
            <div class="relative single-chart">
              <svg viewBox="0 0 36 36" class="circular-chart3 green3">
                <path
                  class="circle-bg"
                  d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                <path
                  class="circle"
                  stroke-dasharray="79, 100"
                  d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
              </svg>
              <img
                id="item3"
                src="../assets/img/Calculation/orange.png"
                alt="fruit3"
              />
            </div>
            <h1 class="text-center text-[#01893D] text-[22px] font-medium my-2">
              มะม่วงน้ำดอกไม้
            </h1>
            <p class="text-center text-[#030a0a]">
              ความเหมาะสม :
              <span class="text-[22px] font-bold text-[#01893D]">85%</span>
            </p>
          </div>
        </div> -->
      </div>
    </div>
  </NavbarMain>
</template>

<style scoped>
@import "@/assets/styles/custom-icons.css";

.active {
  background-color: #01893D;
  color: white;
}

.single-chart {
  width: 100%;
  justify-content: space-around;
}

.circular-chart1 {
  display: block;
  margin: 10px auto;
  max-width: 104px;
  max-height: 104px;
}

.circular-chart2 {
  display: block;
  margin: 10px auto;
  max-width: 104px;
  max-height: 104px;
}

.circular-chart3 {
  display: block;
  margin: 10px auto;
  max-width: 72px;
  max-height: 72px;
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

.circular-chart1.green1 .circle {
  stroke: #9bd226;
}

.circular-chart1.green2 .circle {
  stroke: #bdc73f;
}

.circular-chart1.green3 .circle {
  stroke: #f2ca50;
}

#item1 {
  @apply absolute rounded-full w-[82px] top-[0.7rem] left-[2.3rem] lg:top-[0.9rem] lg:left-[1.37rem] lg:w-[110px];
}

#item2 {
  @apply absolute rounded-full w-[70px] top-[0.55rem] left-[2.65rem] lg:top-[0.6rem] lg:left-[2.06rem] lg:w-[88px];
}
#item3 {
  @apply absolute rounded-full w-[58px] top-[0.4rem] left-[3rem] lg:top-[0.55rem] lg:left-[2.46rem] lg:w-[74px];
}

/* > sm */
@media only screen and (max-width: 640px) {
  .circular-chart1 {
    max-width: 104px;
    max-height: 104px;
  }

  .circular-chart2 {
    max-width: 88px;
    max-height: 88px;
  }

  .circular-chart3 {
    max-width: 72px;
    max-height: 72px;
  }
}

/*
/* >  md */
/* @media only screen and (min-width:768px) {
  .circular-chart1 {
    max-width: 72px;
    max-height: 72px;
  }

  .circular-chart2 {
    max-width: 72px;
    max-height: 72px;
  }

  .circular-chart3 {
    max-width: 72px;
    max-height: 72px;
  }

} */

/* > lg */
@media only screen and (min-width: 1024px) {
  .circular-chart1 {
    max-width: 90%;
    max-height: 250px;
  }

  .circular-chart2 {
    max-width: 70%;
    max-height: 250px;
  }

  .circular-chart3 {
    max-width: 60%;
    max-height: 250px;
  }
}
</style>
