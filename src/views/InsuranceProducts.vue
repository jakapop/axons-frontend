
<script setup>
import {ref,reactive, computed,onMounted} from 'vue'
import useVuelidate from "@vuelidate/core";
import Swal from "sweetalert2";
import {
  required,
  email,
  sameAs,
  minLength,
  helpers,
} from "@vuelidate/validators";

const phone_format = helpers.regex(/^(\d{3})(\d{3})(\d{4})$/);
const checkTrue = helpers.withParams({ type: 'checkTrue' }, (value, parentVm) => {
  return parentVm.Check === true;
});

const gender_list = ref([
  {id:1,gender: 'ชาย',value:'male'},
  {id:2,gender: 'หญิง',value:'female'},
]);

const titlename_list = ref([
  {id:1, titlename: 'นาย',value:'mr'},
  {id:2, titlename: 'นาง',value:'mrs'},
  {id:3, titlename: 'นางสาว',value:'miss'},
  {id:4, titlename: 'อื่นๆ',value:'other'},
])

const state = reactive({
  serial: "",
  purchase_date: "",
  file_bill: "",
  titlename: "",
  titlename_note: null,
  firstname: "",
  lastname: "",
  email_: "",
  mobile: "",
  gender: "",
  birth_date: "",
  address_no: "",
  address: "",
  address_alley: "",
  address_road: "",
  province: "",
  district: "",
  subdistrict: "",
  zipcode: "",
  check:false,

  province_list:[],
  district_list:[],
  subdistrict_list:[],

  image_upload:""


});
const rules = computed(() => {
  return {
    serial: {
      required: helpers.withMessage("กรุณาระบุเลขซีเรียล", required),
    },
    // file_bill: {
    //   required: helpers.withMessage("กรุณาอัพโหลดใบชำระเงิน", required),
    // },
    purchase_date: {
      required: helpers.withMessage("กรุณาระบุวันที่ซื้อผลิตภัณฑ์", required),
    },
    titlename: {
      required: helpers.withMessage("กรุณาระบุคำนำหน้า", required),
    },
    firstname: {
      required: helpers.withMessage("กรุณาระบุชื่อ", required),
    },
    lastname: {
      required: helpers.withMessage("กรุณาระบุนามสกุล", required),
    },
    email_: {
      required: helpers.withMessage("กรุณาระบุอีเมล", required),
      email: helpers.withMessage(
        () => "อีเมลไม่ถูกต้อง",
        email
      ),
    },

    mobile: {
      required: helpers.withMessage('กรุณาระบุเบอร์โทรศัพท์', required),
      phone_format:helpers.withMessage('เบอร์โทรศัพท์ไม่ถูกต้อง',phone_format)
    },
    gender: {
      required: helpers.withMessage("กรุณาระบุเพศ", required),
    },
    birth_date: {
      required: helpers.withMessage("กรุณาระบุวันเกิด", required),
    },
    address_no: {
      required: helpers.withMessage("กรุณาระบุบ้านเลขที่", required),
    },
    // address: {
    //   required: helpers.withMessage("กรุณาระบุที่อยู่", required),
    // },
    province: {
      required: helpers.withMessage("กรุณาเลือกจังหวัด", required),
    },
    district: {
      required: helpers.withMessage("กรุณาเลือกอำเภอ", required),
    },
    subdistrict: {
      required: helpers.withMessage("กรุณาเลือกตำบล", required),
    },
    zipcode: {
      required: helpers.withMessage("กรุณาระบุรหัสไปรษณีย์", required),
    },
    check:{checkTrue}
  };
});

const v$ = useVuelidate(rules, state);

let spiner_load =ref(false);

let show_success =ref(false);

onMounted(()=>{
  getProvinceAll();
})
const getProvinceAll = () => {
  ApiCore.get("/v2/get-province").then((response) => {

    let obj = response.data.data;

    let arr_th = [];
    obj.forEach((element, index) => {
      arr_th.push(element.name_th);
    });

    let province_arr = [];
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_province = obj.filter(x => x.name_th == name);
      province_arr.push(obj_province[0]);
    });
    state.province_list = province_arr;
  });
}

const sortThaiDictionary = (list) => {
  const newList = [...list]
  newList.sort((a, b) => a.localeCompare(b, 'th'))
  return newList
}

