import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import gAuthPlugin from 'vue3-google-oauth2';

import App from './App.vue'
import router from './router'
import { useMainStore } from '@/stores/main'
import axios from "axios";
import VueSweetalert2 from 'vue-sweetalert2';
import "@/assets/styles/custom-icons.css";
import 'sweetalert2/dist/sweetalert2.min.css';
import './css/main.css'
const token = localStorage.getItem("astk")

window.ApiMain= axios.create({
  baseURL: import.meta.env.VITE_API_MAIN ,
  headers: {
    'Authorization' : `Bearer `+token
  }
});
window.ApiSso= axios.create({
  baseURL: import.meta.env.VITE_API_SSO ,
  headers: {
    'Authorization' : `Bearer `+token
  }
});
window.ApiCore= axios.create({
  baseURL: import.meta.env.VITE_API_CORE ,
  headers: {
    'Authorization' : `Bearer `+token
  }
});

/* Init Pinia */
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

/* Init GoogleAuth */
let gauthClientId = "253241300698-ccul6ur2qhfls2q7mrab20r9humm0h94.apps.googleusercontent.com";

/* Create Vue app */
const app = createApp(App)
// app.use(gAuthPlugin, { clientId: gauthClientId, scope: 'email', prompt: 'consent', fetch_basic_profile: false , plugin_name: 'farm1'})
app.use(router).use(pinia).use(VueSweetalert2).use(gAuthPlugin, { clientId: gauthClientId, scope: 'email', prompt: 'consent', fetch_basic_profile: false , plugin_name: 'farm12'}).mount('#app')

/* Init Pinia main store */
const mainStore = useMainStore(pinia)

/* Fetch sample data */
//mainStore.fetch('clients')
//mainStore.fetch('history')

/* Default title tag */
const defaultDocumentTitle = 'Axons'

/* Collapse mobile aside menu on route change */
router.beforeEach(to => {
  mainStore.asideMobileToggle(false)
  mainStore.asideLgToggle(false)
})

router.afterEach(to => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }

  /* Full screen mode */
  mainStore.fullScreenToggle(!!to.meta.fullScreen)
})
