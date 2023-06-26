<script setup>
import NavbarMain from "../../layouts/NavbarMain.vue";
import HeaderFarm from "../../components/Headers/HeaderFarm.vue";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useMainStore } from "@/stores/main";
import moment from "moment";

const mainStore = useMainStore();
const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;
const state = reactive({
  notiToday:'',
  group_noti_date:[],
  slot:"",
  board:"",
  board_name:''
})

onMounted(()=>{
  let url = new URL(window.location.href);
  state.board = url.searchParams.get("board");
  state.slot = url.searchParams.get("slot");

  ApiMain.get("/notifications/"+CustomerId+"?order=DESC&page=1&take=9999").then((response) => {
  const noti_all = response.data.data;
  const result = noti_all.filter(noti => noti.serialNumber == state.board);
  state.notiToday = result
  const arr_noti_date = []

  Object.entries(state.notiToday).forEach(([key, value]) => {
    arr_noti_date.push(moment.utc(value.createdAt).format("DD/MM/YYYY"))
  });

  state.group_noti_date = Array.from(new Set(arr_noti_date)) ;

  console.log(state.notiToday);
  })

  let boards =  url.searchParams.get("board");
  ApiCore.get("/v2/projects/" + CustomerFarmId + "/boards/" + boards + "/devices").then((response) => {
    console.log(response.data.data)


    if (typeof response.data.data[0].board.name !== 'undefined') {
      state.board_name = response.data.data[0].board.name
    }

    // console.log("board_name",state.board_name);
    // console.log("devices_setting",state.devices_setting);
  });


});
</script>
<template>
  <NavbarMain>
  <div>
    <HeaderFarm />
    <div class="m-4">
      <div class="flex flex-row justify-between">
        <div>
          <h1 class="font-bold text-[22px] mb-4">ประวัติการทำงาน</h1>
          <p  class="font-medium text-base mb-4">บอร์ด {{state.board_name }}  </p>
        </div>
      </div>
      <div class="w-full rounded-lg p-4">
        <div class="flex flex-col justify-center items-center">
          <div v-for="(item, index) in state.group_noti_date" :key="index" class="bg-white w-full md:w-[480px] lg:w-9/12 mb-4 p-4 rounded-lg h-[400px] overflow-y-auto" >
            <h1 class="text-base font-medium mb-4">{{ item }}</h1>
            <div class="flex flex-row justify-center items-center gap-4 mb-4 p-2 rounded-lg" style="background: linear-gradient(0deg, rgba(41, 137, 6, 0.1), rgba(41, 137, 6, 0.1)), #FFFFFF;">
              <div class="w-48">
                <span class="text-[#302421] font-bold text-sm md:text-base">เวลา</span>
              </div>
              <div class="w-full ">
                <span class="text-[#302421] font-bold text-sm md:text-base truncate">รายละเอียด</span>
              </div>
              <div class="w-64">
                <span class="text-[#302421] font-bold text-sm md:text-base">สถานะ</span>
              </div>
            </div>
            <div v-for="(item_noti, index) in state.notiToday" :key="index" class="ml-2" >
                <div v-if="item == moment.utc(item_noti.createdAt).format('DD/MM/YYYY')"  class="flex flex-row justify-center items-center gap-4 mb-4">
                  <div class="w-48">
                    <span class="text-[#302421] font-medium text-sm md:text-base">{{ moment.utc(item_noti.createdAt).format("HH:mm") }}</span>
                  </div>
                  <div class="w-full ">
                    <p v-if="item_noti.notiStatus == '4'" class=" text-[#302421] font-medium text-sm md:text-base break-words w-cus w-full" >{{ item_noti.message.replace(/\d.*([0-9]{2}):([0-9]{2})/,"").replace(/บอร์ด.*[A-Za-z0-9]\s*\([^)]*\)\s*/g,"").replace("ค่ะ","") }}</p>
                    <p v-else class=" text-[#302421] font-medium text-sm md:text-base break-words w-cus w-full" >{{ item_noti.message.replace(/\d.*([0-9]{2}):([0-9]{2})/,"").replace(/ที่บอร์ด.*[A-Za-z0-9]\s*\([^)]*\)\s*/g,"").replace("ค่ะ","") }}</p>
                  </div>
                  <div class="w-64">
                    <span :class="item_noti.notiStatus == '1' || item_noti.notiStatus == '4' || item_noti.notiStatus == '5' || item_noti.notiStatus == '9' ?'text-[#01893D]':item_noti.notiStatus == '2' ||item_noti.notiStatus == '3' ||  item_noti.notiStatus == '6' || item_noti.notiStatus == '10' || item_noti.notiStatus == '11'?'text-[#D22626]':'text-[#676c66]'" class=" font-medium text-sm md:text-base" >
                          <span v-if="item_noti.notiStatus == '1'">เปิด</span>
                          <span v-else-if="item_noti.notiStatus == '2'">ปิด</span>
                          <span v-else-if="item_noti.notiStatus == '3'">ออฟไลน์</span>
                          <span v-else-if="item_noti.notiStatus == '4'">ออนไลน์</span>
                          <span v-else-if="item_noti.notiStatus == '5'">เพิ่ม</span>
                          <span v-else-if="item_noti.notiStatus == '6'">ลบ</span>
                          <span v-else-if="item_noti.notiStatus == '8'">เริ่มอัพเดท</span>
                          <span v-else-if="item_noti.notiStatus == '9'">อัพเดทสำเร็จ</span>
                          <span v-else-if="item_noti.notiStatus == '10'">ดาวน์โหลดไฟล์แต่ไม่สำเร็จ</span>
                          <span v-else-if="item_noti.notiStatus == '11'">การอัพเดทมีปัญหา</span>
                          <span v-else>-</span>
                        </span>
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
<!-- <template>
    <NavbarMain>
    <div>
      <HeaderFarm />
      <div class="m-4">
        <div class="flex flex-row justify-between">
          <div>
            <h1 class="font-bold text-[22px] mb-4">ประวัติการทำงาน</h1>
            <p  class="font-medium text-base mb-4">บอร์ด {{state.board}}  </p>
          </div>
        </div>
        <div class="flex flex-row justify-center items-center">
          <div class="w-full md:w-[480px] lg:w-9/12 ">
          <div class="flex flex-col justify-center ">
            <div v-for="(item, index) in state.group_noti_date" :key="index" class="bg-white w-full rounded-lg p-4 m-4 md:m-0 md:mb-4 ">
              <h1 class="text-base font-medium mb-4">{{ item }}</h1>
              <div class="relative w-full h-[500px] overflow-y-auto ">
                <table class=" text-sm text-left text-gray-500 dark:text-gray-400 ">
                  <thead class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
                    style="background: linear-gradient(0deg, rgba(41, 137, 6, 0.1), rgba(41, 137, 6, 0.1)), #FFFFFF;">
                    <tr>
                      <th scope="col" class="px-2 py-2 rounded-l-lg w-[48px] text-sm font-bold">
                        <span class="text-[#302421] font-bold text-sm md:text-base truncate">เวลา</span>
                      </th>
                      <th scope="col" class="px-2 py-2 w-[334px] text-sm font-bold">
                        <span class="text-[#302421] font-bold text-sm md:text-base truncate">รายละเอียด</span>
                      </th>
                      <th scope="col" class="px-2 py-2 rounded-r-lg w-[50px] text-sm font-bold">
                        <span class="text-[#302421] font-bold text-sm md:text-base truncate">สถานะ</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white  dark:bg-gray-800 dark:border-gray-700"  v-for="(item_noti, index) in state.notiToday" :key="index">
                      <td class=" w-[48px] font-medium  text-[#302421] whitespace-nowrap dark:text-white">
                        <span class="text-[#302421] font-medium text-sm md:text-base">{{ moment.utc(item_noti.createdAt).format("HH:mm") }}</span>
                      </td>
                      <td class="w-[334px] text-[#302421]">
                        <span class="text-[#302421] font-medium text-sm md:text-base" >{{ item_noti.message.replace(/\d.*([0-9]{2}):([0-9]{2})/,"").replace(/ที่บอร์ด.*/,"") }}</span>
                      </td>
                      <td class="w-[50px] text-[#302421] ">
                        <span :class="item_noti.notiStatus == '1' || item_noti.notiStatus == '4' || item_noti.notiStatus == '5' || item_noti.notiStatus == '9' ?'text-[#01893D]':item_noti.notiStatus == '2' ||item_noti.notiStatus == '3' ||  item_noti.notiStatus == '6' || item_noti.notiStatus == '10' || item_noti.notiStatus == '11'?'text-[#D22626]':'text-[#676c66]'" class=" font-medium text-sm md:text-base" >
                          <span v-if="item_noti.notiStatus == '1'">เปิด</span>
                          <span v-else-if="item_noti.notiStatus == '2'">ปิด</span>
                          <span v-else-if="item_noti.notiStatus == '3'">ออฟไลน์</span>
                          <span v-else-if="item_noti.notiStatus == '4'">ออนไลน์</span>
                          <span v-else-if="item_noti.notiStatus == '5'">เพิ่ม</span>
                          <span v-else-if="item_noti.notiStatus == '6'">ลบ</span>
                          <span v-else-if="item_noti.notiStatus == '8'">เริ่มอัพเดท</span>
                          <span v-else-if="item_noti.notiStatus == '9'">อัพเดทสำเร็จ</span>
                          <span v-else-if="item_noti.notiStatus == '10'">ดาวน์โหลดไฟล์แต่ไม่สำเร็จ</span>
                          <span v-else-if="item_noti.notiStatus == '11'">การอัพเดทมีปัญหา</span>
                          <span v-else>-</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
    </NavbarMain>
</template> -->

<style scoped>

@media only screen and (max-width: 500px) {
  .w-cus {
    width: 70px;
  }
}
.border-custom {
  border-radius: 10px;
  border: 1.5px solid#01893D;
}

</style>
