<script setup>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Auth from "@/layouts/Auth.vue";
import { ref, reactive ,computed, onMounted} from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { useMainStore } from "@/stores/main";
import useVuelidate from '@vuelidate/core';
import { required, email, sameAs, minLength, helpers } from '@vuelidate/validators';


const mainStore = useMainStore();
const router = useRouter();


const user_regis = JSON.parse(localStorage.getItem("user_regis") || "[]");

console.log('user_regis==',user_regis);
// const formatPassword = helpers.regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/);

const form = reactive({
  username: user_regis.username,
  email: user_regis.email,
  firstName: user_regis.firstName,
  lastName: user_regis.lastName,
  password:"",
  confirmPassword:"",
  type: "phone",
  province_id: user_regis.province_id,
});

const rules = computed(() => {
  return {
    password: {
      required: helpers.withMessage('กรุณาระบุรหัสผ่าน', required),
      minLength: helpers.withMessage(() => 'รหัสผ่านต้องมีความยาว 8 ตัวอักษรขึ้นไป',
        minLength(8)
      )
    },
    confirmPassword: {
      required: helpers.withMessage('กรุณาระบุยืนยันรหัสผ่าน', required),
      sameAs: helpers.withMessage(() => 'รหัสผ่านไม่ตรงกัน', sameAs(form.password))
    }
  }
});
const v$ = useVuelidate(rules, form)
const submit_ = async () => {
  const result = await v$.value.$validate();
  if (result) {
    axios.post(import.meta.env.VITE_API_SSO + "/api/auth/register", {
        detail: { province_id: form.province_id },
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        username: form.username,
      })
      .then((data) => {
        console.log(data.status);
        if (data.status == 201) {
          if (form.type == "email") {
            Swal.fire({
              icon: "success",
              title: "สมัครสมาชิก สำเร็จ",
              html: "กรุณายืนยันตัวตน อีเมลของคุณ",
              showConfirmButton: 1,
              timer: 5000,
            });
            router.push("/vertify-email");
          } else {
            ApiSso.post("/api/auth/request-verify", {
              type: "phone",
              username: form.username,
            }).then((data_otp) => {
              console.log(data_otp)
              if (data_otp.data.message == "Success") {
                localStorage.setItem("otp_ref", data_otp.data.ref);
                localStorage.setItem("type_otp", "regis");
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
            });
          }
          //localStorage.removeItem("user_regis");
        }
      })
      .catch((error) => {
        console.log(error);
        const username = (error.response.data["invalid-params"].username ??[])[0];

        const email = (error.response.data["invalid-params"].email ?? [])[0];
        let error_messege = "";
        if (typeof username !== "undefined") {
          // error_messege += error.response.data["invalid-params"].username[0] + "<br>";
          error_messege += 'ชื่อผู้ใช้นี้มีอยู่แล้วในระบบ'+ "<br>";
        }
        if (typeof email !== "undefined") {
          // error_messege += error.response.data["invalid-params"].email[0] + "<br>";
          error_messege += 'อีเมลนี้มีอยู่แล้วในระบบ' + "<br>";
        }
        Swal.fire({
          icon: "warning",
          title: error.response.data.title,
          showConfirmButton: 1,
          html: error_messege,
          timer: 4000,
        });
      });
  }
  else {
    const username_element = document.querySelector('#password') ;
    const password_element = document.querySelector('#confirmPassword') ;
    username_element.classList.remove("border-[#837D7B]");
    username_element.classList.add("border-[#D22626]");
    password_element.classList.remove("border-[#837D7B]");
    password_element.classList.add("border-red-500");

    Swal.fire({
      position: "center",
      icon: "warning",
      text:'กรุณากรอกฟอร์มให้ครบ',
      showConfirmButton: true,
    });
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
</script>

<template>
  <div class="grid grid-cols-1 justify-items-center items-center  h-screen">
    <div class="flex flex-row justify-center w-full md:w-[640px] h-full p-4 md:p-0 md:h-[631px] xl:w-[800px] rounded-2xl md:rounded-2xl  md:mt-[32px] md:mb-[75px]">
      <img src="../assets/img/img_landingpage/bg_login.png" class="bg-center bg-no-repeat object-cover hidden md:block md:h-[600px] w-[320px] rounded-l-2xl" alt="side image">
      <div class="w-full lg:w-1/2 bg-white h-[600px] md:h-[600px] rounded-t-2xl rounded-b-2xl md:rounded-b-none md:rounded-br-2xl">
        <div
          class="flex items-center justify-center text-center bg-white w-full rounded-t-2xl md:rounded-t-none md:rounded-tr-2xl h-[96px]">
          <img src="../assets/img/img_landingpage/logo_login.svg" class="w-[64px] h-[64px]" alt="logo">
        </div>
        <div class=" p-4">
          <div class="flex flex-row justify-between">
            <div class="text-[#302520]">
              <h5 class="text-[22px] font-medium opacity-60">สมัครสมาชิก</h5>
            </div>
          </div>
          <div>
            <form @submit.prevent="submit_">
              <div class=" mt-4 mb-6">
                  <div class="relative">
                    <label
                    class="block uppercase tracking-wide text-[#302520] text-base md:text-base font-mediem mb-2 relative">รหัสผ่าน</label>
                    <input name="password"  v-model="form.password" type="password" id="password" :class="
                    form.password != ''
                      ? 'border-[#01893D] border-1'
                      : 'border-[#837D7B] '
                  " class="block bg-white rounded-[8px] h-[36px] focus:border-[#01893D] focus:ring-[#01893D] text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border">
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
              <!-- <div class="mt-4 mb-6">
                <label
                    class="block uppercase tracking-wide text-[#302520] text-base md:text-base font-mediem mb-2 relative">รหัสผ่าน</label>
                  <input  v-model="form.password" type="password" name="password"
                    :class="form.password!=''?'border-[#01893D] border-1':'border-[#837D7B] '"
                    id="password"
                    class="block h-[36px] w-full px-4 py-2 mt-2 text-[#302520] placeholder-gray-400 bg-white border rounded-[10px] focus:border-[#01893D] focus:ring-[#01893D] focus:outline-none" />
                    <small :class="v$.password.$error?'hidden':''" class="text-xs opacity-60">รหัสผ่านต้องมีความยาว 8 ตัวขึ้นไป</small>
                    <small v-if="v$.password.$error" class="text-red-500 text-sm float-right">{{ v$.password.$errors[0].$message }}</small>
              </div> -->
              <!-- <div class="mb-5">
                <label
                    class="block uppercase tracking-wide text-[#302520] text-base md:text-base font-mediem mb-2 relative">ยืนยันรหัสผ่าน</label>
                  <input  v-model="form.confirmPassword" type="password"
                    name="confirmPassword" id="confirmPassword"
                    :class="form.confirmPassword!=''?'border-[#01893D] border-1':'border-[#837D7B]'"
                    class="block h-[36px] w-full px-4 py-2 mt-2 text-[#302520] placeholder-gray-400 bg-white border  rounded-[10px]  focus:border-[#01893D] focus:ring-[#01893D] focus:outline-none " />
                  <small v-if="v$.confirmPassword.$error" class="text-red-500 text-sm float-right">{{ v$.confirmPassword.$errors[0].$message }}</small>
              </div> -->
              <div class="my-4" :class="user_regis.email=='' ?'mt-10 mb-6':'' ">
                  <span
                    class="block uppercase tracking-wide text-[#302520] text-base font-bold relative">
                    รับรหัสยืนยันตัวตนด้วย
                  </span>
                </div>
                <div class="mb-4 flex flex-col" :class="user_regis.email=='' ?'mb-10':'' " >
                  <div class="mb-4">
                    <input type="radio" id="phone-radio"  value="phone"  v-model="form.type" name="check-radio"
                    class="w-4 h-4 text-[#01893D] bg-gray-100 border-gray-300 focus:ring-[#01893D] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label for="phone-radio" class="ml-1.5 text-base font-medium text-[#302520] dark:text-gray-300">{{form.username}}</label>
                  </div>
                  <div :class="user_regis.email=='' ?'hidden':'' " >
                      <input type="radio" id="email-radio" value="email" v-model="form.type" name="check-radio"
                      class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-[#01893D] dark:focus:ring-blue-600 " />
                      <label for="email-radio" class="ml-1.5 text-base font-medium text-[#302520]">{{form.email}}</label>
                  </div>
                </div>
                <div class="mb-4 text-center">
                  <button type="submit"
                    class="bg-[#01893D] hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[36px] w-full ">
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

<style>
@import "@/assets/styles/custom-icons.css";
</style>

