<script setup>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Auth from '@/layouts/Auth.vue'
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import farmimg from "@/assets/img/farm/farm_login.png";

const form = reactive({
  email: "",
  new_password: '',
  confirm_password: ''
});

let selectedOpen = ref(false);
let selectedLang = ref("TH");

const states = reactive({
  selectedLangFlag: "thai",
});

let vertify_email = ref(false);
const router = useRouter();

const submit = () => {
  console.log(form.new_password)
  console.log(form.confirm_password)
  if (form.new_password != "" && form.confirm_password != "") {
    ApiSso.put("/api/auth/change-password", {
      type: "email",
      password: form.new_password,
      confirm_password: form.confirm_password
    }).then((data) => {
        console.log(data);
        if (data.data.message == "Success") {
          Swal.fire({
            icon: "success",
            title: "เปลี่ยนรหัสผ่าน สำเร็จ",
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/");
            }
          })
        }
      })
      .catch((error) => {
        console.log("Fail");
        const confirm_password = (error.response.data["invalid-params"].confirm_password ?? [])[0];
        let error_messege = ""
        if (typeof confirm_password !== 'undefined') {
          error_messege += error.response.data["invalid-params"].confirm_password[0] + "<br>"
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
};
</script>

<template>
  <div class="flex justify-center items-center w-full h-full my-10">
    <div class="">
      <div class=" flex justify-center bg-white rounded-2xl shadow-xl z-20 w-[288px] md:w-[640px]">
        <!-- Login banner -->
        <div class="hidden bg-cover md:block lg:w-11/12">
          <div
            class="relative place-items-center bg-cover bg-center bg-no-repeat p-5 h-full w-full object-cover rounded-tl-[16px] rounded-bl-[16px]"
            :style="{ backgroundImage: `url(${farmimg})` }">
          </div>
        </div>
        <div class="flex items-center w-full mx-auto" :class="vertify_email==false?'':'hidden'" >
          <div  class="flex-1">
            <div class="bg-[#01893D] text-center py-4 rounded-t-[16px] md:rounded-tl-[0px] md:rounded-tr-[16px]">
              <div class="flex items-center justify-center">
                <img class="w-[96px] h-[96px]" src="@/assets/img/icons/logo/logo.svg" alt="" />
              </div>
            </div>

            <div class="text-left m-4">
              <h1 class="text-[#30242166] text-[22px] font-mediem">ตั้งค่ารหัสผ่านใหม่</h1>
            </div>
            <div class="mt-8 px-6 mb-4">
              <form>
                <div class="mb-6">
                  <label
                    class="block uppercase tracking-wide text-[#302520] text-base md:text-base font-mediem mb-2 relative">
                    รหัสผ่านใหม่
                  </label>
                  <input name="new_password" id="new_password" v-model="form.new_password" type="text"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-[#01893D] rounded-[10px] h-[40px] focus:border-[#01893D] focus:ring-[#01893D] focus:outline-none focus:ring focus:ring-opacity-40" />
                  <span v-if="form.new_password==''"
                    class="text-red-500 text-base md:text-base float-right">กรุณากรอกรหัสผ่านใหม่</span>
                </div>
                <div class="mb-4">
                  <label
                    class="block uppercase tracking-wide text-[#302520] text-base md:text-base font-mediem mb-2 relative">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input name="confirm_password" id="confirm_password" v-model="form.confirm_password" type="text"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-[#01893D] rounded-[10px] h-[40px] focus:border-[#01893D] focus:ring-[#01893D] focus:outline-none focus:ring focus:ring-opacity-40" />
                  <span v-if="form.confirm_password==''"
                    class="text-red-500 text-base md:text-base float-right">กรุณากรอกยืนยันรหัสผ่านใหม่</span>
                </div>

                <div class=" text-center">
                  <button @click="submit" type="button"
                    class="bg-[#01893D] hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] hover:shadow rounded-[10px] w-full h-[36px] mt-4 ">
                    ยืนยัน
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "@/assets/styles/custom-icons.css";
</style>
