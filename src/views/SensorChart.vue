<script setup>
import { ref, reactive, onMounted } from "vue";

import Chart from "chart.js/auto";
import NavbarMain from "../layouts/NavbarMain.vue";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";
import moment from "moment-with-locales-es6";
import { useMainStore } from "@/stores/main";


const mainStore = useMainStore();
const daynow = moment().locale('th').format('D');
const monthnow = moment().locale('th').format('MMMM');
const year = moment().locale('th').format('YYYY');
const yearnow = parseInt(year) + 543;
const url = new URL(window.location.href);
let state = reactive({
  serial: url.searchParams.get("board"),
  sensor_id: url.searchParams.get("sid"),
  board_name: '',
  sensor_name_th: "",
  sensor_name_en: "",
  sensor_unit_th: "",
  sensor_unit_en: "",
  avg_all: 0,
  avg_max: 0,
  avg_min: 0,
});


// setActive button
let active_btn = ref(1);


const setActive = (status) => {
  if (status == 1) {
    active_btn.value = 1;
    // location.href = "#hour";
  }
  else if (status == 2) {
    active_btn.value = 2;
    // location.href = "#day";
  }
  else if (status == 3) {
    active_btn.value = 3;
    // location.href = "#month";
  }
  else if (status == 4) {
    active_btn.value = 4;
    // location.href = "#year";
  }
};



onMounted(() => {
  ApiCore.get("/v2/projects/" + mainStore.CustomerFarmId + "/boards/" + state.serial).then((response) => {

    console.log(response);

    if (typeof response.data.data[0] !== 'undefined') {
      state.board_name = response.data.data[0].name
    }
    let board_name = document.querySelector("#board_name");
    board_name.classList.remove("hidden");
  });
  // setup
  let tabsContainer = document.querySelector("#tabs");
  let tabTogglers = tabsContainer.querySelectorAll("#tabs a");
  //console.log(tabTogglers);
  //console.log(tabsContainer);
  tabTogglers.forEach(function (toggler) {
    toggler.addEventListener("click", function (e) {
      e.preventDefault();

      let tabName = this.getAttribute("href");
      console.log(tabName);
      let tabContents = document.querySelector("#tab-contents");

      if (tabName == "#day") {
        get_report("report-day");

      }
      else if (tabName == "#hour") {
        get_report("report-hour");
      }
      else if (tabName == "#month") {
        get_report("report-month");
      }

      for (let i = 0; i < tabContents.children.length; i++) {
        tabTogglers[i].parentElement.classList.remove(
          "bg-white",
          "text-white"
        );
        tabContents.children[i].classList.remove("hidden");

        if ("#" + tabContents.children[i].id === tabName) {
          continue;
        }
        tabContents.children[i].classList.add("hidden");
      }
      e.target.parentElement.classList.add(
        "bg-white",
        "text-white"
      );
    });
  });

  ApiCore.get("/v2/sensors/" + state.sensor_id).then((response) => {

    console.log("sensor == ", response);

    state.sensor_name_th = response.data.data.name.th;
    state.sensor_name_en = response.data.data.name.en;
    state.sensor_unit_th = response.data.data.unit.th;
    state.sensor_unit_en = response.data.data.unit.en;

    get_report("report-hour");
    // get_report("report-day");
    // get_report("report-month");
    // get_report("report-year");
  });
  // setup
});

const toMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('th-TH', {
    month: 'long',
  });
}