const selectProvince = (event)=>{

  state.province = event.target.options[event.target.options.selectedIndex].text;

  let province_id =event.target.options[event.target.options.selectedIndex].value;

  ApiCore.get("/v2/get-district?province=" + province_id).then((response) => {
    let obj = response.data.data;
    let arr_th = [];

    obj.forEach((element, index) => {
      arr_th.push(element.name_th);
    });

    let district = [];
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_district = obj.filter(x => x.name_th == name);
      district.push(obj_district[0]);
    });
    state.district_list = district;

  });
};
const selectDistrict = (event)=>{

  let district_id = event.target.value ;
  let data = state.district_list.filter(item=> item.district_id == event.target.value) ;
  state.district = data[0].name_th ;
  ApiCore.get("/v2/get-subdistrict?district=" + district_id).then((response) => {
    let obj = response.data.data;

    let arr_th = [];

    obj.forEach((element, index) => {
      arr_th.push(element.name_th);
    });

    let subdistrict = [];
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_subdistrict = obj.filter(x => x.name_th == name);
      subdistrict.push(obj_subdistrict[0]);
    });
    state.subdistrict_list = subdistrict;

    console.log(state.subdistrict_list);
  });
};
const selectSubdistrict = (event) => {

  let sub = state.subdistrict_list.filter(item=>item.subdistrict_id == event.target.value) ;
  console.log(sub[0]);
  state.subdistrict = sub[0].name_th ;
  state.zipcode = sub[0].zipcode

};
let progress= ref(0);
let percent = computed(()=>progress.value) ;

const upload_file = async (event)=>{

  spiner_load.value = true ;
  let file = event.target.files[0];

  console.log(event.target.files[0]);
  const formdata = new FormData();
  formdata.append('file', file);

  const config = await {
    headers: {
    'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: function(progressEvent) {
      progress.value = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
      console.log('process : '+progress.value+'%');
    }
  }
  await ApiCore.post("/v2/upload-warranty",formdata,config).then((res) => {
        if (res.status == 200 || res.status == 201) {

          state.file_bill = res.data.data ;
          spiner_load.value = false ;
        }
        console.log(res.data.data);
        state.image_upload = res.data.data ;
      }).catch((error) => {
        console.log(error);
        spiner_load.value = false ;
      });
};


const submitForm = async () => {
  const result = await v$.value.$validate();
  if(state.check == true){
    if(result){
      await ApiCore.post("/v2/warranty",{
        serial: state.serial,
        purchase_date: state.purchase_date,
        file_bill: state.file_bill,
        titlename: state.titlename,
        titlename_note: null,
        firstname: state.firstname,
        lastname: state.lastname,
        email: state.email_,
        mobile: state.mobile,
        gender: state.gender,
        birth_date: state.birth_date,
        address_no: state.address_no,
        address: state.address,
        address_alley: state.address_alley,
        address_road: state.address_road,
        province: state.province,
        district: state.district,
        subdistrict: state.subdistrict,
        zipcode: state.zipcode,
      }).then((res) => {
        if (res.status == 200 || res.status == 201) {
          console.log('Submit successfully');
          Swal.fire({
            icon: "success",
            title: "ลงทะเบียนเรียบร้อย",
            showConfirmButton: true,
            confirmButtonText: "ตกลง",
          }).then(() =>{
            show_success.value = true;
          });
        }
      }).catch((error) => {
        if(error.response.status == 422){
          const inputserial = document.getElementById('serial');
          inputserial.classList.add('border-[#F05252]');
          show_success.value = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });

          Swal.fire({
            icon: "error",
            title: "เลขซีเรียลนี้ได้ลงทะเบียนไปแล้ว",
            showConfirmButton: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            showConfirmColor: '#01893D',
            confirmButtonText: "ตกลง",
          })
        }
        show_success.value = false;
      });
    }
    else{
      Swal.fire({
      icon: "warning",
      title: "กรุณาระบุข้อมูลให้ครบ",
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
    });
    show_success.value = false;
    }
  }
  else {
    Swal.fire({
      icon: "error",
      title: "กรุณากดยินยอมเงื่อนไข",
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
    });
    show_success.value = false;
  }
};
</script>


