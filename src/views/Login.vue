<script setup>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Auth from "@/layouts/Auth.vue";
import { ref, reactive, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import axios from "axios";
import farmimg from "@/assets/img/farm/farm_login.png";
import useVuelidate from "@vuelidate/core";
import googlelogin from "@/components/GoogleAuth/GoogleAuth.vue";
import {
  required,
  email,
  sameAs,
  minLength,
  helpers,
} from "@vuelidate/validators";
import Swal from "sweetalert2";

const mainStore = useMainStore();
const CustomerId = mainStore.CustomerId;
const router = useRouter();

onBeforeMount(() => {
  if (localStorage.getItem("astk") !== null && CustomerId !== null) {
    ApiSso.get("/api/auth/profile")
      .then((data) => {
        if (data.status == 200) {
          router.push("/home");
        }
      })
      .catch((error) => {
        router.push("/");
      });
  }
});

const icon_senser = [
  {
    id: 1,
    name: "Th",
  },
  {
    id: 2,
    name: "En",
  },
  {
    id: 3,
    name: "Cn",
  },
];

let selectedOpen = ref(false);
let selectedLang = ref("TH");
let ck_login = ref(0);

let showModal = ref(false);
const modalClick = () => {
  router.push("/vertify-account");
  // localStorage.setItem('vertify',form.username);
};
const states = reactive({
  selectedLangFlag: "thai",
  isLoading: false,
});
// --------- Form Validate --------------
// const phone_number = helpers.regex(/^(\d{3})(\d{3})(\d{4})$/);
// const email_format = helpers.regex(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const validate_email_phone = helpers.regex(
  /^(?:0\d{9})|[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
);
const form = reactive({
  username: "", //tawatchai_pou@farmthailand.co.th
  password: "", //farm2022
});

const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage("กรุณาระบุชื่อผู้ใช้", required),
      email: helpers.withMessage(
        () => "อีเมลหรือเบอร์โทรศัพท์ไม่ถูกต้อง",
        validate_email_phone
      ),
    },
    password: {
      required: helpers.withMessage("กรุณาระบุรหัสผ่าน", required),
    },
  };
});

const v$ = useVuelidate(rules, form);

//ต้องเพิ่ม async  เข้าไปด้วยเพราะ ฟังก์ชันการตรวจสอบต้องเป็นแบบ อะซิงโครนัส และต้องรอให้ตรวจสอบแบบฟอร์มเสร็จก่อน
const submit_login = async () => {
  const result = await v$.value.$validate();
  if (result) {
    states.isLoading = true;
    ApiMain.post("/uaa/login", {
      grantType: "password",
      username: form.username,
      password: form.password,
    })
      .then((data_uaa) => {
        console.log("uaa ==", data_uaa);
        if (data_uaa.status == 201) {
          const token = data_uaa.data.accessToken;
          axios
            .get(import.meta.env.VITE_API_SSO + "/api/auth/profile", {
              headers: {
                Authorization: `Bearer ` + token,
              },
            })
            .then((data) => {
              const customer_id = data.data.data.id;
              mainStore.setUser({
                uid: data.data.data.id,
                username: data.data.data.username,
                province_id: data.data.data.user_details.province_id,
                first_name: data.data.data.first_name,
                last_name: data.data.data.last_name,
                email: data.data.data.email,
              });
              localStorage.setItem("astk", data_uaa.data.accessToken);
              localStorage.setItem("userid", data.data.data.id);

              axios
                .get(
                  import.meta.env.VITE_API_MAIN +
                    "/customer/" +
                    customer_id +
                    "/get-image",
                  {
                    headers: {
                      Authorization: `Bearer ` + token,
                    },
                  }
                )
                .then((response) => {
                  console.log("respons ==", response);
                  if (response.data.status == 200) {
                    console.log(response.data.data.filename);
                    mainStore.userImage = response.data.data.filename;
                  }
                  window.location.replace("/home");
                })
                .catch((error) => {
                  console.log("no image");
                  window.location.replace("/home");
                });
            })
            .catch((error) => {
              states.isLoading = false;
              router.push("/");
            });
        } else {
          states.isLoading = false;
          ck_login.value = 1;
        }
      })
      .catch((error) => {
        let error_data = error.response.data;
        console.log(error);
        console.log(error_data);
        states.isLoading = false;
        if (error.response.status == 400) {
          ck_login.value = 1;
          const username_element = document.querySelector("#username");
          const password_element = document.querySelector("#password");
          username_element.classList.remove("border-[#837D7B]");
          username_element.classList.add("border-[#D22626]");
          password_element.classList.remove("border-[#837D7B]");
          password_element.classList.add("border-red-500");

          if (error_data.type == "user-inactive") {
            showModal.value = true;
            localStorage.setItem("vertify", form.username);
            // Swal.fire({
            //   position: "center",
            //   icon: "warning",
            //   text: 'กรุณายืนยันตัวตน',
            //   showConfirmButton: true,
            //   confirmButtonText: '<a href="/vertify-account">ยืนยันตัวตน</a>'
            // });
          } else if (error_data.type == "user-credentials-invalid") {
            showModal.value = false;
            Swal.fire({
              position: "center",
              icon: "warning",
              text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
              showConfirmButton: true,
              confirmButtonText: "ตกลง",
            });
          }
        }
      });
  } else {
    Swal.fire({
      position: "center",
      icon: "warning",
      text: "กรุณาระบุชื่อผู้ใช้และรหัสผ่านในแบบฟอร์มให้ครบ หรือระบุข้อมูลให้ถูกต้อง",
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
    });
  }
};

