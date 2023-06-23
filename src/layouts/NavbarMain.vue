<script setup>
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/vue";

import { useMainStore } from "@/stores/main";
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/vue/outline";
import moment from "moment-with-locales-es6";
import farmimg from "@/assets/img/img_landingpage/bg-device.png";
import userdefault from "@/assets/img/icons/user.png";

const mainStore = useMainStore();
const userFirstName = mainStore.userFirstName;
const userImage = mainStore.userImage;  //รูปโปรไฟล์
const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;
const CustomerFarmName = mainStore.CustomerFarmName;
const CustomerFarmImage = mainStore.CustomerFarmImage;


let user_image = ref(userdefault);
const router = useRouter();
const navigation = [
  {
    name: "Dashboard",
    href: "#",
    current: true,
  },
  {
    name: "Team",
    href: "#",
    current: false,
  },
  {
    name: "Projects",
    href: "#",
    current: false,
  },
  {
    name: "Calendar",
    href: "#",
    current: false,
  },
];



const mainNavigation = [
  {
    href: "/home",
    name: "Home",
    label: "หน้าแรก",

    icon1: "home",
    icon2: "home2",
    subMenu: [],
  },
  {
    name: "Dashboard",
    label: "ฟาร์มของฉัน",

    icon1: "potted_plant",
    icon2: "potted_plant2",
    subMenu: [
      {
        href: "/manageFarm",
        name: "ManageFarm",
        label: "จัดการฟาร์ม",
        icon: "managefarm",

      },
      {
        href: "/selectBoard",
        name: "SelectBoard",
        label: "ข้อมูลจากเซนเซอร์",
        icon: "memory",

      },
      {
        href: "/climate",
        name: "Climate",
        label: "พยากรณ์อากาศ",
        icon: "climate",

      },
      {
        href: "/geography",
        name: "Geography",
        label: "ภูมิศาสตร์",
        icon: "geography",

      },
      {
        href: "/activity-manage",
        name: "ActivityManage",
        label: "วางแผนกิจกรรม",
        icon: "paper",
      },
    ],
  },
  {
    href: "/market",
    name: "Market",
    label: "ตลาด",
    icon1: "storefront",
    icon2: "storefront2",
    subMenu: [],
  },
  {
    href: "/calculate",
    name: "Calculate",
    label: "ประมวลผล",
    icon1: "calculate",
    icon2: "calculate2",
    subMenu: [],
  },
  {
    href: "/other",
    name: "OtherPage",
    label: "อื่นๆ",
    icon1: "more_horiz",
    icon2: "more_horiz",
    subMenu: [],
  },
];

const state = reactive({
  farms: [],
  lat: "",
  lon: "",
  openSubMenu: false,
  image_farm: "",
  notiToday: [],
  notiCount: ""
});

const now = new Date();


let oldCount = ref(localStorage.getItem('old_count_noti'));
let click_list = ref(0);
onMounted(() => {

  ApiMain.get("/notifications/" + CustomerId + "?order=DESC&page=1&take=100").then((response) => {

    const noti_obj = response.data.data;

    console.log(response.data.data);

    const filteredData = Object.values(noti_obj).filter(item => {
      const date = new Date(item.createdAt);
      return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
    });

    state.notiToday = filteredData;

    console.log('state.notiToday : ', state.notiToday);

  })

  ApiMain.get("/notifications/" + CustomerId + "/counting").then((response) => {
    if (response.data.status = 200) {
      state.notiCount = response.data.data;
      // console.log('new get Noti =='+state.notiCount);
    }
  })

  if (userImage) {
    user_image.value = "https://farmworld.farm/api-main/image/" + userImage + "?imageableType=customer"
  }

  let project_id1 = CustomerFarmId;
  let image_farm = farmimg
  ApiCore.get("/v2/projects/?limit=all")
    .then((response) => {
      state.farms = response.data.data;
      if (CustomerFarmName) {
        selectedFarm.value = CustomerFarmName;
        state.image_farm = CustomerFarmImage;
      } else {
        project_id1 = state.farms[0].id;
        selectedFarm.value = state.farms[0].name;
        if (response.data.data[0].image != null) {
          image_farm = response.data.data[0].image.link
        }
        mainStore.setUser({
          farmid: state.farms[0].id,
          farmname: state.farms[0].name,
          farmimage: image_farm,
        });
      }
      get_customer_project(CustomerId, project_id1);
    })
    .then(() => {
      //กรณีเลือกจากหน้า manageFarm
      let url = new URL(window.location.href);
      let farmid = url.searchParams.get("farmid");
      if (farmid) {
        ApiCore.get("/v2/projects/" + farmid).then((response) => {
          selectedFarm.value = response.data.data[0].name;
          //console.log(response.data.data[0].image)
          if (response.data.data[0].image != null) {
            image_farm = response.data.data[0].image.link
            state.image_farm = response.data.data[0].image.link
          } else {
            state.image_farm = image_farm
          }
          mainStore.setUser({
            farmid: response.data.data[0].id,
            farmname: response.data.data[0].name,
            farmimage: image_farm,
          });
          get_customer_project(CustomerId, farmid);
        });
      }
    }).catch((err) => {
    })
});

