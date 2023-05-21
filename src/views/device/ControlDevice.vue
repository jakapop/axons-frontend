<script setup>
import NavbarMain from "../../layouts/NavbarMain.vue";
import HeaderFarm from "../../components/Headers/HeaderFarm.vue";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useMainStore } from "@/stores/main";
import { flip } from "@popperjs/core";

const router = useRouter();
const mainStore = useMainStore();

// Menu
let isActive = ref('custom');

// switch
// 1.คลิกเปิด-ปิด :สั่งงาน
let checked_switch = ref(false);
let colorfill = ref('#827C7B');

// 2.คลิกเปิด-ปิด :อัตโนมัติ
let checked_switch_auto = ref(false);
let colorfill2 = ref('#827C7B');

let time_list = ref([
  { id: 1, start_time: '', end_time: '' },
  { id: 2, start_time: '', end_time: '' },
  { id: 3, start_time: '', end_time: '' },
  { id: 4, start_time: '', end_time: '' },
  { id: 5, start_time: '', end_time: '' },
  { id: 6, start_time: '', end_time: '' },
  { id: 7, start_time: '', end_time: '' },
  { id: 8, start_time: '', end_time: '' },
]);
let days = ref([
  { id: 1, name: 'จันทร์' },
  { id: 2, name: 'อังคาร' },
  { id: 3, name: 'พุธ' },
  { id: 4, name: 'พฤหัสบดี' },
  { id: 5, name: 'ศุกร์' },
  { id: 6, name: 'เสาร์' },
  { id: 7, name: 'อาทิตย์' },
  { id: 8, name: 'ทุกวัน' },
]);

const state = reactive({
  serial: '',
  slot: '',
  device_name: '',
  device_id:"",

  devices_setting_all:"",
  devices_setting:"",
  day_show:"",
  val_auto:0,
  sensor_all:"",
  sensor_id:"",
  sensor_condi:"มากกว่า",

  val_disabled:false,
  senser_unit:[],
  sensor_count:1,
  unit_show:""
});

const dataform_timer = reactive({
  select_timer: [],
  start_time: [],
  end_time: [],
  checked_day: []
})

