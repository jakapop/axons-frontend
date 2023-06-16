
<script setup>
import { computed, onMounted } from "@vue/runtime-core";
import NavbarMain from "../layouts/NavbarMain.vue";
import { useMainStore } from "@/stores/main";
import {ref,reactive} from 'vue';
import userdefault from "@/assets/img/icons/user.png";

const mainStore = useMainStore();
const userName = mainStore.userName;  //เบอร์โทร
const userFirstName = mainStore.userFirstName;  //ชื่อ
const userLastName = mainStore.userLastName;  //ชื่อ
const CustomerEmail = mainStore.userEmail; // email
const userProvinceId = mainStore.userProvinceId ; // จังหวัด
const userImage = computed(()=>mainStore.userImage);  //รูปโปรไฟล์
const CustomerId = mainStore.CustomerId; // id

let provice_name = ref('');
let user_image = ref(userdefault);

onMounted(()=>{

  console.log(userImage.value);

  if(userImage.value){
    user_image.value = "https://farmworld.farm/api-main/image/"+userImage.value+"?imageableType=customer";

  }

  if(userProvinceId){
    ApiSso.get("/api/geo/provinces/"+userProvinceId)
    .then((response) => {
      let provice = response.data.data.name.th;
      provice_name.value =  provice.substring(provice.indexOf('.') + 1).trim();

    }).catch((e)=>{
      provice_name.value = "ไม่มีข้อมูล"
    })
  }else{
    provice_name.value = "ไม่ระบุ"
  }
});
</script>

<template>
  <NavbarMain>
    <div class="m-4 mt-16 md:mt-8">
      <div class="my-4">
        <h1 class="text-[22px] font-bold mb-2">ข้อมูลส่วนตัว</h1>
      </div>
      <div class="grid grid-cols-1 justify-items-center bg-white rounded shadow p-4">
        <div class="flex flex-col items-center mb-4 md:mb-10">
            <img :src="user_image" alt="" class="my-4 w-[150px] h-[150px] rounded-full"  >
            <div class="text-center">
              <h5 class="font-mediem text-base md:text-2xl">{{userFirstName}} {{userLastName}}</h5>
            </div>
        </div>
        <div class="flex flex-col justify-self-start md:justify-self-center">
          <div class="flex flex-row items-center mb-4 md:mb-6">
            <img src="@/assets/img/OtherPage/location_on.png" alt="" class="mr-2 w-[20px]">
            <span class="font-mediem text-base md:text-x whitespace-nowrap">จังหวัด <span class="text-[#01893D]">{{provice_name}}</span></span>
          </div>
          <div class="flex flex-row items-center mb-4  md:mb-6">
            <img src="@/assets/img/OtherPage/mail.png" alt="" class="mr-2 w-[20px]">
            <span class="font-mediem text-base md:text-xl whitespace-nowrap">อีเมล <span class="text-[#01893D]">{{CustomerEmail}}</span></span>
          </div>
          <div class="flex flex-row items-center mb-4  md:mb-6">
            <img src="@/assets/img/OtherPage/call.png" alt="" class="mr-2 w-[20px]">
            <span class="font-mediem text-base md:text-xl whitespace-nowrap">เบอร์โทรศัพท์ <span class="text-[#01893D]">{{userName}}</span></span>
          </div>
        </div>
        <router-link to="/edit-personal" class="flex items-center justify-center my-4 bg-[#01893D] py-0.5 px-2 md:py-3 md:px-10 w-[256px] h-[36px] md:w-[300px] md:h-[50px] rounded-lg">
            <img src="@/assets/img/OtherPage/edit.png" class="w-[18px] md:w-[20px] mr-2" alt="">
            <span class="text-white text-sm font-bold md:text-lg">แก้ไขข้อมูลส่วนตัว</span>
        </router-link>
      </div>
    </div>
  </NavbarMain>
</template>


<style>

</style>
