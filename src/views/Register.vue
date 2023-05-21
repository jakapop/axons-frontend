<script setup>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Auth from "@/layouts/Auth.vue";
import { ref, reactive, onBeforeMount, onMounted ,computed} from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useMainStore } from "@/stores/main";


import useVuelidate from '@vuelidate/core';
import { required, email, sameAs, minLength, helpers } from '@vuelidate/validators';
import { list } from "postcss";

const phone_format = helpers.regex(/^(\d{3})(\d{3})(\d{4})$/);

const form = reactive({
  firstname: "",
  lastname: "",
  province_id:"",
  province:[],
  email_user:"",
  phone:"",
  terms:""
});

const province_list = ref([]);

const rules = computed(() => {
  return {
    firstname: {
      required: helpers.withMessage('กรุณาระบุชื่อ', required),
    },
    lastname: {
      required: helpers.withMessage('กรุณาระบุนามสกุล', required),
    },
    province: {
      required: helpers.withMessage('กรุณาเลือกจังหวัด', required),
    },
    email_user: {
      // required: helpers.withMessage('กรุณาระบุชื่อผู้ใช้', required),
      email: helpers.withMessage(() => 'อีเมลไม่ถูกต้อง', email),
    },
    phone: {
      required: helpers.withMessage('กรุณาระบุเบอร์โทรศัพท์', required),
      phone_format:helpers.withMessage('เบอร์โทรศัพท์ไม่ถูกต้อง',phone_format)
    },
    terms: {
      required
    },
  }
});
// v$ เป็นตัวแปรธรรมดา
const v$ = useVuelidate(rules, form)

//ต้องเพิ่ม async  เข้าไปด้วยเพราะ ฟังก์ชันการตรวจสอบต้องเป็นแบบ อะซิงโครนัส และต้องรอให้ตรวจสอบแบบฟอร์มเสร็จก่อน
const submit = async () => {
  const result = await v$.value.$validate();
  if(result){

    const user_regis = {
      firstName: form.firstname,
      lastName: form.lastname,
      province_id:form.province_id,
      username: form.phone,
      email: form.email_user,
    }
    localStorage.setItem("user_regis", JSON.stringify(user_regis));
    router.push("/Register2");
  }
  else {
  if (form.firstname == "") {
    let element = document.querySelector('#firstname') ;
    element.classList.remove("border-[#837D7B]");
    element.classList.add("border-[#D22626]");
  }
  if (form.lastname == "") {
    let element = document.querySelector('#lastname') ;
    element.classList.remove("border-[#837D7B]");
    element.classList.add("border-[#D22626]");
  }
  if (form.province_id == "") {
    let element = document.querySelector('#province') ;
    element.classList.remove("border-[#837D7B]");
    element.classList.add("border-[#D22626]");
  }
  // if (form.email_user == "") {
  //   let element = document.querySelector('#email_user') ;
  //   element.classList.remove("border-[#837D7B]");
  //   element.classList.add("border-[#D22626]");
  // }
  if (form.phone == "") {
    let element = document.querySelector('#phone') ;
    element.classList.remove("border-[#837D7B]");
    element.classList.add("border-[#D22626]");
  }
  if (form.terms == false) {
      Swal.fire({
        icon: "warning",
        title: "กรุณายอมรับข้อตกลง",
        showConfirmButton: false,
        timer: 1500
      });
    }
  else {
    Swal.fire({
      icon: "warning",
      title: "กรุณาระบุข้อมูลในแบบฟอร์มให้ครบ",
      showConfirmButton: false,
      timer: 1500
    });
  }

}
}
const mainStore = useMainStore();
const router = useRouter();
const selectedOpenProvinces = ref(false);
const selectedProvinces = ref("");

let selectedOpen = ref(false);
let selectedLang = ref("TH");