const get_report = (period) => {


  ApiCore.get(
    "/v2/boards/" + state.serial + "/sensor/" + state.sensor_id + "/" + period
  ).then((response) => {
    const report_data = response.data.data;

    console.log('report data ==',report_data);

    let max = 0;
    let min = 0;

    const month = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    let labels = [];
    let datapoints = [];
    let data_avg = [];
    if(period == "report-hour"){
      for (let i = 0; i <= 24; i++) {
        labels.push(i);
      }
    }else if (period == "report-day") {
      const currentMonth = moment().month(); 
      // จำนวนวันที่อยู่ในเดือน
      const numberOfDays = moment().month(currentMonth).daysInMonth();
      for (let i = 1; i <= numberOfDays; i++) {
        let chart_data = report_data.filter(item=>item.day==i) ;
        console.log('ค่าที่ตรงกับวันที่ : '+i,chart_data[0]);

        if(chart_data[0] != undefined){
          datapoints.push(chart_data[0].avg);
          data_avg.push(chart_data[0].avg);
        }else{
          datapoints.push('0');
          data_avg.push('0');
        }
        labels.push(i);
      }


    }else if (period == "report-month") {
      
      for (let i = 0; i <= month.length; i++) {
        let ele = month[i] ;
        labels.push(ele);

        let filteredData = report_data.filter(obj => new Date(obj.event_time).getMonth() === i+1);
        console.log(filteredData);

        if(filteredData.length == 0){
          datapoints.push('0');

        }
        else{
          datapoints.push(filteredData[0].avg);
        }
      }
      
      // report_data.filter(item=>item.event_time==i) ;
    }

    Object.entries(report_data).forEach(([key, val]) => {
      if(period != "report-day"){
        datapoints.push(val.avg);
        data_avg.push(val.avg);
      }
      else if(period == "report-year"){
        labels.push(val.year);
      }
    });
    if(period == "report-day"){
      const filteredArray =  datapoints.filter(value => value !== '0') ;
      max = Math.max(...filteredArray);
      min = Math.min(...filteredArray);
    }else { 
      
      if((max !=  -Infinity || max != Infinity) || (min !=  -Infinity || min != Infinity)  ){
        max = Math.max(...datapoints);
        min = Math.min(...datapoints);
      }else{
        max = 0;
        min = 0 ;
      }
    }

    console.log('datapoints == ',datapoints);
    console.log('data_avg == ',data_avg);

    const bgc = [];
    const copydatapoints = [...datapoints];
    
    

    //ค่าเฉลี่ย
    let sum = data_avg.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    let avg = sum / data_avg.length || 0;
    state.avg_all = Math.floor(avg); 

    state.avg_max = max.toFixed(1); //ค่าสูงสุด
    state.avg_min = min.toFixed(1); //ค่าต่ำสุด
    if((state.avg_max ==  -Infinity || state.avg_max == Infinity) || (state.avg_min ==  -Infinity || state.avg_min == Infinity)  ){
      state.avg_max = 0;
      state.avg_min = 0 ;
    }

    console.log('max == ',max,'min == ',min);
    console.log('state.avg_max',state.avg_max);

    
    
  
    const highestValueColor = datapoints.map((datapoint, index) => {
      console.log('index='+index + ' || '+max+'=='+datapoint);
      const color = datapoint == max ? "#074E9F" : "#01893D";
      bgc.push(color);
      if (max == datapoint) {
        copydatapoints.splice(index, 1, 0);
      }
    });
    
    const lowerValueColor = datapoints.map((datapoint, index) => {
      
      if (min == datapoint) {
        bgc.splice(index, 1, "#0086C9");
      }
    });

    // ส่วนของข้อมูลในกราฟ
    const data = {
      labels: labels,
      datasets: [
        {
          label: state.sensor_name_th,
          data: datapoints,
          backgroundColor: bgc,
          fill: true,
          tension: 0.1,
          borderRadius: 10,
        },
      ],
    };

    // แสดงกราฟ
    const config = {
      type: 'bar',
      data,
      options: {
        layout: {
          padding: 20
        },
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            beginAtZero: true,
            font: {
              weight: 'bold',
              family: 'IBM Plex Sans Thai'
            },
            grid: {
              display: false,
            },
            title: {
              display: true,
              // text: 'วันที่',
              font: {
                weight: 'bold',
                family: 'IBM Plex Sans Thai',
              }
            }
          },
        },
        plugins: {
          // tooltip: {
          //     enabled : true
          // },
          legend: {
            display: false,
          }
        },
        responsive: true,
        maintainAspectRatio: false
      },
      //   plugins: [alwaysShowTootip]
    };

    // render init block
    // Chart.defaults.font.size = 22;
    try {
      let hourChart = new Chart(document.getElementById(period), config);
    } catch (e) {
    }

  });
};


const getDirection = (degrees)=>{

  console.log('degrees == ',degrees);
  if (degrees >= 337.5 || degrees < 22.5) {
    return " ( N )";
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return " ( NE )";
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return " (E)";
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return " ( SE )";
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return " ( S )";
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return " (SW)";
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return " ( W )";
  } else if (degrees >= 292.5 && degrees < 337.5) {
    return " (NW)";
  } else {
    return "Invalid degrees";
  }

};


