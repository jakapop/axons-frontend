<script setup>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Auth from "@/layouts/Auth.vue";
import { ref, reactive,computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

import useVuelidate from '@vuelidate/core';
import { required, email, sameAs, minLength, helpers } from '@vuelidate/validators';


const validate_email_phone = helpers.regex(/^(?:0\d{9})|[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
const form = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  type_send: "",
});

const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage('กรุณาระบุชื่อผู้ใช้', required),
      email: helpers.withMessage(() => 'อีเมลหรือเบอร์โทรศัพท์ไม่ถูกต้อง', validate_email_phone),
    },
    password: {
      required: helpers.withMessage('กรุณาระบุรหัสผ่าน', required),
      minLength: helpers.withMessage(() => 'รหัสผ่านต้องมีความยาว 8 ตัวอักษรขึ้นไป',
        minLength(8)
      )
    },
    confirmPassword: {
      required: helpers.withMessage('กรุณาระบุยืนยันรหัสผ่าน', required),
      sameAs: helpers.withMessage(() => 'รหัสผ่านไม่ตรงกัน', sameAs(form.password))
    },
  }
});

const v$ = useVuelidate(rules, form)

const submit = async () => {
  if(form.type_send == "email"){
    const result = await v$.value.username.$validate();
    if (result) {
      ApiSso.post("/api/auth/forgot-password", {
        type: "email",
        username: form.username,
      })
        .then((data) => {
          if (data.data.message == "Success") {
            Swal.fire({
              icon: "success",
              title: "กรุณาตรวจสอบ อีเมลของคุณ",
              showConfirmButton: 1,
              timer: 5000,
            });
            router.push("/");
          }
        })
        .catch((error) => {
          console.log("Fail");
          Swal.fire({
            icon: "warning",
            title: error.response.data.title,
            showConfirmButton: 1,
            timer: 4000,
          });
        });

    }
    else{
      const username_element = document.querySelector('#username') ;
      const password_element = document.querySelector('#password') ;
      const confirmPassword_element = document.querySelector('#confirmPassword') ;
      username_element.classList.remove("border-[#837D7B]");
      username_element.classList.add("border-[#D22626]");
      password_element.classList.remove("border-[#837D7B]");
      password_element.classList.add("border-[#D22626]");
      confirmPassword_element.classList.remove("border-[#837D7B]");
      confirmPassword_element.classList.add("border-[#D22626]");

      Swal.fire({
      icon: "warning",
      title: "กรุณาระบุข้อมูลในแบบฟอร์มให้ถูกต้อง",
      showConfirmButton: false,
      timer: 1500
    });
    }
  }
  else {
    const result = await v$.value.$validate();
    if (result) {
      const user_regis = {
        username: form.username
      }
      localStorage.setItem("user_regis", JSON.stringify(user_regis));
      ApiSso.post("/api/auth/forgot-password", {
        type: "phone",
        username: form.username,
      })
        .then((data) => {
          console.log(data.data.message)
          if (data.data.message == "Success") {
            localStorage.setItem("otp_ref", data.data.ref)
            localStorage.setItem("type_otp", "forgot")
            localStorage.setItem("otp_password", form.password)
            Swal.fire({
              icon: "success",
              title: "ส่ง OTP สำเร็จ",
              html: "กรุณากรอกรหัส OTP จาก SMS ของคุณ",
              showConfirmButton: 1,
              timer: 4000,
            });
            router.push("/otp");
          } else {
            Swal.fire({
              icon: "warning",
              title: "ส่ง OTP ไม่สำเร็จ",
              showConfirmButton: 1,
              timer: 3000,
            });
          }
        })
        .catch((error) => {
          console.log("Fail");
          Swal.fire({
            icon: "warning",
            title: error.response.data.title,
            showConfirmButton: 1,
            timer: 4000,
          });
        });
    }
    else{
      const username_element = document.querySelector('#username') ;
      const password_element = document.querySelector('#password') ;
      const confirmPassword_element = document.querySelector('#confirmPassword') ;
      username_element.classList.remove("border-[#837D7B]");
      username_element.classList.add("border-[#D22626]");
      password_element.classList.remove("border-[#837D7B]");
      password_element.classList.add("border-[#D22626]");
      confirmPassword_element.classList.remove("border-[#837D7B]");
      confirmPassword_element.classList.add("border-[#D22626]");

      Swal.fire({
      icon: "warning",
      title: "กรุณาระบุข้อมูลในแบบฟอร์มให้ครบ",
      showConfirmButton: false,
      timer: 1500
    });
    }
  }

};

