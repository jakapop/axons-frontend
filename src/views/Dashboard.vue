<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import { ref, reactive, onMounted, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";

const mainStore = useMainStore();
const router = useRouter();

const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;
//console.log(CustomerId)
//console.log(CustomerFarmId)

const state = reactive({
  senser_all: [],
  board_name: '',
  group: [],
  boards: [],
  serial: "",
});

onMounted(() => {
  let url = new URL(window.location.href);
  let boards = url.searchParams.get("boards");
  state.serial = boards;
  //console.log(boards);
  ApiCore.get("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + boards).then((response) => {
    if (typeof response.data.data[0] !== 'undefined') {
      state.board_name = response.data.data[0].name
    }
    let board_name = document.querySelector("#board_name");
    board_name.classList.remove("hidden");
    //console.log(response.data.data[0].name);
  });

  if (!boards) {
    router.push("/SelectBoard");
  }
  //2309SWCSTXJ47BC
  ApiCore.get("/v2/boards/" + boards + "/sensor").then((response) => {
    state.boards = response.data.data.sensors;
    console.log('sensor boards == ', state.boards);
    //Object.keys(state.boards).forEach(function (key) {
    // console.log(state.boards[key].items_id);
    //state.boards[key]["icon"] = getImageUrl(state.boards[key].id)
    // Object.keys(state.sensors).forEach(function (key2) {
    //     if (state.boards[key].items_id == state.sensors[key2].item_id){
    //         state.boards[key]["icon"] = state.sensors[key2].icon
    //     }
    // })
    //});
    //console.log(state.boards);
    const dupObj = state.boards;
    const uniKeys = [...new Set(dupObj.map(({ category_id }) => category_id))];
    state.group = uniKeys;
    //console.log(state.group);
  });
});


const getDirection = (degrees) => {
  console.log('value == ' + degrees, typeof (degrees));
  if (degrees >= 337.5 || degrees < 22.5) {
    return "ทิศเหนือ";
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return "ภาคตะวันออกเฉียงเหนือ";
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return "ทิศตะวันออก";
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return "ทิศตะวันออกเฉียงใต้";
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return "ทิศใต้";
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return "ทิศตะวันตกเฉียงใต้";
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return "ทิศตะวันตก";
  } else if (degrees >= 292.5 && degrees < 337.5) {
    return " ทิศตะวันตกเฉียงเหนือ";
  } else {
    return "Invalid degrees";
  }

};

const rainfall = (rainfallVolume) => {

  if (rainfallVolume >= 0.1 && rainfallVolume <= 10) {
    return "ฝนตกเล็กน้อย";
  } else if (rainfallVolume > 10 && rainfallVolume <= 35) {
    return "ฝนตกปานกลาง";
  } else if (rainfallVolume > 35 && rainfallVolume <= 90) {
    return "ฝนตกหนัก";
  } else if (rainfallVolume > 90) {
    return "ฝนตกหนักมาก";
  } else {
    return "ไม่มีฝนตก";
  }
};


