<script setup>
import { onBeforeMount } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";

const mainStore = useMainStore();
const CustomerId = mainStore.CustomerId;
const router = useRouter();
//mainStore.setDarkMode(true)
onBeforeMount(() => {
  if (localStorage.getItem("astk") !== null && CustomerId !== null) {
      ApiSso.get("/api/auth/profile")
      .then((data) => {
        //console.log("auth true")
      }).catch((error) => {
        localStorage.removeItem('astk');
        mainStore.CustomerId = null
        router.push("/");
      });
  } else {
    let URL = window.location.href;
    let pagename = URL.split("/");
    if (pagename[3].search("insurance-product") >= 0 || pagename[3].search("register") >= 0 || pagename[3].search("change_pass") >= 0 || pagename[3].search("forgot_pass") >= 0 || pagename[3].search("register2") >= 0 || pagename[3].search("otp") >= 0 ||pagename[3].search("vertify-account") >= 0) {
    }else{
      router.push("/");
    }
  }
});
</script>

<template>
  <router-view />
</template>
