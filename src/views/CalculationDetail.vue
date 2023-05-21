
<script setup>
import { click } from "dom7";
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import NavbarMain from "../layouts/NavbarMain.vue";
import axios from 'axios';
import Swal from "sweetalert2";

import fruit_image from '../assets/img/icons/fruit.png'


let url = new URL(window.location.href);
const id = url.searchParams.get("result");

let file_fruits = ref('');
let type_plants = ref('');
let open_download = ref(false);
const fruit = reactive({
  code: '',
  name: '',// ชื่อ
  species: '', // สายพันธุ์
  breedCategoryId: '',//ประเภท
  scientificName: '',  // ชื่อวิทยาศาสตร์
  commonName: '', // ชื่อสามัญ
  detail: '',// รายละเอียด
  harvestPeriod: '', // อายุการเก็บเกี่ยว
  airTemperatureMax: '',// อุณหภูมิในอากาศ Max
  airTemperatureMin: '',// อุณหภูมิในอากาศ Min
  soilTemperatureMax: '',// อุณหภูมิในดิน Max
  soilTemperatureMin: '',// อุณหภูมิในดิน Min
  soilMoistureMax: '',// ความชื้นในดิน Max
  soilMoistureMin: '',// ความชื้นในดิน Min
  soilPhMax: '',// pH ในดิน Max
  soilPhMin: '',// pH ในดิน Min
  soilEcMax: '',// EC ในดิน Max
  soilEcMin: '',// EC ในดิน Min
  nitrogenMax: '',// N Max
  nitrogenMin: '',// N Min
  phosphorusMax: '',// P Max
  phosphorusMin: '',// P Min
  potassiumMax: '',// K Max
  potassiumMin: '',// K Min
  amountOfWaterMax: '',// ปริมาณน้ำ Max
  amountOfWaterMin: '',// ปริมาณน้ำ Min
  lightIntensityMax: '',// ความเข้มแสง Max
  lightIntensityMin: '',// ความเข้มแสง Min
  document_file: 'string',// เอกสาร
  link: '',// ลิ้ง
  image: '',// รูป
  status: 'active',// สถานะ

});


onMounted(() => {
  ApiMain.get("/breed/" + id + "/detail").then(async (response) => {
    file_fruits.value = response.data.data.document;
    fruit.code = response.data.data.code;
    fruit.breedCategoryId = response.data.data.breedCategoryId;
    fruit.name = response.data.data.name;
    fruit.species = response.data.data.species; // สายพันธุ์
    fruit.scientificName = response.data.data.scientificName;  // ชื่อวิทยาศาสตร์
    fruit.commonName = response.data.data.commonName; // ชื่อสามัญ
    fruit.detail = response.data.data.detail;// รายละเอียด
    fruit.harvestPeriod = response.data.data.harvestPeriod; // อายุการเก็บเกี่ยว
    fruit.airTemperatureMax = response.data.data.airTemperatureMax;// อุณหภูมิในอากาศ Max
    fruit.airTemperatureMin = response.data.data.airTemperatureMin;// อุณหภูมิในอากาศ Min
    fruit.soilTemperatureMax = response.data.data.soilTemperatureMax;// อุณหภูมิในดิน Max
    fruit.soilTemperatureMin = response.data.data.soilTemperatureMin;// อุณหภูมิในดิน Min
    fruit.soilMoistureMax = response.data.data.soilMoistureMax;// ความชื้นในดิน Max
    fruit.soilMoistureMin = response.data.data.soilMoistureMin;// ความชื้นในดิน Min
    fruit.soilPhMax = response.data.data.soilPhMax;// pH ในดิน Max
    fruit.soilPhMin = response.data.data.soilPhMin;// pH ในดิน Min
    fruit.soilEcMax = response.data.data.soilEcMax;// EC ในดิน Max
    fruit.soilEcMin = response.data.data.soilEcMin;// EC ในดิน Min
    fruit.nitrogenMax = response.data.data.nitrogenMax;// N Max
    fruit.nitrogenMin = response.data.data.nitrogenMin;// N Min
    fruit.phosphorusMax = response.data.data.phosphorusMax;// P Max
    fruit.phosphorusMin = response.data.data.phosphorusMin;// P Min
    fruit.potassiumMax = response.data.data.potassiumMax;// K Max
    fruit.potassiumMin = response.data.data.potassiumMin;// K Min
    fruit.amountOfWaterMax = response.data.data.amountOfWaterMax;// ปริมาณน้ำ Max
    fruit.amountOfWaterMin = response.data.data.amountOfWaterMin;// ปริมาณน้ำ Min
    fruit.lightIntensityMax = response.data.data.lightIntensityMax;// ความเข้มแสง Max
    fruit.lightIntensityMin = response.data.data.lightIntensityMin;// ความเข้มแสง Min
    fruit.document_file = response.data.data.document;// เอกสาร
    fruit.link = response.data.data.link// ลิ้ง
    fruit.image = response.data.data.image;// รูป
    fruit.status = response.data.data.status;// สถาน

    if(fruit.breedCategoryId == 1){
      type_plants.value = 'ข้อมูลผลไม้'

    }else if(fruit.breedCategoryId == 2){
      type_plants.value = 'ข้อมูลพืชผัก'
    }
    else if(fruit.breedCategoryId == 3){
      type_plants.value = 'ข้อมูลพืชไร่'
    }


    ApiMain.get("https://farmworld.farm/api-main/image/" + response.data.data.document + "?imageableType=breed").then((result) => {
        console.log(result)
        if(result.status == 200){
          open_download.value = true ;
        }
        else{
          open_download.value = false ;
        }

      }).catch(error => {
        console.error(error);
        open_download.value = false ;
    });

  });



});