let show_visible = ref(true);
const showPassword = () => {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
    show_visible.value = false;
  } else {
    x.type = "password";
    show_visible.value = true;
  }
};
</script>

<template>
  <div
    :class="showModal == true ? 'opacity-30' : ''"
    class="grid grid-cols-1 justify-items-center items-center h-screen"
  >
    <div
      class="flex flex-row justify-center w-full md:w-[640px] h-full p-4 md:p-0 md:h-[631px] xl:w-[800px] rounded-2xl md:rounded-2xl md:mt-[32px] md:mb-[75px]"
    >
      <!-- Side Background -->
      <img
        src="../assets/img/img_landingpage/bg_login.png"
        class="bg-center bg-no-repeat object-cover hidden md:block md:h-full w-[320px] rounded-l-2xl"
        alt=""
      />
      <!-- End Side Background -->
      <div
        class="w-full lg:w-1/2 bg-white h-[700px] md:h-full rounded-t-2xl rounded-b-2xl md:rounded-b-none md:rounded-br-2xl"
      >
        <div
          class="flex items-center justify-center text-center bg-white w-full rounded-t-2xl md:rounded-t-none md:rounded-tr-2xl h-[96px]"
        >
          <img
            src="../assets/img/img_landingpage/logo_login.svg"
            class="w-[64px] h-[64px]"
            alt="logo"
          />
        </div>
        <div class="p-4">
          <div class="flex flex-row justify-between">
            <div class="text-[#302520]">
              <h1 class="text-[22px] font-bold mb-0.5">ยินดีต้อนรับ</h1>
              <h5 class="text-[22px] font-medium opacity-60">เข้าสู่ระบบ</h5>
            </div>
            <div>
              <div
                class="pl-5 mt-0.5 mr-0.5 my-auto relative"
                v-on:click="selectedOpen = !selectedOpen"
              >
                <div
                  class="flex flex-wrap w-[95px] rounded-[6px] h-[36px] md:h-[36px] xl:h-[36px] text-sm md:text-base relative bg-white items-center"
                  style="border: 1px solid #01893D"
                >
                  <div class="flex -mr-px justify-center w-15 pl-1">
                    <span
                      class="flex items-center leading-normal bg-white border-0 rounded rounded-r-none text-2xl text-gray-600"
                    >
                      <img
                        class="inline w-6"
                        style="margin-left: 4px"
                        src="@/assets/img/icons/lang/thai.svg"
                        v-if="states.selectedLangFlag == 'thai'"
                      />
                      <img
                        class="inline w-6"
                        style="margin-left: 4px"
                        src="@/assets/img/icons/lang/eng.svg"
                        v-if="states.selectedLangFlag == 'eng'"
                      />
                      <img
                        class="inline w-6"
                        style="margin-left: 4px"
                        src="@/assets/img/icons/lang/laos.svg"
                        v-if="states.selectedLangFlag == 'laos'"
                      />
                      <img
                        class="inline w-6"
                        style="margin-left: 4px"
                        src="@/assets/img/icons/lang/myanmar.svg"
                        v-if="states.selectedLangFlag == 'myanmar'"
                      />
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    class="whitespace-nowrap overflow-hidden text-[#01893D] flex-shrink flex-grow leading-normal w-px flex-1 border-0 h-[30px] text-sm md:text-base font-medium border-grey-light rounded rounded-l-none px-3 pl-2 self-center relative outline-none"
                    v-model="selectedLang"
                  />
                </div>
                <img
                  class="flex absolute left-[95px] top-[15px] md:top-3.5 w-2.5 md:w-4 bg-transparent"
                  src="@/assets/img/icons/select-down.svg"
                  alt=""
                  :class="selectedOpen ? 'rotate-180' : ''"
                />
                <div
                  class="absolute shadow bg-white top-[30px] z-40 lef-0 rounded max-h-select overflow-y-auto border-[#01893D] border-[1px]"
                  v-if="selectedOpen == true"
                >
                  <div class="flex flex-col w-[100px]">
                    <div
                      value="TH"
                      class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                      v-on:click="selectedOpen = !selectedOpen"
                    >
                      <div
                        class="flex w-full items-center border-transparent border-l-2 relative hover:border-teal-100"
                        @click="
                          (selectedLang = 'TH'),
                            (selectedOpen = !selectedOpen),
                            (states.selectedLangFlag = 'thai')
                        "
                      >
                        <div class="w-full items-center flex p-2 pl-0">
                          <img
                            class="inline w-6"
                            style="margin-left: 4px"
                            src="@/assets/img/icons/lang/thai.svg"
                          />
                          <div
                            class="mx-2 hover:text-[#9BD226] text-[#01893D] text-sm md:text-base"
                          >
                            TH
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      value="EN"
                      class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                      v-on:click="selectedOpen = !selectedOpen"
                    >
                      <div
                        class="flex w-full items-center border-transparent border-l-2 relative hover:border-teal-100"
                        @click="
                          (selectedLang = 'EN'),
                            (selectedOpen = !selectedOpen),
                            (states.selectedLangFlag = 'eng')
                        "
                      >
                        <div class="w-full items-center flex p-2 pl-0">
                          <img
                            class="inline w-6"
                            style="margin-left: 4px"
                            src="@/assets/img/icons/lang/eng.svg"
                          />
                          <span
                            class="mx-2 hover:text-[#9BD226] text-[#01893D] text-sm md:text-base"
                            >EN</span
                          >
                        </div>
                      </div>
                    </div>
                    <div
                      value="LO"
                      class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                      v-on:click="selectedOpen = !selectedOpen"
                    >
                      <div
                        class="flex w-full items-center border-transparent border-l-2 relative hover:border-teal-100"
                        @click="
                          (selectedLang = 'LO'),
                            (selectedOpen = !selectedOpen),
                            (states.selectedLangFlag = 'laos')
                        "
                      >
                        <div class="w-full items-center flex p-2 pl-0">
                          <img
                            class="inline w-6"
                            style="margin-left: 4px"
                            src="@/assets/img/icons/lang/laos.svg"
                          />
                          <span
                            class="mx-2 hover:text-[#9BD226] text-[#01893D] text-sm md:text-base"
                            >LO</span
                          >
                        </div>
                      </div>
                    </div>
                    <div
                      value="KM"
                      class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                      v-on:click="selectedOpen = !selectedOpen"
                    >
                      <div
                        class="flex w-full items-center border-transparent border-l-2 relative hover:border-teal-100"
                        @click="
                          (selectedLang = 'KM'),
                            (selectedOpen = !selectedOpen),
                            (states.selectedLangFlag = 'myanmar')
                        "
                      >
                        <div class="w-full items-center flex p-2 pl-0">
                          <img
                            class="inline w-6"
                            style="margin-left: 4px"
                            src="@/assets/img/icons/lang/myanmar.svg"
                          />
                          <span
                            class="mx-2 hover:text-[#9BD226] text-[#01893D] text-sm md:text-base"
                            >KM</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--Start Form -->
          <div>
            <form @submit.prevent="submit_login">
              <div class="my-4">
                <label class="block uppercase tracking-wide text-[#302520] text-base font-mediem font-mediem mb-2">อีเมล
                  หรือเบอร์โทรศัพท์</label>
                <input name="username" id="username" v-model="form.username" type="text"
                   :class="
  form.username != ''
    ? 'border-[#01893D] border-1'
    : 'border-[#837D7B] '