let selectedOpen = ref(false);
let selectedLang = ref("TH");

const router = useRouter();

const submit_ = () => {
  if (states.type_send == "email") {
    if (states.username != "") {
      ApiSso.post("/api/auth/forgot-password", {
        type: "email",
        username: states.username,
      })
        .then((data) => {
          if (data.data.message == "Success") {
            Swal.fire({
              icon: "success",
              title: "กรุณาตรวจสอบ อีเมลของคุณ",
              showConfirmButton: 1,
              timer: 5000,
            });
            router.push("/");
          }
        })
        .catch((error) => {
          console.log("Fail");
          Swal.fire({
            icon: "warning",
            title: error.response.data.title,
            showConfirmButton: 1,
            timer: 4000,
          });
        });
    }
  } else {
    console.log("send otp");
    if (states.password == "") {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกรหัสผ่าน",
      });
    }

    if (states.cpassword == "") {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกยืนยันรหัสผ่าน",
      });
    }

    if (states.password != states.cpassword) {
      Swal.fire({
        icon: "warning",
        title: "รหัสผ่าน และ ยืนยันรหัสผ่านไม่ตรงกัน",
      });
    }

    if (
      states.username != "" &&
      states.password != "" &&
      states.cpassword != "" &&
      states.password == states.cpassword
    ) {

    }
  }
};
let show_visible = ref(false);
const showPassword = ()=>{
  var x = document.getElementById("password");
  var y = document.getElementById("confirmPassword");
  if (x.type === "password" || y.type === "password") {
    x.type = "text";
    y.type = "text"
    show_visible.value = true ;
  } else {
    x.type = "password";
    y.type = "password"
    show_visible.value = false ;
  }
};


const change_username = () => {

  if (validateEmail(form.username)) {
    form.type_send = "email";
    console.log(rules.value);
  } else {
    form.type_send = "phone";
  }
};

const validateEmail = (email) => {
  return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};