const dowload_PDF = ()=>{
  ApiMain.get("https://farmworld.farm/api-main/image/" + file_fruits.value + "?imageableType=breed", { responseType: 'blob' }).then(response => {
        console.log(response);

        if(response.status == 200){
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          const file_name = fruit.name + '.pdf'
          link.setAttribute('download', file_name);
          document.body.appendChild(link);
          link.click();
        }
        else{
          Swal.fire({
          icon: "warning",
          title: "ยังไม่มีเอกสาร",
          showConfirmButton: true,
          timer: 3000,
        })
        }


      }).catch((error)=>{
        Swal.fire({
          icon: "warning",
          title: "ยังไม่มีเอกสาร",
          showConfirmButton: true,
          timer: 3000,
        })
      })
};


const test =()=>{

};

</script>

<template>
  <NavbarMain>
    <div class="m-4 mt-16 md:mt-8">
      <div class="mb-2">
        <h1 class="text-[22px] font-bold mb-4">
            {{ type_plants }}
        </h1>
      </div>
      <div class="bg-white rounded-2xl p-2 ">
        <div class="flex flex-col justify-center items-center">
          <!-- fruit_image -->
          <div v-if="fruit.image !=''">
            <img  class="rounded-lg w-[256px] h-[256px] lg:w-[356px] lg:h-[356px]" :src="`https://farmworld.farm/api-main/image/${fruit.image}?imageableType=breed`"
              alt="fruit">
          </div>
          <div v-else class="bg-gray-200 w-[256px] h-[256px] lg:w-[356px] lg:h-[356px] flex items-center justify-center rounded-lg" >
              <img :src="fruit_image" alt="friut" class="w-[100px] h-auto">
          </div>
        </div>
        <div class="mx-2 lg:mx-[64px]">
          <h1 class="text-center text-[22px] font-bold mb-3">{{ fruit.name }}</h1>
          <div class="flex justify-center">
            <div class="flex flex-row mb-[32px] w-full lg:w-[900px]">
            <h6 class="font-medium text-base mr-2 title">รายละเอียด : </h6>
            <p class="text-base font-medium">{{ fruit.detail }}</p>
          </div>
          </div>
          <div class="flex justify-center">
            <div class="flex flex-row flex-wrap md:flex-nowrap w-full lg:w-[900px]">
            <div class="w-full">
              <div class="flex flex-row  mb-3">
                <span class="mr-2 font-medium text-base title ">สายพันธุ์ : </span>
                <p class="text-base font-medium">{{ fruit.species }}</p>
              </div>
              <div class="flex flex-row  mb-3">
                <span class="mr-2 font-medium text-base title">ชื่อวิทยาศาสตร์ : </span>
                <p class="text-base font-medium">{{ fruit.scientificName }}</p>
              </div>
              <div class="flex flex-row  mb-3">
                <span class="mr-2 font-medium text-base title">ชื่อสามัญ : </span>
                <p class="text-base font-medium">{{ fruit.commonName }}</p>
              </div>
              <div class="flex flex-row mb-3">
                <span class="mr-2 font-medium text-base title">ระยะเวลาเก็บเกี่ยว : </span>
                <p class="text-base font-medium">{{ fruit.harvestPeriod }}</p>
              </div>
              <div class="mb-3 flex flex-row ">
                <h6 class="font-medium text-base mr-2 title">อุณหภูมิในอากาศ : </h6>
                <p class="text-base font-medium">{{ parseFloat(fruit.airTemperatureMin) }} -
                  {{ parseFloat(fruit.airTemperatureMax) }} °C</p>
              </div>
              <div class="mb-3 flex flex-row ">
                <h6 class="font-medium text-base mr-2 title">อุณหภูมิในดิน : </h6>
                <p class="text-base font-medium">{{ parseFloat(fruit.soilTemperatureMin) }} -
                  {{ parseFloat(fruit.soilTemperatureMax) }} °C</p>
              </div>
              <div class="mb-3 flex flex-row ">
                <h6 class="font-medium text-base mr-2 title">ความชื้นในดิน : </h6>
                <p class="text-base font-medium">{{ parseFloat(fruit.soilMoistureMin) }} -
                  {{ parseFloat(fruit.soilMoistureMax) }} %</p>
              </div>
            </div >
            <div class="w-full">
              <div class="mb-3 flex flex-row ">
                  <h6 class="font-medium text-base mr-2 title">pH ในดิน : </h6>
                  <p class="text-base font-medium">{{parseFloat(fruit.soilPhMin)}} - {{parseFloat(fruit.soilPhMax)}}</p>
                </div>
                <div class="mb-3 flex flex-row">
                  <h6 class="font-medium text-base mr-2 title">EC ในดิน : </h6>
                  <p class="text-base font-medium">{{parseFloat(fruit.soilEcMin)}} - {{parseFloat(fruit.soilEcMax)}} ms/cm</p>
                </div>
                <div class="mb-3 flex flex-row ">
                  <h6 class="font-medium text-base mr-2 title">ไนโตรเจน : </h6>
                  <p class="text-base font-medium">{{parseFloat(fruit.nitrogenMin)}} - {{parseFloat(fruit.nitrogenMax)}} mg/kg</p>
                </div>
                <div class="mb-3 flex flex-row ">
                  <h6 class="font-medium text-base mr-2 title">โพแทสเซียม : </h6>
                  <p class="text-base font-medium">{{parseFloat(fruit.potassiumMin)}} - {{parseFloat(fruit.potassiumMax)}} mg/kg</p>
                </div>
                <div class="mb-3 flex flex-row ">
                  <h6 class="font-medium text-base mr-2 title">ฟอสฟอรัส : </h6>
                  <p class="text-base font-medium">{{parseFloat(fruit.phosphorusMin)}} - {{parseFloat(fruit.phosphorusMax)}} mg/kg</p>
                </div>
                <div class="mb-3 flex flex-row ">
                  <h6 class="font-medium text-base mr-2 title">ปริมาณน้ำ : </h6>
                  <p class="text-base font-medium">{{parseFloat(fruit.amountOfWaterMin)}} - {{parseFloat(fruit.amountOfWaterMax)}} มิลลิเมตร/ปี</p>
                </div>
                <div class="mb-3 flex flex-row ">
                  <h6 class="font-medium text-base mr-2 title">ความเข้มแสง : </h6>
                  <p class="text-base font-medium">{{parseFloat(fruit.lightIntensityMin)}} - {{parseFloat(fruit.lightIntensityMax)}} ลักซ์</p>
                </div>
            </div>
          </div>
          </div>
          <div class="text-center w-full md:h-auto mb-4 mt-10">
            <button v-if="open_download == true" type="button" @click="dowload_PDF" class="bg-[#01893D] w-[188px] rounded-lg px-0.5 py-2">
              <img alt="" class="mr-0.5 inline download bg-[#ffffff]" style="width: 24px; height: 24px" />
              <span class="text-white text-sm font-bold">รับเอกสารข้อมูลการปลูก</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>

<style scoped>
@import "@/assets/styles/custom-icons.css";

.title {
  color: #9B5E05;
  white-space: nowrap;
}
</style>