const selectedOpen = ref(false);
const notificationOpen = ref(false);
const selectedFarm = ref("");


// Read Notify
const read_noti = (id) => {
  //console.log("read_noti "+id)
  ApiMain.put("/notifications/" + CustomerId + "/update-status/" + id, { "readed": 1 }).then((response) => {
    console.log(response);
    if (response.data.status == 204) {

      ApiMain.get("/notifications/" + CustomerId + "/counting").then((response) => {
        state.notiCount = response.data.data;
        console.log('nitification == ' + state.notiCount);

        localStorage.setItem('count_noti', state.notiCount);
      })

      ApiMain.get("/notifications/" + CustomerId + "?order=DESC&page=1&take=100").then((response) => {
        const noti_obj = response.data.data;
        const filteredData = Object.values(noti_obj).filter(item => {
          const date = new Date(item.createdAt);
          return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
        });
        state.notiToday = filteredData;

      })
    }
  })
}

const get_customer_project = (CustomerId, projectId) => {
  ApiMain.get(`/customer/${CustomerId}/get-point?projectId=${projectId}`)
    .then((res) => {
      const lat = res.data.data.lat;
      const lon = res.data.data.lon;
      const provinceId = res.data.data.provinceId;
      const provinceName = res.data.data.provinceName;
      const districtId = res.data.data.districtId;
      const districtName = res.data.data.districtName;
      ApiMain.get(`/weather/temperature?provinceId=${provinceId}`).then(
        (res2) => {
          // console.log(res2);
          // console.log('temperature == ',Math.floor(res2.data.temperature));

          mainStore.setUser({
            farmlat: lat,
            farmlon: lon,
            provinceid: provinceId,
            provincename: provinceName,
            districtid: districtId,
            districtname: districtName,
            temperature: Math.floor(res2.data.temperature),
            farmimage: state.image_farm,
          });
        }
      );
    })
    .catch((err) => {
      mainStore.setUser({
        farmlat: "",
        farmlon: "",
        provinceid: "",
        districtid: "",
      });
      //console.log(err);
    });
};

const select_farm = (id, name, image) => {
  let URL = window.location.href;
  let pagename = URL.split("/");
  let page_ck = pagename[3].search("dashboard");
  if (page_ck >= 0) {
    router.push("/SelectBoard");
  }
  //console.log(image);
  if (image != null) {
    state.image_farm = image.link;
  } else {
    state.image_farm = farmimg;
  }
  selectedOpen.value = !selectedOpen.value;
  mainStore.setUser({
    farmid: id,
    farmname: name,
    farmimage: state.image_farm,
  });
  get_customer_project(CustomerId, id);
  //console.log(id);
};

const logout = () => {
  localStorage.removeItem("astk");
  localStorage.removeItem("userid");
  localStorage.removeItem("main");
  localStorage.removeItem("count_noti");
  localStorage.setItem("old_count_noti", oldCount.value);
  mainStore.logout;
  window.location.replace("/");
};

const currentRoute = () => {
  return useRouter().currentRoute.value.name;
};

const openSubMenuList = () => {
  state.openSubMenu = !state.openSubMenu;
  console.log(state.openSubMenu);
};

let isMenuOpen = ref(false);

const handleClick = (event) => {

  

  oldCount.value = state.notiCount;

  localStorage.setItem('old_count_noti', state.notiCount);
  localStorage.setItem('count_noti', state.notiCount);
  isMenuOpen.value = !isMenuOpen.value;
  // if (state.notiToday.length == 0) {
  //   isMenuOpen.value = false;
  // } else {
  //   console.log('toggle');
  //   localStorage.setItem('old_count_noti', state.notiCount);
  //   isMenuOpen.value = !isMenuOpen.value;
  // }


};


const substring_BoardName = (message_board) => {

  const board_name = message_board.match(/ที่บอร์ด(.+?)(กรุณา|เรียบ|กลับ)/);
  if (board_name) {
    const extractedMatchBoardName = board_name[1].trim();
    return extractedMatchBoardName
  }
};

// const substring_boardname = (message) =>{
//   const boardIndex = message.indexOf('บอร์ด')
//       if (boardIndex !== -1) {
//         const boardString = message.substr(boardIndex)
//         let boardName = boardString.split(' ')[1]
//         if(message.includes('กลับสู่สถานะออนไลน์') == true){
//           return  boardName.replace('กลับสู่สถานะออนไลน์','');
//         }
//         else{
//           return boardName
//         }
//       }
// };

</script>

