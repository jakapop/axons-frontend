<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import Swal from "sweetalert2";

const mainStore = useMainStore();

const router = useRouter();
const CustomerId = mainStore.CustomerId; // id
const userImage = mainStore.userImage;  //รูปโปรไฟล์

const states = reactive({
  profile: [],
  province: [],
  province_id: "",

  ck_have_image:false,
  ck_upload:false,
  fileupload:"",
  formData: new FormData(),
});

onBeforeMount(() => {
  ApiSso.get("/api/geo/provinces")
  .then((response) => {
    states.province = response.data.data;
  });

});

onMounted(() => {
  let blah = document.querySelector("#blah");
  let add_photo = document.querySelector("#add_photo");
  ApiSso.get("/api/auth/profile").then((response) => {
    states.profile = response.data.data;

    console.log(states.profile);
    states.province_id = response.data.data.user_details.province_id
  })

  ApiMain.get("/customer/"+CustomerId+"/get-image")
  .then((response) => {
    if (response.data.status == 200){
        //console.log(response.data.data.filename)
        states.ck_have_image = true
        blah.classList.remove("hidden");
        add_photo.classList.add("hidden");
        blah.src = import.meta.env.VITE_API_MAIN +"/image/"+response.data.data.filename+"?imageableType=customer"
    }
  }).catch(error => {
    //console.log(error.code)
    if (error.code == "ERR_BAD_REQUEST"){
        blah.classList.add("hidden");
    }
  })

});

const upload_image = () => {
  let imagefile = document.querySelector("#imgInp");
  states.formData.append("file", imagefile.files[0]);
  states.ck_upload = true
  let add_photo = document.querySelector("#add_photo");
  let blah = document.querySelector("#blah");
  blah.classList.remove("hidden");
  add_photo.classList.add("hidden");
  const [file] = imgInp.files;
  if (file) {
    blah.src = URL.createObjectURL(file);
  }
};


let input_color = ref(false);

const submit_form = () => {

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(states.profile.email) || states.profile.email == null){

    input_color.value = false ;
    ApiSso.put("/api/auth/profile", {
    username: states.profile.username,
    email: states.profile.email,
    firstname: states.profile.first_name,
    lastname: states.profile.last_name,
    detail: { province_id: states.province_id },
  }).then((response) => {
    //console.log(response.data)
    if (response.data.message == "Success") {
      mainStore.userProvinceId = states.province_id
      mainStore.userFirstName = states.profile.first_name
      mainStore.userLastName = states.profile.last_name

      if (states.ck_upload == true){
        ApiMain.post("/image/customer-upload?imageableType=customer",states.formData).then((response2) => {
          // console.log(response2.data)
          mainStore.userImage = response2.data
          if (response2.data != ""){
            if(states.ck_have_image){
              ApiMain.delete("/customer/"+CustomerId+"/delete-image")
              .then((response4) => {
                // console.log(response4.data.status)
                ApiMain.post("/customer/"+CustomerId+"/post-image?filename="+response2.data)
                .then((response3) => {
                  console.log(response3.data.status)
                })
              })
            }else{
                ApiMain.post("/customer/"+CustomerId+"/post-image?filename="+response2.data)
                .then((response3) => {
                  console.log(response3.data.status)
                })
            }
          }
        })

      }

      Swal.fire({
        icon: "success",
        title: "แก้ไขข้อมูลส่วนตัวสำเร็จ",
        timer:2700,
        showConfirmButton: false,
        allowOutsideClick: false,
      }).then(()=>{
        mainStore.userEmail = states.profile.email
        router.push("/personal");
      })


    }
  }).catch(err=>{
    if(err.response.status == 406){
      Swal.fire({
        icon: "warning",
        title: "Email นี้มีข้อมูลอยู่ในระบบแล้ว",
        confirmButtonColor: "#298906",
        confirmButtonText: "ตกลง",
        showConfirmButton: true,
        allowOutsideClick: false,
      })
    }
    
  })

  }else{

    input_color.value = true ;
    // const email_profile = document.getElementById('email_profile');
    // email_profile.classList.remove("border-[#837D7B]");
    // email_profile.classList.add("border-[#D22626]");
    Swal.fire({
        icon: "warning",
        title: "กรุณาระบุอีเมลให้ถูกต้อง",
        confirmButtonColor: "#01893D",
        confirmButtonText: "ตกลง",
        showConfirmButton: true,
        allowOutsideClick: false,
      })
  }



};

