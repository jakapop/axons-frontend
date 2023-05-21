<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import Swal from "sweetalert2";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";

const mainStore = useMainStore();
const router = useRouter();
const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;

let operGarp = false;
let selectedOpen = false;
let selectedFarm = "";

const states = reactive({
  pickBoardDelete: false,
  editBoard: false, //2011L2BLPVXTCEE
  boards: [],
  board_select_del: "",
  farms: []
});

const boards_select = computed(() => {
  ApiCore.get("v2/projects/" + mainStore.CustomerFarmId + "/boards").then(
    (response) => {
      //console.log(mainStore.CustomerFarmId)
      states.boards = response.data.data;
      const board_data = response.data.data;
      Object.entries(board_data).forEach(([key, val]) => {
        ApiCore.get("/v2/firmware/" + val.serial).then((data) => {
          if (data.data.status) {
            if (data.data.data.new_release) {
              states.boards[key]["new_release"] =
                data.data.data.new_release.new_version;
            }
          }
        });
      });
    }
  );
  return;
});

onMounted(() => {
  ApiCore.get("/v2/projects/?limit=all").then((response) => {
    states.farms = response.data.data;
    console.log("myfarm ==", states.farms.length);
  });
  ApiCore.get("v2/projects/" + mainStore.CustomerFarmId + "/boards").then(
    (response) => {
      const board_data = response.data.data;
      Object.entries(board_data).forEach(([key, val]) => {
        ApiCore.get("/v2/firmware/" + val.serial).then((data) => {
          if (data.data.status) {
            if (data.data.data.new_release) {
              states.boards[key]["new_release"] =
                data.data.data.new_release.new_version;
            }
          }
        });
      });
    }
  );
});

const EditBoard = () => {
  if (states.editBoard == false) {
    states.editBoard = true;
  } else {
    states.editBoard = false;
  }
};

const renameBoard = (serial, event) => {
  //console.log("Rename" + mainStore.CustomerFarmId + " " + serial + event.target.value)
  ApiCore.put("v2/projects/" + mainStore.CustomerFarmId + "/boards/" + serial, {
    name: event.target.value,
  }).then((response) => {
    console.log(response.data.status);
  });
};

const UpFirmWare = (serial, new_release) => {
  console.log("UpFirmWare:" + serial + ":" + new_release);
  Swal.fire({
    title: "อัพเดตเฟิร์มแวร์",
    text: "บอร์ดของคุณต้องเชื่อมต่ออินเตอร์เน็ตก่อนทำการอัพเดต",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: "ยกเลิก",
    cancelButtonColor: "#d33",
    confirmButtonText: "อัพเดต",
  }).then((result) => {
    if (result.isConfirmed) {
      ApiCore.post("/v2/firmware/" + serial, {
        serial: serial,
        request_version: new_release,
      }).then((response) => {
        console.log(response.data);
        let timerInterval;
        Swal.fire({
          title: "กำลังทำการอัพเดตเฟิร์มแวร์",
          html: "กรุณารอสักครู่ .....",
          timer: 80000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
              //console.log(Swal.getTimerLeft());
              ApiCore.put("/v2/firmware/" + serial, {
                serial: serial,
                upgrade_status: "success",
              }).then((response) => {
              }).catch((error) => {
                Swal.fire({
                  title: "อัพเดตเฟิร์มแวร์สำเร็จ",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 2500
                })
                clearInterval(timerInterval);
                Swal.close();
                window.location.replace("/selectBoard");
              });
            }, 1000);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
          }
        });
      }).catch((error) => {
        console.log(error.response.data);
        Swal.fire({
          title: "ไม่สามารถอัพเดตเฟิร์มแวร์",
          text: error.response.data.detail,
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          Swal.close();
          window.location.replace("/selectBoard");
        });
      });
    }
  });
};

const DeleteBoard = (serial) => {
  //console.log("DeleteBoard "+serial)
  states.board_select_del = serial;
  if (states.pickBoardDelete == false) {
    states.pickBoardDelete = true;
  } else {
    states.pickBoardDelete = false;
  }
};

const ConfirmDeleteBoard = () => {
  states.editBoard = false;
  if (states.pickBoardDelete == false) {
    states.pickBoardDelete = true;
  } else {
    states.pickBoardDelete = false;
  }
  ApiCore.delete(
    "/v2/projects/" + CustomerFarmId + "/boards/" + states.board_select_del
  )
    .then((data) => {
      //console.log(data.status);
      if (data.status == 204) {
        Swal.fire({
          icon: "success",
          title: "ลบบอร์ด สำเร็จ",
          showConfirmButton: 1,
          timer: 2000,
        });
        ApiCore.get("v2/projects/" + mainStore.CustomerFarmId + "/boards").then(
          (response) => {
            states.boards = response.data.data;
          }
        );
        router.push("/SelectBoard");
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถลบบอร์ดได้",
        showConfirmButton: 1,
        timer: 4000,
      });
    });
};
let activity_active = ref(0);
let dropdownShow = ref(false);
const showdropdown = (active_id) => {
  activity_active.value = active_id;

  dropdownShow.value = !dropdownShow.value;
};