<template>
  <div class="leading-normal tracking-normal mt-[60px] md:mt-[50px]">
    <header>
      <nav aria-label="menu nav" class="bg-white custom-shadow px-1 mt-0 h-auto fixed w-full z-50 top-0 py-2">
        <div class="flex flex-wrap items-center justify-between px-4">
          <div class="flex flex-shrink md:w-1/3 justify-center md:justify-start text-white">
            <a href="/home">
              <img src="../assets/img/img_landingpage/logo_login.svg" alt="" class="w-8 md:w-10" />
            </a>
          </div>
          <div class="flex flex-1 w-1/3 justify-start text-white px-2">
            <span class="relative w-full" v-on:click="selectedOpen = !selectedOpen">
              <input placeholder="เลือกฟาร์ม"
                class="bg-white caret-transparent rounded-[8px] h-[40px] font-medium text-sm p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 border-[#01893D] custom-input-select"
                v-model="selectedFarm" />
              <img class="flex absolute right-[11px] top-[15px] w-4 bg-transparent rounded text-base text-gray-600"
                src="@/assets/img/icons/select-down.svg" alt="" :class="selectedOpen ? 'rotate-180' : ''" />
              <div
                class="absolute shadow bg-white top-100 z-40 w-full lef-0 max-h-select overflow-y-auto rounded-[8px] mt-2 border-[#01893D] border"
                v-if="selectedOpen == true">
                <div class="flex flex-col w-full">
                  <div v-for="(farm, index) in state.farms" :value="farm.id" :key="index"
                    class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                    v-on:click="select_farm(farm.id, farm.name, farm.image)">
                    <div
                      class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100"
                      @click="
                        (selectedFarm = farm.name),
                        (selectedOpen = !selectedOpen)
                        ">
                      <div class="w-full items-center flex">
                        <div class="hover:text-[#9BD226] font-medium text-sm text-[#01893D] truncate">
                          {{ farm.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </div>
          <div class="flex content-center md:w-1/3 justify-end">
            <ul class="list-reset flex justify-between flex-none items-center">
              <li class="flex-none md:mr-3">
                <div class="relative inline-block">
                  <Menu as="div" class="ml-3 mt-2 relative">
                    <div>
                      <button type="button" @click="handleClick($event)" class="flex">
                        <img v-if="state.notiCount > oldCount" class="bell w-[30px] h-[30px] mr-1 md:mr-0"
                          src="../assets/img/img_landingpage/notifications1.svg" />
                        <img v-else class="w-[30px] h-[30px]  mr-1 md:mr-0"
                          src="../assets/img/img_landingpage/notifications1.svg" />
                      </button>
                      <span class="absolute object-right-top" style="right: -5px; top: -22px">
                        <!-- <div v-if="state.notiCount>0" class="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
                          {{ state.notiCount }}
                        </div> -->
                        <span v-if="state.notiCount > oldCount"
                          class="inline-flex items-center text-red-500 text-[35px]">•</span>
                      </span>
                    </div>
                    <transition enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                      <div v-if="isMenuOpen == true">
                        <div v-if="state.notiToday.length > 0"
                          class="w-custom w-[350px] sm:w-[350px] md:w-[350px] h-[360px] origin-top-right absolute custom-right -right-4 sm:right-0 mt-5 overflow-auto border-[#01893D] border rounded-[8px] shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <div v-for="(noti, index) in state.notiToday" :key="index"
                            :class="noti.readed == 0 ? 'bg-green-50' : 'bg-white'"
                            class="relative rounded-[16px] flex flex-col justify-between leading-normal">
                            <div @click="read_noti(noti.id)"
                              class="relative cursor-pointer py-2 p-2 flex flex-row items-center justify-center ">
                              <span v-if="noti.readed == 0" class=" text-[#01893D] text-2xl absolute left-0.5">•</span>
                              <div class="flex flex-col items-center w-3/12">
                                <div class="w-[80px]">
                                  <span v-if="noti.notiStatusText"
                                    :class="noti.notiStatusText == 'ปิด' ? 'bg-[#827C7B]' : noti.notiStatusText == 'เปิด' ? 'bg-[#01893D]' : noti.notiStatusText == 'ออนไลน์' ? 'bg-[#154293]' : noti.notiStatusText == 'ออฟไลน์' ? 'bg-[#D22626]' : 'bg-[#827C7B]'"
                                    class="block w-full text-center py-1 px-4 rounded-full font-bold text-xs text-white mb-[6px] truncate ">{{
                                      noti.notiStatusText }}</span>
                                </div>
                                <div class="flex flex-col">
                                  <span class="font-bold text-xs mb-[6px]">{{
                                    moment.utc(noti.createdAt).format("DD/MM/YYYY") }}</span>
                                  <!-- <span class="font-bold text-xs">{{  moment(noti.createdAt).lang("th").format("hh:mm") }} น.</span> -->
                                  <span class="font-bold text-xs">{{ (noti.createdAt).slice(11, 16) }} น.</span>
                                </div>
                              </div>
                              <div class="vertical-line"></div>
                              <div class="w-full">
                                <p :class="noti.notiStatusText == 'ปิด' ? 'text-[#827C7B]' : noti.notiStatusText == 'เปิด' ? 'text-[#01893D]' : noti.notiStatusText == 'ออนไลน์' ? 'text-[#154293]' : noti.notiStatusText == 'ออฟไลน์' ? 'text-[#D22626]' : 'text-[#827C7B]'"
                                  class="text-xs font-bold mb-2 break-words w-[200px]">
                                  <!-- เช็คสถานะแล้วตัด string -->
                                  <span v-if="noti.notiStatus == '4'">{{
                                    noti.message.replace(/\d.*([0-9]{2}):([0-9]{2})/, "").replace(/บอร์ด.*[A-Za-z0-9]/g, "").replace("ค่ะ", "")
                                  }}</span>
                                  <span v-else>{{
                                    noti.message.replace(/\d.*([0-9]{2}):([0-9]{2})/, "").replace(/ที่บอร์ด.*[A-Za-z0-9]/g, "").replace("ค่ะ", "")
                                  }}</span>
                                </p>
                                <p class="text-black text-sm font-medium truncate w-[200px]">บอร์ด {{
                                  substring_BoardName(noti.message) }}</p>
                                <!-- <p class="text-black text-sm font-medium truncate w-[200px]" >บอร์ด {{ noti.message.match(/บอร์ด\s+(\w+)/)[1] }}</p> -->
                                <!-- <p class="text-black text-sm font-medium truncate w-[200px]" >บอร์ด {{ noti.serialNumber }}</p> -->
                              </div>
                            </div>
                            <hr v-if="index + 1 != state.notiToday.length" class="line-custom mx-2">
                          </div>
                        </div>
                        <div v-else>
                          <div class="flex justify-center items-center w-custom w-[350px] sm:w-[350px] md:w-[350px] h-[360px] origin-top-right absolute custom-right -right-4 sm:right-0 mt-5 overflow-auto border-[#01893D] border rounded-[8px] shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <h1 class="text-sm text-gray-400">ยังไม่มีแจ้งเตือน</h1>
                        </div>
                        </div>
                      </div>
                    </transition>
                    
                  </Menu>
                </div>
              </li>
              <li class="flex-none md:mr-3">
                <Menu as="div" class="ml-3 relative">
                  <div>
                    <MenuButton class="flex text-sm rounded-full">
                      <img class="h-8 w-8 rounded-full my-auto" :src="user_image" />
                      <span
                        class="ml-2.5 text-left font-medium text-[#01893D] hidden lg:block truncate whitespace-nowrap mt-1.5">
                        {{ userFirstName }}
                      </span>
                    </MenuButton>
                  </div>
                  <transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95">
                    <MenuItems
                      class="origin-top-right absolute right-0 mt-4 w-28 border-[#01893D] border rounded-[8px] shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 whitespace-nowrap">
                      <MenuItem v-slot="{ active }">
                      <a href="/personal" :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-[10px] md:text-sm font-bold text-[#01893D]',
                      ]">ข้อมูลส่วนตัว</a>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                      <a href="#" :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-[10px] md:text-sm font-bold text-[#01893D]',
                      ]">ตั้งค่า</a>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                      <a href="#" @click="logout()" :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-[10px] md:text-sm font-bold text-[#01893D]',
                      ]">ออกจากระบบ</a>
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </Menu>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- background opacity -->
    <div v-if="isMenuOpen == true" class="fixed inset-0 z-40 bg-opacity-50 transition-opacity"
      style="background: rgba(0, 0, 0, 0.2);"></div>
    <!-- end  background opacity -->

    <main>
      <div class="flex flex-col md:flex-row rounded-t-[24px] bg-white mt-[54px] md:mt-0 ">

        <nav aria-label="alternative nav bg-[#01893D] ">

          <div class="md:bg-[#01893D] fixed top-0 md:relative z-10 w-full md:w-40 lg:w-60 content-center ">
            <div
              class="md:bg-[#FFF] h-full md:rounded-tl-[24px] pb-2 md:w-40 lg:w-60 md:fixed md:left-0 mt-[35px] md:mt-0 content-center md:content-start text-left justify-between">
              <ul
                class="mt-[50px] md:mt-[20px] bg-white pb-1 list-reset flex flex-row md:flex-col pt-3 md:py-3 px-1 md:px-4 text-center md:text-left">
                <li class="flex-1 mb-0 md:mb-[10px]" v-for="(item, index) in mainNavigation"
                  v-on:click="!item.href ? openSubMenuList() : ''" :key="index">
                  <a :href="item.href" aria-label="dashboard" :class="[
                    currentRoute() == item.name ||
                      ((item.name == 'Dashboard') &&
                        (currentRoute() == 'ManageFarm' ||
                          currentRoute() == 'SelectBoard' ||
                          currentRoute() == 'SensorChart' ||
                          currentRoute() == 'ExportExcel' ||
                          currentRoute() == 'Climate' ||
                          currentRoute() == 'Geography' ||
                          currentRoute() == 'AddFarm' ||
                          currentRoute() == 'AddBoard' ||
                          currentRoute() == 'ActivityManage' ||
                          currentRoute() == 'ViewActivity')) || (item.name == 'Calculate' &&
                            (currentRoute() == 'CalculationDetail' ||
                              currentRoute() == 'CalculationResult')) || currentRoute() == item.name ||
                      (item.name == 'OtherPage' &&
                        (currentRoute() == 'Personal' || currentRoute() == 'Contact' ||
                          currentRoute() == 'EditPersonal')) || (item.name == 'Market' &&
                            (currentRoute() == 'MarketDetail'))
                      ? 'border-b-4 lg:border-0 border-[#01893D]'
                      : '',
                  ]"
                    class="relative flex flex-col lg:flex-row items-center  pt-2 lg:space-x-4 hover:bg-[#D5E7D9] text-white box-slide-menu self-center md:p-4">
                    <img v-if="(item.name != 'Dashboard' &&
                        (currentRoute() == 'ManageFarm' ||
                          currentRoute() == 'SelectBoard' ||
                          currentRoute() == 'SensorChart' ||
                          currentRoute() == 'ExportExcel' ||
                          currentRoute() == 'Climate' ||
                          currentRoute() == 'Geography' ||
                          currentRoute() == 'ActivityManage' ||
                          currentRoute() == 'ViewActivity')) ||
                      (currentRoute() != item.name &&
                        (currentRoute() != 'ManageFarm' ||
                          currentRoute() != 'SelectBoard' ||
                          currentRoute() != 'SensorChart' ||
                          currentRoute() != 'ExportExcel' ||
                          currentRoute() != 'Climate' ||
                          currentRoute() != 'Geography' ||
                          currentRoute() != 'ActivityManage' ||
                          currentRoute() != 'ViewActivity'))
                      " alt="" class="md:mt-3 lg:mt-0" :class="[
    currentRoute() == item.name &&
      item.name == 'Dashboard' &&
      (currentRoute() == 'ManageFarm' ||
        currentRoute() == 'SelectBoard' ||
        currentRoute() == 'ExportExcel' ||
        currentRoute() == 'SensorChart' ||
        currentRoute() == 'Climate' ||
        currentRoute() == 'Geography')
      ? 'bg-[#01893D]'
      : 'bg-[#000]',
    item.name == 'Dashboard' &&
      (currentRoute() == 'ManageFarm' ||
        currentRoute() == 'SelectBoard' ||
        currentRoute() == 'SensorChart' ||
        currentRoute() == 'ExportExcel' ||
        currentRoute() == 'Climate' ||
        currentRoute() == 'Geography' ||
        currentRoute() == 'AddFarm' ||
        currentRoute() == 'AddBoard' ||
        currentRoute() == 'ActivityManage' ||
        currentRoute() == 'DeviceList' ||
        currentRoute() == 'HistoryDevice' ||
        currentRoute() == 'ControlDevice' ||
        currentRoute() == 'AddDevice' ||
        currentRoute() == 'ViewActivity') || currentRoute() == item.name ||
      (item.name == 'Calculate' &&
        (currentRoute() == 'CalculationDetail' ||
          currentRoute() == 'CalculationResult')) || currentRoute() == item.name ||
      (item.name == 'OtherPage' &&
        (currentRoute() == 'Personal' || currentRoute() == 'Contact' ||
          currentRoute() == 'EditPersonal')) || (item.name == 'Market' &&
            (currentRoute() == 'MarketDetail'))
      ? 'hidden'
      : '',
    item.icon1,
  ]" />

                    <img v-if="currentRoute() == item.name ||
                      (item.name == 'Dashboard' &&
                        (currentRoute() == 'ManageFarm' ||
                          currentRoute() == 'SelectBoard' ||
                          currentRoute() == 'SensorChart' ||
                          currentRoute() == 'ExportExcel' ||
                          currentRoute() == 'Climate' ||
                          currentRoute() == 'Geography' ||
                          currentRoute() == 'AddFarm' ||
                          currentRoute() == 'AddBoard' ||
                          currentRoute() == 'ActivityManage' ||
                          currentRoute() == 'DeviceList' ||
                          currentRoute() == 'HistoryDevice' ||
                          currentRoute() == 'ControlDevice' ||
                          currentRoute() == 'AddDevice' ||
                          currentRoute() == 'ViewActivity')) || currentRoute() == item.name || (item.name == 'Calculate' && (currentRoute() == 'CalculationDetail' ||
                            currentRoute() == 'CalculationResult')) || currentRoute() == item.name || (item.name == 'OtherPage' && (currentRoute() == 'Personal' || currentRoute() == 'Contact' || currentRoute() == 'EditPersonal')) || currentRoute() == item.name || (item.name == 'Calculate' && (currentRoute() == 'CalculationDetail' ||
                              currentRoute() == 'CalculationResult')) || (item.name == 'Market' &&
                                (currentRoute() == 'MarketDetail'))
                      " alt="" class="md:mt-3 lg:mt-0" :class="[
    currentRoute() == item.name ||
      (item.name == 'Dashboard' &&
        (currentRoute() == 'ManageFarm' ||
          currentRoute() == 'SelectBoard' ||
          currentRoute() == 'SensorChart' ||
          currentRoute() == 'ExportExcel' ||
          currentRoute() == 'Climate' ||
          currentRoute() == 'Geography' ||
          currentRoute() == 'AddFarm' ||
          currentRoute() == 'AddBoard' ||
          currentRoute() == 'ActivityManage' ||
          currentRoute() == 'DeviceList' ||
          currentRoute() == 'HistoryDevice' ||
          currentRoute() == 'ControlDevice' ||
          currentRoute() == 'AddDevice' ||
          currentRoute() == 'ViewActivity')) || currentRoute() == item.name ||
      (item.name == 'Calculate' &&
        (currentRoute() == 'CalculationDetail' ||
          currentRoute() == 'CalculationResult')) || currentRoute() == item.name ||
      (item.name == 'OtherPage' && (currentRoute() == 'Personal' || currentRoute() == 'Contact' || currentRoute() == 'EditPersonal')) || (item.name == 'Market' &&
        (currentRoute() == 'MarketDetail'))
      ? 'bg-[#01893D]' : 'bg-black',
    item.icon2,
  ]" :style="[
  item.name == 'Dashboard' &&
    (currentRoute() == 'ManageFarm' ||
      currentRoute() == 'SelectBoard' ||
      currentRoute() == 'SensorChart' ||
      currentRoute() == 'ExportExcel' ||
      currentRoute() == 'AddBoard' ||
      currentRoute() == 'AddFarm' ||
      currentRoute() == 'Climate' ||
      currentRoute() == 'ActivityManage' ||
      currentRoute() == 'DeviceList' ||
      currentRoute() == 'HistoryDevice' ||
      currentRoute() == 'ControlDevice' ||
      currentRoute() == 'AddDevice' ||
      currentRoute() == 'ViewActivity' ||
      currentRoute() == 'Geography') || currentRoute() == item.name ||
    (item.name == 'Calculate' &&
      (currentRoute() == 'CalculationDetail' ||
        currentRoute() == 'CalculationResult')) || currentRoute() == item.name ||
    (item.name == 'OtherPage' &&
      (currentRoute() == 'Personal' || currentRoute() == 'Contact' ||
        currentRoute() == 'EditPersonal')) || (item.name == 'Market' &&
          (currentRoute() == 'MarketDetail'))
    ? 'margin-left: 0;'
    : '',
]" />

                    <span v-if="item.name == 'Dashboard'"
                      class="font-medium md:mt-2 lg:mt-0 lg:w-[120px] name-memu text-[10px] md:text-[16px]" :class="[
                        currentRoute() == item.name ||
                          (item.name == 'Dashboard' &&
                            (currentRoute() == 'ManageFarm' ||
                              currentRoute() == 'SelectBoard' ||
                              currentRoute() == 'SensorChart' ||
                              currentRoute() == 'ExportExcel' ||
                              currentRoute() == 'Climate' ||
                              currentRoute() == 'Geography' ||
                              currentRoute() == 'AddFarm' ||
                              currentRoute() == 'AddBoard' ||
                              currentRoute() == 'ActivityManage' ||
                              currentRoute() == 'DeviceList' ||
                              currentRoute() == 'HistoryDevice' ||
                              currentRoute() == 'ControlDevice' ||
                              currentRoute() == 'AddDevice'))
                          ? 'border-[#01893D] md:border-0 lg:border-r-4 text-[#01893D]'
                          : 'text-[#000] md:mb-2 lg:mb-0',
                      ]">{{ item.label }}</span>
                    <span v-else-if="item.name == 'Calculate'"
                      class="font-medium md:mt-2 lg:mt-0 lg:w-[120px] name-memu text-[10px] md:text-[16px]" :class="[
                        currentRoute() == item.name ||
                          (item.name == 'Calculate' &&
                            (currentRoute() == 'CalculationDetail' ||
                              currentRoute() == 'CalculationResult'))
                          ? 'border-[#01893D] md:border-0 lg:border-r-4 text-[#01893D]'
                          : 'text-[#000] md:mb-2 lg:mb-0',
                      ]">{{ item.label }}</span>
                    <span v-else-if="item.name == 'Market'"
                      class="font-medium md:mt-2 lg:mt-0 lg:w-[120px] name-memu text-[10px] md:text-[16px]" :class="[
                        currentRoute() == item.name ||
                          (item.name == 'Market' &&
                            (currentRoute() == 'MarketDetail'))
                          ? 'border-[#01893D] md:border-0 lg:border-r-4 text-[#01893D]'
                          : 'text-[#000] md:mb-2 lg:mb-0',
                      ]">{{ item.label }}</span>
                    <span v-else-if="item.name == 'OtherPage'"
                      class="font-medium md:mt-2 lg:mt-0 lg:w-[120px] name-memu text-[10px] md:text-[16px]" :class="[
                        currentRoute() == item.name ||
                          (item.name == 'OtherPage' &&
                            (currentRoute() == 'Personal' || currentRoute() == 'Contact' ||
                              currentRoute() == 'EditPersonal'))
                          ? 'border-[#01893D] md:border-0 lg:border-r-4 text-[#01893D]'
                          : 'text-[#000] md:mb-2 lg:mb-0',
                      ]">{{ item.label }}</span>
                    <span v-else
                      :class="[currentRoute() == item.name ? 'border-[#01893D] md:border-0 lg:border-r-4 text-[#01893D]' : 'text-[#000] md:mb-2 lg:mb-0']"
                      class="font-medium md:mt-2 lg:mt-0 lg:w-[120px] name-memu text-[10px] md:text-[16px]">{{ item.label
                      }}</span>
                  </a>
                  <div v-if="item.subMenu != ''">
                    <ul v-if="state.openSubMenu == true"
                      class="bg-white pb-2 absolute md:relative md:overflow-auto md:h-[270px] w-full mt-1 md:mt-0 list-reset left-0 md:flex-col text-center md:text-left pl-0 mb-0">
                      <li class="ml-0 lg:ml-10 mt-4" v-for="(submenu, index) in item.subMenu" :key="index">
                        <router-link :to="submenu.href"
                          class="mx-10 md:mx-0 text-center flex flex-row md:flex-col lg:flex-row  items-center justify-start md:justify-center lg:justify-start mb-4 lg:mb-6"
                          :class="[
                            currentRoute() == submenu.name
                              ? 'md:border-b-4 lg:border-0 md:border-[#01893D]'
                              : '',
                          ]">
                          <div class="mr-2">
                            <img alt="" class="w-[24px] h-[24px]"
                              :class="[currentRoute() == submenu.name ? 'bg-[#01893D]' : 'bg-[#000]', submenu.icon,]" />
                          </div>
                          <span :class="[
                            currentRoute() == submenu.name
                              ? 'border-[#01893D] md:border-0  text-[#01893D]'
                              : 'text-[#000] md:mb-2 lg:mb-0',
                          ]"
                            class="whitespace-nowrap font-medium lg:mt-0 name-memu text-[10px] md:text-[16px] md:pr-0">{{
                              submenu.label }}</span>
                        </router-link>
                        <!-- <a
                          :href="submenu.href"
                          aria-label="dashboard"
                          :class="[
                            currentRoute() == submenu.name
                              ? 'md:border-b-4 lg:border-0 md:border-[#01893D]'
                              : '',
                          ]"
                          class="whitespace-nowrap ml-0 lg:ml-5 mb-0 lg:mb-4  relative flex md:flex-col lg:flex-row items-center lg:space-x-4 hover:bg-[#D5E7D9] text-white  self-center text-center px-4 py-2 "
                        >
                          <img
                            alt=""
                            class="md:mt-3 lg:mt-0 "
                            :class="[
                              currentRoute() == submenu.name
                                ? 'bg-[#01893D]'
                                : 'bg-[#000]',
                              submenu.icon,
                            ]"
                          />

                          <span
                            class="font-medium ml-2 md:ml-0 md:mt-2 lg:mt-0 name-memu text-[10px] md:text-[16px] pr-2 md:pr-0"
                            :class="[
                              currentRoute() == submenu.name
                                ? 'border-[#01893D] md:border-0 border-r-4 text-[#01893D]'
                                : 'text-[#000] md:mb-2 lg:mb-0',
                            ]"
                            >{{ submenu.label }}</span
                          >
                        </a> -->
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div class="w-full h-full  bg-gray-100 ">
          <div id="main" class="main-content flex-1 mt-[43px] md:mt-0 ">
            <slot />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.custom-shadow {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/*  smooth Toggle */
.slide-enter-active,
.slide-leave-active {
  transition: transform 5s ease;
}

/* เคลื่อนที่เข้า ออก */
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}