onMounted(() => {
  let url = new URL(window.location.href);
  let boards = url.searchParams.get("board");
  state.slot = url.searchParams.get("slot");

  state.serial = boards;
  ApiCore.get("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + boards + "/devices").then((response) => {
    state.devices_setting_all = response.data.data[0].settings
    Object.keys(state.devices_setting_all).filter((key)=>{
      if(state.devices_setting_all[key].slot == state.slot){
        state.devices_setting = state.devices_setting_all[key]
        state.device_name = state.devices_setting_all[key].name.th
        state.device_id = state.devices_setting_all[key].device_id
        console.log(state.devices_setting_all[key].type)

          if(state.devices_setting_all[key].type == "custom"){
            clickmenu('custom')
            if(state.devices_setting_all[key].config_custom.status == "on"){
              checked_switch.value = true
            }

          }else if(state.devices_setting_all[key].type == "schedule"){
            clickmenu('schedule')
            if(state.devices_setting_all[key].config_schedule.day.sun){
              dataform_timer.checked_day[0] = "อาทิตย์"
            }
            if(state.devices_setting_all[key].config_schedule.day.mon){
              dataform_timer.checked_day[1] = "จันทร์"
            }
            if(state.devices_setting_all[key].config_schedule.day.tue){
              dataform_timer.checked_day[2] = "อังคาร"
            }
            if(state.devices_setting_all[key].config_schedule.day.wen){
              dataform_timer.checked_day[3] = "พุธ"
            }
            if(state.devices_setting_all[key].config_schedule.day.thu){
              dataform_timer.checked_day[4] = "พฤหัสบดี"
            }
            if(state.devices_setting_all[key].config_schedule.day.fri){
              dataform_timer.checked_day[5] = "ศุกร์"
            }
            if(state.devices_setting_all[key].config_schedule.day.sat){
              dataform_timer.checked_day[6] = "เสาร์"
            }

            const obj_times = state.devices_setting_all[key].config_schedule.time
            Object.keys(obj_times).forEach(key_time => {
              if(obj_times[key_time].status == "on"){
                dataform_timer.select_timer[parseInt(key_time)+1] = true
              }
              dataform_timer.start_time[parseInt(key_time)+1] = obj_times[key_time].start
              dataform_timer.end_time[parseInt(key_time)+1] = obj_times[key_time].end
            });

        }else if(state.devices_setting_all[key].type == "auto"){
          clickmenu('auto')
          state.val_auto = state.devices_setting_all[key].config_auto.val
          setActiveSensor(state.devices_setting_all[key].config_auto.sensor_id)

          ApiCore.get("/v2/sensors/"+state.devices_setting_all[key].config_auto.sensor_id)
          .then((response) => {
            if( typeof response.data.data.unit !== "undefined"){
              state.unit_show = response.data.data.unit.th
            }
          })
          if(state.devices_setting_all[key].config_auto.status == "on"){
            checked_switch_auto.value = true
            state.val_disabled = true
          }
        }
      }
    });

    ApiCore.get("/v2/boards/"+state.serial+"/sensor/")
    .then((response) => {
      state.sensor_all = response.data.data.sensors
      const unit_all = state.sensor_all
      Object.keys(unit_all).forEach(key => {
        state.senser_unit[unit_all[key].id] = unit_all[key].unit.th
      })
    })

  });

  ApiCore.get("/v2/boards/" + state.serial + "/sensor").then((response) => {
    state.sensor_count = response.data.data.sensors.length;
    console.log("sensor_count",state.sensor_count)
  });

});

const clickmenu = (menu) => {
  console.log("clickmenu",menu)

    ApiCore.get("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + state.serial + "/devices")
    .then((response) => {
    state.devices_setting_all = response.data.data[0].settings
      Object.keys(state.devices_setting_all).filter((key)=>{
        if(state.devices_setting_all[key].slot == state.slot){
          console.log("debug11",state.devices_setting_all[key].type)

          let main_status = "off"
          console.log(state.devices_setting_all[key].config_schedule)

          if(state.devices_setting_all[key].config_custom != null){
            main_status = state.devices_setting_all[key].config_custom.status
          }
          else if(state.devices_setting_all[key].config_schedule != null){
            main_status = state.devices_setting_all[key].config_schedule.status
          }
          else if(state.devices_setting_all[key].config_auto != null){
            main_status = state.devices_setting_all[key].config_auto.status
          }

          if(state.devices_setting_all[key].type != menu && main_status=="on"){
            let mode = ""
            if(state.devices_setting_all[key].type == "custom"){
              mode = "กำหนดเอง"
            }else if(state.devices_setting_all[key].type == "schedule"){
              mode = "ตั้งเวลา"
            }else if(state.devices_setting_all[key].type == "auto"){
              mode = "อัตโนมัติ"
            }
            Swal.fire({
              icon: "warning",
              title: "ขณะนี้ คุณเปิดใช้งานโหมด "+mode+" อยู่ กรุณาทำการปิดก่อนเพื่อใปใช้งานในโหมดอื่นๆ",
              showConfirmButton: 1,
              timer: 3000,
            })
          }else{
             isActive.value = menu;
          }
        }
      })
    })

};

const switchOn = (event) => {
  checked_switch.value = event.target.checked;
  let action = "off"
  if (checked_switch.value == true) {
    colorfill.value = '#01893D';
    action = "on"
  }else {
    colorfill.value = '#827C7B';
  }

  ApiCore.put("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + state.serial + "/devices/" + state.device_id , {
    "type": "custom",
    "slot": state.slot,
    "configCustom": {"status": action},
    "updateBy": mainStore.userFirstName}
  ).then((response) => {
    if(response.status == 204){
      console.log(response.status)
    }
  })
}

