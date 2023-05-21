<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed, onUpdated } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment-with-locales-es6";

import Swal from "sweetalert2";

const props = defineProps({
  showhome: {
    type: Boolean,
  }
});



const states = reactive({
  data_all :[],
  obj_activity: [],
  activities_today: [],
  days: [],
  project_all: [],
  showhome: props.showhome
});

let limit_item = ref(1);
let total_item = ref(0);

const router = useRouter();
const userid = localStorage.getItem("userid");

let today_th = ref("");
let today = ref("");
let month = ref("");
let year = ref("");
let click = ref(false);
let monthNamesThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",];
let dayNames = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์",];
let dayNames_short = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];


onMounted(async () => {
  let obj_day = states.days;
  ApiMain.get("/activity/count-7-day/" + userid).then((res) => {
    let obj = res.data.data;
    // console.log('count 7 = ',obj);
    obj.forEach((element) => {
      let date = element.date;
      let have_activity = moment(date).locale("th").format("YYYY-MM-DD");
      for (let index = 0; index < obj_day.length; index++) {
        const element = obj_day[index];
        let day = element.date_format;
        if (day == have_activity) {
          states.days[index].activity_val = false;
        }
      }
    });
  });
  let d = new Date();
  today_th.value = dayNames[d.getDay()];
  today.value = moment().locale("th").format("D");
  month.value = monthNamesThai[d.getMonth()];
  year.value = (parseInt(moment().locale("th").format("YYYY")) + 543).toString();

  let requests = [];

  for (var index = 0; index < 7; index++) {
    let date = new Date(new Date().setDate(new Date().getDate() + index));
    const daynow = moment().locale("th").format("D");
    const date_format = moment(date).locale("th").format("YYYY-MM-DD");
    let d = dayNames_short[date.getDay()];
    let short_day = "";
    let only_day = moment(date).locale("th").format("D");
    if (daynow == only_day) {
      short_day = "วันนี้";
    } else {
      short_day = dayNames_short[date.getDay()];
    }
    states.days.push({
      short_day: short_day,
      date: only_day,
      full_date: date,
      date_format: date_format,
      isActive: false,
      activity_val: true,
      activity_data: []
    });
    // Get Activity 7 Days
    let full_date_send = moment(date).locale("th").format("YYYY-MM-DD");
    const apiUrl = ApiMain.get(`/activity/by-customer/${userid}?date=${full_date_send}&order=ASC&page=1&take=99999`);
    requests.push(apiUrl);
  }

  Promise.all(requests).then((responses) => {
    for (let index = 0; index < 7; index++) {
      states.days[index].activity_data = responses[index].data.data;
    }

    let obj_farmlist = [];
    ApiCore.get("/v2/projects/?limit=all").then((response) => {

      obj_farmlist = response.data.data;
      console.log('farm name list == ', obj_farmlist);

      let result = states.days.map((obj1) => {
        let activityArr = obj1.activity_data.map((act) => {
          let farmName = "";
          let farmObj = obj_farmlist.find((obj2) => obj2.id == act.projectId);
          if (farmObj) {
            farmName = farmObj.name;
          }
          return {...act, farm_name: farmName};
        });

        let activity = sortData(activityArr);
        return {...obj1, activity_data: activity};
      });
      states.obj_activity = result ;
      states.activities_today = result[0].activity_data ;
    });

  }).catch((error) => {
    console.error('Error fetching resources:', error);
  });

  console.log(' 7 days == ', states.days);
  // states.activities_today = states.days[0].activity_data;
});





const sortData = (obj) => {

  obj.sort(function (a, b) {
    if (a.priority === 'high' && b.priority !== 'high') {
      return -1;
    } else if (b.priority === 'high' && a.priority !== 'high') {
      return 1;
    } else if (a.priority === 'medium' && (b.priority === 'low' || b.priority === 'high')) {
      return -1;
    } else if (b.priority === 'medium' && (a.priority === 'low' || a.priority === 'high')) {
      return 1;
    } else {
      return 0;
    }

  });
  obj.sort(function (a, b) {
    let timeA = a.time.split(':');
    let timeB = b.time.split(':');
    let dateA = new Date(0, 0, 0, timeA[0], timeA[1], timeA[2]);
    let dateB = new Date(0, 0, 0, timeB[0], timeB[1], timeB[2]);
    return dateA - dateB;
  });
  return obj
}



