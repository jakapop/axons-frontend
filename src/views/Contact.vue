
<script setup>
import NavbarMain from "@/layouts/NavbarMain.vue";
import { ref, reactive } from 'vue'
let showtooltip = ref(false);
const copyLink = async (link) => {
  try {
    await navigator.clipboard.writeText(link);
    showtooltip.value = true;
    setTimeout(() => { showtooltip.value = false }, 2000);
  } catch (err) {
    console.error('Failed to copy link: ', err);
  }
};
</script>

<template>
  <NavbarMain>
    <div class="m-4">
      <div>
        <h1 class="text-[22px] font-bold mb-2 pt-5 md:pt-2">ติดต่อเรา</h1>
      </div>
      <div class="flex flex-row w-full justify-items-center gap-[8px]">
        <div class=" bg-white rounded-[16px] shadow p-4 w-full">
          <div class="flex flex-col justify-self-start md:justify-self-center py-5">
            <div class="flex flex-row items-center mb-4 md:mb-6">
             
              <a href="https://www.axonstech.com/" target="_blank" class="flex flex-row items-center">
              <img src="@/assets/img/OtherPage/language.png" alt="" class="mr-2 w-[24px] h-[24px]">
              <span class="font-mediem text-base  text-[#01893D]">www.axonstech.com</span>
            </a>
            </div>
            <div class="flex flex-row items-center mb-4 md:mb-6">
              
              <a href="https://www.facebook.com/AXONSofficial" target="_blank" class="flex flex-row items-center">
                <img src="@/assets/img/OtherPage/Facebooklogo.png" alt="" class="mr-2 w-[24px] h-[24px]">
                <span class="font-mediem text-base  text-[#01893D]">AXONS</span>
              </a>
            </div>
            <div class="flex flex-row items-center mb-4 md:mb-6">
              
              <a href="https://www.youtube.com/@axonsofficial9382" target="_blank" class="flex flex-row items-center">
                <img src="@/assets/img/OtherPage/YouTubelogo.png" alt="" class="mr-2 w-[24px] h-[24px]">
                <span class="font-mediem text-base  text-[#01893D]">AXONS Official</span>
              </a>
            </div>
            
            <div class="flex flex-row items-center mb-4 md:mb-6">
             
              <a href="suebsak.rak@axonstech.com" class="flex flex-row items-center">
              <img src="@/assets/img/OtherPage/mail_green.png" alt="" class="mr-2 w-[24px] h-[24px]">
              <span class="font-mediem text-base  text-[#01893D]">suebsak.rak@axonstech.com</span>
            </a>
            </div>
            <div class="flex flex-row items-center mb-4 md:mb-6">
             
              <a :href="'tel:' + '+6680-024-5801'" class="flex flex-row items-center">
              <img src="@/assets/img/OtherPage/phone_iphone.png" alt="" class="mr-2 w-[24px] h-[24px]">
              <span class="font-mediem text-base  text-[#01893D]">080-024-5801</span>
            </a>
            </div>
            
            
          </div>
        </div>
        
      </div>


    </div>
  </NavbarMain>
</template>
<style></style>
