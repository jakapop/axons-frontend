<script setup>
import { ref, reactive, onMounted ,computed } from 'vue'
import SensorChart from "../../views/SensorChart.vue"
import Chart from 'chart.js/auto'
import moment from "moment-with-locales-es6";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const monthNamesThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",];
const dayNames = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];


const states = reactive({
  serial: "",
  board_name:"",
  sensor_id: 1, //อุณหภูมิ
  avg_all: 0,
  avg_max: 0,
  avg_min: 0,
  board: {},
  sensor_temp: 0,
  weatherForecast:{},
});
const token_weather ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM0NzA3ZTBkZDYzMjYwYTZkNjRlNGEwNzhkY2E5ZDYyMTVhNTUyMzFjNTE0OTQxOTZlYTI0M2RkZjBjYzE0NDU4YWE1ZGFjODE2YmJmMGUwIn0.eyJhdWQiOiIyIiwianRpIjoiMzQ3MDdlMGRkNjMyNjBhNmQ2NGU0YTA3OGRjYTlkNjIxNWE1NTIzMWM1MTQ5NDE5NmVhMjQzZGRmMGNjMTQ0NThhYTVkYWM4MTZiYmYwZTAiLCJpYXQiOjE2NjE3NjM5NjAsIm5iZiI6MTY2MTc2Mzk2MCwiZXhwIjoxNjkzMjk5OTYwLCJzdWIiOiIyMTI3Iiwic2NvcGVzIjpbXX0.HG2opljn5zqQ4wKvLaomYKOVJHF4txs6iQhmMVMEZCkx0NZ4OQz_9InejmpYA-HHlKuJxxQ4MopvjIV0Uu0j04BMHhVgDjGfSpUnpOZFVhHeOZr8UbDpvRqgSo-1RyRYMYXqK8DCkUFSuAX06bbHCkoPc57I68_bcmS8bAc9KPo-PfS0NfosTIBarmCQHaw0ur2diPS20e38U3DmKIGymrCQ_3Lj6fSuZD1mBGtj4twSw1TCq9Xhu-eOoRo5jTxnLL7gagT6iG0nnPwNJIWfcAAumO9ta_bYYemQB4KGSx4qu8mzt27DPG9BclV9EDvv5sPUZ-QQ_vrb_3it6fLNhImxjNuQDG6Lccu-i0FZMPYrKV5PqnZkukOdDHCgkFNOyJrMkq-UwyGH5WtNtxzqdlHM_j78ZrvV38HCdeuoCupHEaaQIB0AhCGZOAJbogSQn6en8V-YrmoAhMoq_ca14VRt5fy9CviVRo4JaRp5Bmo2nd9pJLKBLF_CttI14H3BXLR7U0nrri6tKJhEoJI15nsUep8apCHhTIaqaywtTRA7gJBV19OYdMutdvAKLg9hahS5WIkVpB3F3OoG_Cd0LNyufoXnRa1hZ41s4t-zoZdAYJURs56ZGm8rCWxyIsAYT6lz-yR7KgP0SXzsZdO1Cra3bStUOYDoY8nXIPFGN84";

let d = new Date();
const today_th = ref('');
const month = ref("");
const year = ref("");



onMounted(() => {
  today_th.value = dayNames[d.getDay()];
  month.value = monthNamesThai[d.getMonth()];
  year.value = (parseInt(moment().locale("th").format("YYYY")) + 543).toString();
  ApiCore.get("/v2/projects/?limit=all").then((response) => {
    const project_data = response.data.data;
    Object.entries(project_data).forEach(([key, val]) => {
      ApiCore.get("/v2/projects/" + val.id + "/boards").then((response) => {
        Object.entries(response.data.data).forEach(([key, val2]) => {
          if (val2.serial != "") {
            states.serial = val2.serial
            if(val2.name != ""){
                states.board_name = val2.name
            }
            const serial = val2.serial
            ApiCore.get("/v2/boards/" + serial + "/sensor/" + states.sensor_id + "/report-lastest")
              .then((response) => {
                if (typeof response.data.data[0] !== 'undefined'){
                    states.sensor_temp = response.data.data[0].result_sensor;
                }
                get_report()
                return
              });
          }
        })
      })
    });
  })
});