const setActiveDays = (index, full_date) => {

  let select_date =  moment(full_date).locale("th").format("D") ;
  let result =  states.obj_activity.filter(item=>item.date == select_date) ;
  states.activities_today = result[0].activity_data ;

  let full_date_send = moment(full_date).locale("th").format("YYYY-MM-DD");
  let x = states.days.filter(item => item.date_format == full_date_send);

  today_th.value = dayNames[full_date.getDay()];
  today.value = moment(full_date).locale("th").format("D");
  month.value = monthNamesThai[full_date.getMonth()];
  year.value = (parseInt(moment(full_date).locale("th").format("YYYY")) + 543).toString();

  activeDay(index);
};

const fixed_longString = (str) => {
  if (str.length > 20) {
    let text = str.substring(0, 10) + '...';

    return text;
  }
  else {
    return str;
  }
}

const formatTime = (time) => {
  let format_time = time.slice(0, time.lastIndexOf(":"));
  return format_time;
};

const edit_data = (id) => {
  console.log(id);
  let path = '/viewActivity?activity_id=' + id;
  router.push(path);
};


const delete_data = (id) => {

  Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบใช้หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#01893D",
    cancelButtonColor: "#D22626",
    confirmButtonText: "ตกลง",
    cancelButtonText:"ยกเลิก"
  }).then((result) => {
    if (result.isConfirmed == true) {
      ApiMain.delete("/activity/" + id).then(response => {
        if (response.status == 200) {
          location.reload();
        }
      });
    }
  }).catch((error) => response.send(error.message));

}

let activity_active = ref(0);
let dropdownShow = ref(false);

const showdropdown = (active_id) => {
  activity_active.value = active_id;

  dropdownShow.value = !dropdownShow.value;
}

const activeDay = (index) => {
  if (index == 0) {

    states.days[0].isActive = true;
    states.days[1].isActive = false;
    states.days[2].isActive = false;
    states.days[3].isActive = false;
    states.days[4].isActive = false;
    states.days[5].isActive = false;
    states.days[6].isActive = false;
  }
  else if (index == 1) {
    states.days[0].isActive = false;
    states.days[1].isActive = true;
    states.days[2].isActive = false;
    states.days[3].isActive = false;
    states.days[4].isActive = false;
    states.days[5].isActive = false;
    states.days[6].isActive = false;
  }
  else if (index == 2) {
    states.days[0].isActive = false;
    states.days[1].isActive = false;
    states.days[2].isActive = true;
    states.days[3].isActive = false;
    states.days[4].isActive = false;
    states.days[5].isActive = false;
    states.days[6].isActive = false;
  }
  else if (index == 3) {
    states.days[0].isActive = false;
    states.days[1].isActive = false;
    states.days[2].isActive = false;
    states.days[3].isActive = true;
    states.days[4].isActive = false;
    states.days[5].isActive = false;
    states.days[6].isActive = false;
  }
  else if (index == 4) {
    states.days[0].isActive = false;
    states.days[1].isActive = false;
    states.days[2].isActive = false;
    states.days[3].isActive = false;
    states.days[4].isActive = true;
    states.days[5].isActive = false;
    states.days[6].isActive = false;
  }
  else if (index == 5) {
    states.days[0].isActive = false;
    states.days[1].isActive = false;
    states.days[2].isActive = false;
    states.days[3].isActive = false;
    states.days[4].isActive = false;
    states.days[5].isActive = true;
    states.days[6].isActive = false;
  }
  else if (index == 6) {
    states.days[0].isActive = false;
    states.days[1].isActive = false;
    states.days[2].isActive = false;
    states.days[3].isActive = false;
    states.days[4].isActive = false;
    states.days[5].isActive = false;
    states.days[6].isActive = true;
  }
};
const activityShow = computed(() => {

  return states.activities_today.slice(0, limit_item.value * 5);
});
const totalPages = computed(() => {
  return states.activities_today.length / 5;
});
const viewMore = () => {
  if (limit_item.value < totalPages.value) {
    limit_item.value++;
  }
};