" class="focus:border-[#01893D] focus:ring-[#01893D] bg-white rounded-[8px] h-[36px] text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border" placeholder="example@example.com" />
                <small v-if="v$.username.$error" class="text-red-500 text-sm float-right">{{
    v$.username.$errors[0].$message
}}</small>
              </div>
              <div class="mb-4">
                <label
                  class="block uppercase tracking-wide text-[#302520] text-base font-mediem mb-2 relative"
                  >รหัสผ่าน</label
                >
                <div class="relative">
                  <input
                    name="password"
                    v-model="form.password"
                    type="password"
                    id="password"
                    :class="
                      form.password != ''
                        ? 'border-[#01893D] border-1'
                        : 'border-[#837D7B] '
                    "
                    class="block bg-white rounded-[8px] h-[36px] focus:border-[#01893D] focus:ring-[#01893D] text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border"
                    placeholder="your password"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword"
                    class="text-[#827C7B] absolute right-2.5 top-2 bottom-2.5"
                  >
                    <i v-if="show_visible == false" class="fa-solid fa-eye"></i>
                    <i
                      v-else-if="show_visible == true"
                      class="fa-solid fa-eye-slash"
                    ></i>
                  </button>
                </div>

                <!-- <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="your password"
                  :class="
                    form.password != ''
                      ? 'border-[#01893D] border-1'
                      : 'border-[#837D7B] '
                  "
                  class="bg-white rounded-[8px] h-[36px] focus:border-[#01893D] focus:ring-[#01893D] text-sm md:text-base p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border"
                /> -->

                <small
                  v-if="v$.password.$error"
                  class="text-red-500 text-sm float-right"
                  >{{ v$.password.$errors[0].$message }}</small
                >
              </div>
              <div class="text-right mb-4 mt-5">
                <button
                  type="button"
                  @click="$router.push('/forgot_pass')"
                  class="text-sm text-[#01893D] font-mediem"
                >
                  ลืมรหัสผ่าน
                </button>
              </div>
              <div class="flex flex-col justify-center items-center">
                <button
                  type="submit"
                  :disabled="states.isLoading"
                  class="mb-4 w-full h-[36px] font-bold text-sm md:text-base rounded-lg bg-[#01893D] text-white hover:bg-white hover:text-[#01893D]"
                >
                  <span v-if="states.isLoading === false">เข้าสู่ระบบ</span>
                  <span v-if="states.isLoading === true"
                    >กำลังเข้าสู่ระบบ...</span
                  >
                </button>
                <span class="mb-1 font-mediem text-[#302520] text-sm"
                  >ยังไม่มีบัญชี?</span
                >
                <button
                  type="button"
                  @click="$router.push('/register')"
                  class="mb-4 w-full h-[36px] font-bold text-sm md:text-base rounded-lg bg-[#D5E7D9] text-[#01893D] hover:bg-white hover:text-[#01893D]"
                >
                  สมัครสมาชิก
                </button>
                <span class="mb-4 font-mediem opacity-60 text-sm"
                  >หรือเข้าสู่ระบบด้วย</span
                >
                <!-- <div class="flex flex-row">
                  <img
                    class="w-[32px] mr-[16px]"
                    src="@/assets/img/icons/login/apple.svg"
                    alt=""
                  />
                  <img
                    class="w-[32px] ml-[16px]"
                    src="@/assets/img/icons/login/google.svg"
                    alt=""
                  />
                </div> -->
                <googlelogin></googlelogin>
              </div>
            </form>
          </div>
          <!--End Form -->
        </div>
      </div>
    </div>
  </div>

  <!-- Main modal -->
  <div
    id="defaultModal"
    v-if="showModal == true"
    class="flex justify-center fixed top-0 left-0 right-0 z-50 mt-[200px] w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 md:h-full"
  >
    <div class="relative w-full h-full max-w-2xl md:h-auto">
      <!-- Modal content -->
      <div class="relative bg-white rounded-[16px] shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-4 border-b bg-[#01893D] rounded-t-[16px] dark:border-gray-600">
          <h3 class="text-xl font-semibold text-white dark:text-white">
            กรุณายืนยันตัวตน
          </h3>
          <button
            type="button"
            @click="showModal = false"
            class="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <h1>คุณยังไม่ได้ยืนยันตัวตน</h1>
          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            กรุณายืนยันตัวตนด้วยเบอร์โทรศัพท์ หรือ อีเมลก่อนเริ่มใช้งาน
          </p>
        </div>
        <!-- Modal footer -->
        <div
          class="flex justify-center items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button @click="modalClick" type="button"
            class="text-white bg-[#01893D] hover:bg-gray-100 hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">ตกลง</button>
          <button @click="showModal = false" type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">ยกเลิก</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/custom-icons.css";

::placeholder {
  color: rgb(90, 90, 90);
  opacity: 0.5;
  font-weight: 400;
  font-size: 16px;
  text-align: start;
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: rgb(90, 90, 90);
  opacity: 0.5;
  font-weight: 400;
  font-size: 16px;
  text-align: start;
}

::-ms-input-placeholder { /* Microsoft Edge */
  color: rgb(90, 90, 90);
  opacity: 0.5;
  font-weight: 400;
  font-size: 16px;
  text-align: start;
}
</style>
