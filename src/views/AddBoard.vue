<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";

import { QrcodeStream } from "vue3-qrcode-reader";

const mainStore = useMainStore();
const router = useRouter();

const CustomerId = mainStore.CustomerId;
const CustomerFarmId = mainStore.CustomerFarmId;

const form = reactive({
  serial: "", //2011L2BLPVXTCEE
  showModal: false,
  torch: false,
  err: false,
});

// onMounted(() => {
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d", { willReadFrequently: true });
// });

const scanqr = () => {
  form.showModal = !form.showModal;
};

const saveqr = () => {
  console.log("saveqr");
};

const closeqr = () => {
  form.showModal = !form.showModal;
};

const onInit = async (promise) => {
  try {
    const { capabilities } = await promise;
    // successfully initialized
  } catch (error) {
    if (error.name === "NotAllowedError") {
      error = "user denied camera access permisson";
    } else if (error.name === "NotFoundError") {
      error = "no suitable camera device installed";
    } else if (error.name === "NotSupportedError") {
      error = "page is not served over HTTPS (or localhost)";
    } else if (error.name === "NotReadableError") {
      error = "maybe camera is already in use";
    } else if (error.name === "OverconstrainedError") {
      error = " did you requested the front camera although there is none?";
    } else if (error.name === "StreamApiNotSupportedError") {
      error = "browser seems to be lacking features";
    }
  } finally {
    // hide loading indicator
  }
};

const onDecode = (decodedString) => {
  form.serial = decodedString;
  form.showModal = !form.showModal;
  Swal.fire({
    position: "center",
    icon: "success",
    title: "สแกน QR Code สำเร็จ",
    showConfirmButton: false,
    timer: 1500,
  });
  //alert(decodedString);
};

const submit = () => {
  ApiCore.post("/v2/projects/" + CustomerFarmId + "/boards", {
    serial: form.serial,
  })
    .then((data) => {
      console.log(data.status);
      form.err = false;
      if (data.status == 200) {
        Swal.fire({
          icon: "success",
          title: "เพิ่มบอร์ด สำเร็จ",
          showConfirmButton: 1,
          timer: 2000,
        });
        router.push("/SelectBoard");
      } else {
      }
    })
    .catch((error) => {
      console.log(error.response.data);
      form.err = true;
      let error_messege = "";
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเพิ่มบอร์ดได้",
        showConfirmButton: 1,
        timer: 4000,
      });
    });
};
</script>
<template>
  <NavbarMain>
    <div>
      <HeaderFarm />
      <div class="pl-4 pr-6 pt-4 mb-4">
        <h1 class="text-[22px] md:text-2xl font-bold my-[20px] mt-0">
          เพิ่มบอร์ด
        </h1>

        <div class="pt-4 rounded-[16px] bg-[#fff] pb-6">
          <!-- <div>
                      <input type="date"
                class="w-[130px] md:w-1/2 py-1 md:py-4 md:ml-auto text-[12px] md:text-lg xl:text-2xl rounded-[16px] border-[#01893D] text-[#01893D]">
                    </div> -->
          <div class="mb-3 text-base text-center">
            <p class="text-left pl-4">เพิ่มโดยการกรอก Serial number</p>
          </div>

          <form class="w-full px-4">
            <div class="md:flex  mb-6">
              <div class="w-full md:w-2/3">
                <input
                  v-model="form.serial"
                  :class="
                    form.err == false ? 'border-[#01893D]' : 'border-red-500 '
                  "
                  class="focus:ring-[#01893D] focus:border-[#01893D] bg-white rounded-[8px] h-[36px] md:h-9 text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1"
                  id="inline-serial"
                  type="text"
                  oninput="this.value = this.value.toUpperCase();"
                />
                <div v-if="form.err == true" class="text-right">
                  <span class="text-red-500 text-sm ml-auto mr-3 mt-2"
                    >Serial number ไม่ถูกต้อง</span
                  >
                </div>
              </div>
              <div class="md:w-1/3 md:px-2 mt-2 md:mt-0">
                <button
                  @click="submit"
                  type="button"
                  class="bg-[#01893D] hover:bg-[#fff] text-white font-medium px-2 mr-1 hover:text-[#01893D] rounded-[10px] h-9 w-full btn-custom"
                >
                  <!-- <div class="grid grid-cols-2"> -->
                  <img
                    alt=""
                    class="inline check lg:mt-0 bg-[#fff]"
                    style="width: 20px; height: 20px"
                  />
                  <span class="text-sm ml-1">ยืนยัน</span>
                  <!-- </div> -->
                </button>
              </div>
            </div>
            <div class="text-center">
              <div class="mb-3 text-base">
                <p>หรือเพิ่มโดย QR Code</p>
              </div>
              <button
                type="button"
                @click="scanqr"
                class="bg-[#01893D] hover:bg-[#fff] text-white font-medium px-2 mr-1 hover:text-[#01893D] rounded-[10px] h-9 w-full btn-custom"
              >
                <!-- <div class="grid grid-cols-2"> -->
                <img
                  alt=""
                  class="inline qr_code_scanner lg:mt-0 bg-[#fff]"
                  style="width: 20px; height: 20px"
                />
                <span class="text-sm ml-1">สแกน QR CODE</span>
                <!-- </div> -->
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </NavbarMain>

  <!-- <canvas id="canvas"> -->
  <div>
    <div
      v-if="form.showModal"
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
    >
      <div>
        <div class="pl-4 pr-6 pt-4">
          <div class="pt-4 rounded-[16px] bg-[#fff] pb-6">
            <p class="flex justify-center text-xl font-bold my-[6px] pl-5">
              สแกน QR CODE
            </p>
            <form class="w-full px-4">
              <div class="w-full">
                <div class="bg-gray-50 px-8">
                  <QrcodeStream
                    @init="onInit"
                    @decode="onDecode"
                  ></QrcodeStream>
                </div>
              </div>
              <div class="flex justify-center mt-4 mb-2">
                <router-link to="/addboard">
                  <button
                    @click="saveqr"
                    type="button"
                    class="bg-[#01893D] mr-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom w-[120px]"
                  >
                    <img
                      alt=""
                      class="inline check lg:mt-0 bg-[#fff]"
                      style="width: 20px; height: 20px"
                    />
                    <span class="text-sm ml-1">ตกลง</span>
                  </button>
                </router-link>
                <router-link to="/addboard">
                  <button
                    @click="closeqr"
                    class="modal-close bg-[#01893D] ml-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom w-[120px]"
                  >
                    <img
                      alt=""
                      class="inline close lg:mt-0 bg-[#fff]"
                      style="width: 15px; height: 15px"
                    />
                    <span class="text-sm ml-1">ยกเลิก</span>
                  </button>
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="form.showModal"
      class="opacity-25 fixed inset-0 z-40 bg-black"
    ></div>
  </div>
  <!-- </canvas> -->
</template>
<style>
@import "@/assets/styles/custom-icons.css";

input[type="date"]::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 1;
  display: block;
  background: url(@/assets/img/icons/calendar_month.png) no-repeat center;
  width: 20px;
  height: 20px;
  border-width: thin;
}

.btn-custom-add:hover img {
  background-color: #01893D;
}

.header-img {
  background-image: url("@/assets/img/img_landingpage/bg-device.png");
}
</style>
