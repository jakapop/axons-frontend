<script setup>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Auth from "@/layouts/Auth.vue";
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { useMainStore } from "@/stores/main";
import useVuelidate from '@vuelidate/core';
import { required, email, sameAs, minLength, helpers } from '@vuelidate/validators';
import farmimg from "@/assets/img/farm/farm_login.png";

const mainStore = useMainStore();
const router = useRouter();

const vertify = localStorage.getItem('vertify');
const form = reactive({
  username: vertify
});
const phone_number = /^(\d{3})(\d{3})(\d{4})$/;
const email_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const submit = () => {

  let result_phone = phone_number.test(form.username);
  let result_email = email_format.test(form.username);

  if (result_phone == true && result_email == false) {  //ยืนยันตัวตนผ่านเบอร์โทร
    ApiSso.post("/api/auth/request-verify", {
      type: "phone",
      username: form.username,
    }).then((res) => {

      if (res.data.message == "Success") {
        localStorage.setItem("otp_ref", res.data.ref);
        localStorage.setItem("type_otp", "resend_vertify");
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
  } else {  //ยืนยันตัวตนผ่าน email

    ApiSso.post("/api/auth/request-verify", {
      type: "email",
      username: form.username,
    }).then((data) => {
      console.log(data.data);
      if (data.data.message == "Success") {
        Swal.fire({
          icon: "success",
          title: "กรุณาตรวจสอบ อีเมลของคุณ",
          // html: "กรุณาตรวจสอบ อีเมลของคุณ",
          showConfirmButton: 1,
          timer: 5000,
        });
        router.push("/vertify-email");
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
};

</script>

<template>
  <div class="grid grid-cols-1 justify-items-center my-[16px] mx-[16px] md:my-[32px] md:mx-[64px] lg:mx-[192px]">
    <div class="flex flex-row justify-center w-full  md:w-[640px] md:h-auto rounded-2xl md:rounded-2xl">
      <img :src="farmimg"
        class="bg-center bg-no-repeat object-cover hidden md:block md:h-[410px] md:w-[320px] rounded-l-2xl"
        alt="side image">
      <div class="w-full lg:w-1/2 h-auto bg-white rounded-b-2xl md:rounded-b-none md:rounded-br-2xl">
        <div
          class="flex items-center justify-center text-center bg-[#01893D] w-full rounded-t-2xl md:rounded-t-none md:rounded-tr-2xl h-[96px]">
          <img src="@/assets/img/icons/logo/logo.svg" class="w-[64px] h-[64px]" alt="logo">
        </div>
        <div class=" p-4">
          <h5 class="text-[22px] font-medium opacity-60 mb-4">คุณยังไม่ได้ยืนยันตัวตน</h5>
          <p class="font-medium text-base mb-10">คุณจำเป็นต้องยืนยันตัวตนด้วยเบอร์โทรศัพท์ หรือ อีเมลก่อนเริ่มใช้งาน</p>
          <h6 class="font-medium text-base mb-6">รับรหัสยืนยันตัวตนด้วย</h6>
          <div>
            <form @submit.prevent="submit">
              <div class="flex items-center mb-4">
                <input checked id="phone-radio" type="radio" :value="form.username" v-model="form.username"
                  name="radio-vertify"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="phone-radio" class="ml-2 text-base font-medium text-gray-900 dark:text-gray-300">{{ vertify
                  }}</label>
              </div>

              <button type="submit"
                class="bg-[#01893D] hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[36px] w-full mt-4">
                ยืนยัน
              </button>
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