const check_pH = (pH) => {
  
  if (pH < 3.5) {
    return 'กรดรุนแรงที่สุด';
  } else if (pH >= 3.5 && pH <= 4.5) {
    return 'กรดรุนแรงมาก';
  } else if (pH >= 4.6 && pH <= 5.0) {
    return 'กรดจัดมาก';
  } else if (pH >= 5.1 && pH <= 5.5) {
    return 'กรดจัด';
  } else if (pH >= 5.6 && pH <= 6.0) {
    return 'กรดปานกลาง';
  } else if (pH >= 6.1 && pH <= 6.5) {
    return 'กรดเล็กน้อย';
  } else if (pH >= 6.6 && pH <= 7.3) {
    return 'เป็นกลาง';
  } else if (pH >= 7.4 && pH <= 7.8) {
    return 'ด่างเล็กน้อย';
  } else if (pH >= 7.9 && pH <= 8.4) {
    return 'ด่างปานกลาง';
  } else if (pH >= 8.5 && pH <= 9.0) {
    return 'ด่างจัด';
  } else if (pH > 9.0) {
    return 'ด่างจัดมาก';
  } else {
    return '';
  }
};



const obj_graph = [
  {id:'hour',unit:'ชั่วโมง'},
  {id:'day',unit:'วันที่'},
  {id:'month',unit:'เดือน'},
  {id:'year',unit:'ปี'},
];
</script>