@media screen and (max-width: 360px) {
  .custom-right {
    right: -60px !important;
  }

  .w-custom {
    width: 312px !important;
  }
}

@media screen and (max-width: 380px) {
  .custom-right {
    right: -45px;
  }

  .w-custom {
    width: 340px;
  }
}

@media screen and (max-width: 400px) {
  .custom-right {
    right: -50px;
  }
}

.line-custom {
  border: 1.5px solid green;
}

.vertical-line {
  width: 3px;
  margin: 0px 8px 0px 8px;
  height: 59px;
  background: #01893D;

}

.top-100 {
  top: 100%;
}

.bottom-100 {
  bottom: 100%;
}

.max-h-select {
  max-height: 300px;
}

.bell {
  display: block;
  font-size: 30px;
  color: #fff;
  -webkit-animation: ring 4s 0.7s ease-in-out infinite;
  -webkit-transform-origin: 50% 4px;
  -moz-animation: ring 4s 0.7s ease-in-out infinite;
  -moz-transform-origin: 50% 4px;
  animation: ring 4s 0.7s ease-in-out infinite;
  transform-origin: 50% 4px;
}

@-webkit-keyframes ring {
  0% {
    -webkit-transform: rotateZ(0);
  }

  1% {
    -webkit-transform: rotateZ(30deg);
  }

  3% {
    -webkit-transform: rotateZ(-28deg);
  }

  5% {
    -webkit-transform: rotateZ(34deg);
  }

  7% {
    -webkit-transform: rotateZ(-32deg);
  }

  9% {
    -webkit-transform: rotateZ(30deg);
  }

  11% {
    -webkit-transform: rotateZ(-28deg);
  }

  13% {
    -webkit-transform: rotateZ(26deg);
  }

  15% {
    -webkit-transform: rotateZ(-24deg);
  }

  17% {
    -webkit-transform: rotateZ(22deg);
  }

  19% {
    -webkit-transform: rotateZ(-20deg);
  }

  21% {
    -webkit-transform: rotateZ(18deg);
  }

  23% {
    -webkit-transform: rotateZ(-16deg);
  }

  25% {
    -webkit-transform: rotateZ(14deg);
  }

  27% {
    -webkit-transform: rotateZ(-12deg);
  }

  29% {
    -webkit-transform: rotateZ(10deg);
  }

  31% {
    -webkit-transform: rotateZ(-8deg);
  }

  33% {
    -webkit-transform: rotateZ(6deg);
  }

  35% {
    -webkit-transform: rotateZ(-4deg);
  }

  37% {
    -webkit-transform: rotateZ(2deg);
  }

  39% {
    -webkit-transform: rotateZ(-1deg);
  }

  41% {
    -webkit-transform: rotateZ(1deg);
  }

  43% {
    -webkit-transform: rotateZ(0);
  }

  100% {
    -webkit-transform: rotateZ(0);
  }
}

