import { defineStore } from 'pinia'
import axios from 'axios'

export const useMainStore = defineStore('main', {
  state: () => ({
    /* Styles */
    style: '',
    bodyStyle: '',
    lightBorderStyle: '',
    lightBgStyle: '',
    asideStyle: '',
    asideBrandStyle: '',
    asideMenuCloseLgStyle: '',
    asideMenuLabelStyle: '',
    asideMenuItemStyle: '',
    asideMenuItemActiveStyle: '',
    asideMenuItemInactiveStyle: '',
    asideSubmenuListStyle: '',
    navBarItemLabelStyle: '',
    navBarItemLabelHoverStyle: '',
    navBarItemLabelActiveColorStyle: '',
    navBarMenuListUpperLabelStyle: '',
    tableTrStyle: '',
    tableTrOddStyle: '',
    overlayStyle: '',

    /* User */
    userName: null,
    userFirstName: null,
    userLastName: null,
    userProvinceId: null,
    userEmail: null,
    userImage: null,

    /* Customer */
    CustomerId: null,
    CustomerFarmId: null,
    CustomerFarmName: null,
    CustomerFarmImage: null,
    CustomerFarmLat: null,
    CustomerFarmLon: null,
    CustomerProvinceId: null,
    CustomerProvinceName: null,
    CustomerDistrictId: null,
    CustomerDistrictName: null,
    CustomerTemperature: null,

    CustomerAddLat: null,
    CustomerAddLng: null,

    /* fullScreen - fullscreen form layout (e.g. login page) */
    isFullScreen: true,

    /* Aside */
    isAsideMobileExpanded: false,
    isAsideLgActive: false,

    /* Dark mode */
    darkMode: false,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: []
  }),
  persist: true,
  actions: {
    setUser (payload) {
      if (payload.first_name) {
        this.userFirstName = payload.first_name
      }
      if (payload.last_name) {
        this.userLastName = payload.last_name
      }
      if (payload.username) {
        this.userName = payload.username
      }
      if (payload.email) {
        this.userEmail = payload.email
      }
      if (payload.province_id) {
        this.userProvinceId = payload.province_id
      }

      if (payload.uid) {
        this.CustomerId = payload.uid
      }
      if (payload.farmid) {
        this.CustomerFarmId = payload.farmid
      }
      if (payload.farmname) {
        this.CustomerFarmName = payload.farmname
      }

      if (payload.farmimage) {
        this.CustomerFarmImage = payload.farmimage
      }

      if (payload.farmlat) {
        this.CustomerFarmLat = payload.farmlat
      }else{
        this.CustomerFarmLat = ""
      }
      if (payload.farmlon) {
        this.CustomerFarmLon = payload.farmlon
      }else{
        this.CustomerFarmLon = ""
      }
      if (payload.provinceid) {
        this.CustomerProvinceId = payload.provinceid
      }else{
        this.CustomerProvinceId = ""
      }
      if (payload.provincename) {
        this.CustomerProvinceName = payload.provincename
      }else{
        this.CustomerProvinceName = ""
      }
      if (payload.districtid) {
        this.CustomerDistrictId = payload.districtid
      }else{
        this.CustomerDistrictId = ""
      }
      if (payload.districtname) {
        this.CustomerDistrictName = payload.districtname
      }else{
        this.CustomerDistrictName = ""
      }

      if (payload.temperature) {
        this.CustomerTemperature = payload.temperature
      }else{
        this.CustomerTemperature = ""
      }
    },
 
    logout (payload=null) {
        this.userName = null
        this.userEmail = null
        this.CustomerId = null
        this.CustomerFarmId = null
        this.CustomerFarmName = null
        this.CustomerFarmImage = null
        this.CustomerFarmLat = null
        this.CustomerFarmLon = null
        this.CustomerProvinceId = null
        this.CustomerProvinceName = null
        this.CustomerTemperature = null
    },

    setStyle (payload) {
    },

    asideMobileToggle (payload = null) {
      const isShow = payload !== null ? payload : !this.isAsideMobileExpanded

      document.getElementById('app').classList[isShow ? 'add' : 'remove']('ml-60', 'lg:ml-0')

      document.documentElement.classList[isShow ? 'add' : 'remove']('m-clipped')

      this.isAsideMobileExpanded = isShow
    },

    asideLgToggle (payload = null) {
      this.isAsideLgActive = payload !== null ? payload : !this.isAsideLgActive
    },

    fullScreenToggle (payload) {
      this.isFullScreen = payload

      document.documentElement.classList[payload ? 'add' : 'remove']('full-screen')
    },

    setDarkMode (payload = null) {
      const value = payload !== null ? payload : !this.darkMode

      document.documentElement.classList[value ? 'add' : 'remove']('dark')

      this.darkMode = value
    },

    fetch (sampleDataKey) {
      axios
        .get(`data-sources/${sampleDataKey}.json`)
        .then(r => {
          if (r.data && r.data.data) {
            this[sampleDataKey] = r.data.data
          }
        })
        .catch(error => {
          alert(error.message)
        })
    }
  }
})