<template>
  <NavbarMain>
    <HeaderFarm />
    <div class="bg-white">
      <div class="px-4 pt-4 mb-2 bg-[#F3F2F0] rounded-t-[16px] md:rounded-[0px]">
        <div class="flex flex-col justify-center md:flex-row md:justify-between">
          <h1 class="text-[22px] font-bold mb-2">ข้อมูลจากเซนเซอร์</h1>
          <h5 id="board_name" class="text-[22px] font-medium hidden">
            <span v-if="state.board_name">{{ state.board_name }}</span>
            <span v-else>{{ state.serial }}</span>
          </h5>
        </div>
        <div class="py-4 rounded-[16px] bg-[#fff]">
          <div class="font-bold text-[12px] md:text-lg xl:text-2xl mb-2 ml-1 md:ml-[12px]">
            <img class="inline w-6 md:w-10 xl:w-16" style="margin-left: 4px" :src="`img/sensor/${state.sensor_id}.png`"
              alt="" />
            {{ state.sensor_name_th }}
          </div>
          <div class="w-full mt-4">
            <div class="flex flex-row text-center pt-2 px-2 md:px-8">
              <div id="tabs" class="inline-flex w-full items-center justify-between gap-2">
                <a id="default-tab" href="#hour" @click="setActive(1)" :class="{ active: active_btn == 1 }"
                  class="text-[#837D7B] w-full py-1.5 px-4 rounded-lg cursor-pointer bg-[#F3F2F0]">
                  ชั่วโมง
                </a>
                <a href="#day" @click="setActive(2)" :class="{ active: active_btn == 2 }"
                  class=" text-[#837D7B] w-full py-1.5 px-4 rounded-lg cursor-pointer bg-[#F3F2F0]">
                  วัน
                </a>
                <a href="#month" @click="setActive(3)" :class="{ active: active_btn == 3 }"
                  class=" text-[#837D7B] w-full py-1.5 px-4 rounded-lg cursor-pointer bg-[#F3F2F0]">
                  เดือน
                </a>
                <a href="#year" @click="setActive(4)" :class="{ active: active_btn == 4 }"
                  class=" text-[#837D7B] w-full py-1.5 px-4 rounded-lg cursor-pointer bg-[#F3F2F0]">
                  ปี
                </a>
              </div>
            </div>
            <div id="tab-contents">

              <div id="hour">
                <div class="flex flex-row px-2 md:px-8 mt-2">
                  <div class=" w-full md:w-3/5">
                    <p class="text-[10px] sm:text-xs md:text-lg font-medium w-cus">ข้อมูล : <span class="text-[#01893D]">วันที่ {{ daynow }} เดือน{{ monthnow }} พ.ศ.{{ yearnow }}</span> </p>
                    <p class="text-[10px] sm:text-xs md:text-lg font-medium">
                      ค่าเฉลี่ย : {{ state.avg_all }}
                      <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                      <span v-else-if="state.sensor_name_th =='ทิศทางลม'">{{ state.sensor_unit_en }} {{ getDirection(state.avg_max) }}  </span>
                      <span v-else-if="state.sensor_name_th =='pH ในดิน'"  > ( {{ check_pH(state.avg_all) }} ) </span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">uW/<span>cm<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'mW/m2'">uW/<span>m<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                      <span v-else>{{ state.sensor_unit_en  }} </span>
                    </p>
                  </div>
                  <div class="w-full  md:w-2/5 flex flex-row justify-end">
                    <div >
                      <div class="flex flex-row items-center gap-1 md:gap-2">
                        <div class="bg-[#074E9F] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs md:text-lg lg:text-lg font-medium">ค่าสูงสุด : {{ state.avg_max }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      <div>
                        <div class="flex flex-row items-center gap-1 md:gap-2 mt-1">
                        <div class="bg-[#0086C9] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs md:text-lg lg:text-lg font-medium">ค่าต่ำสุด : {{ state.avg_min }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p class="text-xs md:text-lg font-medium pt-2 px-2 md:px-8 mt-4">
                  <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5'">{{ state.sensor_unit_th }} ( µg /<span>m<sup>3</sup></span> )</span>
                      <span v-else-if="state.sensor_name_th =='pH ในดิน'" >ความเป็นกรดด่าง (pH)</span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">{{ state.sensor_unit_th }} (μW/<span>cm<sup>2</sup>)</span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/m2'">{{ state.sensor_unit_th }} (μW/<span>m<sup>2</sup>)</span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">{{ state.sensor_unit_th }} (μmol/<span>m<sup>2</sup></span>/s)</span>
                      <span v-else>{{state.sensor_unit_th }} ( {{ state.sensor_unit_en  }} ) </span>
                </p>
                <div class="chart-container" style="position: relative; height:290px; width:100%">
                  <canvas id="report-hour"></canvas>
                </div>
                <p class="text-xs md:text-lg font-medium pt-2 px-2 md:px-8 text-center -mt-8">
                  ชั่วโมง
                </p>
              </div>
              <div id="day" class="hidden">
                <!-- <div class="grid grid-cols-3 gap-2 pt-2 px-2 md:px-8">
                  <div class="col-span-2 text-[10px] sm:text-xs  md:text-lg font-medium my-auto">
                    <p>ข้อมูล :<span class="text-[#01893D]">เดือน{{ monthnow }} พ.ศ.{{ yearnow }}</span> </p>
                    <p>
                      ค่าเฉลี่ย : {{ state.avg_all }}
                      <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                      <span v-else-if="state.sensor_name_th =='ทิศทางลม'">{{ state.sensor_unit_en }} {{ getDirection(state.avg_max) }} </span>
                      <span v-else-if="state.sensor_name_th =='pH ในดิน'"  > ( {{ check_pH(state.avg_all) }} ) </span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                      <span v-else>{{ state.sensor_unit_en  }} </span>
                    </p>
                  </div>
                  <div class="flex flex-row justify-end">
                    <div >
                      <div class="flex flex-row items-center gap-1 md:gap-2">
                        <div class="bg-[#074E9F] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs md:text-md lg:text-lg font-medium">ค่าสูงสุด : {{ state.avg_max }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      <div>
                        <div class="flex flex-row items-center gap-1 md:gap-2">
                        <div class="bg-[#0086C9] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs md:text-md lg:text-lg font-medium">ค่าต่ำสุด : {{ state.avg_min }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      </div>
                    </div>
                  </div>
                </div> -->
                <div class="flex flex-row px-2 md:px-8 mt-2">
                  <div class=" w-full md:w-3/5">
                    <p class="text-[10px] sm:text-xs md:text-lg font-medium w-cus">ข้อมูล : <span class="text-[#01893D]">วันที่ {{ daynow }} เดือน{{ monthnow }} พ.ศ.{{ yearnow }}</span> </p>
                    <p class="text-[10px] sm:text-xs md:text-lg font-medium">
                      ค่าเฉลี่ย : {{ state.avg_all }}
                      <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                      <span v-else-if="state.sensor_name_th =='ทิศทางลม'">{{ state.sensor_unit_en }} {{ getDirection(state.avg_max) }}  </span>
                      <span v-else-if="state.sensor_name_th =='pH ในดิน'"  > ( {{ check_pH(state.avg_all) }} ) </span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">uW/<span>cm<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'mW/m2'">uW/<span>m<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                      <span v-else>{{ state.sensor_unit_en  }} </span>
                    </p>
                  </div>
                  <div class="w-full  md:w-2/5 flex flex-row justify-end">
                    <div >
                      <div class="flex flex-row items-center gap-1 md:gap-2">
                        <div class="bg-[#074E9F] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs md:text-lg lg:text-lg font-medium">ค่าสูงสุด : {{ state.avg_max }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      <div>
                        <div class="flex flex-row items-center gap-1 md:gap-2 mt-1">
                        <div class="bg-[#0086C9] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs md:text-lg lg:text-lg font-medium">ค่าต่ำสุด : {{ state.avg_min }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-xs md:text-lg font-medium pt-2 px-2 md:px-8 mt-4">
                  <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5'">{{ state.sensor_unit_th }} ( µg /<span>m<sup>3</sup></span> )</span>
                      <span v-else-if="state.sensor_name_th =='pH ในดิน'" >ความเป็นกรดด่าง (pH)</span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">{{ state.sensor_unit_th }} (μW/<span>cm<sup>2</sup>)</span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/m2'">{{ state.sensor_unit_th }} (μW/<span>m<sup>2</sup>)</span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">{{ state.sensor_unit_th }} (μmol/<span>m<sup>2</sup></span>/s)</span>
                      <span v-else>{{state.sensor_unit_th }} ( {{ state.sensor_unit_en  }} ) </span>
                </p>
                <div class="chart-container" style="position: relative; height:290px; width:100%">
                  <canvas id="report-day"></canvas>
                </div>
                <p class="text-xs md:text-lg font-medium pt-2 px-2 md:px-8 text-center -mt-8">
                  วันที่
                </p>
              </div>
              <div id="month" class="hidden">
                <div class="grid grid-cols-3 gap-2 pt-2 px-2 md:px-8">
                  <div class="col-span-2 text-[10px] sm:text-xs md:text-lg font-medium my-auto ">
                    <p>ข้อมูล : <span class="text-[#01893D] ">พ.ศ. {{ yearnow }}</span> </p>
                    <p>
                      ค่าเฉลี่ย : {{ state.avg_all }}
                      <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                      <span v-else-if="state.sensor_name_th =='ทิศทางลม'">{{ state.sensor_unit_en }} {{ getDirection(state.avg_max) }} </span>
                      <span v-else-if="state.sensor_name_th =='pH ในดิน'"  > ( {{ check_pH(state.avg_all) }} ) </span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                      <span v-else>{{ state.sensor_unit_en  }} </span>
                    </p>
                  </div>
                  <div class="flex flex-row justify-end">
                    <div >
                      <div class="flex flex-row items-center gap-1 md:gap-2">
                        <div class="bg-[#074E9F] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs md:text-lg lg:text-lg font-medium">ค่าสูงสุด : {{ state.avg_max }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      <div>
                        <div class="flex flex-row items-center gap-1 md:gap-2">
                        <div class="bg-[#0086C9] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs  md:text-lg lg:text-lg font-medium">ค่าต่ำสุด : {{ state.avg_min }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-xs md:text-lg font-medium pt-2 px-2 md:px-8 mt-4">
                  <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5'">{{ state.sensor_unit_th }} ( µg /<span>m<sup>3</sup></span> )</span>
                      <span v-else-if="state.sensor_name_th =='pH ในดิน'" >ความเป็นกรดด่าง (pH)</span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">{{ state.sensor_unit_th }} (μW/<span>cm<sup>2</sup>)</span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/m2'">{{ state.sensor_unit_th }} (μW/<span>m<sup>2</sup>)</span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">{{ state.sensor_unit_th }} (μmol/<span>m<sup>2</sup></span>/s)</span>
                      <span v-else>{{state.sensor_unit_th }} ( {{ state.sensor_unit_en  }} ) </span>
                </p>
                <div class="chart-container" style="position: relative; height:290px; width:100%">
                  <canvas id="report-month"></canvas>
                </div>
                <p class="text-xs md:text-lg font-medium pt-2 px-2 md:px-8 text-center -mt-8">
                  เดือน
                </p>
              </div>
              <div id="year" class="hidden">
                <div class="grid grid-cols-3 gap-2 pt-2 px-2 md:px-8">
                  <div class="col-span-2 text-[10px] sm:text-xs md:text-lg font-medium my-auto ">
                    <p>ข้อมูล : <span class="text-[#01893D]">พ.ศ. {{ yearnow }}</span> </p>
                    <p>
                      ค่าเฉลี่ย : {{ state.avg_all }}
                      <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                      <span v-else-if="state.sensor_name_th =='ทิศทางลม'">{{ state.sensor_unit_en }} {{ getDirection(state.avg_max) }} </span>
                      <span v-else-if="state.sensor_name_th =='pH ในดิน'"  > ( {{ check_pH(state.avg_all) }} ) </span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                      <span v-else>{{ state.sensor_unit_en  }} </span>
                    </p>
                  </div>
                  <div class="flex flex-row justify-end">
                    <div >
                      <div class="flex flex-row items-center gap-1 md:gap-2">
                        <div class="bg-[#074E9F] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs  md:text-lg lg:text-lg font-medium">ค่าสูงสุด : {{ state.avg_max }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      <div>
                        <div class="flex flex-row items-center gap-1 md:gap-2">
                        <div class="bg-[#0086C9] w-[15px] md:w-[30px] h-[10px] md:h-[16px]"></div> 
                        <p class="w-full truncate text-[10px] sm:text-xs md:text-lg lg:text-lg font-medium">ค่าต่ำสุด : {{ state.avg_min }}
                          <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5' && state.sensor_unit_en == 'µg/m3'">µg /<span>m<sup>3</sup></span></span>
                          <span v-else-if="state.sensor_name_th =='ทิศทางลม'" >{{ state.sensor_unit_en }}</span>
                          <span v-else-if="state.sensor_name_th =='pH ในดิน'"  ></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">μW/<span>cm<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μW/m2'">μW/<span>m<sup>2</sup></span></span>
                          <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">μmol/<span>m<sup>2</sup></span>/s</span>
                          <span v-else>{{ state.sensor_unit_en  }} </span>
                        </p>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-xs md:text-lg font-medium pt-2 px-2 md:px-8 mt-4">
                  <span v-if="state.sensor_name_th=='ฝุ่น PM 2.5'">{{ state.sensor_unit_th }} ( µg /<span>m<sup>3</sup></span> )</span>
                      <span v-else-if="state.sensor_name_th =='pH ในดิน'" >ความเป็นกรดด่าง (pH)</span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/cm2'">{{ state.sensor_unit_th }} (μW/<span>cm<sup>2</sup>)</span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μW/m2'">{{ state.sensor_unit_th }} (μW/<span>m<sup>2</sup>)</span></span>
                      <span v-else-if="state.sensor_unit_en  == 'μmol/m2/s'">{{ state.sensor_unit_th }} (μmol/<span>m<sup>2</sup></span>/s)</span>
                      <span v-else>{{state.sensor_unit_th }} ( {{ state.sensor_unit_en  }} ) </span>
                </p>
                <div class="chart-container" style="position: relative; height:290px; width:100%">
                  <canvas id="report-year"></canvas>
                </div>
                <p class="text-xs md:text-lg font-medium pt-2 px-2 md:px-8 text-center -mt-8">
                  ปี
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </NavbarMain>
</template>

<style scoped>
@import "@/assets/styles/custom-icons.css";

input:checked~.dot {
  transform: translateX(100%);
  background-color: #48bb78;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 1;
  display: block;
  background: url(@/assets/img/icons/calendar_month.png) no-repeat center;
  width: 20px;
  height: 20px;
  border-width: thin;
}

.header-img {
  background-image: url("@/assets/img/img_landingpage/bg-device.png");
}


.active {
  background-color: #01893D;
  color: white;
}

@media screen and (max-width: 364px) {
  .w-cus { 
 
    padding-right: 20px !important;
  }
  .w-cus2 { 
    padding-right: 20px;
  }
  
}
@media screen and (max-width: 420px) {
  .w-cus { 
    padding-right: 15px;
  }

}
</style>
