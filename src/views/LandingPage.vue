<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';

import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';

import "swiper/css/effect-coverflow";

// import required modules
import { EffectCoverflow, Pagination } from "swiper";

const modules = [EffectCoverflow];
// const swiperOptions = {px
//   centeredSlides: true,
//   autoplay: {
//     delay: 5000,
//   },
// }


const route = useRouter();

//--------- Axons : แก้ไขรูปสไลด์ ที่เป็นโทรศัพท์ -------------
const image_list = ref([
  '/Device_img/1.svg',
  '/Device_img/2.svg',
  '/Device_img/3.svg',
  '/Device_img/4.svg',
  '/Device_img/5.svg',
])
//-----------------------------

const content_list = ref([
  {
    id: 1,
    title: 'จัดการสวนและฟาร์ม',
    content: `ตัวช่วยจัดการสวนหรือฟาร์มสำหรับเกษตรกร ผ่านระบบควบคุมเกษตรอัจฉริยะ เพื่อให้สามารถควบคุมดูแลสวน หรือฟาร์มได้อย่างแม่นยำ`,
    icon: '/icons/1.svg'
  },
  {
    id: 2,
    title: 'พยากรณ์สภาพอากาศ',
    content: `รายงานสภาพภูมิอากาศในปัจจุบัน และพยากรณ์
สภาพอากาศในอนาคต เพื่อวางแผนการทำงาน
ได้อย่างครอบคลุมยิ่งขึ้น`,
    icon: '/icons/2.svg'
  },
  {
    id: 3,
    title: 'ตรวจสอบลักษณะภูมิศาสตร์',
    content: `ข้อมูลเชิงลึกด้านภูมิศาสตร์ แบบเฉพาะเจาะจงใน
แต่ละพื้นที่ โดยแสดงข้อมูลสมบัติของดิน เช่น ค่า pH การระบายน้ำของดินบริเวณใกล้เคียง เป็นต้น`,
    icon: '/icons/3.svg'
  },
  {
    id: 4,
    title: 'วางแผนกิจกรรมภายในฟาร์ม',
    content: `สร้างและกำหนดกิจกรรมต่างๆ ภายในสวน หรือฟาร์ม เพื่อให้สามารถบริหารจัดการได้อย่างมี
ประสิทธิภาพรวมถึงสามารถควบคุมปริมาณงาน
ในแต่ละวันได้อย่างเหมาะสม`,
    icon: '/icons/4.svg'
  },
  {
    id: 5,
    title: 'ค้นหาแหล่งซื้อขาย',
    content: `ค้นหาแหล่งซื้อขายผลผลิตทางการเกษตร ที่อยู่
ในบริเวณใกล้เคียงกับที่ตั้งของสวน หรือฟาร์ม พร้อมระบบนำทางไปยังแหล่งซื้อขายผลผลิตทางการเกษตรนั้นๆ`,
    icon: '/icons/5.svg'
  },
  {
    id: 6,
    title: 'หาพืชพันธุ์ที่เหมาะสมกับพื้นที่',
    content: `รวบรวมข้อมูลจากสภาพภูมิอากาศ สภาพ ภูมิศาสตร์ และเซนเซอร์ เพื่อหาพืชพันธุ์ที่เหมาะ
สมกับพื้นที่เพาะปลูกนั้นๆ และยังสามารถรับ
ข้อมูลของพืชแต่ละชนิดในรูปแบบไฟล์ (.pdf) ได้`,
    icon: '/icons/6.svg'
  },
]);


const routeLink = (num_type) => {
  if (num_type == 1) {
    route.push('/register');
  } else if (num_type == 2) {
    route.push('/login');
  }
};

let showtooltip = ref(false);

const copyLink = async(link)  =>{

      try {
        await navigator.clipboard.writeText(link);
        showtooltip.value = true ;
        setTimeout(() => { showtooltip.value  = false }, 2000);
      } catch (err) {
        console.error('Failed to copy link: ', err);
      }

};