const gotopage = () => {
  router.push("/personal");
};
</script>

<template>
  <NavbarMain>
    <div class="m-4 mt-16 md:mt-8">
      <div>
        <h1 class="text-[22px] font-bold mb-2">ข้อมูลส่วนตัว</h1>
      </div>
      <div  class="grid grid-cols-1 justify-items-center bg-white rounded shadow p-4 pb-10">
      <label for="imgInp">
        <input type="file" name="imgInp" id="imgInp" @change="upload_image" :v-model="states.fileupload" class="opacity-0" />
        <div class="flex flex-col items-center mb-6">
          <img id="blah" src="../assets/img/icons/user.png" class="hidden my-4 w-[100px] h-[100px] rounded-full cursor-pointer" >
          <div id="add_photo"
            class="relative bg-custom rounded-full w-[96px] h-[96px] md:w-[100px] md:h-[100px] "
          >
            <div class="flex flex-col items-center ">
              <img
                src="../assets/img/OtherPage/add_a_photo.png"
                class="w-[30px] md:w-[30px] mt-5"
              />
              <span
                class="absolute text-center bottom-5 text-sm font-bold md:text-md text-[#01893D]"
                >แก้ไขรูปภาพ</span
              >
            </div>
          </div>
        </div>
      </label>
        <div>
          <form @submit.prevent="submit_form()">
            <div class="flex flex-row justify-between">
              <div class="mb-6 mr-2 w-full">
                <label
                  for="base-input"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >ชื่อ</label
                >
                <input
                  type="text"
                  id="base-input"
                  v-model="states.profile.first_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div class="mb-6 w-full">
                <label
                  for="base-input"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >นามสกุล</label
                >
                <input
                  type="text"
                  v-model="states.profile.last_name"
                  id="base-input"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]"
                />
              </div>
            </div>
            <div class="mb-6">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >จังหวัด</label
              >
              <select
                id="province_id"
                v-model="states.province_id"
                class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#01893D] dark:focus:border-[#01893D]"
              >
                <option
                  v-for="option in states.province"
                  :key="option.id ?? option"
                  :value="option.id"
                  :selected="option.id == states.province_id"
                >
                  {{ option.name.th }}
                </option>
              </select>
            </div>
            <div class="mb-6">
              <label
                for="base-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >อีเมล</label
              >
              <input
                id="email_profile"
                type="email"
                v-model="states.profile.email"
                :class="input_color == true ? 'border-red-500':'border-gray-300'"
                class="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div class="mb-6">
              <label
                for="base-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >เบอร์โทรศัพท์</label
              >
              <input
                type="text"
                disabled
                readonly
                placeholder=""
                v-model="states.profile.username"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#01893D] focus:border-[#01893D] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div class="flex flex-row justify-between">
              <div class="mr-2 w-full">
                <button
                  class="rounded-[8px] w-full h-[36px] md:w-[200px] bg-[#01893D] text-white"
                >
                  <i class="fa-solid fa-check"></i> ยืนยัน
                </button>
              </div>
              <div class="w-full">
                <button
                  @click="gotopage()"
                  class="rounded-[8px] w-full h-[36px] md:w-[200px] bg-[#01893D] text-white"
                >
                  <i class="fa-regular fa-x"></i> ยกเลิก
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>

<style>
.bg-custom {
  background-color: rgba(0, 0, 0, 0.077);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
</style>