onMounted(() => {
  ApiSso.get("/api/geo/provinces").then((response) => {

    let obj = response.data.data ;
    let arr_th = [] ;

    obj.forEach((element,index) => {
      if(element.name.th == 'กรุงเทพมหานคร'){
        let x  = 'จ. กรุงเทพมหานคร'
        arr_th.push(x);
      }
      else {
        arr_th.push(element.name.th);
      }
    });

    let province_arr = [] ;
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name)=>{
      let obj_province = obj.filter(x=>x.name.th == name);
      if(obj_province.length == 0){
        province_arr.push({ id:10,name:{en:'Bangkok',th:'จ. กรุงเทพมหานคร'}});
      }
      else {
        province_arr.push(obj_province[0]);
      }
    });
    province_list.value =  province_arr ;
  });
});
const sortThaiDictionary = (list) => {
  const newList = [...list]
  newList.sort((a, b) => a.localeCompare(b, 'th'))
  return newList
}

const select_province = (id, name) => {
  selectedOpenProvinces.value = !selectedOpenProvinces.value;
  form.province_id = id;
  form.province_name = name;
};
</script>

<template>
  <div class="grid grid-cols-1  justify-items-center items-center  h-screen">
    <div class="flex flex-row justify-center w-full h-full p-4 md:p-0  md:w-[640px] md:h-[613px] rounded-2xl md:rounded-2xl">
      <img src="../assets/img/img_landingpage/bg_login.png" class="bg-center bg-no-repeat object-cover hidden md:block md:h-full md:w-[320px] rounded-l-2xl"
        alt="">
      <div class="w-full lg:w-1/2 h-full bg-white rounded-t-2xl rounded-b-2xl md:rounded-b-none md:rounded-br-2xl">
        <div
          class="flex items-center justify-center text-center bg-white w-full rounded-t-2xl md:rounded-t-none md:rounded-tr-2xl h-[96px]">
          <img src="../assets/img/img_landingpage/logo_login.svg" class="w-[64px] h-[64px]" alt="logo">
        </div>
        <div class=" p-4 ">
          <div class="flex flex-row justify-between">
            <div class="text-[#302520]">
              <h5 class="text-[22px] font-medium opacity-60">สมัครสมาชิก</h5>
            </div>
          </div>
          <div>
            <form @submit.prevent="submit">
              <div class="mt-4 mb-4 flex flex-row">
                <div class="mr-2 w-1/2">
                  <label class="block uppercase tracking-wide text-[#302520] text-base font-mediem mb-0.5">ชื่อ <span class="text-red-500">*</span></label>
                  <input id="firstname" type="text" v-model="form.firstname"
                    :class="form.firstname? 'border-[#01893D]' : 'border-[#837D7B]'"
                    class="bg-white rounded-[8px] h-[36px] md:h-9 text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border focus:border-[#01893D] focus:ring-[#01893D]"
                    />
                  <small v-if="v$.firstname.$error" class="text-red-500 text-sm float-right ">{{v$.firstname.$errors[0].$message}}</small>
                </div>
                <div class="ml-2 w-1/2">
                  <label
                    class="block uppercase tracking-wide text-[#302520] text-base font-mediem mb-0.5">นามสกุล <span class="text-red-500">*</span></label>
                  <input id="lastname" type="text" v-model="form.lastname"
                    :class="form.lastname? 'border-[#01893D]' : 'border-[#837D7B]'"
                    class="bg-white rounded-[8px] h-[36px] md:h-9 text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border  focus:border-[#01893D] focus:ring-[#01893D]"
                    />
                  <small v-if="v$.lastname.$error" class="text-red-500 text-sm float-right">{{v$.lastname.$errors[0].$message}}</small>
                </div>
              </div>
              <div class="mb-5">

                <label
                  class="block uppercase tracking-wide text-[#302520] text-base font-mediem mb-0.5">จังหวัด <span class="text-red-500">*</span></label>
                <span class="relative w-full" v-on:click="selectedOpenProvinces = !selectedOpenProvinces">
                  <input id="province" placeholder="จังหวัด" disabled
                    class="bg-white rounded-[8px] h-[36px] md:h-9 text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 custom-input-select"
                    v-model="form.province"
                    :class="form.province.length > 0? 'border-[#01893D] border-1' : 'border-[#837D7B]'" />
                  <img
                    class="flex absolute right-[11px] top-[12.5px] md:top-2 w-2.5 md:w-4 bg-transparent rounded text-base text-gray-600"
                    src="@/assets/img/icons/select-down.svg" alt=""
                    :class="selectedOpenProvinces ? 'rotate-180' : ''" />
                  <div
                    class="absolute shadow bg-white top-100 z-40 w-full h-[200px] lef-0  max-h-select overflow-y-auto rounded-[24px] mt-2 border-[#01893D] border-2"
                    v-if="selectedOpenProvinces == true">
                    <div class="flex flex-col w-full">
                      <div v-for="(province, index) in province_list" :value="province.id" :key="index"
                        class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b" v-on:click="
                          select_province(province.id, province.name.th)
                        ">
                        <div
                          class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100"
                          @click="
                            (form.province = province.name.th),
                            (selectedOpenProvinces = !selectedOpenProvinces)
                          ">
                          <div class="w-full items-center flex p-2">
                            <div class="mx-2 hover:text-[#9BD226] text-sm text-[#01893D]">
                              {{ province.name.th }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
                <small v-if="v$.province.$error" class="text-red-500 text-sm float-right">{{v$.province.$errors[0].$message}}</small>
              </div>

              <div class="mb-5">
                <label
                  class="block uppercase tracking-wide text-[#302520] text-base font-mediem mb-0.5">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
                <input id="phone" type="tel"  v-model="form.phone"
                  :class="form.phone ? 'border-[#01893D] border-1' : 'border-[#837D7B]'"
                  placeholder="0888888888"
                  class="bg-white rounded-[8px] h-[36px] md:h-9 text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border focus:border-[#01893D] focus:ring-[#01893D]"
                  />
                  <small v-if="v$.phone.$error" class="text-red-500 text-sm float-right">{{v$.phone.$errors[0].$message}}</small>
              </div>
              <div class="mb-4">
                <label
                  class="block uppercase tracking-wide text-[#302520] text-base font-mediem mb-0.5">อีเมล <span class="opacity-60">(ไม่บังคับ)</span>
                </label>
                <input  name="email_user" id="email_user" v-model="form.email_user"
                  :class="form.email_user ? 'border-[#01893D]' : 'border-[#837D7B]'"  type="email" placeholder="example@example.com"
                  class="bg-white rounded-[8px] h-[36px] md:h-9  focus:border-[#01893D] focus:ring-[#01893D] text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 " />
                  <small v-if="v$.email_user.$error" class="text-red-500 text-sm float-right">{{v$.email_user.$errors[0].$message}}</small>
              </div>
              <div class="mb-4" :class="v$.email_user.$error?'mt-10':''">
                <div class="flex items-center">
                  <div class="flex items-center h-5">
                    <input v-model="form.terms" :class="form.terms==false?'text-red-500' : 'text-[#01893D]'" id="terms" aria-describedby="terms" type="checkbox" class="mr-2 w-6 h-6 rounded-[24px] border border-gray-300 bg-gray-50 focus:ring-3 focus:ring-[#01893D] agreement"/>
                  </div>
                    <span for="terms" class="mr-1 font-mediem text-base text-[#302520] ">ฉันยอมรับ </span>
                    <a class="text-[#01893D] hover:underline" href="#">ข้อตกลงการใช้งาน</a>
                </div>
              </div>
              <div class=" text-center">
                <button @click="submit" type="button"
                  class="bg-[#01893D] hover:bg-[#fff] text-white font-bold px-4 hover:text-[#01893D] rounded-[10px] w-full md:w-[256px] h-[36px] text-sm md:text-base">
                  สมัครสมาชิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style>
@import "@/assets/styles/custom-icons.css";

.agreement.agreement:checked {
  background-color: green;
}
</style>