const check_pH = (pH) => {
  
  if (pH < 3.5) {
    return 'กรดรุนแรงที่สุด';
  } else if (pH >= 3.5 && pH <= 4.5) {
    return 'กรดรุนแรงมาก';
  } else if (pH >= 4.6 && pH <= 5.0) {
    return 'กรดจัดมาก';
  } else if (pH >= 5.1 && pH <= 5.5) {
    return 'กรดจัด';
  } else if (pH >= 5.6 && pH <= 6.0) {
    return 'กรดปานกลาง';
  } else if (pH >= 6.1 && pH <= 6.5) {
    return 'กรดเล็กน้อย';
  } else if (pH >= 6.6 && pH <= 7.3) {
    return 'เป็นกลาง';
  } else if (pH >= 7.4 && pH <= 7.8) {
    return 'ด่างเล็กน้อย';
  } else if (pH >= 7.9 && pH <= 8.4) {
    return 'ด่างปานกลาง';
  } else if (pH >= 8.5 && pH <= 9.0) {
    return 'ด่างจัด';
  } else if (pH > 9.0) {
    return 'ด่างจัดมาก';
  } else {
    return '';
  }
};
</script>
<template>
  <NavbarMain>
    <div id="home">
      <HeaderFarm />
      <div class="m-4">
        <div class="grid grid-cols-1">
          <div class="flex flex-row items-start md:items-center whitespace-nowrap ">
            <div class="w-full">
              <h1 class="text-[22px] font-bold mb-2">ข้อมูลจากเซนเซอร์</h1>
              <h5 id="board_name" class="text-[22px] font-medium hidden">
                <span v-if="state.board_name">{{ state.board_name }}</span>
                <span v-else class="text-base">{{ state.serial }}</span>
              </h5>
            </div>
            <div class="w-full flex justify-end">
              <router-link :to="`/device-list?board=${state.serial}`"
                class="bg-[#01893D] hover:bg-white hover:text-[#01893D] font-medium text-sm md:text-base text-white rounded-[8px] px-2 sm:px-4 md:px-10 py-2">สั่งงานอุปกรณ์</router-link>
            </div>
          </div>
        </div>
        <div v-for="(groupType, index) in state.group" :key="index" class="mt-3">
          <p v-if="groupType == '1'" class="text-2xl font-bold my-4">
            ข้อมูลดิน
          </p>
          <p v-if="groupType == '2'" class="text-2xl font-bold my-4">
            ข้อมูลน้ำ
          </p>
          <p v-if="groupType == '3'" class="text-2xl font-bold my-4">
            ข้อมูลอากาศ
          </p>
          <p v-if="groupType == '4'" class="text-2xl font-bold my-4">
            ข้อมูลแสง
          </p>
          <p v-if="groupType == '5'" class="text-2xl font-bold my-4">
            ข้อมูลเสียง
          </p>
          <p v-if="groupType == '6'" class="text-2xl font-bold my-4">
            ข้อมูลพลังงาน
          </p>
          <p v-if="groupType == '7'" class="text-2xl font-bold my-4">
            ข้อมูลตำแหน่ง
          </p>
          <p v-if="groupType == '8'" class="text-2xl font-bold my-4">
            อื่นๆ
          </p>

          <div class="content-center grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4 lg:gap-8">
            <template v-for="(sensor, innerIndex) in state.boards" :key="innerIndex">
              <div v-if="groupType == sensor.category_id">
                <div class="mx-auto rounded overflow-hidden w-full bg-white py-4" style="">
                  <div class="">
                    <div class="font-bold text-[12px] md:text-lg xl:text-2xl mb-2 ml-1 md:ml-[12px]">
                      <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px"
                        :src="`img/sensor/${sensor.id}.png`" />
                      {{ sensor.name.th }}
                    </div>
                    <p
                      class="py-1 md:py-4 text-gray-700 text-base text-center text-[30px] my-6 md:text-[54px] xl:text-[64px] truncate">
                      {{ sensor.result_sensor }}
                    </p>
                    <p class="text-gray-700 text-base text-center md:text-xl mt-3 mb-4">
                      <span v-if="sensor.name.th == 'ทิศทางลม'">{{ sensor.unit.th }} / {{
                        getDirection(sensor.result_sensor) }}</span>
                        <span v-else-if="sensor.name.th == 'pH ในดิน'">{{ check_pH(sensor.result_sensor) }}</span>
                      <span v-else-if="sensor.name.th != 'ฝุ่น PM 2.5'">
                        <span v-if="sensor.unit.th == 'uW/cm2'">uW/<span>cm<sup>2</sup></span></span>
                        <span v-else-if="sensor.unit.th == 'mW/m2'">uW/<span>m<sup>2</sup></span></span>
                        <span v-else-if="sensor.unit.th == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                        <span v-else>{{ sensor.unit.th }} </span>
                      </span>
                      <span v-else-if="sensor.name.th == 'ฝุ่น PM 2.5'">ไมโครกรัม/ลูกบาศก์เมตร</span>


                      <span v-if="sensor.name.th == 'ฝุ่น PM 2.5' && sensor.unit.th == 'µg./m3'">µg
                        /<span>m<sup>3</sup></span></span>
                      <span v-if="sensor.name.th == 'ปริมาณนํ้าฝน'" class="block text-black">(
                        {{ rainfall(sensor.result_sensor) }} )</span>
                    </p>
                  </div>
                  <div class="px-6 text-center">
                    <router-link :to="`/SensorChart?board=${state.serial}&sid=${sensor.id}`">
                      <button v-if="sensor.unit.th != 'ละติจูด' && sensor.unit.th != 'ลองจิจูด'" type="button"
                        class="text-white w-full hover:text-[#01893D] bg-[#01893D] hover:bg-[#fff] font-bold rounded-[8px] text-sm px-4 h-[40px] text-center items-center btn-custom">
                        <img alt="" class="inline chart lg:mt-0 bg-[#fff] mr-1" style="width: 20px; height: 20px" />
                        <span>กราฟ</span>
                      </button>
                    </router-link>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="text-center mt-8">
          <router-link :to="`/ExportExcel?boards=${state.serial}`">
            <button
              class="bg-[#01893D] hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[40px] btn-custom-add">
              <!-- <div class="grid grid-cols-2"> -->
              <img alt="" class="export inline lg:mt-0 bg-[#fff]" style="width: 20px; height: 20px" />
              <span class="text-sm ml-1">ส่งออกเป็นไฟล์ Excel</span>
              <!-- </div> -->
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>

<style land="scss">
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
}
</style>