const get_report = () => {
  ApiCore.get("/v2/boards/" + states.serial + "/sensor/" + states.sensor_id + "/report-day"
  ).then((response) => {
    const report_data = response.data.data;

    // console.log(response.data.data,report_data.length)
    if (report_data.length == 0) {
      let chart = document.querySelector("#chart");
      chart.classList.add("hidden");
    }
    else {
      let none = document.querySelector("#none_data");
      none.classList.add("hidden");
      let chart = document.querySelector("#chart");
      chart.classList.remove("hidden");
    }
    let labels = [];
    let datapoints = [];
    let data_avg = [];

    Object.entries(report_data).forEach(([key, val]) => {
      labels.push(val.day);
      datapoints.push(val.avg);
      data_avg.push(val.avg);
    });

    const bgc = [];
    const copydatapoints = [...datapoints];
    const max = Math.max(...datapoints);
    let sum = data_avg.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    let avg = sum / data_avg.length || 0;

    states.avg_all = Math.floor(avg);
    states.avg_max = max.toFixed(1);
    const highestValueColor = datapoints.map((datapoint, index) => {
      const color =
        datapoint == max ? "#074E9F" : "#01893D";
      bgc.push(color);
      if (max == datapoint) {
        copydatapoints.splice(index, 1, 0);
      }
    });

    const min = Math.min(...datapoints);
    states.avg_min = min.toFixed(1);
    const lowerValueColor = copydatapoints.map((datapoint, index) => {
      if (min == datapoint) {
        bgc.splice(index, 1, "#0086C9");
      }
    });

    const data = {
      labels: labels,
      datasets: [
        {
          label: states.sensor_name_th,
          data: datapoints,
          backgroundColor: bgc,
          fill: true,
          tension: 0.1,
          borderRadius: 10,
        },
      ],
    };
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
              text: 'วันที่',
              font: {
                size:16,
                weight: 'bold',
                family: 'IBM Plex Sans Thai',
                style:'normal'

              }
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          }
        },
        responsive: true,
        maintainAspectRatio: false
      },
    };

    try{
      let hourChart = new Chart(document.getElementById("hourChart"), config);
    }catch(e){
    }

  });
};

const addBoard = () => {
  router.push('/AddBoard');
};

const contact =()=> {
  router.push('/contact');
};

