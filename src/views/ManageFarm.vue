<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import { ref, reactive, onMounted, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import Swal from "sweetalert2";
import farmimg from "@/assets/img/img_landingpage/bg-device.png";
import slope from "@/assets/img/icons/slope.png";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";
const mainStore = useMainStore();
const router = useRouter();

let priority = ref(4);
let dropdownShow = ref(false);
let abundance = ref("0");
const states = reactive({
  farms: [],
  pickFarmDelete: false,
  isOpen: false,
  farm_select_del: "",
});

onBeforeMount(() => {
  ApiCore.get("/v2/projects/?limit=all").then((response) => {
    states.farms = response.data.data;
    //console.log(states.farms);
  });
});

const selectBoard = () => {
  console.log("SelectBoard");
};

const DeleteFarm = (id) => {
  //console.log("DeleteFarm");
  states.farm_select_del = id;
  if (states.pickFarmDelete == false) {
    states.pickFarmDelete = true;
  } else {
    states.pickFarmDelete = false;
  }
};

const ConfirmDeleteFarm = (id) => {
  //console.log("ConfirmDeleteFarm");
  if (states.pickFarmDelete == false) {
    states.pickFarmDelete = true;
  } else {
    states.pickFarmDelete = false;
  }

  ApiCore.delete("/v2/projects/"+states.farm_select_del)
  .then((data) => {
      //console.log(data.status);
      if (data.status == 204) {
        Swal.fire({
          icon: "success",
          title: "ลบฟาร์ม สำเร็จ",
          showConfirmButton: 1,
          timer: 3000,
        });
        ApiCore.get("/v2/projects/?limit=all").then((response) => {
            states.farms = response.data.data;
        }).then((data) => {
            //router.push("/ManageFarm");
            mainStore.CustomerFarmName = ""
            mainStore.CustomerFarmImage = ""
            window.location.replace("/ManageFarm")
        })
      }
    })
    .catch((error) => {
      //console.log(error.response.data);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถลบฟาร์มได้",
        showConfirmButton: 1,
        timer: 4000,
      });
    });
};

