<script setup>
// import { reactive } from "@vue/reactivity";

import NavbarMain from "../layouts/NavbarMain.vue";
import Swal from "sweetalert2";
import { ref, reactive, onMounted, onBeforeMount, computed, onUpdated, watch, onBeforeUnmount } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import moment from "moment-with-locales-es6";
import useVuelidate from '@vuelidate/core';
import { required, email, sameAs, minLength, helpers } from '@vuelidate/validators';

const router = useRouter();
const route = useRoute();

let priority = ref('');
let id_farm = ref('');
const selectedOpen = ref(false);
// let selectedFarm = ref('');


let editing = ref('');
var userid = localStorage.getItem("userid");
const dataform = reactive({
  activity_name: "",
  farm: id_farm,
  time: "",
  date: "",
  priority: priority,
  farm_list: "",
  selectedFarm: ''
});
const rules = computed(() => {
  return {
    activity_name: {
      required: helpers.withMessage('กรุณาระบุชื่อผู้ใช้', required),
    },
    date: {
      required: helpers.withMessage('กรุณาระบุวันที่', required),
    },
    time: {
      required: helpers.withMessage('กรุณาระบุเวลา', required),
    },
    priority: {
      required
    },
    selectedFarm: {
      required
    },
  }
});


const states = reactive({
  project_all: [],
  serial: '',
  farm_name: ''
})




ApiCore.get("/v2/projects/?limit=all").then((res) => {

  states.project_all = res.data.data;
  dataform.farm_list = res.data.data;

  console.log(dataform.farm_list);
});


onMounted(() => {

  let url = new URL(window.location.href);
  const activity = url.searchParams.get("activity_id");

  if (activity) {
    states.serial = activity;
    console.log("path id = " + states.serial);

    ApiMain.get("/activity/" + states.serial).then(response => {
      const setForm = response.data.data;
      ApiCore.get("/v2/projects/" + setForm.projectId).then(res => {
        let farmname = res.data.data;
        for (let index = 0; index < farmname.length; index++) {
          const element = farmname[index];
          dataform.selectedFarm = element.name;

        }
      });

      if (response.status == 200) {
        let format_time = setForm.time.slice(0, setForm.time.lastIndexOf(":"));
        console.log(format_time);
        dataform.selectedFarm = states.farm_name;
        dataform.activity_name = setForm.title;
        dataform.farm = setForm.projectId;
        dataform.time = format_time;
        dataform.date = setForm.date;
        dataform.priority = setForm.priority;
      }
    })
    editing.value = 'แก้ไข';
  }
  else {

    editing.value = 'เพิ่ม';
  }
});


const deleteActivity = (activity_id) => {

  ApiMain.delete("/activity/" + activity_id).then(response => {

    if (response.status == 200) {
      Swal.fire({
        icon: "success",
        title: "ลบกิจกรรม สำเร็จ",
        showConfirmButton: 1,
        timer: 2000,
      });
      router.push("/activity-manage");
    }
  }).catch((error) => response.send(error.message))
}


const v$ = useVuelidate(rules, dataform);