const switchOnAuto = (event) => {

  console.log("switchOnAuto" + event.target.checked)
  console.log("sensor_id" , state.sensor_id)
  console.log("val_auto" , state.val_auto)

  if(event.target.checked && state.sensor_id==""){
    Swal.fire({
      icon: "warning",
      title: "กรุณาเลือกเซนเซอร์",
      showConfirmButton: 1,
      timer: 2000,
    })
    checked_switch_auto.value = false
    return;
  }

  let action = "off"
  checked_switch_auto.value = event.target.checked;
  let auto_val = document.querySelector("#auto_val");
  if (checked_switch_auto.value == true) {
    action = "on"
    colorfill2.value = '#01893D';
    state.val_disabled = true
    auto_val.classList.remove("text-green-600");
    auto_val.classList.add("text-gray-400");
  }else {
    colorfill2.value = '#827C7B';
    state.val_disabled = false
    auto_val.classList.remove("text-gray-400");
    auto_val.classList.add("text-green-600");
  }

  ApiCore.put("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + state.serial + "/devices/" + state.device_id , {
    "type": "auto",
    "slot": state.slot,
    "configAuto": {
      "sensor_id": state.sensor_id,
      "start": state.val_auto+1,
      "finish": state.val_auto+1,
      "val": state.val_auto,
      "status": action
	  },
    "updateBy": mainStore.userFirstName}
  ).then((response) => {
    if(response.status == 204){
       console.log(response.status)
    }
  })

}

// const submit = () => {
//   console.log('click submit !!');
// };

const submit_timer = (action) => {
  console.log('submit timer')
  // console.log(dataform_timer.select_timer)
  // console.log(dataform_timer.start_time)
  // console.log(dataform_timer.end_time)
  // console.log(dataform_timer.checked_day)
  let arr_times = []
  let ck_time = true
  let ck_day = false
  let ck_action = "on"
  let messege = "กรุณาตั้งเวลาให้ถูกต้อง"
  if(action == "cancel"){
    ck_action = "off"
  }
  Object.values(dataform_timer.checked_day).forEach(val => {
    //console.log(val)
    if(val=="จันทร์" || val=="อังคาร" || val=="พุธ" || val=="พฤหัสบดี" || val=="ศุกร์" || val=="เสาร์" || val=="อาทิตย์"){
      ck_day = true
    }else{
      messege = "กรุณากำหนดวัน"
    }
  })

  Object.keys(time_list.value).forEach(key => {
    if(typeof dataform_timer.start_time[parseInt(key)+1] !== 'undefined' && typeof dataform_timer.end_time[parseInt(key)+1] !== 'undefined'){
      if(dataform_timer.start_time[parseInt(key)+1] == dataform_timer.end_time[parseInt(key)+1]){
        ck_time = false
        messege = "กรุณาตั้งเวลาให้ถูกต้อง"
      }
      let select_timer = "off"
      if(dataform_timer.select_timer[parseInt(key)+1]){
          select_timer = "on"
      }
      // console.log("start_time",dataform_timer.start_time[parseInt(key)+1])
      // console.log("end_time",dataform_timer.end_time[parseInt(key)+1])
      arr_times.push({
				"start": dataform_timer.start_time[parseInt(key)+1],
				"end": dataform_timer.end_time[parseInt(key)+1],
				"status": select_timer
      })
    }
  })

  if(ck_time && ck_day){
    let mon = false
    let tue = false
    let wen = false
    let thu = false
    let fri = false
    let sat = false
    let sun = false

    const obj_checked_day = dataform_timer.checked_day
    Object.values(obj_checked_day).forEach(val => {
      if(val=="จันทร์"){
        mon = true
      }else if(val=="อังคาร"){
        tue = true
      }else if(val=="พุธ"){
        wen = true
      }else if(val=="พฤหัสบดี"){
        thu = true
      }else if(val=="ศุกร์"){
        fri = true
      }else if(val=="เสาร์"){
        sat = true
      }else if(val=="อาทิตย์"){
        sun = true
      }
    });

    ApiCore.put("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + state.serial + "/devices/" + state.device_id , {
      "type": "schedule",
      "slot": state.slot,
      "configSchedule": {
      "day": {
            "mon": mon,
            "tue": tue,
            "wen": wen,
            "thu": thu,
            "fri": fri,
            "sat": sat,
            "sun": sun
        },
        "time": arr_times,
        "status": ck_action
      },
      "updateBy": mainStore.userFirstName}
    ).then((response) => {
      if(response.status == 204){
        let title = "ตั้งค่าอุปกรณ์สำเร็จ"
        if(action == "cancel"){
          title = "ยกเลิก ตั้งค่าอุปกรณ์สำเร็จ"
        }
        Swal.fire({
              icon: "success",
              title: title,
              showConfirmButton: 1,
              timer: 2000,
            })
      }
    })
  }else{
    Swal.fire({
      icon: "warning",
      title: messege,
      showConfirmButton: 1,
      timer: 2000,
     })
  }
}

