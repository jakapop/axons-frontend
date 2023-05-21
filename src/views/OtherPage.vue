

<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import { ref, reactive, onMounted } from 'vue';
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import userdefault from "@/assets/img/icons/user.png";

const mainStore = useMainStore();
const userImage = mainStore.userImage;  //รูปโปรไฟล์
const userName = mainStore.userName;
const router = useRouter();

let user_image = ref(userdefault);

let selectedOpen = ref(false);
let selectedLang = ref("TH");

const states = reactive({
  selectedLangFlag: "thai",
  isLoading: false
});
const logout = () => {
  console.log("logout")
  localStorage.removeItem('astk');
  localStorage.removeItem('userid');
  localStorage.removeItem('main');
  mainStore.userId = null
  window.location.replace("/")
};

onMounted(()=>{
  if(userImage){
    user_image.value = "https://farmworld.farm/api-main/image/"+userImage+"?imageableType=customer"
  }
});

</script>

<template>
  <NavbarMain>
    <div class="m-4 mt-16 md:mt-8">
      <div class="flex flex-row justify-between">
        <div>
          <h1 class="text-[22px] font-bold">อื่น ๆ</h1>
        </div>
        <div>
          <div class="md:ml-auto relative block" v-on:click="selectedOpen = !selectedOpen">
            <div class="flex flex-wrap w-[100px] rounded-[8px] h-9 text-[10px] md:text-base mb-4 relative bg-white items-center"
              style="border: 1px solid #01893D">
              <div class="flex -mr-px justify-center w-15 pl-1">
                <span
                  class="flex items-center leading-normal bg-white border-0 rounded rounded-r-none text-2xl text-gray-600">
                  <img class="inline w-6" style="margin-left: 4px" src="@/assets/img/icons/lang/thai.svg"
                    v-if="states.selectedLangFlag == 'thai'" />
                  <img class="inline w-6" style="margin-left: 4px" src="@/assets/img/icons/lang/eng.svg"
                    v-if="states.selectedLangFlag == 'eng'" />
                  <img class="inline w-6" style="margin-left: 4px" src="@/assets/img/icons/lang/laos.svg"
                    v-if="states.selectedLangFlag == 'laos'" />
                  <img class="inline w-6" style="margin-left: 4px" src="@/assets/img/icons/lang/myanmar.svg"
                    v-if="states.selectedLangFlag == 'myanmar'" />
                </span>
              </div>
              <input type="text" disabled
                class="whitespace-nowrap  overflow-hidden text-[#01893D] flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-[20px] text-sm md:text-base border-grey-light rounded rounded-l-none px-3 pl-2 self-center relative outline-none"
                v-model="selectedLang" />
            </div>
            <img class="flex absolute right-[10px] top-[11px] md:top-3.5 w-3 md:w-4 bg-transparent "
              src="@/assets/img/icons/select-down.svg" alt="" :class="selectedOpen ? 'rotate-180' : ''" />
            <div
              class="absolute shadow bg-white w-[82px] top-[36px] z-40 right-[24px] rounded max-h-select overflow-y-auto border-[#01893D] border-[1px]"
              v-if="selectedOpen == true">
              <div class="flex flex-col">
                <div value="TH" class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                  v-on:click="selectedOpen = !selectedOpen">
                  <div class="flex w-full items-center border-transparent border-l-2 relative hover:border-teal-100"
                    @click="
                      (selectedLang = 'TH'), (selectedOpen = !selectedOpen) , (states.selectedLangFlag = 'thai')
                    ">

                    <div class="w-[82px] items-center flex p-2 pl-0.5">
                      <img class="inline w-6" style="margin-left: 4px" src="@/assets/img/icons/lang/thai.svg" />
                      <div class="mx-2 hover:text-[#9BD226] text-[#01893D] text-[10px] md:text-base">
                        TH
                      </div>
                    </div>
                  </div>
                </div>

                <div value="EN" class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                  v-on:click="selectedOpen = !selectedOpen">
                  <div class="flex w-full items-center border-transparent border-l-2 relative hover:border-teal-100"
                    @click="
                      (selectedLang = 'EN'), (selectedOpen = !selectedOpen) , (states.selectedLangFlag = 'eng')
                    ">

                    <div class="w-[82px] items-center flex p-2 pl-0.5">
                      <img class="inline w-6" style="margin-left: 4px" src="@/assets/img/icons/lang/eng.svg" />
                      <div class="mx-2 hover:text-[#9BD226] text-[#01893D] text-[10px] md:text-base">
                        EN
                      </div>
                    </div>
                  </div>
                </div>

                <div value="LO" class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                  v-on:click="selectedOpen = !selectedOpen">
                  <div class="flex w-full items-center border-transparent border-l-2 relative hover:border-teal-100"
                    @click="
                      (selectedLang = 'LO'), (selectedOpen = !selectedOpen) , (states.selectedLangFlag = 'laos')
                    ">

                    <div class="w-[82px] items-center flex p-2 pl-0.5">
                      <img class="inline w-6" style="margin-left: 4px" src="@/assets/img/icons/lang/laos.svg" />
                      <div class="mx-2 hover:text-[#9BD226] text-[#01893D] text-[10px] md:text-base">
                        LO
                      </div>
                    </div>
                  </div>
                </div>

                <div value="KM" class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                  v-on:click="selectedOpen = !selectedOpen">
                  <div class="flex w-full items-center border-transparent border-l-2 relative hover:border-teal-100"
                    @click="
                      (selectedLang = 'KM'), (selectedOpen = !selectedOpen) , (states.selectedLangFlag = 'myanmar')
                    ">

                    <div class="w-[82px] items-center flex p-2 pl-0.5">
                      <img class="inline w-6" style="margin-left: 4px" src="@/assets/img/icons/lang/myanmar.svg" />
                      <div class="mx-2 hover:text-[#9BD226] text-[#01893D] text-[10px] md:text-base">
                        KM
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3  md:grid-cols-4 lg:grid-cols-5 gap-[5px] md:gap-[8px] items-center py-5">
        <div>
          <router-link to="/personal">
            <div
              class="p-[8px] md:py-5 w-full max-w-sm bg-white rounded-[16px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div class="flex flex-col items-center">
                <img class="mb-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full"
                  :src="user_image" />
                <h5 class="mb-1 text-sm md:text-lg font-medium whitespace-nowrap">ข้อมูลส่วนตัว</h5>
              </div>
            </div>
          </router-link>

        </div>
        <div>
          <!-- Axons : แก้ไข link ช่อง Youtube -->
          <a href="https://www.youtube.com/@axonsofficial9382">
            <div
              class="p-[8px] md:py-5 w-full max-w-sm bg-white rounded-[16px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div class="flex flex-col items-center">
                <img class="mb-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
                  src="../assets/img/OtherPage/video_library.png" />
                <h5 class="mb-1 text-sm md:text-lg font-medium whitespace-nowrap">วิดีโอ</h5>
              </div>
            </div>
          </a>

        </div>
        <div>
           <!-- Axons : แก้ไข link ช่อง Facebook -->
          <a href="https://www.facebook.com/AXONSofficial">
            <div
              class="p-[8px] md:py-5 w-full max-w-sm bg-white rounded-[16px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div class="flex flex-col items-center">
                <img class="mb-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
                  src="../assets/img/OtherPage/newspaper.png" />
                <h5 class="mb-1 text-sm md:text-lg font-medium whitespace-nowrap">ข่าวสาร</h5>
              </div>
            </div>
          </a>

        </div>

        <div>
          <router-link to="/insurance-products">
            <div
              class="p-[8px] md:py-5 w-full max-w-sm bg-white rounded-[16px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div class="flex flex-col items-center">
                <img class="mb-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]" src="../assets/img/OtherPage/verified_userinsurance.svg" />
                <h5 class="mb-1 text-sm md:text-lg font-medium whitespace-nowrap">การรับประกัน</h5>
              </div>
            </div>
          </router-link>
        </div>

        <div>
          <router-link to="/contact">
            <div
              class="p-[8px] md:py-5 w-full max-w-sm bg-white rounded-[16px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div class="flex flex-col items-center">
                <img class="mb-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
                  src="../assets/img/OtherPage/support_agent.png" />
                <h5 class="mb-1 text-sm md:text-lg font-medium whitespace-nowrap">ติดต่อเรา</h5>
              </div>
            </div>
          </router-link>
        </div>
        <div>
          <button class="w-full" @click="logout()">
            <div
              class="p-[8px] md:py-5 w-full max-w-sm bg-white rounded-[16px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div class="flex flex-col items-center">
                <img class="mb-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]" src="../assets/img/OtherPage/logout.png" />
                <h5 class="mb-1 text-sm md:text-lg font-medium whitespace-nowrap">ออกจากระบบ</h5>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </NavbarMain>

</template>


<style>

</style>