@-moz-keyframes ring {
  0% {
    -moz-transform: rotate(0);
  }

  1% {
    -moz-transform: rotate(30deg);
  }

  3% {
    -moz-transform: rotate(-28deg);
  }

  5% {
    -moz-transform: rotate(34deg);
  }

  7% {
    -moz-transform: rotate(-32deg);
  }

  9% {
    -moz-transform: rotate(30deg);
  }

  11% {
    -moz-transform: rotate(-28deg);
  }

  13% {
    -moz-transform: rotate(26deg);
  }

  15% {
    -moz-transform: rotate(-24deg);
  }

  17% {
    -moz-transform: rotate(22deg);
  }

  19% {
    -moz-transform: rotate(-20deg);
  }

  21% {
    -moz-transform: rotate(18deg);
  }

  23% {
    -moz-transform: rotate(-16deg);
  }

  25% {
    -moz-transform: rotate(14deg);
  }

  27% {
    -moz-transform: rotate(-12deg);
  }

  29% {
    -moz-transform: rotate(10deg);
  }

  31% {
    -moz-transform: rotate(-8deg);
  }

  33% {
    -moz-transform: rotate(6deg);
  }

  35% {
    -moz-transform: rotate(-4deg);
  }

  37% {
    -moz-transform: rotate(2deg);
  }

  39% {
    -moz-transform: rotate(-1deg);
  }

  41% {
    -moz-transform: rotate(1deg);
  }

  43% {
    -moz-transform: rotate(0);
  }

  100% {
    -moz-transform: rotate(0);
  }
}