</script>
<template>
  

  <div class="relative">
    <div
      class="bg-image lg:h-[650px] flex flex-row flex-wrap lg:flex-nowrap  md:items-center px-[16px] py-[36px] md:py-[32px] lg:py-[96px] lg:px-[40px]">
      <div class="relative w-full mb-[32px] md:mb-[64px] lg:mb-0">
        <div class="mb-2 md:mb-0">
          <!-- Axons : แก้ไขรูปไอคอน Logo-->
          <img src="../assets/img/icons/logo/logo_axons.svg" alt="logo"
            class="w-[56px] h-[56px] sm:w-[54px] sm:h-[54px] md:w-[112px] md:h-[112px] lg:w-[160px] lg:h-[160px]"
            width="54" height="54">
        </div>
        <div class="mb-2 md:mb-4">
          <img src="../assets/img/img_landingpage/text_logo.svg" alt="title" class="w-[160px] md:w-[160px]">
        </div>
        <p
          class="text-[40px] font-medium w-[288px] md:w-full lg:w-[319px] text-[#01893D] whitespace-normal sm:whitespace-nowrap md:whitespace-normal">
          ก้าวเป็นผู้นำ <br><span class="text-[#154293] text-[32px]">ด้านเกษตรเทคโนโลยี</span> </p>
      </div>
      <div class="relative w-full self-end bottom-0 md:bottom-[80px]">
        <div class="flex flex-col  justify-start md::justify-center items-center">
          <div class="flex flex-row w-full justify-center flex-wrap sm:flex-nowrap items-center gap-2 mt-[32px]">
            <button type="button" @click="routeLink(1)"
              class="text-white bg-[#01893D] hover:bg-green-700 hover:shadow-lg px-2 w-full sm:w-[228px] h-[48px] whitespace-nowrap text-[22px] font-bold rounded-lg">สมัครสมาชิก</button>
            <button type="button" @click="routeLink(2)"
              class="text-[#01893D] bg-white  hover:shadow-lg px-2 w-full sm:w-[228px] h-[48px] whitespace-nowrap text-[22px] font-bold rounded-lg">เข้าสู่ระบบ</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4 md:mx-[40px] my-9">
    <div class="bg-white p-4 rounded-lg" v-for="(item, index) in content_list" :key=index>
      <div class="flex flex-col justify-center items-center">
        <div class="mb-2">
          <img :src="item.icon" alt="icon">
        </div>
        <div class="mb-4">
          <h2 class="font-bold text-[22px] text-[#01893D] whitespace-nowrap">{{ item.title }}</h2>
        </div>
        <p class="w-full md:w-[277px] lg:w-9/12 text-center font-medium">{{ item.content }}</p>
      </div>
    </div>
  </div>
  <div class="relative">
    <div class="bg-regis h-[406px] md:h-[500px]">
      <div class="relative flex flex-col items-center justify-center w-full h-full">
        <div class="mb-[32px]">
          <img src="../assets/img/img_landingpage/person_add_axons.svg" alt="" class="w-[128px] h-[128px]">
        </div>
        <div class="mb-[32px]">
          <h1 class="font-medium text-[32px] text-center md:text-start w-[288px] md:w-full text-white">เริ่มต้นใช้งานได้เลยตอนนี้</h1>
        </div>
        <router-link to="/register"
          class="flex justify-center text-center items-center bg-white hover:bg-gray-100 shadow-cus text-[#01893D] text-[22px] font-bold w-[256px] h-[48px] rounded-lg">สมัครสมาชิก</router-link>
      </div>
    </div>
  </div>
  <div class="relative">
    <div class="bg-device h-[740px]">
      <div class="flex flex-col items-center justify-center h-full">
        <div class="mb-9 w-full">
          <swiper :effect="'coverflow'" :grabCursor="true" :centeredSlides="true" :slidesPerView="'auto'"
            :initialSlide='2' :coverflowEffect="{
              rotate: 0,
              stretch: 150,
              depth: 100,
              modifier: 1,
              initialSlide: 2,
              slideShadows: false,
            }" :pagination="true" :modules="modules"  class="mySwiper ">
            <swiper-slide v-for="(item, index) in image_list" :key="index">
              <img :src="item" />
            </swiper-slide>

          </swiper>

        </div>
        
      </div>
    </div>
  </div>
  <footer class="bg-[#01893D] w-full py-9 px-[40px]">
    <div class="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center">
      <div class="w-full">
        <div class="flex flex-col w-full">
          <!-- Axons : แก้ไขรูปไอคอน Logo-->
          <div>
            <img src="../assets/img/img_landingpage/logo_axons_white.svg" alt="" class="w-[119px] h-[93px] md:w-[128px] md:h-[128px]">
          </div>
          <div class="mt-2 sm:mt-0">
            <img src="../assets/img/img_landingpage/text_axons_white.svg" alt="" class="w-[120px] ">
          </div>
        </div>
      </div>
      <div class="w-full" >
        <div class="flex flex-col justify-start sm:justify-end mt-4 sm:mt-0">
          <a href="https://www.axonstech.com/" target="_blank" class="flex flex-row items-center justify-start sm:justify-end text-white text-base font-medium mb-4 tracking-wide whitespace-nowrap"><img
            src="../assets/img/img_landingpage/language.svg" alt="facebook" class="mr-2"> www.axonstech.com</a>
          <a href="https://www.facebook.com/AXONSofficial" target="_blank" class="flex flex-row items-center justify-start sm:justify-end text-white text-base font-medium mb-4 tracking-wide whitespace-nowrap"><img
              src="../assets/img/img_landingpage/Facebook_logo.svg" alt="youtube" class="mr-2"> AXONS</a>
          <a href="https://www.youtube.com/@axonsofficial9382" target="_blank" class="flex flex-row items-center justify-start sm:justify-end text-white text-base font-medium mb-4 tracking-wide whitespace-nowrap"><img
              src="../assets/img/img_landingpage/YouTube_logo.svg" alt="line" class="mr-2">AXONS Officia</a>
        </div>
      </div>
    </div>
  </footer>
