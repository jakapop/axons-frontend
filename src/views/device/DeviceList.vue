<script setup>
import NavbarMain from "../../layouts/NavbarMain.vue";
import HeaderFarm from "../../components/Headers/HeaderFarm.vue";
import { ref, reactive, onMounted, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();
const router = useRouter();

const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;

const state = reactive({
  board_name: '',
  boards: [],
  devices_setting:[],
  serial: "",
});

onMounted(() => {
  let url = new URL(window.location.href);
  let boards = url.searchParams.get("board");
  state.serial = boards;

  ApiCore.get("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + boards + "/devices").then((response) => {
    console.log(response.data.data[0])
    state.devices_setting = response.data.data[0].settings

    if (typeof response.data.data[0].board.name !== 'undefined') {
      state.board_name = response.data.data[0].board.name
    }

    console.log("board_name",state.board_name);
    console.log("devices_setting",state.devices_setting);
  });

});

let item_active = ref(0);
let dropdownShow = ref(false);

const showdropdown =(item_id)=>{
  item_active.value = item_id ;
  dropdownShow.value = !dropdownShow.value ;
};

</script>
<template>
  <NavbarMain>
    <div>
      <HeaderFarm />
      <!-- มีข้อมุล -->
      <div class="m-4 ">
        <div class="flex flex-row items-start md:items-center whitespace-nowrap ">
            <div class="w-full">
              <h1 class="text-[22px] font-bold mb-2">อุปกรณ์</h1>
              <h5 id="board_name" class="text-[22px] font-medium ">
                <span v-if="state.board_name">{{ state.board_name }}</span>
                <span v-else class="text-base">{{ state.serial }}</span>
              </h5>
            </div>
            <div class="w-full flex justify-end">
              <router-link :to="`/history-device?board=${state.serial}`" class="h-[36px] bg-[#01893D] hover:bg-white hover:text-[#01893D] font-medium text-sm md:text-base text-white rounded-[8px] px-2 sm:px-4  py-2 flex items-center">
                <span>ประวัติการทำงาน</span>
              </router-link>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-2 mt-6">
            <div v-for="(item,index) in state.devices_setting" :key="index" class="bg-white rounded-2xl p-2 flex flex-row relative h-[80px]">
              <router-link :to="`/device-control?board=${state.serial}&slot=${item.slot}`" class="w-3/4 p-2 flex flex-row items-center" >
                <img v-if="item.device_id == 1" class="pump inline lg:mt-0 bg-black mr-1" style="width: 40px; height: 40px">
                <img v-else-if="item.device_id == 2" class="fan inline lg:mt-0 bg-black mr-1" style="width: 40px; height: 40px">
                <img v-else-if="item.device_id == 3" class="fi inline lg:mt-0 bg-black mr-1" style="width: 40px; height: 40px">
                <img v-else-if="item.device_id == 4" class="moter inline lg:mt-0 bg-black mr-1" style="width: 40px; height: 40px">
                <img v-else-if="item.device_id == 5" class="wow inline lg:mt-0 bg-black mr-1" style="width: 40px; height: 40px">
                <img v-else-if="item.device_id == 6" class="fan inline lg:mt-0 bg-black mr-1" style="width: 40px; height: 40px">
                <img v-else-if="item.device_id == 7" class="lightnoti inline lg:mt-0 bg-black mr-1" style="width: 40px; height: 40px">
                <span class="ml-4 text-base font-medium text-[#01893D]">ช่องที่  {{item.slot}} {{ item.name.th }}</span>
              </router-link >
              <div class="w-1/4 flex items-start justify-end">
                <a @click="showdropdown(item.id)" :class="{active:item_active == item.id}">
                    <router-link :to="`/add-device?board=${state.serial}&slot=${item.slot}`">
                    <button
                      class=" bg-[#01893D] hover:bg-[#fff] text-white font-bold rounded-[8px] h-9 w-9  right-[15px] btn-custom"
                    >
                      <img
                        alt=""
                        class="mx-auto bg-[#fff] w-4 md:w-6 edit h-4 md:h-6"
                      />
                    </button>
                    </router-link>
                  </a>
              </div>
            </div>
          </div>
          <div class="flex justify-center items-center mt-4">
            <router-link :to="`/add-device?board=${state.serial}`" class="justify-center w-[200px] h-[36px] text-center bg-[#01893D] hover:bg-white hover:text-[#01893D] font-medium text-sm md:text-base text-white rounded-[8px] px-2 sm:px-4  py-2 flex items-center">
                <img  alt=""  class="block lg:mt-0 add bg-white mr-2" style="width: 20px; height: 20px"><span>เพิ่มอุปกรณ์ของคุณ</span>
              </router-link>
          </div>
      </div>
      <!-- ไม่มีข้อมูล -->
      <div class="m-4 hidden">
        <h1 class="text-[22px] font-bold mb-2">อุปกรณ์</h1>
        <div class="bg-white rounded-2xl p-4 w-full ">
          <p class="opacity-60 text-center my-4 font-medium text-base md:text-lg">ไม่พบอุปกรณ์</p>
          <p class="opacity-60 text-center mb-4 font-medium text-sm md:text-base">เพิ่มอุปกรณ์ของคุณเพื่อควบคุมอุปกรณ์</p>
          <div class="flex flex-row gap-4 justify-center">
            <div >
              <router-link to="/add-device" class="rounded-lg py-2 px-4 w-[300px] h-[36px] bg-[#01893D] text-sm md:text-base font-bold flex flex-row justify-center items-center">
              <img alt=""  class="block lg:mt-0 add bg-white mr-2" style="width:24px; height: 24px">
              <span class="text-white">เพิ่มอุปกรณ์</span>
              </router-link>
            </div>
            <div >
              <router-link to="/contact" class="rounded-lg py-2 px-4 w-[300px] h-[36px] bg-[#01893D] text-sm md:text-base font-bold flex flex-row justify-center items-center">
              <img alt=""  class="block lg:mt-0 support bg-white mr-2" style="width: 24px; height: 24px">
              <span class="text-white">ติดต่อเรา</span>
            </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>



<style>
@import "@/assets/styles/custom-icons.css";


</style>
