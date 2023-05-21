import { createRouter, createWebHistory } from 'vue-router'

const routes = [

  {
    meta: {
      title: "InsuranceProducts",
    },
    path: "/insurance-products",
    name: "InsuranceProducts",
    component: () => import('@/views/InsuranceProducts.vue')
  },
  {
    meta: {
      title: "LandingPage",
    },
    path: "/",
    name: "LandingPage",
    component: () => import('@/views/LandingPage.vue')
  },
  {
    meta: {
      title: 'Login',
      fullScreen: true
    },
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    meta: {
      title: 'Register',
      fullScreen: true
    },
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue')
  },
  {
    meta: {
      title: 'Register2',
      fullScreen: true
    },
    path: '/register2',
    name: 'register2',
    component: () => import('@/views/Register2.vue')
  },
  {
    meta: {
      title: 'ForgotPassWord',
      fullScreen: true
    },
    path: '/forgot_pass',
    name: 'ForgotPassWord',
    component: () => import('@/views/ForgotPassWord.vue')
  },
  {
    meta: {
      title: 'ForgotPassWord',
      fullScreen: true
    },
    path: '/set_newpassword',
    name: 'SetNewPassword',
    component: () => import('@/views/SetNewPassword.vue')
  },
  {
    meta: {
      title: 'Dashboard',
      fullScreen: true
    },
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    meta: {
      title: 'SensorChart',
      fullScreen: true
    },
    path: '/sensorChart',
    name: 'SensorChart',
    component: () => import('@/views/SensorChart.vue')
  },
  {
    meta: {
      title: 'Climate',
      fullScreen: true
    },
    path: '/climate',
    name: 'Climate',
    component: () => import('@/views/Climate.vue')
  },
  {
    meta: {
      title: 'ExportExcel',
      fullScreen: true
    },
    path: '/exportExcel',
    name: 'ExportExcel',
    component: () => import('@/views/ExportExcel.vue')
  },
  {
    meta: {
      title: 'AddBoard',
      fullScreen: true
    },
    path: '/addBoard',
    name: 'AddBoard',
    component: () => import('@/views/AddBoard.vue')
  },
  {
    meta: {
      title: 'EditBoard',
      fullScreen: true
    },
    path: '/editBoard',
    name: 'EditBoard',
    component: () => import('@/views/EditBoard.vue')
  },
  {
    meta: {
      title: 'Home',
      fullScreen: true
    },
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    meta: {
      title: 'ActivityManage',
      fullScreen: true
    },
    path: '/activity-manage',
    name: 'ActivityManage',
    component: () => import('../components/ComponentHome/ActivityManage.vue')
  },
  {
    meta: {
      title: 'ViewActivity',
      fullScreen: true
    },
    path: '/viewActivity',
    name: 'ViewActivity',
    component: () => import('@/views/ViewActivity.vue')
  },
  {
    meta: {
      title: 'SelectBoard',
      fullScreen: true
    },
    path: '/selectBoard',
    name: 'SelectBoard',
    component: () => import('@/views/SelectBoard.vue')
  },
  {
    meta: {
      title: 'DeviceList',
      fullScreen: true
    },
    path: '/device-list',
    name: 'DeviceList',
    component: () => import('@/views/device/DeviceList.vue')
  },
  {
    meta: {
      title: 'AddDevice',
      fullScreen: true
    },
    path: '/add-device',
    name: 'AddDevice',
    component: () => import('@/views/device/AddDevice.vue')
  },
  {
    meta: {
      title: 'ControlDevice',
      fullScreen: true
    },
    path: '/device-control',
    name: 'ControlDevice',
    component: () => import('@/views/device/ControlDevice.vue')
  },
  {
    meta: {
      title: 'HistoryDevice',
      fullScreen: true
    },
    path: '/history-device',
    name: 'HistoryDevice',
    component: () => import('@/views/device/HistoryDevice.vue')
  },
  {
    meta: {
      title: 'Geography',
      fullScreen: true
    },
    path: '/geography',
    name: 'Geography',
    component: () => import('@/views/Geography.vue')
  },
  {
    meta: {
      title: 'ManageFarm',
      fullScreen: true
    },
    path: '/manageFarm',
    name: 'ManageFarm',
    component: () => import('@/views/ManageFarm.vue')
  },
  {
    meta: {
      title: 'AddFarm',
      fullScreen: true
    },
    path: '/addFarm',
    name: 'AddFarm',
    component: () => import('@/views/AddFarm.vue')
  },
  {
    meta: {
      title: 'OtherPage',
      fullScreen: true
    },
    path: '/other',
    name: 'OtherPage',
    component: () => import('@/views/OtherPage.vue')
  },
  {
    meta: {
      title: 'Personal',
      fullScreen: true
    },
    path: '/personal',
    name: 'Personal',
    component: () => import('@/views/Personal.vue')
  },
  {
    meta: {
      title: 'EditPersonal',
      fullScreen: true
    },
    path: '/edit-personal',
    name: 'EditPersonal',
    component: () => import('@/views/EditPersonal.vue')
  },
  {
    meta: {
      title: 'Contact',
      fullScreen: true
    },
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue')
  },
  {
    meta: {
      title: 'Market',
      fullScreen: true
    },
    path: '/market',
    name: 'Market',
    component: () => import('@/views/Market.vue')
  },
  {
    meta: {
      title: 'MarketDetail',
      fullScreen: true
    },
    path: '/market-detail',
    name: 'MarketDetail',
    component: () => import('@/views/MarketDetail.vue')
  },
  {
    meta: {
      title: 'Otp',
      fullScreen: true
    },
    path: '/otp',
    name: 'Otp',
    component: () => import('@/views/Otp.vue')
  },
  {
    meta: {
      title: 'VertifyEmail',
      fullScreen: true
    },
    path: '/vertify-email',
    name: 'VertifyEmail',
    component: () => import('@/views/VertifyEmail.vue')
  },
  {
    meta: {
      title: 'VertifyAccount',
      fullScreen: true
    },
    path: '/vertify-account',
    name: 'VertifyAccount',
    component: () => import('@/views/VertifyAccount.vue')
  },
  {
    meta: {
      title: 'Calculation',
      fullScreen: true
    },
    path: '/calculate',
    name: 'Calculate',
    component: () => import('@/views/Calculation.vue')
  },
  {
    meta: {
      title: 'CalculationDetail',
      fullScreen: true
    },
    path: '/calulation-detail',
    name: 'CalculationDetail',
    component: () => import('@/views/CalculationDetail.vue')
  },
  {
    meta: {
      title: 'CalculationResult',
      fullScreen: true
    },
    path: '/calculation-result',
    name: 'CalculationResult',
    component: () => import('@/views/CalculationResult.vue')
  },

  {
    path: '/:catchAll(.*)',
    redirect:'/home'
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
