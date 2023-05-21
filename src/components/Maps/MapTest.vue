<template>
    <GoogleMap api-key="AIzaSyC7fCCI2rmm_sW4hIw_VFdGfp8H_CElkDY" style="width: 100%; height: 555px" :center="center" :zoom="15">
      <Marker :options="{ position: center }" />
    </GoogleMap>
    {{ lat }} {{ lng }}
</template>
  
<script setup>
import { defineComponent, defineProps, reactive } from "vue";
import { ref, watch, computed, onMounted } from 'vue'

import { GoogleMap, Marker } from "vue3-google-map";
const props = defineProps({
  lat: {
    type: String,Number,
    required: true
  },
  lng: {
    type: String,Number,
    required: true
  }
})

console.log('check props', props)

const center = {
    lat: 18.8181031, lng: 98.9651371
}

// const center = onMounted({lat: props.lat, lng: props.lng})
// export default defineComponent({
// components: { GoogleMap, Marker },
// setup() {
//     const props = defineProps(['lat', 'lng'])
//     const center = {
//         lat: props.lat,
//         lng: props.lng
//     }
//     // const center = { lat: 40.689247, lng: -74.044502 };

//     return { center };
// },
// });
</script>