let farm_active = ref(0);
const showdropdown =(farm_id)=>{

  farm_active.value = farm_id ;

  dropdownShow.value = !dropdownShow.value ;

};
</script>
<template>
  <NavbarMain>
    <div id="home" >
      <HeaderFarm />
      <!-- ไม่มีฟาร์ม -->
      <div v-if="states.farms ==''" class="m-4">
        <h1 class="text-[22px] font-bold mb-4">จัดการฟาร์ม</h1>
        <div class="flex items-center justify-center bg-white p-4 rounded-2xl w-full">
          <div class="flex flex-col p-4">
            <h1 class="text-center text-base md:text-xl text-[#837D7B] font-medium mb-4">ไม่พบฟาร์ม</h1>
            <p class="text-center text-sm md:text-lg text-[#837D7B] font-medium mb-4">เพิ่มฟาร์มของคุณเพื่อเพิ่มบอร์ด</p>
            <router-link to="/AddFarm">
            <button class="text-white hover:text-[#01893D] bg-[#01893D] rounded-lg hover:bg-[#fff]  w-[256px] h-[36px] ">
              <img alt="" class="inline add lg:mt-0 bg-[#fff] mr-2" style="width: 20px; height: 20px" />
              <span class="text-sm font-bold md:text-base ">เพิ่มฟาร์มของคุณ</span>
            </button>
          </router-link>
          </div>
        </div>
      </div>
      <div v-else class="px-2">
        <div class="grid grid-cols-2 items-center mt-5">
          <h1 class="text-[22px] md:text-2xl font-bold pl-2">
            จัดการฟาร์ม
          </h1>
          <router-link to="/AddFarm" class="ml-auto pr-2">
                <button type="button"
                  class="text-white hover:text-[#01893D] bg-[#01893D] hover:bg-[#fff] font-medium rounded-[8px] text-sm px-2 h-[36px] text-center inline-flex items-center btn-custom">
                  <img alt="" class="inline add lg:mt-0 bg-[#fff] mr-1" style="width: 20px; height: 20px" />
                  <span>เพิ่มฟาร์มของคุณ</span>
                </button>
          </router-link>
        </div>
        <div class="mt-4">
          <div class="content-center grid xl:grid-cols-2 gap-4 p-2 pt-0">
            <div v-for="(farm, index) in states.farms" :key="index"
              class="mx-auto overflow-hidden w-full rounded-[16px] bg-white py-4 pb-0"
              style=""
            >
              <div class="">
                <div class="grid grid-cols-4 relative">
                  <p
                    class="col-span-3 font-medium text-base mt-1 pl-2 md:ml-[12px] text-[#01893D]"
                  >
                    {{ farm.name }}
                  </p>
                  <a @click="showdropdown(farm.id)" :class="{active:farm_active == farm.id}">
                    <button
                      class=" bg-[#01893D] hover:bg-[#fff] text-white font-bold rounded-[8px] h-9 w-9 absolute right-[15px] btn-custom"
                    >
                      <img
                        alt=""
                        class="mx-auto bg-[#fff] w-4 md:w-6 edit h-4 md:h-6"
                      />
                    </button>
                    <div v-if="dropdownShow==true"  :class="farm_active === farm.id ? 'active' : 'hidden'" class="a-hidden w-[118px] absolute bg-white shadow-lg top-10 right-0 rounded-lg  border-2 border-[#01893D]">
                        <ul>
                          <li class=" hover:bg-gray-100 hover:rounded-lg cursor-pointer p-2"><router-link :to="`/AddFarm?id=${farm.id}`" class="text-[#01893D] text-sm font-medium ">แก้ไขฟาร์ม</router-link></li>
                          <li class=" hover:bg-gray-100 hover:rounded-lg cursor-pointer p-2"><a @click="DeleteFarm(farm.id)" class="text-[#01893D] text-sm font-medium ">ลบฟาร์ม</a></li>
                        </ul>
                    </div>
                  </a>
                  <!-- <button
                    @click="DeleteFarm(farm.id)"
                    class="bg-[#E04C4F] hover:bg-[#fff] text-white font-bold rounded-[8px] h-9 w-9 absolute right-2 btn-custom-delete"
                  >
                    <img
                      alt=""
                      class="mx-auto bg-[#fff] w-4 md:w-5 delete2 h-4 md:h-5"
                    />
                  </button> -->
                </div>
                <div class="p-2 mt-1 w-full">
                  <router-link :to="`/selectBoard?farmid=${farm.id}`">
                  <img v-if="farm.image==null"
                    class="rounded-[16px] object-cover h-20 md:h-48 w-full"
                    :src="farmimg"
                    alt=""
                  />
                  <img v-else
                    class="rounded-[16px] object-cover h-20 md:h-48 w-full"
                    :src="farm.image.link"
                    alt=""
                  />
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        :class="[
          states.pickFarmDelete == false ? 'opacity-0 pointer-events-none' : '',
        ]"
        class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-10"
      >
        <div
          class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        ></div>

        <div
          class="modal-container bg-white w-11/12 md:max-w-md mx-auto shadow-lg z-50 overflow-y-auto rounded-[16px]"
        >
          <div class="modal-content py-4 text-left px-6">
            <p class="text-center mt-6">คุณต้องการจะลบฟาร์มใช่หรือไม่?</p>
            <div class="flex justify-center mt-4">
              <button
                @click="ConfirmDeleteFarm()"
                class="bg-[#01893D] mr-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 w-full btn-custom"
              >
                <img
                  alt=""
                  class="inline check lg:mt-0 bg-[#fff]"
                  style="width: 20px; height: 20px"
                />
                <span class="text-sm ml-1">ตกลง</span>
              </button>
              <button
                v-on:click="states.pickFarmDelete = false"
                class="modal-close bg-[#01893D] ml-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 w-full btn-custom"
              >
                <img
                  alt=""
                  class="inline close lg:mt-0 bg-[#fff]"
                  style="width: 15px; height: 15px"
                />
                <span class="text-sm ml-1">ยกเลิก</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>

<style land="scss">
@import "@/assets/styles/custom-icons.css";


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
  height: 90px;
}
</style>