const submit_form = async () => {
  const result = await v$.value.$validate();

  if (result) {
    if (states.serial) {

      if (dataform.priority != '' && dataform.farm != '') {
        let t = dataform.time;

        // let format_time = moment(t, "HH:mm:ss").format("hh:mm");

        // console.log(format_time,dataform.time);

        let priority_ = dataform.priority;
        let farmId = dataform.farm;
        ApiMain.put("/activity/" + states.serial, {
          customerId: parseInt(userid),
          projectId: farmId,
          title: dataform.activity_name,
          date: dataform.date,
          time: dataform.time,
          priority: priority_
        }).then((data) => {
          if (data.status == 200) {
            Swal.fire({
              icon: "success",
              title: "แก้ไขกิจกรรม สำเร็จ",
              showConfirmButton: 1,
              timer: 2000,
            });
          }
          router.push("/activity-manage");
        });
      }
      else {
        Swal.fire({
          icon: "warning",
          title: 'กรอกข้อมูลยังไม่ครบ',
          text: "กรุณากรอกข้อมูลให้ครบ ",
          confirmButtonColor: '#01893D',
          confirmButtonText: 'ตกลง',
          showConfirmButton: 1,
          timer: 2000,
        });
      }

    }
    else {
      if (dataform.priority != '' && dataform.farm != '') {

        console.log(dataform.time);
        ApiMain.post("/activity", {
          customerId: parseInt(userid),
          projectId: dataform.farm,
          title: dataform.activity_name,
          date: dataform.date,
          time: dataform.time,
          priority: dataform.priority

        }).then((data) => {

          if (data.status == 200) {
            Swal.fire({
              icon: "success",
              title: "เพิ่มกิจกรรม สำเร็จ",
              showConfirmButton: 1,
              timer: 2000,
            });
          }
          router.push("/activity-manage");
        });
      }
      else {
        Swal.fire({
          icon: "warning",
          title: 'กรอกข้อมูลยังไม่ครบ',
          text: "กรุณาระบุระดับความสำคัญ หรือ เลือกฟาร์ม",
          confirmButtonColor: '#01893D',
          confirmButtonText: 'ตกลง',
          showConfirmButton: 1,
          timer: 2000,
        });
      }

    }
  }
  else {
    Swal.fire({
      icon: "warning",
      title: 'กรอกข้อมูลยังไม่ครบ',
      text: "กรุณาระบุข้อมูลให้ครบ ",
      confirmButtonColor: '#01893D',
      confirmButtonText: 'ตกลง',
      showConfirmButton: 1,
      timer: 2000,
    });
  }



};
const closeSubmit = () => {
  console.log('close submit');
  router.push("/activity-manage");
};
onBeforeUnmount(() => {
  dataform.activity_name = "";
  dataform.farm = "";
  dataform.time = "";
  dataform.date = "";
  dataform.priority = "";
  dataform.farm_list = "";
});


// ------------- NEW --------------

let h_active = ref(0);
let m_active = ref(0);
let hour_list = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
let minute_list = ['00', '10', '20', '30', '40', '50']
let showDatePicker = ref(false);

let h = ref('00');
let m = ref('00');
// const form = reactive({
//   date: '',
// })

const selectHours = (h_time, index_active) => {
  h.value = h_time;
  h_active.value = index_active;

};

const selectMinutes = (m_time, index_active) => {
  m.value = m_time;
  dataform.time = h.value + ':' + m.value;

  m_active.value = index_active;

  showDatePicker.value = false;
};

