<script setup>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Auth from "@/layouts/Auth.vue";
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

// import OtpVertify from "@/components/OTP/OtpVerfify.vue";
import VOtpInput from "vue3-otp-input";

const user_regis = JSON.parse(localStorage.getItem("user_regis") || "[]");
const vertify = localStorage.getItem('vertify');
let time_counter = ref(0);

const state = reactive({
  username: user_regis.username,
  ref: localStorage.getItem("otp_ref"),
  otp_code: "",
  type_otp: localStorage.getItem("type_otp"),
  otp_password: localStorage.getItem("otp_password"),
  set_sec: 190,
});

let selectedOpen = ref(false);
let selectedLang = ref("TH");

const states = reactive({
  selectedLangFlag: "thai",
});

const router = useRouter();

const counter_time = () => {
  let counter = setInterval(() => {
    time_counter.value = state.set_sec + " " + "วินาที";
    state.set_sec--;
    if (state.set_sec == -1) {
      clearInterval(counter);
      time_counter.value = "หมดเวลา";
    }
  }, 1000);
};

onBeforeMount(() => {
  if (!localStorage.getItem("type_otp")) {
    router.push("/");
  }
  counter_time();
});

const handleOnComplete = (value) => {
  state.otp_code = value;
};

const handleOnChange = (value) => {
  //console.log("OTP changed: ", value);
};

const resend = () => {
  console.log("resend" + state.type_otp);
  state.set_sec = 120;
  let url = "";
  if (state.type_otp == "forgot") {
    url = "/api/auth/forgot-password";
  } else {
    url = "/api/auth/request-verify";
  }

  ApiSso.post(url, {
    type: "phone",
    username: state.username,
  }).then((data_otp) => {
    console.log(data_otp);
    if (data_otp.data.message == "Success") {
      localStorage.setItem("otp_regis", data_otp.data.ref);
      state.ref = data_otp.data.ref;
      Swal.fire({
        icon: "success",
        title: "ส่ง OTP สำเร็จ",
        html: "กรุณากรอกรหัส OTP จาก SMS ของคุณ",
        showConfirmButton: 1,
        timer: 3000,
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "ส่ง OTP ไม่สำเร็จ",
        showConfirmButton: 1,
        timer: 3000,
      });
    }
  });
};