const add_day = (event,day) => {

  if(day=="ทุกวัน" && event.target.checked){
    dataform_timer.checked_day[0] = "อาทิตย์"
    dataform_timer.checked_day[1] = "จันทร์"
    dataform_timer.checked_day[2] = "อังคาร"
    dataform_timer.checked_day[3] = "พุธ"
    dataform_timer.checked_day[4] = "พฤหัสบดี"
    dataform_timer.checked_day[5] = "ศุกร์"
    dataform_timer.checked_day[6] = "เสาร์"
    dataform_timer.checked_day[7] = "ทุกวัน"
  }else if(day=="ทุกวัน" && !event.target.checked){
    dataform_timer.checked_day[0] = ""
    dataform_timer.checked_day[1] = ""
    dataform_timer.checked_day[2] = ""
    dataform_timer.checked_day[3] = ""
    dataform_timer.checked_day[4] = ""
    dataform_timer.checked_day[5] = ""
    dataform_timer.checked_day[6] = ""
    dataform_timer.checked_day[7] = ""
  }

}

let sensor_active = ref(false);

const setActiveSensor = (sensor_id) =>{
  console.log("device_id",state.device_id)
  console.log("sensor_id",sensor_id)
  console.log("sensor_condi",state.sensor_condi)
  if(!state.val_disabled){

    if(state.device_id == 1 || state.device_id == 2 || state.device_id == 5){ // ปั้มน้ำ , พัดลมระบายความร้อน , วาล์วน้ำ
      if(sensor_id == 2 || sensor_id == 3){
        state.sensor_condi = "น้อยกว่า"
      }else{
        state.sensor_condi = "มากกว่า"
      }
    }

    if(state.device_id == 6 || state.device_id == 3){ // พัดลมระบายความเย็น // หลอดไฟ
      if(sensor_id == 1 || sensor_id == 8 || sensor_id == 12){
        state.sensor_condi = "น้อยกว่า"
      }else{
        state.sensor_condi = "มากกว่า"
      }
    }

    if(state.device_id == 4 || state.device_id == 7){ // มอเตอร์ // สัญญาญแจ้งเตือน
        state.sensor_condi = "มากกว่า"
    }

    state.unit_show = state.senser_unit[sensor_id]
    state.sensor_id = sensor_id
    sensor_active.value = sensor_id
  }

};

