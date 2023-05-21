

<script setup>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Auth from '@/layouts/Auth.vue'

import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

import farmimg from "@/assets/img/farm/farm_login.png";

const form = reactive({
  otp_number: "",
});
let selectedOpen = ref(false);
let selectedLang = ref("TH");

const states = reactive({
  selectedLangFlag: "thai",
});


const router = useRouter();

const submit = () => {
  if (form.email != "") {
    axios.post(import.meta.env.VITE_API_SSO + "/api/auth/forgot-password", {
      "type": "email",
      "username": form.email,
    })
      .then((data) => {
        console.log(data.data);
        if (data.data.message == "Success") {
          Swal.fire({
            icon: "success",
            title: "กรุณาตรวจสอบ อีเมลของคุณ",
            // html: "กรุณาตรวจสอบ อีเมลของคุณ",
            showConfirmButton: 1,
            timer: 5000,
          });
          router.push("/login");
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
        class="bg-center bg-no-repeat object-cover hidden md:block md:h-[350px] md:w-[320px] rounded-l-2xl"
        alt="side image">
      <div class="w-full lg:w-1/2 h-auto bg-white rounded-b-2xl md:rounded-b-none md:rounded-br-2xl">
        <div
          class="flex items-center justify-center text-center bg-[#01893D] w-full rounded-t-2xl md:rounded-t-none md:rounded-tr-2xl h-[96px]">
          <img src="@/assets/img/icons/logo/logo.svg" class="w-[64px] h-[64px]" alt="logo">
        </div>
        <div class="p-4 bg-white rounded-b-2xl md:rounded-b-none md:rounded-br-2xl">
          <div class="text-[#302520]">
            <h5 class="text-[22px] font-medium opacity-60 mb-5">ยืนยันตัวตน</h5>
            <p class="text-base font-medium">ตรวจสอบข้อความยืนยันตัวตนในอีเมลของท่าน</p>
            <div class="flex flex-row items-center justify-end mt-2 mb-10">
              <span class="text-sm font-mediem text-[#302520] mr-2 ">หากไม่พบอีเมล </span>
              <router-link to="/" class="text-sm font-mediem text-[#01893D]">ติดต่อเรา</router-link>
            </div>
          </div>
          <router-link to="/" type="button" class="bg-[#01893D] hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[36px] w-full text-center">กลับไปหน้า login</router-link>
        </div>
      </div>
    </div>
  </div>


</template>

<style>
@import "@/assets/styles/custom-icons.css";
</style>