<template>
  <div v-if="show_success == false">
    <div class="relative z-50">
      <nav class="bg-white shadoww border-gray-200 py-3 h-[64px] dark:bg-gray-900 rounded-none">
    <div class="container flex items-center justify-between mx-[12px] ml-[20px]">
      <a href="/home" class="flex items-center">
        <img src="../assets/img/img_landingpage/logo_login.svg" class="w-10 h-10" alt="Logo" />
      </a>
    </div>
  </nav>
    </div>
  <div class="bg-white relative z-10">
    <div class="w-full h-full ">
      <h1 class="text-lg md:text-2xl lg:text-[32px] font-medium py-8 mx-[32px] lg:mx-[64px] ">ลงทะเบียนรับประกันผลิตภัณฑ์</h1>
    </div>
    <div class="w-full h-[244px] flex flex-row items-center justify-center md:gap-4 lg:gap-8 px-9xl py-8">
      <div class="w-full flex flex-col justify-center items-center">
        <div class="mb-6">
          <img src="/icons/handyman.svg" alt="handyman" class="w-[64px] lg:w-[96px] h-full">
        </div>
        <p class="w-[100px] sm:w-[150px] md:w-[220px] h-[100px] font-medium text-center text-xs md:text-sm lg:text-base text-[#302421]">
          แก้ไขปัญหาต่างๆ ได้อย่างตรงจุดและรวดเร็ว กับทีมช่างชำนาญการ</p>
      </div>
      <div class="w-full flex flex-col justify-center items-center">
        <div class="mb-6">
          <img src="/icons/new_releases.svg" alt="new_releases" class="w-[64px] lg:w-[96px] h-full">
        </div>
        <p class="w-[100px] sm:w-[150px] md:w-[220px] h-[100px] font-medium  text-center text-xs md:text-sm lg:text-base text-[#302421]">
          ตรวจสอบสถานะการรับประกันสะดวก และแม่นยำ</p>
      </div>
      <div class="w-full flex flex-col justify-center items-center">
        <div class="mb-6">
          <img src="/icons/policy.svg" alt="policy" class="w-[64px] lg:w-[96px] h-full">
        </div>
        <p class="w-[100px] sm:w-[150px] md:w-[220px] h-[100px] font-medium  text-center text-xs md:text-sm lg:text-base text-[#302421]">
          สะดวกต่อการรับสิทธิประโยชน์ต่างๆ ในอนาคต</p>
      </div>
    </div>
  </div>
  <div class="mx-4 sm:mx-12  md:mx-24 lg:mx-48">
    <div class="my-8 bg-white py-8 px-10 w-full rounded-xl shadow-custom">
    <form @submit.prevent="submitForm">
      <div class="mb-8">
        <h1 class="text-[22px] font-bold text-[#01893D] mb-8">ข้อมูลผลิตภัณฑ์</h1>
      <div class="mb-6">
        <label for="serial" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">เลขซีเรียล (Serial number) <span class="text-red-500">*</span></label>
        <input type="text" id="serial" v-model="state.serial" :class="v$.serial.$error ? 'border-red-300' : 'border-gray-300'"
          class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <small v-if="v$.serial.$error" class="text-red-500 text-sm float-left">{{v$.serial.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="bill" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">อัปโหลดใบชำระเงิน (Bills)</label>
        <div class="relative flex flex-row items-center">
          <input type="file" accept=".png,.jpg,.jpeg"  @change="upload_file" id="input_file"  class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 block w-full h-[36px] p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <div class="w-[100px] ml-2">
            <label for="input_file"  class="bg-[#01893D] px-4 py-1 rounded-lg text-white">
              <svg  v-if="spiner_load == true"  aria-hidden="true" class="inline w-4 h-4 mr-2 text-white animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span v-else class="whitespace-nowrap">อัปโหลด</span>
            </label>
          </div>
        </div>
        <small class="text-xs text-gray-500">นามสกุลไฟล์ PNG, JPG หรือ JPEG เท่านั้น</small>
        <!-- <small v-if="v$.file_bill.$error" class="text-red-500 text-sm float-left">{{v$.file_bill.$errors[0].$message}}</small>
        <small v-else class="text-xs text-gray-500">นามสกุลไฟล์ PNG, JPG หรือ JPEG เท่านั้น</small> -->
        <div v-if="state.image_upload">
          <img :src="state.image_upload" alt="" class="object-cover w-[300px]">
        </div>
      </div>
      <div class="mb-6">
        <label for="purchase_date" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white whitespace-nowrap">วันที่ซื้อผลิตภัณฑ์ (Purchase date) <span class="text-red-500">*</span></label>
        <input type="date" id="purchase_date" v-model="state.purchase_date" :class="v$.purchase_date.$error ? 'border-red-300' : 'border-gray-300'"
          class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]" >
        <small v-if="v$.purchase_date.$error" class="text-red-500 text-sm float-left">{{v$.purchase_date.$errors[0].$message}}</small>
      </div>
      </div>
      <div class="mb-8">
        <h1 class="text-[22px] font-bold text-[#01893D] mb-8">ข้อมูลส่วนตัว</h1>
      <div class="mb-6">
        <label for="titlename" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">คำนำหน้า (Title) <span class="text-red-500">*</span></label>
        <select id="titlename" v-model="state.titlename" :class="v$.titlename.$error ? 'border-red-300' : 'border-gray-300'" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <option value="" selected disabled>เลือกคำนำหน้า</option>
          <option v-for="name in titlename_list" :key="name.id" :value="name.value">{{ name.titlename }}</option>
        </select>
        <small v-if="v$.purchase_date.$error" class="text-red-500 text-sm float-left">{{v$.purchase_date.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="firstname" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">ชื่อ (First name) <span class="text-red-500">*</span></label>
        <input type="text" id="firstname" v-model="state.firstname" :class="v$.firstname.$error ? 'border-red-300' : 'border-gray-300'"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <small v-if="v$.firstname.$error" class="text-red-500 text-sm float-left">{{v$.firstname.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="lastname" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">นามสกุล (Last name)<span class="text-red-500">*</span></label>
        <input type="text" id="lastname"  v-model="state.lastname" :class="v$.lastname.$error ? 'border-red-300' : 'border-gray-300'"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <small v-if="v$.lastname.$error" class="text-red-500 text-sm float-left">{{v$.lastname.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="email" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">อีเมล (Email)<span class="text-red-500">*</span></label>
        <input type="text" id="email" v-model="state.email_" :class="v$.email_.$error ? 'border-red-300' : 'border-gray-300'"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <small v-if="v$.email_.$error" class="text-red-500 text-sm float-left">{{v$.email_.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="mobile" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">เบอร์โทรศัพท์ (Mobile No.)<span class="text-red-500">*</span></label>
        <input type="tel" id="mobile" v-model="state.mobile" :class="v$.mobile.$error ? 'border-red-300' : 'border-gray-300'"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <small v-if="v$.mobile.$error" class="text-red-500 text-sm float-left">{{v$.mobile.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="gender" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">เพศ (Gender)<span class="text-red-500">*</span></label>
        <select id="gender" v-model="state.gender" :class="v$.gender.$error ? 'border-red-300' : 'border-gray-300'" class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <option value="" selected disabled>เลือกเพศ</option>
          <option v-for="item in gender_list" :value="item.value"  :key="item.id">{{ item.gender }}</option>
        </select>
        <small v-if="v$.gender.$error" class="text-red-500 text-sm float-left">{{v$.gender.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="birth_date" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">วันเกิด (Date of birth)<span class="text-red-500">*</span></label>
        <input type="date" id="birth_date" v-model="state.birth_date" :class="v$.birth_date.$error ? 'border-red-300' : 'border-gray-300'"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <small v-if="v$.birth_date.$error" class="text-red-500 text-sm float-left">{{v$.birth_date.$errors[0].$message}}</small>
      </div>
      </div>
      <div class="mb-8">
        <h1 class="text-[22px] font-bold text-[#01893D] mb-8">ข้อมูลที่อยู่</h1>
      <div class="mb-6">
        <label for="address_no" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">บ้านเลขที่ (House number)<span class="text-red-500">*</span></label>
        <input type="text" id="address_no" v-model="state.address_no" :class="v$.address_no.$error ? 'border-red-300' : 'border-gray-300'"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <small v-if="v$.address_no.$error" class="text-red-500 text-sm float-left">{{v$.address_no.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="address" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">หมู่บ้าน/อาคาร/คอนโด (Village/Building/Condo)</label>
        <input type="text" id="address" v-model="state.address"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <!-- <small v-if="v$.address.$error" class="text-red-500 text-sm float-left">{{v$.address.$errors[0].$message}}</small> -->
      </div>
      <div class="mb-6">
        <label for="address_alley" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">ซอย (Alley/Soi)</label>
        <input type="text" id="address_alley" v-model="state.address_alley"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
      </div>
      <div class="mb-6">
        <label for="address_road" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">ถนน (Road)</label>
        <input type="text" id="address_road" v-model="state.address_road"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
      </div>
      <div class="mb-6">
        <label for="province" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">จังหวัด (Province)<span class="text-red-500">*</span></label>
        <select id="province" @change="selectProvince" :class="v$.province.$error ? 'border-red-300' : 'border-gray-300'" class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <option value="" selected disabled>เลือกจังหวัด</option>
          <option v-for="item in state.province_list" :value="item.province_id"  :key="item.province_id">{{ item.name_th }}</option>
        </select>
        <small v-if="v$.province.$error" class="text-red-500 text-sm float-left">{{v$.province.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="district" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">เขต/อำเภอ (District)<span class="text-red-500">*</span></label>
        <select id="district" @change="selectDistrict" :class="v$.district.$error ? 'border-red-300' : 'border-gray-300'" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <option value="" selected disabled>เลือกอำเภอ</option>
          <option v-for="item in state.district_list" :value="item.district_id"  :key="item.district_id">{{ item.name_th }}</option>
        </select>
        <small v-if="v$.district.$error" class="text-red-500 text-sm float-left">{{v$.district.$errors[0].$message}}</small>
      </div>
      <div class="mb-6">
        <label for="subdistrict" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">แขวง/ตำบล (Sub-District)<span class="text-red-500">*</span></label>
        <select id="subdistrict" @change="selectSubdistrict" :class="v$.subdistrict.$error ? 'border-red-300' : 'border-gray-300'" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]">
          <option value="" selected disabled>เลือกตำบล</option>
          <option v-for="item in state.subdistrict_list" :value="item.subdistrict_id"  :key="item.subdistrict_id">{{ item.name_th }}</option>
        </select>
        <small v-if="v$.subdistrict.$error" class="text-red-500 text-sm float-left">{{v$.subdistrict.$errors[0].$message}}</small>
      </div>
      </div>
      <div class="mb-6">
        <label for="zipcode" class="block mb-2 text-sm font-medium text-[#302421] dark:text-white">รหัสไปรษณีย์ (Zip Code)<span class="text-red-500">*</span></label>
        <input type="text" id="zipcode" v-model="state.zipcode"  :class="v$.zipcode.$error ? 'border-red-300' : 'border-gray-300'"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]" readonly>
          <small v-if="v$.zipcode.$error" class="text-red-500 text-sm float-left">{{v$.zipcode.$errors[0].$message}}</small>
      </div>
      <div class="flex items-start mb-6">
    <div class="flex items-center h-5">
      <input id="confirm" type="checkbox" v-model="state.check" :class="v$.check.$error ? 'border-red-500' : 'border-gray-300'"  class="text-[#01893D] w-4 h-4 border  rounded-full bg-gray-50 focus:ring-3 focus:ring-[#01893D] dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" >
    </div>
    <label for="confirm" class="ml-2 text-sm font-medium text-[#302421] dark:text-gray-300 ">ข้าพเจ้ายินดีรับข้อมูลข่าวสาร การสื่อสาร สิทธิประโยชน์ และกิจกรรมต่างๆ จากบริษัท (I do hereby agree to receive information, communication, privileges and activities news from company)</label>
  </div>
      <div class="text-center">
        <button type="submit"
        class="text-white bg-[#01893D] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full lg:w-[200px] h-[34px]  sm:w-auto px-[16px] py-[4px] text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">ลงทะเบียน</button>
      </div>

    </form>
  </div>
  </div>
  </div>
  <!-- เมื่ออัพโหลดเรียบร้อยแล้ว -->
  <div v-else>
    <div class="w-full h-full bg-white">
    <h1 class="text-lg md:text-2xl lg:text-[32px] font-medium py-8 mx-[32px] lg:mx-[64px] ">ลงทะเบียนรับประกันผลิตภัณฑ์</h1>
  </div>
  <div class="bg-white flex flex-col justify-center items-center h-[300px] w-full ">
    <div class="mb-10">
      <img src="/icons/verified_user.svg" alt="" class="w-24 h-24">
    </div>
    <div class="text-center">
      <h1 class="font-bold text-lg md:text-[22px] mb-2">ลงทะเบียนรับประกันผลิตภัณฑ์สำเร็จ</h1>
      <p class="text-sm md:text-base font-medium">ติดต่อแจ้งปัญหา หรือสอบถามเพิ่มเติมได้ที่ 02-1054747 ต่อ 1-5</p>
    </div>
  </div>
  </div>

</template>


<style scoped>
.shadoww{
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
.shadow-custome {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}

input::file-selector-button{
  display: none;

}

</style>
