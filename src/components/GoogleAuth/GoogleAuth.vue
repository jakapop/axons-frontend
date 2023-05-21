<script>

import axios from "axios";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";

const mainStore = useMainStore();
const router = useRouter();

export default {
  name: "GoogleAuth",
  data() {
    return {
      user: "",
    };
  },

  methods: {
    async handleClickSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn();
        if (!googleUser) {
          return null;
        }
        console.log("googleUser", googleUser);
        this.user = googleUser.getBasicProfile().getEmail(); //email
        //console.log("getId", this.user);
        //console.log("getBasicProfile", googleUser.getBasicProfile());
        console.log("", googleUser.getAuthResponse().id_token);
        const id_token = googleUser.getAuthResponse().id_token;
        const user_email = this.user;
        ApiMain.post("/uaa/login/social", {
          token: id_token,
          provider: "google",
          grantType: "social",
        })
          .then((data_uaa) => {
            //console.log(data_uaa)
            if (data_uaa.data.status == 200) {
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
                      console.log(response.data.status);
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
                  router.push("/");
                });
            } else {
              
            }
          })
          .catch((error) => {
            router.push("/");
          });
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }
};
</script>
<template>
  <div>
    <div class="flex flex-row">
      <!-- <img
        class="w-[32px] mr-[16px]"
        src="@/assets/img/icons/login/apple.svg"
        alt=""
      /> -->
      <router-link to="" @click="handleClickSignIn"
        ><img
          class="w-[32px] ml-[16px]"
          src="@/assets/img/icons/login/google.svg"
          alt=""
      /></router-link>
    </div>
  </div>
</template>