</script>
<template>
  <div v-if="states.serial">
    <div class="bg-white rounded-2xl p-2 my-4">
    <div class="flex flex-col">
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center w-[117px]">
          <img src="@/assets/img/icons/sensor/1.png" class="inline mr-1" style="width: 24px; height: 24px" />
          <h1 class="font-bold text-xs md:text-sm xl:text-base whitespace-nowrap text-custom-size">อุณหภูมิในอากาศ</h1>
        </div>
        <div>
          <div class="width-truncate"> <!--class="w-[103px]"-->
            <span class="font-medium text-xs md:text-sm truncate block text-custom-size">บอร์ด
              <span v-if="states.board_name">{{ states.board_name }}</span>
              <span v-else>{{ states.serial }}</span>
            </span>
          </div>
        </div>
      </div>
      <div>
        <p class="text-[50px] md:text-[64px] xl:text-[64px] leading-[1.10] text-center">{{ states.sensor_temp }}</p>
        <p class="font-bold text-[12px] md:text-base xl:text-lg text-center">องศาเซลเซียส (°C )</p>
      </div>
      <div class="mt-2">
        <router-link :to="`/SensorChart?board=${states.serial}&sid=1`">
          <button type="button" class="text-white w-full hover:text-[#01893D] bg-[#01893D] hover:bg-[#fff] font-bold rounded-[8px] text-sm px-4 h-[40px] text-center items-center btn-custom">
              <img alt="" class="inline chart lg:mt-0 bg-[#fff] mr-1" style="width: 20px; height: 20px" />
              <span>กราฟ</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
  <div id="chart">
    <div class="rounded-2xl bg-white p-2 h-full">
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center w-[117px]">
          <img src="@/assets/img/icons/sensor/1.png" class="inline mr-1" style="width: 24px; height: 24px" />
          <h1 class="font-bold text-xs md:text-sm xl:text-base whitespace-nowrap text-custom-size">อุณหภูมิในอากาศ</h1>
        </div>
        <div>
          <div class="width-truncate">
            <span class="font-medium text-xs md:text-sm truncate block text-custom-size">บอร์ด
              <span v-if="states.board_name">{{ states.board_name }}</span>
              <span v-else>{{ states.serial }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="w-full mt-4">
        <div class="flex flex-row justify-between mx-2">
          <div>
            <h5 class="w-custom text-xs md:text-sm lg:text-sm font-medium text-respon truncate">ข้อมูล : <span class="text-[#01893D]">เดือน {{ month }} พ.ศ. {{ year }}</span></h5>
            <h5 class="text-xs md:text-sm lg:text-sm font-medium text-respon">ค่าเฉลี่ย : {{ states.avg_all }} °C</h5>
          </div>
          <div>
            <div class="relative text-xs md:text-sm lg:text-sm font-medium whitespace-nowrap text-respon">
              <div class="absolute top-1 right-28 bg-[#074E9F] w-[30px] h-[10px]"></div> 
              ค่าสูงสุด : {{ states.avg_max }} °C</div>
            <div class="relative text-xs md:text-sm lg:text-sm font-medium whitespace-nowrap text-respon">
              <div class="absolute top-1 right-28 bg-[#0086C9] w-[30px] h-[10px]"></div> 
              ค่าต่ำสุด : {{ states.avg_min }} °C</div>
          </div>
        </div>
        <p class="text-xs md:text-base ml-2 font-bold mt-4">อุณหภูมิ ( °C )</p>
        <div class="chart-container" style="position: relative; height:300px; width: 100%">
          <canvas id="hourChart"></canvas>
        </div>
      </div>
    </div>
  </div>
  <div id="none_data" class="rounded-2xl bg-white p-2 ">
    <div class="flex flex-row justify-center items-center h-[420px]">
      <span class="font-medium opacity-60">ไม่มีข้อมูล</span>
    </div>
  </div>
  </div>
  <!-- ไม่พบบอร์ด -->
  <div v-else>
    <div class="bg-white rounded-[16px] w-full h-[250px] md:h-[640px] p-4 flex justify-center items-center">
      <div>
        <div class="text-center mb-4">
        <h1 class="text-[22px] font-mediem text-[#837D7B] mb-4">
          ไม่พบบอร์ด
        </h1>
        <span class="text-base font-mediem text-[#837D7B]">เพิ่มบอร์ดของคุณเพื่อดูข้อมูลจากเซนเซอร์</span>
      </div>
      <div class="flex flex-row items-center justify-center">
        <button @click="addBoard"
          class="py-0.5 px-2 flex flex-row justify-center items-center bg-[#01893D] rounded-[8px] text-white mr-2 w-full h-[36px]">
          <img class="w-5 h-5 mr-2" src="../../assets/img/icons/add_box.png" alt="" />
          <span class="whitespace-nowrap text-sm font-bold">เพิ่มบอร์ด</span>
        </button>
        <button  @click="contact"
          class="py-0.5 px-2 flex flex-row justify-center items-center bg-[#01893D] rounded-[8px] text-white w-full h-[36px]">
          <img class="w-5 h-5 mr-2" src="../../assets/img/icons/support_agent.png" alt="" />
          <span class="whitespace-nowrap text-sm font-bold">ติดต่อเรา</span>
        </button>
      </div>
      </div>
    </div>
  </div>

</template>



<style scoped>


@media (max-width: 1023px) {
  .width-truncate {
    width: 100% !important;
  }
  .w-custom {
    width: 170px !important;
  }

}
/* @media (max-width: 1024px) {
  .w-custom {
    width: 200px !important;
  }

} */
@media (max-width: 1080px) {
  .text-custom-size {
    font-size: 12px;
  }
  .w-custom {
    width: 120px;
  }
}

@media (max-width: 1200px) {
  .text-respon {
    font-size: 12px;
  }

}
@media (max-width: 1300px) {

  .width-truncate {
    width: 103px;
  }
  .w-custom{
    width: 130px;
  }
}
/* @media (min-width: 1200px) {

  .w-custom {
    width: 160px;
  }
} */
@media (min-width: 1400px) {

  .w-custom{
    width: 240px;
  }
}


</style>
