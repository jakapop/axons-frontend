<script setup>
import moment from "moment-with-locales-es6";
import { ref, reactive, computed, onBeforeMount } from 'vue';
import { useMainStore } from "@/stores/main";
import { useRoute, useRouter } from "vue-router";
const mainStore = useMainStore();
const CustomerId = mainStore.CustomerId;
const CustomerFarmLat = computed(() => mainStore.CustomerFarmLat);
const CustomerFarmLon = computed(() => mainStore.CustomerFarmLon);
const token_weather = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM0NzA3ZTBkZDYzMjYwYTZkNjRlNGEwNzhkY2E5ZDYyMTVhNTUyMzFjNTE0OTQxOTZlYTI0M2RkZjBjYzE0NDU4YWE1ZGFjODE2YmJmMGUwIn0.eyJhdWQiOiIyIiwianRpIjoiMzQ3MDdlMGRkNjMyNjBhNmQ2NGU0YTA3OGRjYTlkNjIxNWE1NTIzMWM1MTQ5NDE5NmVhMjQzZGRmMGNjMTQ0NThhYTVkYWM4MTZiYmYwZTAiLCJpYXQiOjE2NjE3NjM5NjAsIm5iZiI6MTY2MTc2Mzk2MCwiZXhwIjoxNjkzMjk5OTYwLCJzdWIiOiIyMTI3Iiwic2NvcGVzIjpbXX0.HG2opljn5zqQ4wKvLaomYKOVJHF4txs6iQhmMVMEZCkx0NZ4OQz_9InejmpYA-HHlKuJxxQ4MopvjIV0Uu0j04BMHhVgDjGfSpUnpOZFVhHeOZr8UbDpvRqgSo-1RyRYMYXqK8DCkUFSuAX06bbHCkoPc57I68_bcmS8bAc9KPo-PfS0NfosTIBarmCQHaw0ur2diPS20e38U3DmKIGymrCQ_3Lj6fSuZD1mBGtj4twSw1TCq9Xhu-eOoRo5jTxnLL7gagT6iG0nnPwNJIWfcAAumO9ta_bYYemQB4KGSx4qu8mzt27DPG9BclV9EDvv5sPUZ-QQ_vrb_3it6fLNhImxjNuQDG6Lccu-i0FZMPYrKV5PqnZkukOdDHCgkFNOyJrMkq-UwyGH5WtNtxzqdlHM_j78ZrvV38HCdeuoCupHEaaQIB0AhCGZOAJbogSQn6en8V-YrmoAhMoq_ca14VRt5fy9CviVRo4JaRp5Bmo2nd9pJLKBLF_CttI14H3BXLR7U0nrri6tKJhEoJI15nsUep8apCHhTIaqaywtTRA7gJBV19OYdMutdvAKLg9hahS5WIkVpB3F3OoG_Cd0LNyufoXnRa1hZ41s4t-zoZdAYJURs56ZGm8rCWxyIsAYT6lz-yR7KgP0SXzsZdO1Cra3bStUOYDoY8nXIPFGN84";
const router = useRouter();

let limit_item = ref(1) ;
let total_item = ref(0) ;

const states = reactive({
  activitys_today: [],
  project_all: [],
  // activitys_select: [],
  days: [],
  weatherForecast: {},
  serial: "",
  sensor_id: 1,
  avg_all: 0,
  avg_max: 0,
  avg_min: 0,
  board: {},
  sensor_temp: 0
})