@keyframes ring {
  0% {
    transform: rotate(0);
  }

  1% {
    transform: rotate(30deg);
  }

  3% {
    transform: rotate(-28deg);
  }

  5% {
    transform: rotate(34deg);
  }

  7% {
    transform: rotate(-32deg);
  }

  9% {
    transform: rotate(30deg);
  }

  11% {
    transform: rotate(-28deg);
  }

  13% {
    transform: rotate(26deg);
  }

  15% {
    transform: rotate(-24deg);
  }

  17% {
    transform: rotate(22deg);
  }

  19% {
    transform: rotate(-20deg);
  }

  21% {
    transform: rotate(18deg);
  }

  23% {
    transform: rotate(-16deg);
  }

  25% {
    transform: rotate(14deg);
  }

  27% {
    transform: rotate(-12deg);
  }

  29% {
    transform: rotate(10deg);
  }

  31% {
    transform: rotate(-8deg);
  }

  33% {
    transform: rotate(6deg);
  }

  35% {
    transform: rotate(-4deg);
  }

  37% {
    transform: rotate(2deg);
  }

  39% {
    transform: rotate(-1deg);
  }

  41% {
    transform: rotate(1deg);
  }

  43% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(0);
  }
}

.icon-slide-bar {
  background-color: #890606;
  height: 50px;
  width: 50px;
}

.box-slide-menu:hover img {
  background: #01893D;
}

.box-slide-menu:hover .name-memu {
  color: #01893D;
}

.box-slide-menu:hover .custom-underline {
  color: #01893D00;
}

.custom-input-select {
  background-color: #fff !important;
}
</style>