</script>
<template>
  <div class="grid grid-cols-1 justify-items-center items-center  h-screen">
    <div class="flex flex-row justify-center w-full md:w-[640px] h-full p-4 md:p-0 md:h-[631px] xl:w-[800px] rounded-2xl md:rounded-2xl  md:mt-[32px] md:mb-[75px]">
      <img src="../assets/img/img_landingpage/bg_login.png" class="bg-center bg-no-repeat object-cover hidden md:block md:h-[500px] w-[320px] rounded-l-2xl"
        alt="" />
      <div class="w-full lg:w-1/2 bg-white h-[473px] md:h-[500px] rounded-t-2xl rounded-b-2xl md:rounded-b-none md:rounded-br-2xl">
        <div
          class="flex items-center justify-center text-center bg-white w-full rounded-t-2xl md:rounded-t-none md:rounded-tr-2xl h-[96px]">
          <img src="@/assets/img/img_landingpage/logo_login.svg" class="w-[64px] h-[64px]" alt="logo">
        </div>
        <div class="p-4">
        <form @submit.prevent="submit">
              <div class="mb-6" >
                <label class="block uppercase tracking-wide text-[#302520] text-base font-medium mb-0.5 relative" >
                  อีเมล หรือเบอร์โทรศัพท์
                </label>
                <input
                  name="username"
                  id="username"
                  @keyup="change_username"
                  v-model="form.username"
                  type="text"
                  :class="form.username!=''?'border-[#01893D] border-1':'border-[#837D7B] '"
                  class="block w-full px-4 py-2 mt-2 text-[#302520] bg-white border rounded-[10px] h-[36px] focus:border-[#01893D] focus:ring-[#01893D]"
                />
                <span v-if="v$.username.$error" class="text-red-500 text-sm float-right">{{ v$.username.$errors[0].$message }}</span>
              </div>
              <div id="showpass" v-if="form.type_send != 'email'" >
                <div class="mb-ภ">
                  <div class="relative">
                    <label
                    class="block uppercase tracking-wide text-[#302520] text-base md:text-base font-mediem mb-2 relative">ตั้งรหัสผ่านใหม่</label>
                    <input name="password"
                    id="password"
                    v-model="form.password"
                    type="password"
                    :class="form.password!=''?'border-[#01893D] border-1':'border-[#837D7B] '"
                    class="block bg-white rounded-[8px] h-[36px] focus:border-[#01893D] focus:ring-[#01893D] text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border">
                  <button type="button" @click="showPassword" class="text-[#827C7B] absolute right-2.5 top-10 bottom-2.5">
                    <i v-if="show_visible == false" class="fa-solid fa-eye"></i>
                    <i v-else-if="show_visible == true" class="fa-solid fa-eye-slash"></i>
                  </button>
                  </div>
                  <small :class="v$.password.$error?'hidden':''" class="text-xs opacity-60">รหัสผ่านต้องมีความยาว 8 ตัวขึ้นไป</small>
                  <small v-if="v$.password.$error" class="text-red-500 text-sm float-right">{{ v$.password.$errors[0].$message }}</small>
              </div>
              <div class="relative mt-4 mb-6">
                <label
                    class="block uppercase tracking-wide text-[#302520] text-base md:text-base font-mediem mb-2 relative">ยืนยันรหัสผ่าน</label>
                  <div>
                    <input  v-model="form.confirmPassword" type="password"
                    name="confirmPassword" id="confirmPassword" :class="
                    form.confirmPassword != ''
                      ? 'border-[#01893D] border-1'
                      : 'border-[#837D7B] '
                  " class="block bg-white rounded-[8px] h-[36px] focus:border-[#01893D] focus:ring-[#01893D] text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border" >
                  <button type="button" @click="showPassword" class="text-[#827C7B] absolute right-2.5 top-10 bottom-2.5">
                    <i v-if="show_visible == false" class="fa-solid fa-eye"></i>
                    <i v-else-if="show_visible == true" class="fa-solid fa-eye-slash"></i>
                  </button>
                  </div>
                  <small v-if="v$.confirmPassword.$error" class="text-red-500 text-sm float-right">{{ v$.confirmPassword.$errors[0].$message }}</small>
              </div>
                <!-- <div class="mb-4"  >
                  <label class="block uppercase tracking-wide text-[#302520] text-base font-medium mb-0.5 relative">
                    ตั้งรหัสผ่านใหม่
                  </label>
                  <input
                    name="password"
                    id="password"
                    v-model="form.password"
                    type="password"
                    :class="form.password!=''?'border-[#01893D] border-1':'border-[#837D7B] '"
                    class="block w-full px-4 py-2 mt-2 text-[#302520] bg-white border rounded-[10px] h-[36px] focus:border-[#01893D] focus:ring-[#01893D]"
                  />
                  <small :class="v$.password.$error?'hidden':''" class="text-xs opacity-60">รหัสผ่านต้องมีความยาว 8 ตัวขึ้นไป</small>
                  <span v-if="v$.password.$error" class="text-red-500 text-sm float-right">{{ v$.password.$errors[0].$message }}</span>
                </div> -->
                <!-- <div class="mb-4">
                  <label class="block uppercase tracking-wide text-[#302520] text-base font-medium mb-0.5 relative">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    name="confirmPassword"
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    type="password"
                    :class="form.confirmPassword!=''?'border-[#01893D] border-1':'border-[#837D7B] '"
                    class="block w-full px-4 py-2 mt-2 text-[#302520] bg-white border rounded-[10px] h-[36px] focus:border-[#01893D] focus:ring-[#01893D]"
                  />
                    <span v-if="v$.confirmPassword.$error" class="text-red-500 text-sm float-right">{{ v$.confirmPassword.$errors[0].$message }}</span>
                </div> -->

              </div>
              <div class="mt-6 text-center">
                <button type="submit" class="bg-[#01893D] hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[36px] w-[256px]" >
                  ยืนยัน
                </button>
              </div>
            </form>
      </div>
      </div>
    </div>
  </div>
</template>

