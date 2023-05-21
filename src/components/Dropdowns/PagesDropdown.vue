<template>
  <div>
    <a
      class="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-base uppercase font-bold"
      href="#pablo"
      ref="btnDropdownRef"
    >
      ช้อมูลสมาชิก [{{userName}}]
    </a>
    <div
      ref="popoverDropdownRef"
      class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
    >
      <router-link
        to="/change_pass"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        เปลี่ยนรหัสผ่าน
      </router-link>

      <router-link to="/">
      <a
        v-on:click="logout()"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        ออกจากระบบ
      </a>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
const mainStore = useMainStore();
const userName = mainStore.userName
const router = useRouter();

const logout = () => {
  console.log("logout")
  localStorage.removeItem('astk');
  localStorage.removeItem('userid');
  localStorage.removeItem('main');
  mainStore.CustomerId = null
  window.location.replace("/")
};
</script>