</script>
<template>
  <div >
    <div
      :class="states.showhome == false && states.activities_today != '' ? 'md:h-[830px]' : states.showhome == true && states.activities_today != '' ? 'h-full' : states.showhome == false && states.activities_today == '' ? 'h-[500px] md:h-[830px]' : 'md:h-[830px]'"
      class="bg-white rounded-2xl p-2">
      <h1 class="text-[22px] md:text-2xl font-medium">วางแผนกิจกรรม</h1>
      <div class="flex justify-center items-center">
        <div class="h-auto w-full bg-white rounded-lg p-3.5 md:p-0 lg:p-0 ">
          <p class="text-base font-medium mb-4">เลือกวันที่ต้องการ</p>
          <div class="grid grid-cols-7">
            <div class="w-full px-0.5 cursor-pointer" v-for="(item, index) in states.days " :key="index">
              <div :id="'items' + index"
                :class="item.short_day == 'วันนี้' ? 'bg-[#01893D] border-[#01893D]' : item.isActive == true ? 'bg-[#e6e6e6] border-[#01893D] text-[#302421]' : 'bg-[#e6e6e6] border-[#e6e6e6] text-[#302421]'"
                class="rounded-[8px] h-[62px] sm:h-[80px] md:h-[100px] text-center sm:px-0.5 md:px-0.5 text-white border-2 "
                @click="setActiveDays(index, item.full_date)">
                <div class="py-0.5 pb-0.5 sm:py-2 whitespace-nowrap">
                  <span class="text-sm font-bold">{{ item.short_day }}</span>
                </div>
                <div
                  class="bg-white rounded-t-[8px] rounded-b-[7px] py-[3px] pb-[3px] sm:p-[4px] md:px-0 md:py-[15px] whitespace-nowrap ">
                  <span class="text-black font-medium text-sm">{{ item.date }}</span>
                </div>
              </div>
              <div class="text-center">
                <div v-if="item.activity_val == false">
                  <span class="font-bold text-[16px] text-[#01893D]">●</span>
                </div>
              </div>
            </div>
          </div>
          <p class="mt-[20px] text-sm font-medium pt-2"> วัน {{ today_th }} ที่ {{ today }} {{ month }} {{ year }}</p>
          <div :class="states.showhome == false ? 'hidden' : ''" class="text-center mt-2 mb-[16px]">
            <router-link to="/ViewActivity">
              <button type="button"
                class="text-white w-full hover:text-[#01893D] bg-[#01893D] hover:bg-[#ffffff] font-bold rounded-[8px] text-sm py-[6px] px-[8px]  h-[40px] text-center items-center btn-custom">
                <img alt="" class="inline add lg:mt-0 bg-[#fff] mr-1" style="width: 20px; height: 20px" />
                <span class="text-sm font-bold">เพิ่มกิจกรรมของคุณ</span>
              </button>
            </router-link>
          </div>
        </div>
      </div>
      <div>
        <div v-if="states.activities_today != ''" class=" w-full h-auto md:h-[550px] overflow-y-auto ">
          <!-- Com -->
          <div v-for="(activity, index) in states.activities_today" :key="index"
            class="bg-white custom-shadow p-2 rounded-2xl my-4 mx-1 w-auto com">
            <div class="flex flex-row w-full">
              <div class="mr-2">
                <div
                  :class="activity.priority == 'high' ? 'bg-[#E04C4F]' : activity.priority == 'medium' ? 'bg-[#FAAF3F]' : 'bg-[#154293]'"
                  class="flex flex-col items-center justify-center text-white rounded-[10px] w-full px-4 h-full ">
                  <span class="text-sm md:text-lg font-medium not-italic">{{ formatTime(activity.time) }}</span>
                </div>
              </div>
              <div :class="states.showhome == false ? 'w-3/5 sm:w-9/12 md:w-2/3' : 'w-3/5 sm:w-9/12'"
                class="flex flex-col justify-between">
                <p class="text-ellipsis overflow-hidden font-medium sm:font-semibold text-sm md:text-base mb-2">{{
                  activity.title }}</p>
                <div class="flex flex-row items-center">
                  <div>
                    <svg class="w-[17px] h-[19px] md:w-[17px] md:h-[17px] mr-2" width="30" height="30" viewBox="0 0 30 33"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#01893D"
                        d="M9.54199 29.792H20.5C20.6113 29.792 20.7087 29.7573 20.792 29.688C20.8753 29.618 20.9447 29.5277 21 29.417L22.833 22.042H7.16699L9.04199 29.417C9.06933 29.5277 9.13166 29.618 9.22899 29.688C9.32633 29.7573 9.43066 29.792 9.54199 29.792ZM9.54199 32.625C8.76399 32.625 8.07633 32.4027 7.47899 31.958C6.88166 31.514 6.48599 30.917 6.29199 30.167L4.24999 22.042H25.792L23.708 30.167C23.514 30.889 23.1113 31.4793 22.5 31.938C21.8887 32.396 21.222 32.625 20.5 32.625H9.54199ZM4.12499 19.208H25.917C26.0837 19.208 26.2087 19.1593 26.292 19.062C26.3753 18.9653 26.417 18.8473 26.417 18.708V16.125H3.62499V18.708C3.62499 18.8473 3.67366 18.9653 3.77099 19.062C3.86833 19.1593 3.98633 19.208 4.12499 19.208ZM6.41699 0.0419963C8.66699 0.485996 10.6253 1.63166 12.292 3.479C13.9587 5.32633 14.8613 7.40266 15 9.708C15.1667 7.40266 16.0763 5.33333 17.729 3.5C19.3817 1.66666 21.333 0.513996 23.583 0.0419963C23.9443 -0.0140037 24.2293 0.0693297 24.438 0.291996C24.646 0.513996 24.7223 0.791663 24.667 1.125C24.2777 3.18033 23.2983 5.00666 21.729 6.604C20.1597 8.20133 18.389 9.18066 16.417 9.542V13.333H27.583C28.0277 13.333 28.4167 13.4927 28.75 13.812C29.0833 14.132 29.25 14.528 29.25 15V18.708C29.25 19.6247 28.9307 20.4093 28.292 21.062C27.6527 21.7153 26.9443 22.042 26.167 22.042H3.91699C3.11099 22.042 2.38866 21.7153 1.74999 21.062C1.11133 20.4093 0.791992 19.6247 0.791992 18.708V15C0.791992 14.528 0.958659 14.132 1.29199 13.812C1.62533 13.4927 2.01399 13.333 2.45799 13.333H13.625V9.542C11.625 9.18066 9.84733 8.20133 8.29199 6.604C6.73599 5.00666 5.74966 3.18033 5.33299 1.125C5.27766 0.791663 5.35399 0.513996 5.56199 0.291996C5.77066 0.0693297 6.05566 -0.0140037 6.41699 0.0419963Z" />
                    </svg>
                  </div>
                  <p
                    class="block text-[#01893D] lg:w-full text-sm font-mediem md:text-md mt-1.5 truncate overflow-hidden">
                    {{ activity.farm_name }}</p>
                </div>
              </div>
              <div :class="states.showhome == false ? 'hidden' : 'w-2/5 sm:w-3/12'">
                <div class="flex flex-row justify-end relative">
                  <a @click="showdropdown(activity.id)" :class="{ active: activity_active == activity.id }">
                    <div class="mr-1">
                      <button type="button"
                        class="bg-[#01893D] rounded-md py-1 px-2 w-[36px] h-[36px] md:w-[36px] md:h-[36px]">
                        <img src="../../assets/img/icons/edit.png" alt="" class="w-[24px] sm:w-[30px]  md:w-[50px]" />
                      </button>
                    </div>
                  </a>
                  <div v-if="dropdownShow == true" :class="activity_active === activity.id ? 'active' : 'hidden'"
                    class="a-hidden w-[118px] absolute bg-white shadow-lg top-10 right-0 rounded-lg  border-2 border-[#01893D] z-10">
                    <ul>
                      <li class=" hover:bg-gray-100 hover:rounded-lg  p-2"><a @click="edit_data(activity.id)"
                          class="text-[#01893D] text-sm font-medium">แก้ไขกิจกรรม</a></li>
                      <li class=" hover:bg-gray-100 hover:rounded-lg  p-2"><a @click="delete_data(activity.id)"
                          class="text-[#01893D] text-sm font-medium">ลบกิจกรรม</a></li>
                    </ul>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Mobile -->
          <div v-for="(activity, index) in activityShow" :key="index"
            class="bg-white custom-shadow p-2 rounded-2xl my-4 mx-1 w-auto mobile">
            <div class="flex flex-row w-full">
              <div class="mr-2">
                <div
                  :class="activity.priority == 'high' ? 'bg-[#E04C4F]' : activity.priority == 'medium' ? 'bg-[#FAAF3F]' : 'bg-[#154293]'"
                  class="flex flex-col items-center justify-center text-white rounded-[10px] w-full px-4 h-full ">
                  <span class="text-sm md:text-lg font-medium not-italic">{{ formatTime(activity.time) }}</span>
                </div>
              </div>
              <div :class="states.showhome == false ? 'w-3/5 sm:w-9/12 md:w-2/3' : 'w-3/5 sm:w-9/12'"
                class="flex flex-col justify-between">
                <p class="text-ellipsis overflow-hidden font-medium sm:font-semibold text-sm md:text-base mb-2">{{
                  activity.title }}</p>
                <div class="flex flex-row items-center">
                  <div>
                    <svg class="w-[17px] h-[19px] md:w-[17px] md:h-[17px] mr-2" width="30" height="30" viewBox="0 0 30 33"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#01893D"
                        d="M9.54199 29.792H20.5C20.6113 29.792 20.7087 29.7573 20.792 29.688C20.8753 29.618 20.9447 29.5277 21 29.417L22.833 22.042H7.16699L9.04199 29.417C9.06933 29.5277 9.13166 29.618 9.22899 29.688C9.32633 29.7573 9.43066 29.792 9.54199 29.792ZM9.54199 32.625C8.76399 32.625 8.07633 32.4027 7.47899 31.958C6.88166 31.514 6.48599 30.917 6.29199 30.167L4.24999 22.042H25.792L23.708 30.167C23.514 30.889 23.1113 31.4793 22.5 31.938C21.8887 32.396 21.222 32.625 20.5 32.625H9.54199ZM4.12499 19.208H25.917C26.0837 19.208 26.2087 19.1593 26.292 19.062C26.3753 18.9653 26.417 18.8473 26.417 18.708V16.125H3.62499V18.708C3.62499 18.8473 3.67366 18.9653 3.77099 19.062C3.86833 19.1593 3.98633 19.208 4.12499 19.208ZM6.41699 0.0419963C8.66699 0.485996 10.6253 1.63166 12.292 3.479C13.9587 5.32633 14.8613 7.40266 15 9.708C15.1667 7.40266 16.0763 5.33333 17.729 3.5C19.3817 1.66666 21.333 0.513996 23.583 0.0419963C23.9443 -0.0140037 24.2293 0.0693297 24.438 0.291996C24.646 0.513996 24.7223 0.791663 24.667 1.125C24.2777 3.18033 23.2983 5.00666 21.729 6.604C20.1597 8.20133 18.389 9.18066 16.417 9.542V13.333H27.583C28.0277 13.333 28.4167 13.4927 28.75 13.812C29.0833 14.132 29.25 14.528 29.25 15V18.708C29.25 19.6247 28.9307 20.4093 28.292 21.062C27.6527 21.7153 26.9443 22.042 26.167 22.042H3.91699C3.11099 22.042 2.38866 21.7153 1.74999 21.062C1.11133 20.4093 0.791992 19.6247 0.791992 18.708V15C0.791992 14.528 0.958659 14.132 1.29199 13.812C1.62533 13.4927 2.01399 13.333 2.45799 13.333H13.625V9.542C11.625 9.18066 9.84733 8.20133 8.29199 6.604C6.73599 5.00666 5.74966 3.18033 5.33299 1.125C5.27766 0.791663 5.35399 0.513996 5.56199 0.291996C5.77066 0.0693297 6.05566 -0.0140037 6.41699 0.0419963Z" />
                    </svg>
                  </div>
                  <p
                    class="block text-[#01893D] lg:w-full text-sm font-mediem md:text-md mt-1.5 truncate overflow-hidden">
                    {{ activity.farm_name }}</p>
                </div>
              </div>
              <div :class="states.showhome == false ? 'hidden' : 'w-2/5 sm:w-3/12'">
                <div class="flex flex-row justify-end relative">
                  <a @click="showdropdown(activity.id)" :class="{ active: activity_active == activity.id }">
                    <div class="mr-1">
                      <button type="button"
                        class="bg-[#01893D] rounded-md py-1 px-2 w-[36px] h-[36px] md:w-[36px] md:h-[36px]">
                        <img src="../../assets/img/icons/edit.png" alt="" class="w-[24px] sm:w-[30px]  md:w-[50px]" />
                      </button>
                    </div>
                  </a>
                  <div v-if="dropdownShow == true" :class="activity_active === activity.id ? 'active' : 'hidden'"
                    class="a-hidden w-[118px] absolute bg-white shadow-lg top-10 right-0 rounded-lg  border-2 border-[#01893D] z-10">
                    <ul>
                      <li class=" hover:bg-gray-100 hover:rounded-lg  p-2"><a @click="edit_data(activity.id)"
                          class="text-[#01893D] text-sm font-medium">แก้ไขกิจกรรม</a></li>
                      <li class=" hover:bg-gray-100 hover:rounded-lg  p-2"><a @click="delete_data(activity.id)"
                          class="text-[#01893D] text-sm font-medium">ลบกิจกรรม</a></li>
                    </ul>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="limit_item < (states.activities_today.length / 5)" class="hidden-device text-center">
            <button @click="viewMore" :disabled="limit_item == total_item"
              class="bg-[#01893D] text-sm font-bold rounded-lg text-white w-full h-[36px]">ดูเพิ่มเติม</button>
          </div>
          <div class="mt-24"></div>
        </div>
        <div v-else class="w-full">
          <div :class="states.showhome == false ? 'md:h-[580px]' : 'md:h-[500px]'"
            class="bg-white rounded-[16px] py-1.5 px-2 flex flex-col justify-between leading-normal h-[230px]  ">
            <div class="text-center">
              <div class="text-sm ml-2.5">
                <p class="text-[#837D7B] font-medium text-[16px] md:text-xl mt-24">ไม่พบกิจกรรมสำหรับวันนี้</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.custom-shadow {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

@media (max-width: 1024px) {
  .w-custom {
    width: 100px !important;
  }

}

@media (max-width: 1160px) {
  .w-custom {
    width: 100px;
  }

}

@media (min-width: 1160px) {
  .w-custom {
    width: 200px;
  }

}

@media (max-width: 768px) {
  .hidden-device {
    visibility: block;
  }

  .com {
    display: none;
  }
}

@media (min-width: 768.9px) {
  .hidden-device {
    visibility: hidden;
  }

  .mobile {
    display: none;
  }
}

@media (max-width: 360px) {

  .w-mo {
    width: 100px !important;
  }
}</style>
