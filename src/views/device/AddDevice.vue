<script setup> 
import NavbarMain from "../../layouts/NavbarMain.vue";
import HeaderFarm from "../../components/Headers/HeaderFarm.vue";
import { ref, reactive, onMounted } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";

const router = useRouter();
const mainStore = useMainStore();
let action = ref("เพิ่มอุปกรณ์ใหม่");

const state = reactive({
  device:"",
  device_list:[],
  serial: "",
  devices_setting:"",
  numslot:"",
  editslot:""
})

onMounted(() => {
  let url = new URL(window.location.href);
  let boards = url.searchParams.get("board");
  state.serial = boards;

  state.editslot = url.searchParams.get("slot");
  if (state.editslot) {
    action.value = "แก้ไขอุปกรณ์" + " ช่องที่" + state.editslot;
  }
  ApiCore.get("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + boards + "/devices").then((response) => {
    //console.log(response.data.data[0])
    state.devices_setting = response.data.data[0].settings
    state.numslot = state.devices_setting.length+1
    //console.log(state.numslot)
  });

  ApiCore.get("/v2/devices/?page=1&limit=100").then((response) => {
    state.device_list = response.data.data
    console.log(state.device_list)
  });

  });

  const submit = () =>{
    //console.log('click submit !!',state.device , state.numslot);
    if (state.editslot) {

      ApiCore.put("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + state.serial + "/devices/" + state.device , {
        "type": "custom",
        "slot": state.editslot,
        "configCustom": {"status": "off"},
        "updateBy": mainStore.userFirstName}
      ).then((response) => {
        if(response.status == 204){
          Swal.fire({
            icon: "success",
            title: "แก้ไขอุปกรณ์" + " ช่องที่" +state.editslot+ " สำเร็จ",
            showConfirmButton: 1,
            timer: 2500,
          }).then((res) => {
            window.location.replace('/device-list?board='+state.serial);
          });
        }
      }).catch((e) =>{
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถแก้ไขอุปกรณ์ได้",
          showConfirmButton: 1,
          timer: 2500,
        }).then((res) => {
          window.location.replace('/device-list?board='+state.serial);
        });
      })

    }else{
      ApiCore.put("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + state.serial + "/devices/" + state.device , {
        "type": "custom",
        "slot": state.numslot,
        "configCustom": {"status": "off"},
        "updateBy": mainStore.userFirstName}
      ).then((response) => {
        //console.log(response.status)
        if(response.status == 204){
          Swal.fire({
            icon: "success",
            title: "เพิ่มอุปกรณ์สำเร็จ",
            showConfirmButton: 1,
            timer: 2500,
          }).then((res) => {
            window.location.replace('/device-list?board='+state.serial);
          });
        }

      }).catch((e) =>{
        Swal.fire({
          icon: "warning",
          title: "จำนวนอุปกรณ์เกินกำหนด",
          showConfirmButton: 1,
          timer: 2500,
        }).then((res) => {
          window.location.replace('/device-list?board='+state.serial);
        });
      })
    };
  }

  const closeForm = () =>{
    //router.push('/device-list?board='+state.serial);
    window.location.replace('/device-list?board='+state.serial);
  };
</script>
<template>
  <NavbarMain>
    <div>
      <HeaderFarm />
      <div class="m-4">
        <h1 class="font-bold text-[22px] mb-4">{{ action }}</h1>
        <div class="bg-white rounded-2xl p-4">
          <h2 class="text-base font-medium ">ประเภทอุปกรณ์</h2>
          <form @submit.prevent="submit">
            <div class="flex flex-col mt-4">
            <div class="flex items-center mb-4" v-for="(device,index) in state.device_list" :key="index">
              <input type="radio" required v-model="state.device" :value="device.id" name="device"
                class="w-4 h-4 md:w-5 md:h-5 text-[#01893D] bg-gray-100 border-gray-300 focus:ring-[#01893D] dark:focus:ring-[#01893D] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <img v-if="device.id == 1" class="pump inline lg:mt-0 bg-black mx-4" style="width: 40px; height: 40px">
              <img v-else-if="device.id == 2" class="fan inline lg:mt-0 bg-black mx-4" style="width: 40px; height: 40px">
              <img v-else-if="device.id == 3" class="fi inline lg:mt-0 bg-black mx-4" style="width: 40px; height: 40px">
              <img v-else-if="device.id == 4" class="moter inline lg:mt-0 bg-black mx-4" style="width: 40px; height: 40px">
              <img v-else-if="device.id == 5" class="wow inline lg:mt-0 bg-black mx-4" style="width: 40px; height: 40px">
              <img v-else-if="device.id == 6" class="fan inline lg:mt-0 bg-black mx-4" style="width: 40px; height: 40px">
              <img v-else-if="device.id == 7" class="lightnoti inline lg:mt-0 bg-black mx-4" style="width: 40px; height: 40px">
              <label :for="'input'+index"
                class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-300">{{ device.name.th }}</label>
            </div>
          </div>
          <div class="flex justify-center mt-4 mb-2">
              <button type="submit" class="bg-[#01893D] mr-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] btn-custom w-[120px] md:w-[200px] h-[36px]">
                <img alt="" class="inline check lg:mt-0 bg-[#fff]" style="width: 20px; height: 20px"/>
                <span class="text-sm ml-1">ยืนยัน</span>
              </button>
              <button @click="closeForm" type="button" class="modal-close bg-[#01893D] ml-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] btn-custom w-[120px] md:w-[200px] h-[36px]">
                <img alt="" class="inline close lg:mt-0 bg-[#fff]" style="width: 15px; height: 15px" />
                <span class="text-sm ml-1">ยกเลิก</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>
<style scoped>
@import "@/assets/styles/custom-icons.css";
</style>