const edit_data = (serial_board,board_name) => {
  console.log('serial board == ', serial_board,board_name);

  if(board_name == null){
    board_name = serial_board ;
    router.push(`/editBoard?board=${serial_board}`);
  }
  else{
    router.push(`/editBoard?board=${serial_board}&board_name=${board_name}`);
  }

};


</script>
<template>
  <NavbarMain>
    {{ boards_select }}
    <div>
      <HeaderFarm />
      <div v-if="states.boards.length != 0 && states.farms.length > 0" class="m-4">
        <div class="flex flex-row justify-between">
          <h1 class="text-[22px] font-bold">เลือกบอร์ด</h1>
          <div>
            <router-link to="/AddBoard">
              <button v-if="states.editBoard == false"
                class="bg-[#01893D] hover:bg-[#fff] text-white font-bold px-2 hover:text-[#01893D] rounded-[10px] h-[36px] btn-custom">
                <img alt="" class="inline add lg:mt-0 bg-[#fff]" />
                <span class="text-sm ml-1">เพิ่มบอร์ด</span>
              </button>
            </router-link>
          </div>
        </div>
        <div class="content-center grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 p-2 md:gap-4 lg:gap-8 pt-0 mt-2">
          <div v-for="(board, index) in states.boards" :key="index"
            class="mx-auto overflow-hidden w-full rounded-[16px] bg-white pb-1 relative">
            <div class="flex flex-row justify-between items-center py-2 mx-2 gap-2 h-[36px] mt-2">
              <div class="w-[100px]">
                <button v-if="board.new_release" type="button" @click="UpFirmWare(board.serial, board.new_release)"
                  class="bg-[#01893D] h-[36px] w-full rounded-[10px] text-sm font-medium">
                  <img class="inline upfw lg:mt-0 bg-[#fff]" style="width: 20px; height: 20px" />
                  <span class="text-white">อัพเดต</span>
                </button>
              </div>
              <div>
                <div class="flex flex-row justify-end relative">
                  <a @click="showdropdown(board.serial)" :class="{ active: activity_active == board.serial }">
                    <div class="mr-1">
                      <button type="button"
                        class="bg-[#01893D] rounded-md py-1 px-2 w-[36px] h-[36px] md:w-[36px] md:h-[36px]">
                        <img src="../assets/img/icons/edit.svg" alt="" class="w-[24px] sm:w-[30px]  md:w-[50px]" />
                      </button>
                    </div>
                  </a>
                  <div v-if="dropdownShow == true" :class="activity_active === board.serial ? 'active' : 'hidden'"
                    class="a-hidden w-[118px] absolute bg-white shadow-lg top-10 right-0 rounded-lg  border-2 border-[#01893D] z-10">
                    <ul>
                      <li @click="edit_data(board.serial,board.name)" class="cursor-pointer hover:bg-gray-100 hover:rounded-lg  p-2">
                        <span class="text-[#01893D] text-sm font-medium">แก้ไขบอร์ด</span></li>
                      <li @click="DeleteBoard(board.serial, board.name)"
                        class="cursor-pointer hover:bg-gray-100 hover:rounded-lg  p-2"><span
                          class="text-[#01893D] text-sm font-medium">ลบบอร์ด</span></li>
                    </ul>
                  </div>
                  <div>
                  </div>
                </div>
                <!-- DELETE BOARD -->
                <!-- <button type="button" @click="DeleteBoard(board.serial)"
              v-if="states.editBoard == true" class="bg-[#E04C4F] hover:bg-[#fff] hover:text-[#01893D] text-white font-medium rounded-[10px] w-[36px] h-[36px] px-2"><img alt="" class="mx-auto bg-[#fff] w-4 md:w-6 delete2 h-4 md:h-6"/></button> -->
              </div>
            </div>
            <a :href="`/dashboard?boards=${board.serial}`">
              <div class="text-center">
                <img class="inline w-16 md:w-[104px]" style="margin-left: 4px" src="/img/boards/all/2309.svg" />
                <div v-if="states.editBoard == false"
                  class="mt-4 font-bold text-sm md:text-lg xl:text-2xl mb-2 ml-1 md:ml-[12px] truncate px-2">
                  <span v-if="board.name">{{ board.name }}</span>
                  <span v-else>{{ board.serial }}</span>
                </div>
              </div>
            </a>
            <div class="px-2 mt-4" v-if="states.editBoard == true">
              <input v-model="board.name" type="text" name="boardName" @change="renameBoard(board.serial, $event)"
                class="block w-full px-4 mt-2 text-[#01893D] placeholder-gray-400 bg-white border border-[#01893D] rounded-[10px] h-9 focus:border-[#01893D] focus:ring-[#01893D] focus:outline-none focus:ring focus:ring-opacity-40" />
            </div>
          </div>
        </div>
      </div>
      <!-- หน้าไม่พบบอร์ด -->
      <div v-else-if="states.farms.length > 0 && states.boards.length == 0" class="m-4">
        <h1 class="font-bold text-[22px] mb-4">เลือกบอร์ดของคุณ</h1>
        <div>
          <div class="pt-4 rounded-[16px] bg-[#fff] pb-6">
            <div class="mb-3 md:text-lg text-center text-[#827C7B] font-medium">
              <p>ไม่พบบอร์ด</p>
            </div>
            <div class="w-full px-4">
              <div class="text-center">
                <div class="mb-3 text-sm md:text-lg md:text-center text-[#827C7B] font-medium">
                  <p>เพิ่มบอร์ดของคุณเพื่อดูข้อมูลจากเซนเซอร์</p>
                </div>
                <div class="flex justify-center">
                  <router-link to="/AddBoard">
                    <button
                      class="bg-[#01893D] hover:bg-[#fff] text-white font-medium px-2 mr-1 hover:text-[#01893D] rounded-[10px] h-9 w-[114px] btn-custom">
                      <img alt="" class="inline add lg:mt-0 bg-[#fff]" style="width: 20px; height: 20px" />
                      <span class="text-sm ml-1">เพิ่มบอร์ด</span>
                    </button>
                  </router-link>

                  <router-link to="/contact">
                    <button
                      class="bg-[#01893D] hover:bg-[#fff] text-white font-bold px-2 ml-1 hover:text-[#01893D] rounded-[10px] h-9 w-[124px] btn-custom">
                      <img alt="" class="inline support lg:mt-0 bg-[#fff]" />
                      <span class="text-sm ml-1">ติดต่อเรา</span>
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- กรณีไม่มีบอร์ด กับ ไม่มีฟาร์ม -->
      <div v-else-if="states.farms.length == 0 && states.boards.length == 0" class="m-4">
        <h1 class="font-bold text-[22px] mb-4">เลือกบอร์ดของคุณ</h1>
        <div>
          <div class="pt-4 rounded-[16px] bg-[#fff] pb-6">
            <div class="mb-3 md:text-lg text-center text-[#827C7B] font-medium">
              <p>ยังไม่ได้สร้างฟาร์ม</p>
            </div>
            <div class="w-full px-4">
              <div class="text-center">
                <div class="mb-3 text-sm md:text-lg md:text-center text-[#827C7B] font-medium">
                  <p>สร้างฟาร์มของคุณเพื่อดูข้อมูลจากเซนเซอร์</p>
                </div>

                <router-link to="/addFarm"
                  class="flex flex-row items-center justify-center bg-[#01893D] hover:bg-[#fff] rounded-lg text-white font-medium w-full h-[36px] ">
                  <img alt="" class="inline add lg:mt-0 bg-[#fff] mr-2" style="width: 20px; height: 20px" />
                  เพิ่มฟาร์มของคุณ</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- End -->

      <!--Modal-->
      <div :class="[
          states.pickBoardDelete == false
            ? 'opacity-0 pointer-events-none'
            : '',
        ]" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-10">
        <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

        <div
          class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto rounded-[24px]">
          <div class="modal-content py-4 text-left px-6">
            <!--Title-->
            <div class="flex justify-between items-center pb-3">
              <div>
                <img alt="" class="mr-4 -mt-1 delete inline lg:mt-0 bg-[#000]" style="width: 32px; height: 32px" />
                <p class="text-[22px] font-bold inline">ยืนยันการลบบอร์ด</p>
              </div>
            </div>

            <!--Body-->
            <p class="text-center mt-6">คุณต้องการจะลบบอร์ดใช่หรือไม่?</p>

            <!--Footer-->
            <div class="flex justify-center mt-4">
              <button @click="ConfirmDeleteBoard()"
                class="bg-[#01893D] mr-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom">
                <!-- <div class="grid grid-cols-2"> -->
                <img alt="" class="inline check lg:mt-0 bg-[#fff]" style="width: 20px; height: 20px" />
                <span class="text-sm ml-1">ตกลง</span>
                <!-- </div> -->
              </button>
              <button v-on:click="states.pickBoardDelete = false"
                class="modal-close bg-[#01893D] ml-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom">
                <!-- <div class="grid grid-cols-2"> -->
                <img alt="" class="inline close lg:mt-0 bg-[#fff]" style="width: 15px; height: 15px" />
                <span class="text-sm ml-1">ยกเลิก</span>
                <!-- </div> -->
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

.btn-custom:hover img {
  background-color: #01893D;
}

.header-img {
  background-image: url("@/assets/img/img_landingpage/bg-device.png");
}

.hidden-board {
  display: hidden;
}
</style>