</script>
<template>
  <NavbarMain>
    <div class="pl-4 pr-4  pt-4">
      <div class="flex flex-row justify-between items-center mb-4">
        <div>
          <h2 v-if="editing == 'แก้ไข'" class="text-[22px] md:text-2xl font-bold">{{ editing }}กิจกรรม</h2>
          <h2 v-if="editing == 'เพิ่ม'" class="text-[22px] md:text-2xl font-bold">{{ editing }}กิจกรรมใหม่</h2>
        </div>
        <div v-if="editing == 'แก้ไข'">
          <button type="button" @click="deleteActivity(states.serial)"
            class="btn-cancel w-[88px] bg-[#E04C4F] ml-2 hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[40px] btn-custom-add">
            <img alt="" class="inline delete lg:mt-0 bg-[#fff]" style="width: 15px; height: 15px;">
            <span class="text-sm ml-1">ลบ</span>
          </button>
        </div>
      </div>
      <div class="pt-4 rounded-[16px] bg-[#fff] pb-6">
        <form class="w-full px-4" @submit.prevent="submit_form">
          <div class="md:flex mb-6">
            <label class="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 pt-2">ชื่อกิจกรรม</label>
            <div class="w-full md:w-2/3 flex flex-col ">
              <input :class="v$.activity_name.$error ? 'border-red-500' : 'border-[#837D7B]'"
                class="appearance-none rounded-[10px] w-[203px] h-[36px]  focus:border-[#01893D] focus:ring-[#01893D]  text-[#01893D] "
                type="text" v-model="dataform.activity_name">
              <small v-if="v$.activity_name.$error" class="text-red-500 text-sm mt-1 ml-24">{{
                  v$.activity_name.$errors[0].$message
              }}</small>
            </div>
          </div>
          <div class="md:flex mb-6">
            <div class="">
              <label class="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 pt-2">
                วันที่
              </label>
            </div>
            <div class="w-full md:w-2/3 flex flex-col">
              <input :class="v$.date.$error ? 'border-red-500' : 'border-[#837D7B]'"
                class="appearance-none rounded-[10px] w-[203px] h-[40px] focus:border-[#01893D] focus:ring-[#01893D]  text-[#302520]"
                type="date" v-model="dataform.date">
              <small v-if="v$.date.$error" class="text-red-500 text-sm mt-1 ml-28">{{ v$.date.$errors[0].$message
              }}</small>
            </div>
          </div>
          <!-- <div class="md:flex mb-6">
            <div class="">
              <label class="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 pt-2">
                เวลา
              </label>
            </div>
            <div class="w-full md:w-2/3 flex flex-col">
              <div>
                <input :class="v$.time.$error ? 'border-red-500' : 'border-[#837D7B]'"
                  class="appearance-none rounded-[10px] h-[40px] focus:border-[#01893D] focus:ring-[#01893D]  text-[#01893D] w-[109px] pl-[30px]"
                  onfocus="this.showPicker()" type="time" v-model="dataform.time">
                <span class=" text-gray-500 md:text-right mb-1 md:mb-0 pl-4">นาฬิกา</span>
              </div>
              <small v-if="v$.time.$error" class="text-red-500 text-sm mt-1 ml-5">{{
                  v$.time.$errors[0].$message
              }}</small>
            </div>
          </div> -->
          <div class="mb-6">
            <div class="relative">
              <div class="flex flex-row items-center">
                <label for="province" class="block text-base text-gray-500 font-normal dark:text-white mr-4">เวลา</label>
                <div class="relative" @click="showDatePicker = true">
                  <input type="time"  v-model="dataform.time" id="datepicker" :class="v$.time.$error ? 'border-red-500' : showDatePicker == true ?'border-2 border-[#01893D] ring-[#01893D]':'border-[#837D7B]'"
                    class="text-[#01893D] bg-white border text-sm rounded-lg block w-[120px] pr-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    placeholder="--:--" disabled>
                  <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                    <img src="../assets/img/icons/select-down.svg" alt="" :class="showDatePicker ? 'rotate-180' : ''"
                      class="w-[10px]">
                  </div>
                </div>
                <div class="ml-2">
                  <span class="text-gray-500">นาฬิกา</span>
                </div>
              </div>
              <small v-if="v$.time.$error" :class="showDatePicker == true?'hidden':''" class="text-red-500 text-sm mt-1 ml-20">{{v$.time.$errors[0].$message}}</small>
              <div :class="showDatePicker == true ? '' : 'hidden'" class="z-10 absolute ml-12  w-[120px]">
                <ul id="select-time" class="bg-white mt-0.5 rounded-lg shadow h-auto ">
                  <li>
                    <div class="flex flex-row justify-center h-[150px]">
                      <div class="w-full overflow-scroll">
                        <div class="text-center py-2 cursor-pointer hover:bg-gray-100"
                          :class="{ active: h_active == index }" v-for="(item, index) in hour_list" :key="index"
                          @click="selectHours(item, index)">
                          <span class="text-base font-medium">{{ item }}</span>
                        </div>
                      </div>
                      <div class="w-full overflow-scroll">
                        <div class="text-center py-2 cursor-pointer hover:bg-gray-100"
                          :class="{ active: m_active == index }" v-for="(item, index) in minute_list" :key="index"
                          @click="selectMinutes(item, index)">
                          <span class="text-base font-medium">{{ item }}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="w-[160px]">
              <label class="text-gray-500 md:text-right mb-1 md:mb-0">
                ระดับความสำคัญ
              </label>
            </div>
            <div class="w-full mt-1">
              <div class="w-full flex text-md flex-col text-center justify-center ">
                <div class="w-full flex justify-between text-center items-center">
                  <span v-on:click="priority = 'low'"
                    class="h-[40px] w-full mx-2 rounded-[10px] cursor-pointer transition-all flex justify-center items-center"
                    :class="priority == 'low' ? 'bg-[#154293] text-white' : 'bg-[#F2F2F0] text-[#827C7B]'">
                    <p>ทั่วไป</p>
                  </span>
                  <span v-on:click="priority = 'medium'"
                    class="h-[40px] w-full mx-2 rounded-[10px] cursor-pointer transition-all flex justify-center items-center"
                    :class="priority == 'medium' ? 'bg-[#FAAF3F] text-white' : 'bg-[#F2F2F0] text-[#827C7B]'">
                    <p>กลาง</p>
                  </span>
                  <span v-on:click="priority = 'high'"
                    class="h-[40px] w-full mx-2 rounded-[10px] cursor-pointer transition-all flex justify-center items-center"
                    :class="priority == 'high' ? 'bg-[#E04C4F] text-white' : 'bg-[#F2F2F0] text-[#827C7B]'">
                    <p>สูง</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="">
              <label class="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4" for="inline-date">
                เลือกฟาร์ม
              </label>
            </div>
            <div class="">
              <div class="my-auto relative" v-on:click="selectedOpen = !selectedOpen">
                <input placeholder="เลือกฟาร์ม" disabled
                  class="bg-white rounded-[10px] h-10 p-1 pr-12 px-2 appearance-none outline-none w-full truncate whitespace-nowrap overflow-hidden text-[#01893D]"
                  v-model="dataform.selectedFarm" style="border: 1px solid #837D7B;">
                <img class="flex absolute right-2 top-[15px] bg-transparent rounded text-base text-gray-600"
                  src="@/assets/img/icons/select-down.svg" alt="" :class="selectedOpen ? 'rotate-180' : ''"
                  style="width: 20px">
                <div
                  class="absolute shadow bg-white top-100 z-40 w-full lef-0 max-h-select overflow-y-auto rounded-[16px] mt-2 border-[#01893D] border-2"
                  v-if="selectedOpen == true">
                  <div class="flex flex-col w-full">
                    <div v-for="(item, index) in dataform.farm_list" :value="item.id" :key="index"
                      class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                      v-on:click="selectedOpen = !selectedOpen">
                      <div
                        class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100"
                        @click="dataform.selectedFarm = item.name, selectedOpen = !selectedOpen, id_farm = item.id">
                        <div class="w-full items-center flex p-2">
                          <div class="mx-2 hover:text-[#9BD226] text-[#01893D]">
                            {{ item.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-4 md:px-16">
            <button type="submit"
              class="btn-ok w-full bg-[#01893D] mr-2 hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[40px] btn-custom-add">
              <img alt="" class="inline check lg:mt-0 bg-[#fff]" style="width: 20px; height: 20px;">
              <span class="text-sm ml-1">ตกลง</span>
            </button>
            <button type="button" @click="closeSubmit"
              class="btn-cancel w-full bg-[#01893D] ml-2 hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[40px] btn-custom-add">
              <img alt="" class="inline close lg:mt-0 bg-[#fff]" style="width: 15px; height: 15px;">
              <span class="text-sm ml-1">ยกเลิก</span>
            </button>
          </div>
        </form>
      </div>
    </div>

  </NavbarMain>
</template>




<style scoped>
@import "@/assets/styles/custom-icons.css";

#select-time > li > div > div > div.active {
  background-color: #31C48D;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 1;
  display: block;
  background: url(@/assets/img/icons/calendar_month.png) no-repeat center;
  width: 20px;
  height: 20px;
  border-width: thin;
}

input[type="time"]::-webkit-calendar-picker-indicator {
  display: none;
}

.btn-ok:hover img {
  background: #01893D;
}

.btn-cancel:hover img {
  background: #01893D;
}
</style>