const submit = () => {
  console.log(
    state.type_otp +
      " " +
      state.username +
      " " +
      state.ref +
      " " +
      state.otp_code
  );
  if (state.otp_code != "") {
    if (state.type_otp == "regis" ) {
      ApiSso.post("/api/v2/auth/verify", {
        username: state.username,
        ref: state.ref,
        code: state.otp_code,
      })
        .then((data) => {
          console.log(data.data);
          if (data.data.message == "Success") {
            Swal.fire({
              icon: "success",
              title: "ยืนยันตัวตน OTP สำเร็จ",
              showConfirmButton: 1,
              timer: 4000,
            });
            router.push("/");
            localStorage.removeItem("user_regis");
            localStorage.removeItem("otp_regis");
            localStorage.removeItem("type_otp");
          } else {
            Swal.fire({
              icon: "error",
              title: "ยืนยันตัวตน OTP ไม่สำเร็จ",
              showConfirmButton: 1,
              timer: 3000,
            });
          }
        })
        .catch((error) => {
          console.log("Failed ");
          Swal.fire({
            icon: "warning",
            title: 'ข้อมูลไม่ถูกต้อง',
            text: 'โปรดระบุรหัส OTP ให้ถูกต้อง',
            showConfirmButton: 1,
            timer: 4000,
          });
        });
    }
    else if(state.type_otp == "resend_vertify"){
      ApiSso.post("/api/v2/auth/verify", {
        username: vertify,
        ref: state.ref,
        code: state.otp_code,
      })
        .then((data) => {
          console.log(data.data);
          if (data.data.message == "Success") {
            Swal.fire({
              icon: "success",
              title: "ยืนยันตัวตน OTP สำเร็จ",
              showConfirmButton: 1,
              timer: 4000,
            });
            router.push("/");
            localStorage.removeItem("user_regis");
            localStorage.removeItem("otp_regis");
            localStorage.removeItem("type_otp");
          } else {
            Swal.fire({
              icon: "error",
              title: "ยืนยันตัวตน OTP ไม่สำเร็จ",
              showConfirmButton: 1,
              timer: 3000,
            });
          }
        })
        .catch((error) => {
          console.log("Failed ");
          Swal.fire({
            icon: "warning",
            title: 'ข้อมูลไม่ถูกต้อง',
            text: 'โปรดระบุรหัส OTP ให้ถูกต้อง',
            showConfirmButton: 1,
            timer: 4000,
          });
        });
    }
    else {
      ApiSso.put("/api/auth/update-fotgot-password", {
        username: state.username,
        ref: state.ref,
        code: state.otp_code,
        password: state.otp_password,
        confirm_password: state.otp_password,
      })
        .then((data) => {
          if (data.data.message == "Success") {
            Swal.fire({
              icon: "success",
              title: "ยืนยันตัวตน OTP สำเร็จ",
              showConfirmButton: 1,
              timer: 4000,
            });
            router.push("/");
            localStorage.removeItem("user_regis");
            localStorage.removeItem("otp_forgot");
          } else {
            Swal.fire({
              icon: "error",
              title: "ยืนยันตัวตน OTP ไม่สำเร็จ",
              showConfirmButton: 1,
              timer: 3000,
            });
          }
        })
        .catch((error) => {
          console.log("Fail2");
          Swal.fire({
            icon: "warning",
            title: error.response.data.title,
            showConfirmButton: 1,
            timer: 4000,
          });
        });
    }
  } else {
    for (let index = 0; index < 6; index++) {
      let str = "#digit" + index;
      const element = document.querySelector(str);
      element.classList.remove("border-[#837D7B]");
      element.classList.add("border-[#D22626]");
    }
  }
};
</script>
<template>
  <div
    class="grid grid-cols-1 justify-items-center items-center  h-screen"
  >
    <div
    class="flex flex-row justify-center w-full h-full p-4 md:p-0  md:w-[640px] md:h-[613px] rounded-2xl md:rounded-2xl"
    >
      <!-- Side Background -->
      <img src="../assets/img/img_landingpage/bg_login.png" class="bg-center bg-no-repeat object-cover hidden md:block h-full md:h-[500px] md:w-[320px] rounded-l-2xl"
        alt="">
      <!-- End Side Background -->
      <div
      class="w-full lg:w-1/2 h-[500px] md:h-[500px] bg-white rounded-t-2xl  rounded-b-2xl md:rounded-b-none md:rounded-br-2xl"
      >
        <div
          class="flex items-center justify-center text-center bg-white w-full rounded-t-2xl md:rounded-t-none md:rounded-tr-2xl h-[96px]"
        >
          <img
            src="../assets/img/img_landingpage/logo_login.svg"
            class="w-[64px] h-[64px]"
            alt="logo"
          />
        </div>
        <div class="p-4">
          <div class="text-[#302520]">
            <h5 class="text-[22px] font-medium opacity-60">ยืนยันตัวตน</h5>
          </div>
          <div class="my-4 text-[#302520]">
            <p class="mb-4 text-base font-medium">
              กรอกรหัสยืนยันตัวตน 6 หลักที่ส่งไปยังเบอร์ {{ state.username }}
            </p>
            <span class="text-sm font-medium">Ref : {{ state.ref }}</span
            ><br />
            <p
              v-if="time_counter != 'หมดเวลา'"
              class="text-sm font-medium my-4"
            >
              ภายใน {{ time_counter }}
            </p>
            <p
              v-if="time_counter == 'หมดเวลา'"
              class="text-red-500 text-sm font-medium my-4"
            >
              OTP {{ time_counter }}
            </p>
          </div>
          <!--Start Form -->
          <div>
            <form @submit.prevent="submit">
              <div>
                <!-- <OtpVertify :digit-count="6" @update:otp="otpValue = $event" ></OtpVertify> -->
                <div class="flex flex-row items-center justify-center px-2 sm:px-10 md:px-4">
                  <v-otp-input
                    ref="otpInput"
                    input-classes="otp-input"
                    separator=""
                    :num-inputs="6"
                    :should-auto-focus="true"
                    :is-input-num="true"
                    :placeholder="['*', '*', '*', '*', '*', '*']"
                    @on-change="handleOnChange"
                    @on-complete="handleOnComplete"
                  />
                </div>
                <div class="mt-1 mb-4">
                  <span
                    v-if="state.otp_code == ''"
                    class="text-sm text-red-500 float-right pr-4"
                    >กรุณาระบุรหัส OTP</span
                  >
                  <!-- <span class="text-sm text-red-500 float-right">รหัสยืนยันตัวตนไม่ถูกต้อง</span> -->
                </div>
              </div>
              <div class="flex flex-row items-center w-full justify-end mt-8">
                <span class="mr-2 text-sm font-mediem text-[#302520]"
                  >หากไม่ได้รับข้อความ
                </span>
                <div>
                  <img
                    src="@/assets/img/icons/refresh.svg"
                    alt=""
                    class="inline lg:mt-0 mr-1"
                    style="width: 20px; height: 20px"
                  />
                  <a @click="resend" href="#" class="text-sm text-[#01893D]"
                    >ส่งอีกครั้ง</a
                  >
                </div>
              </div>
              <div class="mt-6 text-center">
                <button
                  type="submit"
                  class="bg-[#01893D] hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[36px] w-full"
                >
                  ยืนยัน
                </button>
              </div>
            </form>
          </div>
          <!--End Form -->
        </div>
      </div>
    </div>
  </div>
</template>

<style >
@import "@/assets/styles/custom-icons.css";

.otp-input:focus {
  border: 1px solid #01893D;
  --tw-ring-color: #01893D;
}

.otp-input {
  width: 35px;
  height: 45px;
  padding: 5px;
  margin: 0 4px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>

