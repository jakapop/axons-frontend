<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";
import { ref, reactive, onMounted, onBeforeMount, computed } from "vue";
import Swal from "sweetalert2";
import moment from "moment-with-locales-es6";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import {required,email,sameAs,minLength,helpers} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
const mainStore = useMainStore();
const router = useRouter();

const month_now = moment().locale("th").format("MM");
const month_now_name = moment().locale("th").format("MMMM");
const month_previous = moment().subtract(1, "months").endOf("month").format("MM");
const month_previous_name = moment().locale("th").subtract(1, "months").endOf("month").format("MMMM");

const state = reactive({
  email_: "",
  serial: "",
  year: moment().locale("th").format("YYYY"),
  month: month_now,
});

const rules = computed(() => {
  return {
    email_: {
      required: helpers.withMessage("กรุณาระบุอีเมล", required),
      email: helpers.withMessage(
        () => "อีเมลไม่ถูกต้อง",
        email
      ),
    },
    month: {
      required
    },
  };
});
const v$ = useVuelidate(rules, state);


onMounted(() => {
  let url = new URL(window.location.href);
  let boards = url.searchParams.get("boards");
  state.serial = boards;
  if (!boards) {
    router.push("/SelectBoard");
  }
});

const submit = async () => {
  const result = await v$.value.$validate();

  if(result){
    ApiCore.post("/v2/export-report/monthly", {
    email: state.email_,
    year: state.year,
    month: state.month,
    serial: state.serial,
  })
    .then((data) => {
      console.log(data.data.status);
      if (data.data.status == true) {
        Swal.fire({
          icon: "success",
          title: "ส่งออกไฟล์ Excel สำเร็จ",
          showConfirmButton: 1,
          timer: 4000,
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถส่งออกไฟล์ Excel",
        showConfirmButton: 1,
        timer: 2000,
      });
    });
  }
  else {
    Swal.fire({
        icon: "warning",
        title: "กรุณาระบุข้อมุลให้ครบ",
        showConfirmButton: 1,
        confirmButtonText: 'ตกลง',
        timer: 2000,
      });

  }

};
</script>
<template>
  <NavbarMain>
    <div>
      <HeaderFarm />
      <div class="m-4">
        <div class="flex flex-col justify-center md:flex-row md:justify-between">
          <h1 class="text-[22px]  font-bold mb-2">ส่งออกเป็นไฟล์ Excel</h1>
        </div>
        <div class="pt-4 rounded-[16px] bg-[#fff] pb-6">
          <form class="w-full px-4">
            <div class="md:flex md:items-center mb-6">
              <div class="md:w-1/3">
                <label
                  class="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4"
                  for="inline-date"
                >
                  เลือกเดือนที่ต้องการ
                </label>
              </div>
              <div class="md:w-2/3">
                <div class="flex items-center mb-4">
                  <input
                    type="radio"
                    :value="month_previous"
                    v-model="state.month"
                    class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="default-radio-1"
                    class="ml-2 text-base  text-gray-500 dark:text-gray-300"
                    >{{ month_previous_name }}</label
                  >
                </div>
                <div class="flex items-center">
                  <input
                    checked
                    type="radio"
                    :value="month_now"
                    v-model="state.month"
                    class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 border border-1 focus:border-[#01893D] focus:ring-[#01893D]"
                  />
                  <label
                    for="default-radio-2"
                    class="ml-2 text-base  text-gray-500 dark:text-gray-300"
                    >{{ month_now_name }}</label
                  >
                </div>
              </div>
            </div>
            <div class="md:flex md:items-center mb-6">
              <div class="md:w-1/3">
                <labe
                  class="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4"
                  for="inline-email"
                >
                  กรอกอีเมลของคุณ
                </labe>
              </div>
              <div class="w-full md:w-2/3">
                <input
                  class="w-full lg:w-[400px] appearance-none rounded-[10px] h-[40px] border-gray-500 text-[#01893D] border border-1 focus:border-[#01893D] focus:ring-[#01893D]"
                  id="email"
                  type="email"
                  v-model="state.email_"
                />
              </div>
            </div>
            <div class="text-center">
              <button
                @click="submit"
                type="button"
                class="bg-[#01893D] hover:bg-[#fff] text-white font-bold py-2 px-4 hover:text-[#01893D] rounded-[10px] h-[40px] btn-custom-add"
              >
                <img
                  alt=""
                  class="inline export lg:mt-0 bg-[#fff]"
                  style="width: 20px; height: 20px"
                />
                <span class="text-sm ml-1">ส่งออกเป็นไฟล์ Excel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>

<style land="scss">
@import "@/assets/styles/custom-icons.css";

input[type="date"]::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 1;
  display: block;
  background: url(@/assets/img/icons/calendar_month.png) no-repeat center;
  width: 20px;
  height: 20px;
  border-width: thin;
}

.btn-custom-see-chart:hover .icon-chart {
  background-color: #01893D;
}

.btn-custom-add:hover img {
  background-color: #01893D;
}
</style>

<style land="scss">
@import "@/assets/styles/custom-icons.css";

.text-custom-head-img-farm.nameday {
  font-size: clamp(5px, 10vw + 10px, 128px);
}

.text-custom-head-img-farm.day {
  font-size: clamp(0.875rem, 4vw + 1rem, 3rem);
}

.btn-custom-see-chart:hover span {
  color: #01893D;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 700, "GRAD" 0, "opsz" 48;
}
</style>