</template>



<style scoped>
.shadow-cus {
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.18);
}

.font-fam {
  font-family: 'IBM Plex Sans Thai';
}

@media only screen and (max-width:500px) {


  .w-text {
    width: 100% !important;
  }

}
@media only screen and (max-width:768px) {
  .bg-image {
    height: 100% !important;
  }

  /* .w-text {
    width: 100% !important;
  } */

}

@media only screen and (max-width:900px) {
  .w-text {
    width: 390px;
  }

}



@media only screen and (max-width:1024px) {
  .bg-image {
    height: 100%;
  }

}

.bg-image {
  background-image: url('../assets/img/img_landingpage/bg_landing_axons.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;

}

.bg-image::before {
  content: "";
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: rgba(255, 255, 255, 0.6);
}

.bg-regis {
  /* background-image: url('../assets/img/img_landingpage/land2.png');
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover; */
  background-color: #154293;
  width: 100%;

}

/* .bg-regis::before {
  content: "";
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: rgba(255, 255, 255, 0.7);
} */


.bg-device {
  background-image: url('../assets/img/img_landingpage/land3.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;

}

.bg-device::before {
  content: "";
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: rgba(255, 255, 255, 0.1);
}




.swiper {
  width: 100%;
  padding-top: 50px;
  padding-bottom: 0px;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 284px;
}

.swiper-slide img {
  display: block;
  width: 100%;
}

@media only screen and (max-width: 768px) {

  .swiper-slide {
    width: 200px;
  }


}

@media only screen and (max-width: 375px) {

  .swiper-slide {
    width: 180px;
  }


}
</style>