</script>
<template>
  <NavbarMain>
    <div>
      <HeaderFarm />
      <div class="m-4">
        <div class="flex flex-row justify-between">
          <div>
            <h1 class="font-bold text-[22px] mb-4">สั่งงานอุปกรณ์</h1>
            <p  class="font-medium text-base mb-4">ช่องที่ {{ state.slot }} {{state.device_name}}  </p>
          </div>
          <!-- <div>
            <router-link :to="`/history-device?board=${state.serial}`" class="bg-[#01893D] hover:bg-green-700 font-medium text-sm md:text-base text-white rounded-[8px] px-2 sm:px-4  py-2 flex items-center">ประวัติการทำงาน</router-link>
          </div> -->
        </div>
        <div class="bg-white rounded-2xl p-4">
          <!-- Menu -->
          <div class="flex flex-row items-center gap-2">
            <button :class="{ active: isActive == 'custom' }" @click="clickmenu('custom')"
              class="py-2 px-4 rounded-lg bg-[#F2F2F0] text-[#827C7B] font-medium w-full text-sm">กำหนดเอง</button>
            <button :class="{ active: isActive == 'schedule' }" @click="clickmenu('schedule')"
              class="py-2 px-4 rounded-lg bg-[#F2F2F0] text-[#827C7B] font-medium w-full text-sm">ตั้งเวลา</button>
            <button v-if="state.sensor_count>0" :class="{ active: isActive == 'auto' }" @click="clickmenu('auto')"
              class="py-2 px-4 rounded-lg bg-[#F2F2F0] text-[#827C7B] font-medium w-full text-sm">อัตโนมัติ</button>
          </div>
          <!-- คลิกสั่งงาน -->
          <div v-if="isActive == 'custom'" class="mt-8">
            <div class="flex flex-col items-center justify-center content-center">
              <h1 class="font-medium text-base md:text-lg text-center">
                <span v-if="checked_switch == true" class="text-[#01893D]">อุปกรณ์กำลังทำงาน</span>
                <span v-else class="text-[#302421]">อุปกรณ์ไม่ได้ทำงาน</span>
              </h1>
              <div class="my-4">
                <svg width="128" height="128" viewBox="0 0 128 128" :fill="colorfill" xmlns="http://www.w3.org/2000/svg"
                  :class="checked_switch == true ? 'bg-[#D5E7D9]' : 'bg-[#D9D9D9]'" class=" rounded-full">
                  <mask id="mask0_4273_8525" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="128"
                    height="128">
                    <rect width="128" height="128" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_4273_8525)">
                    <path
                      d="M63.9996 69.334C62.7559 69.334 61.7116 68.8892 60.8668 67.9996C60.022 67.11 59.5996 66.0433 59.5996 64.7996V19.734C59.5996 18.5777 60.022 17.5548 60.8668 16.6652C61.7116 15.7777 62.7559 15.334 63.9996 15.334C65.2434 15.334 66.31 15.7777 67.1996 16.6652C68.0892 17.5548 68.534 18.5777 68.534 19.734V64.7996C68.534 66.0433 68.0892 67.11 67.1996 67.9996C66.31 68.8892 65.2434 69.334 63.9996 69.334ZM63.9996 112.134C57.333 112.134 51.0887 110.867 45.2668 108.332C39.445 105.8 34.3559 102.356 29.9996 97.9996C25.6434 93.6433 22.1991 88.5319 19.6668 82.6652C17.1324 76.7985 15.8652 70.5767 15.8652 63.9996C15.8652 57.7767 17.0215 51.8215 19.334 46.134C21.6444 40.4444 24.9778 35.3329 29.334 30.7996C30.2215 29.8225 31.3319 29.2892 32.6652 29.1996C33.9986 29.11 35.1548 29.51 36.134 30.3996C36.8444 31.1996 37.1996 32.1553 37.1996 33.2668C37.1996 34.3783 36.8444 35.4225 36.134 36.3996C32.4007 40.1329 29.5783 44.3772 27.6668 49.1324C25.7554 53.8876 24.7996 58.8433 24.7996 63.9996C24.7996 74.8433 28.6215 84.0657 36.2652 91.6668C43.9111 99.2657 53.1559 103.065 63.9996 103.065C74.8434 103.065 84.0882 99.2657 91.734 91.6668C99.3778 84.0657 103.2 74.8433 103.2 63.9996C103.2 58.7559 102.222 53.7564 100.265 49.0012C98.3111 44.2439 95.4674 39.9548 91.734 36.134C91.0215 35.2444 90.6876 34.2439 90.7324 33.1324C90.7772 32.0209 91.1996 31.11 91.9996 30.3996C92.9767 29.4225 94.1319 29.0449 95.4652 29.2668C96.7986 29.4887 98.0434 30.1329 99.1996 31.1996C103.466 35.6433 106.689 40.6876 108.867 46.3324C111.045 51.9772 112.134 57.8663 112.134 63.9996C112.134 70.5767 110.867 76.7985 108.332 82.6652C105.8 88.5319 102.356 93.6433 97.9996 97.9996C93.6434 102.356 88.5543 105.8 82.7324 108.332C76.9106 110.867 70.6663 112.134 63.9996 112.134Z"
                      :fill="colorfill" />
                  </g>
                </svg>
              </div>
              <div class="text-center ml-5 my-4">
                <label class="relative inline-flex items-center mr-5 cursor-pointer">
                  <input type="checkbox" v-model="checked_switch" @change="switchOn($event)" class="sr-only peer">
                  <div
                    class="w-[60px] h-[32px] bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-1 peer-focus:ring-[#34C759] dark:peer-focus:ring-[#34C759] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-[#34C759]">
                  </div>
                </label>
              </div>
              <div>
                <p class="text-sm md:text-base font-medium">แตะที่ปุ่มเพื่อเปิด หรือ ปิด</p>
              </div>
            </div>
          </div>
          <!-- คลิก ตั้งเวลา -->
          <div v-else-if="isActive == 'schedule'" class="mt-8">
            <div class="mb-4">
              <h1 class="text-base font-medium">ตั้งเวลา</h1>
            </div>
            <form @submit.prevent="submit_timer">
              <div class="flex flex-col mt-4 mb-4">
                <div class="flex items-center gap-4 mb-4" v-for="(device, index) in time_list" :key="index">
                  <div>
                    <input :id="'input' + device.id" type="checkbox" v-model="dataform_timer.select_timer[index+1]"
                      :value="device.id" name="device" class="w-4 h-4 md:w-5 md:h-5 rounded-full text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                  </div>
                  <div class="flex flex-row items-center w-full sm:w-[300px] lg:w-[500px]">
                    <input type="time" v-model="dataform_timer.start_time[index+1]"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
                    <span class="text-base font-medium mx-4">ถึง</span>
                    <input type="time" v-model="dataform_timer.end_time[index+1]"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <h1 class="font-medium text-base mb-4">กำหนดวัน : {{ state.day_show }}</h1>
                <ul class="grid grid-cols-4 w-full gap-2 ">
                  <li v-for="day in days" :key="day.id">
                    <input type="checkbox" :id="day.name" v-model="dataform_timer.checked_day" :value="day.name"
                      class="hidden peer" @click="add_day($event,day.name)">
                    <label :for="day.name"
                      class="inline-flex whitespace-nowrap justify-center items-center w-full py-2 px-4 text-gray-500 rounded-lg cursor-pointer bg-[#F2F2F0] dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-[#01893D] peer-checked:text-white hover:text-gray-600 dark:peer-checked:text-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <span>{{ day.name }}</span>
                    </label>
                  </li>
                </ul>
              </div>
              <div class="flex justify-center mt-10 mb-4">
                <button type="submit"
                  class="bg-[#01893D] mr-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom w-full">
                  <img alt="" class="inline check lg:mt-0 bg-[#fff]" style="width: 20px; height: 20px" />
                  <span class="text-sm ml-1">เริ่มใช้งาน</span>
                </button>
                <button @click="submit_timer('cancel')" type="button"
                  class="modal-close bg-[#01893D] ml-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom w-full">
                  <img alt="" class="inline close lg:mt-0 bg-[#fff]" style="width: 15px; height: 15px" />
                  <span class="text-sm ml-1">ยกเลิก</span>
                </button>
              </div>
            </form>
          </div>
          <!-- คลิกอัตโนมัติ -->
          <div v-else-if="isActive == 'auto'" class="mt-8">
            <!-- มีข้อมูล sensor -->
            <div class="">
              <h1 class="font-medium text-base md:text-lg mb-4">เลือกเซนเซอร์</h1>
              <div class="grid grid-cols-3 md:grid-cols-6 gap-4 mx-0 md:mx-0 xl:mx-[50px]" >
                <div v-for="(item, index) in state.sensor_all" :key="index">
                  <div class="flex flex-col items-center" :class="{ active: sensor_active == item.id }" @click="setActiveSensor(item.id)">
                    <img v-if="sensor_active != item.id" :src="`img/sensor/${item.id}.png`" style="-webkit-filter: grayscale(100%); filter: grayscale(100%);" class="mb-1 w-[48px] h-[48px]">
                    <img v-else :src="`img/sensor/${item.id}.png`" class="mb-1 w-[48px] h-[48px]">
                    <span :class="sensor_active == item.id ?'text-[#01893D]':'text-black'" class="text-[10px] lg:text-sm font-bold lg:font-medium text-res whitespace-nowrap">{{ item.name.th }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-10 mb-4">
                <!-- <button type="button"
                  class="rounded-lg py-2 px-4 w-full h-[36px] bg-[#01893D] text-sm md:text-base font-bold flex flex-row justify-center items-center">
                  <img alt="" class="block lg:mt-0 add bg-white mr-2" style="width:24px; height: 24px">
                  <span class="text-white">ดูเพิ่มเติม</span>
                </button> -->
              </div>
              <hr class="border-[#01893D] border-1 rounded-lg">
              <div class="my-4 flex flex-row items-center">
                <div class="flex flex-row items-center">
                  <label for="first_name"
                    class="block font-medium text-base text-gray-900 dark:text-white w-[100px]">มีค่า{{ state.sensor_condi }}</label>
                  <input type="number" id="auto_val" :disabled="state.val_disabled" v-model="state.val_auto"
                    class=" bg-gray-50 border border-gray-300 text-xl font-medium text-green-600 rounded-lg focus:ring-green-500 focus:border-green-500 block w-[80px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div class="ml-4">
                  <span class="font-medium text-base"> {{ state.unit_show }}</span>
                </div>
              </div>
              <div class="flex flex-col items-center justify-center content-center">
                <div class="my-4">
                  <svg width="128" height="128" viewBox="0 0 128 128" :fill="colorfill2"
                    xmlns="http://www.w3.org/2000/svg"
                    :class="checked_switch_auto == true ? 'bg-[#D5E7D9]' : 'bg-[#D9D9D9]'" class=" rounded-full">
                    <mask id="mask0_4273_8525" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                      width="128" height="128">
                      <rect width="128" height="128" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_4273_8525)">
                      <path
                        d="M63.9996 69.334C62.7559 69.334 61.7116 68.8892 60.8668 67.9996C60.022 67.11 59.5996 66.0433 59.5996 64.7996V19.734C59.5996 18.5777 60.022 17.5548 60.8668 16.6652C61.7116 15.7777 62.7559 15.334 63.9996 15.334C65.2434 15.334 66.31 15.7777 67.1996 16.6652C68.0892 17.5548 68.534 18.5777 68.534 19.734V64.7996C68.534 66.0433 68.0892 67.11 67.1996 67.9996C66.31 68.8892 65.2434 69.334 63.9996 69.334ZM63.9996 112.134C57.333 112.134 51.0887 110.867 45.2668 108.332C39.445 105.8 34.3559 102.356 29.9996 97.9996C25.6434 93.6433 22.1991 88.5319 19.6668 82.6652C17.1324 76.7985 15.8652 70.5767 15.8652 63.9996C15.8652 57.7767 17.0215 51.8215 19.334 46.134C21.6444 40.4444 24.9778 35.3329 29.334 30.7996C30.2215 29.8225 31.3319 29.2892 32.6652 29.1996C33.9986 29.11 35.1548 29.51 36.134 30.3996C36.8444 31.1996 37.1996 32.1553 37.1996 33.2668C37.1996 34.3783 36.8444 35.4225 36.134 36.3996C32.4007 40.1329 29.5783 44.3772 27.6668 49.1324C25.7554 53.8876 24.7996 58.8433 24.7996 63.9996C24.7996 74.8433 28.6215 84.0657 36.2652 91.6668C43.9111 99.2657 53.1559 103.065 63.9996 103.065C74.8434 103.065 84.0882 99.2657 91.734 91.6668C99.3778 84.0657 103.2 74.8433 103.2 63.9996C103.2 58.7559 102.222 53.7564 100.265 49.0012C98.3111 44.2439 95.4674 39.9548 91.734 36.134C91.0215 35.2444 90.6876 34.2439 90.7324 33.1324C90.7772 32.0209 91.1996 31.11 91.9996 30.3996C92.9767 29.4225 94.1319 29.0449 95.4652 29.2668C96.7986 29.4887 98.0434 30.1329 99.1996 31.1996C103.466 35.6433 106.689 40.6876 108.867 46.3324C111.045 51.9772 112.134 57.8663 112.134 63.9996C112.134 70.5767 110.867 76.7985 108.332 82.6652C105.8 88.5319 102.356 93.6433 97.9996 97.9996C93.6434 102.356 88.5543 105.8 82.7324 108.332C76.9106 110.867 70.6663 112.134 63.9996 112.134Z"
                        :fill="colorfill2" />
                    </g>
                  </svg>
                </div>
                <div class="text-center ml-5 my-4">
                  <label class="relative inline-flex items-center mr-5 cursor-pointer">
                    <input type="checkbox" v-model="checked_switch_auto" @change="switchOnAuto($event)"
                      class="sr-only peer">
                    <div
                      class="w-[60px] h-[32px] bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-1 peer-focus:ring-[#34C759] dark:peer-focus:ring-[#34C759] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-[#34C759]">
                    </div>
                  </label>
                </div>
                <div>
                  <p class="text-sm md:text-base font-medium">แตะที่ปุ่มเพื่อเปิด หรือ ปิด</p>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-[10px] md:text-sm font-bold">หมายเหตุ : จำเป็นต้องปิดการทำงานของอุปกรณ์ก่อนแก้ไขการตั้งค่า</p>
              </div>
            </div>
            <!-- ไม่มีข้อมูล sensor -->
            <div class="hidden">
              <div class="flex flex-col justify-center content-center">
              <h1 class="text-base font-medium my-10 text-center">ไม่พบเซนเซอร์</h1>
              <div class="flex content-center">
                <button class="w-full md:w-[500px] bg-[#01893D] py-1.5 px-4 rounded-lg">
                  <img alt="" class="inline-block support mr-3 bg-[#fff] " style="width: 20px; height: 20px" />
                  <span class="text-base font-medium text-white">ติดต่อเรา</span>
                </button>
              </div>
            </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  </NavbarMain>
</template>
<style scoped>
@import "@/assets/styles/custom-icons.css";


@media only screen and (max-width: 1162px) {
  .text-res {
    font-size: 12px;
  }

}
@media only screen and (max-width: 400px) {
  .text-res {
    font-size: 10px;
  }

}
button.active {
  background-color: #01893D;
  color: white;
}
</style>