const activity_load = computed(() => {
  ApiCore.get("/v2/projects/?limit=all")
    .then((res) => {
      const project_all = res.data.data
      let obj_farm_all = {}
      project_all.forEach(item => {
        obj_farm_all[item.id] = { "id": item.id, "name": item.name }
      })
      states.project_all = obj_farm_all;

      const datenow = moment().format("YYYY-MM-DD");
      ApiMain.get("/activity/by-customer/" + CustomerId + "?date=" + datenow + "&order=ASC&page=1&take=30").then((result) => {
        // states.activitys_today = result.data.data;

        let obj = result.data.data ;
        obj.sort(function(a, b) {
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

        obj.sort(function(a, b) {
          let timeA = a.time.split(':');
          let timeB = b.time.split(':');
          let dateA = new Date(0, 0, 0, timeA[0], timeA[1], timeA[2]);
          let dateB = new Date(0, 0, 0, timeB[0], timeB[1], timeB[2]);
          return dateA - dateB;
        });
        states.activitys_today = obj;
        // states.activitys_select = states.activitys_today;
      });
    });
});

const formatTime = (time) => {
  let format_time = time.slice(0, time.lastIndexOf(":"));
  return format_time;
};

const activityShow = computed(() => {
  return states.activitys_today.slice(0, limit_item.value * 5);
});
const totalPages = computed(() => {
  return states.activitys_today.length/5;
});
const viewMore = () => {
  if (limit_item.value < totalPages.value) {
    limit_item.value++;
  }
};


</script>
<template>
  {{ activity_load }}
  <div :class="states.activitys_today.length != 0 ? 'h-full md:h-[640px]' : 'h-auto pb-9'"
    class=" bg-white p-2 rounded-2xl">
    <div class="flex flex-row justify-between mb-4">
      <h1 class="text-[22px] md:text-2xl font-medium">กิจกรรมวันนี้</h1>
      <router-link to="/activity-manage">
        <img src="../../assets/img/icons/open-new-page.png" alt="" style="width: 24px; height: 24px">
      </router-link>
    </div>
    <div v-if="states.activitys_today.length != 0" class="w-full h-auto md:h-[560px] overflow-scroll">
      <div v-for="(activity, index) in activityShow" :key="index" class="mobile" >
        <div class="flex flex-row items-center custom-shadow rounded-lg p-1 my-4">
          <div class="w-[70px] mr-2 h-[60px]">
            <div
              :class="activity.priority == 'high' ? 'bg-[#E04C4F]' : activity.priority == 'medium' ? 'bg-[#FAAF3F]' : 'bg-[#154293]'"
              class="flex flex-col items-center justify-center text-white rounded-[10px] w-full h-full">
              <span class="text-sm md:text-lg font-medium not-italic">{{ formatTime(activity.time) }}</span>
            </div>
          </div>
          <div class="w-3/5 md:w-9/12">
            <div class="flex flex-col justify-between">
                  <p class="text-ellipsis overflow-hidden font-medium sm:font-semibold text-sm md:text-base mb-2">{{ activity.title }}</p>
                  <div class="flex flex-row items-center">
                    <div>
                      <svg class="w-[17px] h-[19px] md:w-[17px] md:h-[17px] mr-2" width="30" height="30"
                        viewBox="0 0 30 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#01893D"
                          d="M9.54199 29.792H20.5C20.6113 29.792 20.7087 29.7573 20.792 29.688C20.8753 29.618 20.9447 29.5277 21 29.417L22.833 22.042H7.16699L9.04199 29.417C9.06933 29.5277 9.13166 29.618 9.22899 29.688C9.32633 29.7573 9.43066 29.792 9.54199 29.792ZM9.54199 32.625C8.76399 32.625 8.07633 32.4027 7.47899 31.958C6.88166 31.514 6.48599 30.917 6.29199 30.167L4.24999 22.042H25.792L23.708 30.167C23.514 30.889 23.1113 31.4793 22.5 31.938C21.8887 32.396 21.222 32.625 20.5 32.625H9.54199ZM4.12499 19.208H25.917C26.0837 19.208 26.2087 19.1593 26.292 19.062C26.3753 18.9653 26.417 18.8473 26.417 18.708V16.125H3.62499V18.708C3.62499 18.8473 3.67366 18.9653 3.77099 19.062C3.86833 19.1593 3.98633 19.208 4.12499 19.208ZM6.41699 0.0419963C8.66699 0.485996 10.6253 1.63166 12.292 3.479C13.9587 5.32633 14.8613 7.40266 15 9.708C15.1667 7.40266 16.0763 5.33333 17.729 3.5C19.3817 1.66666 21.333 0.513996 23.583 0.0419963C23.9443 -0.0140037 24.2293 0.0693297 24.438 0.291996C24.646 0.513996 24.7223 0.791663 24.667 1.125C24.2777 3.18033 23.2983 5.00666 21.729 6.604C20.1597 8.20133 18.389 9.18066 16.417 9.542V13.333H27.583C28.0277 13.333 28.4167 13.4927 28.75 13.812C29.0833 14.132 29.25 14.528 29.25 15V18.708C29.25 19.6247 28.9307 20.4093 28.292 21.062C27.6527 21.7153 26.9443 22.042 26.167 22.042H3.91699C3.11099 22.042 2.38866 21.7153 1.74999 21.062C1.11133 20.4093 0.791992 19.6247 0.791992 18.708V15C0.791992 14.528 0.958659 14.132 1.29199 13.812C1.62533 13.4927 2.01399 13.333 2.45799 13.333H13.625V9.542C11.625 9.18066 9.84733 8.20133 8.29199 6.604C6.73599 5.00666 5.74966 3.18033 5.33299 1.125C5.27766 0.791663 5.35399 0.513996 5.56199 0.291996C5.77066 0.0693297 6.05566 -0.0140037 6.41699 0.0419963Z" />
                      </svg>
                    </div>
                    <p class="block text-[#01893D] lg:w-full text-sm font-mediem md:text-md mt-1.5 truncate overflow-hidden">{{  states.project_all[activity.projectId].name  }}</p>
                  </div>
                </div>
          </div>
        </div>
      </div>
      <div v-for="(activity, index) in states.activitys_today" :key="index" class="com"  >
        <div class="flex flex-row items-center custom-shadow rounded-lg p-1 my-4 mx-0.5">
          <div class="w-[80px] mr-2 h-[60px]">
            <div
              :class="activity.priority == 'high' ? 'bg-[#E04C4F]' : activity.priority == 'medium' ? 'bg-[#FAAF3F]' : 'bg-[#154293]'"
              class="flex flex-col items-center justify-center text-white rounded-[10px] w-full h-full">
              <span class="text-sm md:text-lg font-medium not-italic">{{ formatTime(activity.time) }}</span>
            </div>
          </div>
          <div class="w-3/4 md:w-9/12">
            <div class="flex flex-col justify-between">
                  <p class="text-ellipsis overflow-hidden font-medium sm:font-semibold text-sm md:text-base mb-2">{{ activity.title }}</p>
                  <div class="flex flex-row items-center">
                    <div>
                      <svg class="w-[17px] h-[19px] md:w-[17px] md:h-[17px] mr-2" width="30" height="30"
                        viewBox="0 0 30 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#01893D"
                          d="M9.54199 29.792H20.5C20.6113 29.792 20.7087 29.7573 20.792 29.688C20.8753 29.618 20.9447 29.5277 21 29.417L22.833 22.042H7.16699L9.04199 29.417C9.06933 29.5277 9.13166 29.618 9.22899 29.688C9.32633 29.7573 9.43066 29.792 9.54199 29.792ZM9.54199 32.625C8.76399 32.625 8.07633 32.4027 7.47899 31.958C6.88166 31.514 6.48599 30.917 6.29199 30.167L4.24999 22.042H25.792L23.708 30.167C23.514 30.889 23.1113 31.4793 22.5 31.938C21.8887 32.396 21.222 32.625 20.5 32.625H9.54199ZM4.12499 19.208H25.917C26.0837 19.208 26.2087 19.1593 26.292 19.062C26.3753 18.9653 26.417 18.8473 26.417 18.708V16.125H3.62499V18.708C3.62499 18.8473 3.67366 18.9653 3.77099 19.062C3.86833 19.1593 3.98633 19.208 4.12499 19.208ZM6.41699 0.0419963C8.66699 0.485996 10.6253 1.63166 12.292 3.479C13.9587 5.32633 14.8613 7.40266 15 9.708C15.1667 7.40266 16.0763 5.33333 17.729 3.5C19.3817 1.66666 21.333 0.513996 23.583 0.0419963C23.9443 -0.0140037 24.2293 0.0693297 24.438 0.291996C24.646 0.513996 24.7223 0.791663 24.667 1.125C24.2777 3.18033 23.2983 5.00666 21.729 6.604C20.1597 8.20133 18.389 9.18066 16.417 9.542V13.333H27.583C28.0277 13.333 28.4167 13.4927 28.75 13.812C29.0833 14.132 29.25 14.528 29.25 15V18.708C29.25 19.6247 28.9307 20.4093 28.292 21.062C27.6527 21.7153 26.9443 22.042 26.167 22.042H3.91699C3.11099 22.042 2.38866 21.7153 1.74999 21.062C1.11133 20.4093 0.791992 19.6247 0.791992 18.708V15C0.791992 14.528 0.958659 14.132 1.29199 13.812C1.62533 13.4927 2.01399 13.333 2.45799 13.333H13.625V9.542C11.625 9.18066 9.84733 8.20133 8.29199 6.604C6.73599 5.00666 5.74966 3.18033 5.33299 1.125C5.27766 0.791663 5.35399 0.513996 5.56199 0.291996C5.77066 0.0693297 6.05566 -0.0140037 6.41699 0.0419963Z" />
                      </svg>
                    </div>
                    <p class="block text-[#01893D] lg:w-full text-sm font-mediem md:text-md mt-1.5 truncate overflow-hidden">{{  states.project_all[activity.projectId].name  }}</p>
                  </div>
                </div>
          </div>
        </div>
      </div>

      <div  v-if="limit_item < (states.activitys_today.length/5)" class="hidden-device text-center">
        <button  @click="viewMore" :disabled="limit_item == total_item"
          class="bg-[#01893D] text-sm font-bold rounded-lg text-white w-full h-[36px]">ดูเพิ่มเติม</button>
      </div>
    </div>
    <div v-else>
      <div class="w-full h-[200px] md:h-[540px] mt-6 flex flex-col items-center justify-center">
        <span class="text-[#837D7B] font-medium text-[16px] md:text-xl">ไม่พบกิจกรรมสำหรับวันนี้</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-shadow {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

/* @media (max-width: 640px) {
  .hidden-device {
    visibility: block;
  }
  .com {
    display: none;
  }
}

@media (min-width: 640px) {
  .hidden-device {
    visibility: hidden;
  }
  .mobile {
    display: none;
  }
} */
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
</style>
