<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";
import { ref, reactive, onMounted, onBeforeMount, computed } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { GoogleMap, Marker } from "vue3-google-map";

import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  sameAs,
  minLength,
  helpers,
} from "@vuelidate/validators";

const mainStore = useMainStore();
const CustomerId = mainStore.CustomerId;

const router = useRouter();
const selectedOpenType = ref(false);
const selectedType = ref("");

const selectedOpenProvinces = ref(false);
const selectedProvinces = ref("");

const selectedOpenDistrict = ref(false);
const selectedDistrict = ref("");

const selectedOpenSubdistrict = ref(false);
const selectedSubdistrict = ref("");
let save_button = ref("ตกลง");

const api_key = ref(import.meta.env.VITE_GOOGLE_API_KEY);

const center = reactive({
  lat: 13.749421, //13.991734
  lng: 100.506907, //100.512052
});

navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    if (states.lat == "" && states.lon == ""){
      center.lat = position.coords.latitude;
      center.lng = position.coords.longitude;
    }
    let ck_gps = document.querySelector("#ck_gps");
    ck_gps.classList.remove("disabled:opacity-25");
    ck_gps.removeAttribute('disabled');
  },
  (error) => {
    console.log(error.message);
  }
);

let states = reactive({
  project_name: "",
  project_type: [
    {
      id: 1,
      name: "ไร่",
    },
    {
      id: 2,
      name: "สวน",
    },
    {
      id: 3,
      name: "ฟาร์ม",
    },
    {
      id: 4,
      name: "นา",
    },
    {
      id: 5,
      name: "การปศุสัตว์",
    },
    {
      id: 6,
      name: "การประมง",
    },
  ],
  project_type_id: "",
  detail: "",
  address: "",
  province: [],
  province_id: "",
  province_name: "",

  district: [],
  district_id: "",
  district_name: "",

  subdistrict: [],
  subdistrict_id: "",
  subdistrict_name: "",

  lat: "",
  lon: "",

  fileupload: "",
  upload_status: false,
  formData: new FormData(),

  showModal: false,

  farm_id_edit: null,
  have_farmworld: true,
});

onMounted(() => {
  let url = new URL(window.location.href);
  states.farm_id_edit = url.searchParams.get("id");

  if (states.farm_id_edit) {
    save_button.value = "แก้ไข";

    ApiCore.get(`/v2/projects/${states.farm_id_edit}`).then((res) => {
      const farm_project = res.data.data[0];
      states.project_name = farm_project.name;
      states.project_type_id = farm_project.project_type_id;
      selectedType.value =
        states.project_type[farm_project.project_type_id - 1].name;

      //console.log(res.data.data[0].image.link)
      if (res.data.data[0].image != null) {
        blah.src = res.data.data[0].image.link;
        upload.classList.add("hidden");
        uploaded.classList.remove("hidden");
        // ck_imgfarm.classList.add("hidden");
      }
    });

    ApiMain.get(
      `/customer/${CustomerId}/get-point?projectId=${states.farm_id_edit}`
    )
      .then((res) => {
        const farm = res.data.data;
        console.log(farm);
        center.lat = parseFloat(farm.lat);
        center.lng = parseFloat(farm.lon);
        states.lat = farm.lat;
        states.lon = farm.lon;

        states.province_id = farm.provinceId;
        states.province_name = farm.provinceName;
        selectedProvinces.value = farm.provinceName;
        select_province(farm.provinceId, farm.provinceName, "edit");
        selectedOpenProvinces.value = !selectedOpenProvinces.value;

        states.district_id = farm.districtId;
        states.district_name = farm.districtName;
        selectedDistrict.value = farm.districtName;
        select_district(farm.districtId, farm.districtName, "edit");
        selectedOpenDistrict.value = !selectedOpenDistrict.value;

        states.subdistrict_id = farm.subdistrictId;
        states.subdistrict_name = farm.subdistrictName;
        selectedSubdistrict.value = farm.subdistrictName;
        select_subdistrict(farm.subdistrictId, farm.subdistrictName);
        selectedOpenSubdistrict.value = !selectedOpenSubdistrict.value;

        //states.project_name = res.data.data.name
        states.detail = farm.detail;
        states.address = farm.address;
      })
      .catch((error) => {
        states.have_farmworld = false;
        //console.log(error.response);
      });
  }

  ApiSso.get("/api/geo/provinces").then((response) => {
    let arr_th = [];
    // states.province = response.data.data;
    // console.log(states.province);
    let obj = response.data.data;
    obj.forEach((element, index) => {
      if (element.name.th == "กรุงเทพมหานคร") {
        let x = "จ. กรุงเทพมหานคร";
        arr_th.push(x);
      } else {
        arr_th.push(element.name.th);
      }
    });

    let province_arr = [];
    let sort_name = sortThaiDictionary(arr_th); //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_province = obj.filter((x) => x.name.th == name);
      if (obj_province.length == 0) {
        province_arr.push({
          id: 10,
          name: { en: "Bangkok", th: "จ. กรุงเทพมหานคร" },
        });
      } else {
        province_arr.push(obj_province[0]);
      }
    });
    states.province = province_arr;
  });
});
const sortThaiDictionary = (list) => {
  const newList = [...list];
  newList.sort((a, b) => a.localeCompare(b, "th"));
  return newList;
};

const select_type = (id, name) => {
  selectedOpenType.value = !selectedOpenType.value;
  states.project_type_id = id;
  // let ck_type = document.querySelector("#ck_type");
  // ck_type.classList.add("hidden");
};

const select_province = (id, name, type = "post") => {
  selectedOpenProvinces.value = !selectedOpenProvinces.value;
  states.province_id = id;
  states.province_name = name;
  ApiSso.get("/api/geo/provinces/" + id + "/districts").then((response) => {
    states.district = response.data.data;

    let obj = states.district;
    let arr_district = [];
    let district = [];

    obj.forEach((element, index) => {
      //console.log(element.name.th);
      arr_district.push(element.name.th);
    });
    let sort_district = sortThaiDictionary(arr_district);

    sort_district.forEach((name) => {
      let sort_district = obj.filter((x) => x.name.th == name);
      if (sort_district.length == 0) {
        district.push({
          id: 10,
          name: { en: "Bangkok", th: "จ. กรุงเทพมหานคร" },
        });
      } else {
        district.push(sort_district[0]);
      }
    });
    states.district = district;

    if (type == "post") {
      selectedDistrict.value = "อำเภอ";
      states.district_id = "";
      selectedSubdistrict.value = "ตำบล";
      states.subdistrict_id = "";
    }
  });
};

const select_district = (id, name, type = "post") => {
  selectedOpenDistrict.value = !selectedOpenDistrict.value;
  states.district_id = id;
  states.district_name = name;
  ApiSso.get(
    "/api/geo/provinces/" +
      states.province_id +
      "/districts/" +
      id +
      "/sub-districts"
  ).then((response) => {
    // states.subdistrict = response.data.data;
    let obj = response.data.data;
    let arr_subdistrict = [];
    let subdistrict = [];

    obj.forEach((element, index) => {
      //console.log(element.name.th);
      arr_subdistrict.push(element.name.th);
    });
    let sort_subdistrict = sortThaiDictionary(arr_subdistrict);

    sort_subdistrict.forEach((name) => {
      let sort_subdistrict = obj.filter((x) => x.name.th == name);
      if (sort_subdistrict.length == 0) {
        subdistrict.push({
          id: 10,
          name: { en: "Bangkok", th: "จ. กรุงเทพมหานคร" },
        });
      } else {
        subdistrict.push(sort_subdistrict[0]);
      }
    });
    states.subdistrict = subdistrict;
    if (type == "post") {
      selectedSubdistrict.value = "ตำบล";
      states.subdistrict_id = "";
    }
  });
};

const select_subdistrict = (id, name) => {
  selectedOpenSubdistrict.value = !selectedOpenSubdistrict.value;
  states.subdistrict_id = id;
  states.subdistrict_name = name;
  ApiSso.get(
    "/api/geo/provinces/" +
      states.province_id +
      "/districts/" +
      states.district_id +
      "/sub-districts"
  ).then((response) => {
    states.subdistrict = response.data.data;
  });
};

const upload_image = () => {
  let imagefile = document.querySelector("#imgInp");
  states.formData.append("file", imagefile.files[0]);

  let ck_upload = document.querySelector("#upload");
  let ck_uploaded = document.querySelector("#uploaded");
  ck_upload.classList.add("hidden");
  ck_uploaded.classList.remove("hidden");

  const [file] = imgInp.files;
  if (file) {
    blah.src = URL.createObjectURL(file);
    states.upload_status = true;
  }
};

const getgps = () => {
  states.showModal = !states.showModal;
  states.lat = center.lat
  states.lon = center.lng
};

const updateMarker = (location) => {
  states.lat = location.lat();
  states.lon = location.lng();
};

const rules = computed(() => {
  return {
    project_name: {
      required: helpers.withMessage("กรุณาระบุชื่อฟาร์ม", required),
    },
    fileupload: {},
    address: { required: helpers.withMessage("กรุณาระบุที่อยู่", required) },
    project_type_id: {
      required: helpers.withMessage("กรุณาระบุประเภทฟาร์ม", required),
    },
    province_id: {
      required: helpers.withMessage("กรุณาเลือกจังหวัด", required),
    },
    district_id: {
      required: helpers.withMessage("กรุณาระบุเลือกอำเภอ", required),
    },
    subdistrict_id: {
      required: helpers.withMessage("กรุณาระบุตำบล", required),
    },
    lat: { required: helpers.withMessage("กรุณาระบุละติจูด", required) },
    lon: { required: helpers.withMessage("กรุณาระบุลองจิจูด", required) },
  };
});

const v$ = useVuelidate(rules, states);

const submit = async () => {
  const result = await v$.value.$validate();
  if (result) {
    if (states.farm_id_edit) {
      console.log("edit");
      ApiCore.put("/v2/projects/" + states.farm_id_edit, {
        name: states.project_name,
        organization_id: 0,
        project_type_id: states.project_type_id,
      })
        .then((data) => {
          console.log(data.status);
          states.formData.append("project_id", states.farm_id_edit);
          if (data.status == 200) {
            if (states.have_farmworld == true) {
              ApiMain.put("/customer/" + CustomerId + "/update-point", {
                projectId: states.farm_id_edit,
                serial: "string",
                detail: states.detail,
                address: states.address,
                provinceId: states.province_id,
                provinceName: states.province_name,
                districtId: states.district_id,
                districtName: states.district_name,
                subdistrictId: states.subdistrict_id,
                subdistrictName: states.subdistrict_name,
                lat: states.lat,
                lon: states.lon,
              }).then((data) => {
                if (data.status == 200) {
                  Swal.fire({
                    icon: "success",
                    title: "แก้ไขฟาร์ม สำเร็จ",
                    showConfirmButton: 1,
                    timer: 3500,
                  }).then((res) => {
                    window.location.replace("/ManageFarm");
                  });

                  if (states.upload_status) {
                    ApiCore.post("/v2/upload", states.formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        accept: "application/json",
                      },
                    }).then((data) => {
                      if (data.status == 200) {
                        console.log("upload edit image");
                        mainStore.CustomerFarmImage = data.data.data
                      }
                    });
                  }
                }
              });
            } else {
              ApiMain.post("/customer/add-point", {
                customerId: CustomerId,
                projectId: states.farm_id_edit,
                serial: "string",
                detail: states.detail,
                address: states.address,
                provinceId: states.province_id,
                provinceName: states.province_name,
                districtId: states.district_id,
                districtName: states.district_name,
                subdistrictId: states.subdistrict_id,
                subdistrictName: states.subdistrict_name,
                lat: states.lat,
                lon: states.lon,
              }).then((data) => {
                console.log(data);
                if (data.status == 200) {
                  Swal.fire({
                    icon: "success",
                    title: "แก้ไขฟาร์ม สำเร็จ",
                    showConfirmButton: 1,
                    timer: 3500,
                  }).then((res) => {
                    window.location.replace("/ManageFarm");
                  });

                  if (states.upload_status) {
                    ApiCore.post("/v2/upload", states.formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        accept: "application/json",
                      },
                    }).then((data) => {
                      if (data.status == 200) {
                        console.log("upload edit add");
                        mainStore.CustomerFarmImage = data.data.data
                      }
                    });
                  }

                }
              });
            }
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถแก้ไขฟาร์มได้",
            showConfirmButton: 1,
            timer: 4000,
          });
        });
    } else {
      ApiCore.post("/v2/projects", {
        name: states.project_name,
        organization_id: 0,
        project_type_id: states.project_type_id,
      })
        .then((data) => {
          //console.log(data.status);
          //console.log(data.data.data.id);
          states.formData.append("project_id", data.data.data.id);
          if (data.status == 200) {
            ApiMain.post("/customer/add-point", {
              customerId: data.data.data.user_id,
              projectId: data.data.data.id,
              serial: "string",
              detail: states.detail,
              address: states.address,
              provinceId: states.province_id,
              provinceName: states.province_name,
              districtId: states.district_id,
              districtName: states.district_name,
              subdistrictId: states.subdistrict_id,
              subdistrictName: states.subdistrict_name,
              lat: states.lat,
              lon: states.lon,
            }).then((data) => {
              console.log(data);
              if (data.status == 200) {
                Swal.fire({
                  icon: "success",
                  title: "เพิ่มฟาร์ม สำเร็จ",
                  showConfirmButton: 1,
                  timer: 3500,
                }).then((res) => {
                  window.location.replace("/ManageFarm");
                });

                if (states.upload_status) {
                  ApiCore.post("/v2/upload", states.formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      accept: "application/json",
                    },
                  }).then((data) => {
                    console.log(data.status);
                    if (data.status == 200) {
                      console.log("upload post");
                      mainStore.CustomerFarmImage = data.data.data
                      //console.log(data.status);
                    }
                  });
                }
              }
            });
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถเพิ่มฟาร์มได้",
            showConfirmButton: 1,
            timer: 4000,
          });
        });
    }
  } else {
    let message_err = "";
    if (states.project_name == "") {
      message_err += "กรุณากรอกชื่อฟาร์ม<br>";
    }
    if (states.project_type_id == "") {
      message_err += "กรุณาระบุประเภทฟาร์ม<br>";
    }
    if (states.address == "") {
      message_err += "กรุณากรอกที่อยู่<br>";
    }
    if (states.province_id == "") {
      message_err += "กรุณาระบุจังหวัด<br>";
    }
    if (states.district_id == "") {
      message_err += "กรุณาระบุอำเภอ<br>";
    }
    if (states.subdistrict_id == "") {
      message_err += "กรุณาระบุตำบล<br>";
    }
    if (states.lat == "") {
      message_err += "กรุณาระบุ ละติจูด<br>";
    }
    if (states.lon == "") {
      message_err += "กรุณาระบุ ลองจิจูด<br>";
    }
    Swal.fire({
      icon: "error",
      html: message_err,
      showConfirmButton: 1,
      timer: 3000,
    });
  }
};

const closeForm = () => {
  router.push("/ManageFarm");
};
</script>
<template>
  <NavbarMain>
    <HeaderFarm />
    <div>
      <div class="p-4 pt-0">
        <h1
          v-if="save_button == 'แก้ไข'"
          class="text-[22px] md:text-2xl font-bold my-[20px] pl-5"
        >
          แก้ไขฟาร์ม
        </h1>
        <h1 v-else class="text-[22px] md:text-2xl font-bold my-[20px] pl-5">
          เพิ่มฟาร์มใหม่
        </h1>
        <div class="p-4 rounded-[24px] bg-[#fff]">
          <form @submit.prevent="submit" class="w-full">
            <div class="flex flex-wrap justify-center -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-base font-medium mb-2 relative"
                >
                  อัพโหลดรูปภาพฟาร์ม
                </label>
                <label
                  class="flex flex-col w-full h-[192px] bg-[#F2F2F0] hover:bg-gray-100 hover:border-gray-300 relative rounded-[10px]"
                >
                  <div
                    id="upload"
                    class="flex flex-col items-center justify-center pt-7 my-auto"
                  >
                    <div
                      class="bg-[#01893D] hover:bg-[#fff] text-white font-medium px-4 hover:text-[#01893D] rounded-[10px] h-[40px] btn-custom"
                    >
                      <div class="mt-2">
                        <img
                          alt=""
                          class="inline add lg:mt-0 bg-[#fff]"
                          style="width: 25px; height: 25px"
                        />
                        <span class="text-sm ml-1">เพิ่มรูปภาพฟาร์ม</span>
                      </div>
                    </div>
                  </div>
                  <!--Start เอาไว้ใช้ตอนมีรูป -->
                  <div id="uploaded" class="hidden">
                    <img
                      id="blah"
                      class="w-full h-[192px] object-cover object-center rounded-[10px]"
                      src=""
                    />
                    <div
                      class="bg-[#01893D] absolute right-0 top-2 mr-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom"
                    >
                      <img
                        class="inline edit lg:mt-0 bg-[#fff]"
                        style="width: 20px; height: 20px"
                      />
                      <span class="text-sm ml-1">แก้ไข</span>
                    </div>
                  </div>
                  <!--End เอาไว้ใช้ตอนมีรูป -->
                  <input
                    type="file"
                    accept="image/*"
                    name="imgInp"
                    id="imgInp"
                    @change="upload_image"
                    :v-model="states.fileupload"
                    class="opacity-0"
                  />
                </label>
                <!-- <span
                  id="ck_imgfarm"
                  class="text-red-500 text-sm font-medium border-red-500 float-right"
                  >กรุณาเพิ่มรูปฟาร์ม</span
                > -->
                <!-- <span  v-if="v$.fileupload.$error" class="text-red-500 text-sm font-medium border-red-500 float-right">{{ v$.fileupload.$errors[0].$message}}</span> -->
              </div>
            </div>
            <div class="flex flex-wrap -mx-3">
              <div class="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-base font-medium mb-2 relative"
                >
                  ชื่อฟาร์ม <span class="text-red-500">*</span>
                </label>
                <input
                  :class="
                    v$.project_name.$error
                      ? 'border-red-500'
                      : 'border-[#837D7B]'
                  "
                  class="bg-white rounded-[8px] h-[36px] text-sm p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 focus:border-[#01893D] focus:ring-[#01893D]"
                  id="project_name"
                  type="text"
                  v-model="states.project_name"
                  placeholder=""
                />
                <span
                  v-if="v$.project_name.$error"
                  class="text-red-500 text-sm font-medium border-red-500 float-right"
                  >{{ v$.project_name.$errors[0].$message }}</span
                >
              </div>
              <div class="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-base font-medium mb-2 relative"
                >
                  ประเภทฟาร์ม <span class="text-red-500">*</span>
                </label>
                <span
                  class="relative w-full"
                  v-on:click="selectedOpenType = !selectedOpenType"
                >
                  <!-- <input
                                      placeholder="ประเภท"
                                      disabled
                                      class="bg-white rounded-[8px] h-[36px] text-sm p-1 pr-12 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 border-[#01893D]"
                                      v-model="selectedType"
                                    /> -->
                  <input
                    :class="
                      v$.project_type_id.$error
                        ? 'border-red-500'
                        : 'border-[#837D7B]'
                    "
                    placeholder="ประเภท"
                    disabled
                    class="bg-white rounded-[8px] h-[36px] text-sm p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 focus:border-[#01893D] focus:ring-[#01893D] custom-input-select"
                    v-model="selectedType"
                  />
                  <img
                    class="flex absolute right-[11px] top-[12.5px] w-2.5 bg-transparent rounded text-base text-gray-600"
                    src="@/assets/img/icons/select-down.svg"
                    alt=""
                    :class="selectedOpenType ? 'rotate-180' : ''"
                  />
                  <!-- <img
                                      class="flex absolute right-2 bg-transparent rounded text-base text-gray-600"
                                      src="@/assets/img/icons/select-down.svg"
                                      alt=""
                                      :class="selectedOpenType ? 'rotate-180' : ''"
                                      style="width: 20px; top: 8px"
                                    /> -->
                  <div
                    class="absolute shadow bg-white top-100 z-40 w-full lef-0 max-h-select overflow-y-auto rounded-[24px] mt-2 border-[#01893D] border-2"
                    v-if="selectedOpenType == true"
                  >
                    <div class="flex flex-col w-full h-[200px]">
                      <div
                        v-for="(type, index) in states.project_type"
                        :value="type.id"
                        :key="index"
                        class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                        v-on:click="select_type(type.id, type.name)"
                      >
                        <div
                          class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100"
                          @click="
                            (selectedType = type.name),
                              (selectedOpenType = !selectedOpenType)
                          "
                        >
                          <div class="w-full items-center flex p-2">
                            <div
                              class="mx-2 hover:text-[#9BD226] text-sm text-[#01893D]"
                            >
                              {{ type.name }}
                              <!-- <span class="text-base truncate w-full normal-case font-normal -mt-1 text-gray-500">Board - {{ farm.board }}</span> -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  v-if="v$.project_type_id.$error"
                  class="text-red-500 text-sm font-medium border-red-500 float-right"
                  >{{ v$.project_type_id.$errors[0].$message }}</span
                >
                <!-- <div class="text-right">
                  <span
                    id="ck_type"
                    class="text-red-500 text-sm ml-auto mr-3 mt-2"
                    >กรุณาเลือกประเภทฟาร์ม</span
                  >
                </div> -->
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6 mt-4">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-base font-medium mb-2 relative"
                >
                  รายละเอียด
                </label>

                <textarea
                  v-model="states.detail"
                  class="appearance-none block w-full text-[#01893D] text-sm border border-[#837D7B] focus:border-[#01893D] focus:ring-[#01893D] rounded-[10px] px-4 leading-tight focus:outline-none"
                ></textarea>
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-3">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-base font-medium mb-2 relative"
                >
                  ที่อยู่ <span class="text-red-500">*</span>
                </label>
                <input
                  :class="
                    v$.address.$error ? 'border-red-500' : 'border-[#837D7B]'
                  "
                  class="bg-white rounded-[8px] h-[36px] text-sm p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 focus:border-[#01893D] focus:ring-[#01893D]"
                  type="text"
                  placeholder=""
                  v-model="states.address"
                />
                <span
                  v-if="v$.address.$error"
                  class="text-red-500 text-sm font-medium border-red-500 float-right"
                  >{{ v$.address.$errors[0].$message }}</span
                >
                <!-- <div class="text-right">
                  <span
                    id="ck_address"
                    class="text-red-500 text-sm ml-auto mr-3"
                    >กรุณาระบุที่อยู่</span
                  >
                </div> -->
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-2">
              <div class="w-full md:w-1/3 px-3 mb-3 md:mb-0">
                <span
                  class="relative w-full"
                  v-on:click="selectedOpenProvinces = !selectedOpenProvinces"
                >
                  <input
                    :class="
                      v$.province_id.$error
                        ? 'border-red-500'
                        : 'border-[#837D7B]'
                    "
                    placeholder="จังหวัด"
                    disabled
                    class="bg-white rounded-[8px] h-[36px] text-sm p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 focus:border-[#01893D] focus:ring-[#01893D] custom-input-select"
                    v-model="selectedProvinces"
                  />
                  <img
                    class="flex absolute right-[11px] top-[12.5px] w-2.5 bg-transparent rounded text-base text-gray-600"
                    src="@/assets/img/icons/select-down.svg"
                    alt=""
                    :class="selectedOpenProvinces ? 'rotate-180' : ''"
                  />
                  <!-- <input
                    placeholder="จังหวัด"
                    disabled
                    class="bg-white rounded-[10px] h-10 p-1 pr-12 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 border-[#01893D]"
                    v-model="selectedProvinces"
                  />
                  <img
                    class="flex absolute right-2 bg-transparent rounded text-base text-gray-600"
                    src="@/assets/img/icons/select-down.svg"
                    alt=""
                    :class="selectedOpenProvinces ? 'rotate-180' : ''"
                    style="width: 20px; top: 8px"
                  /> -->
                  <div
                    class="absolute shadow bg-white top-100 z-40 w-full h-[200px] lef-0 max-h-select overflow-y-auto rounded-[24px] mt-2 border-[#837D7B] focus:border-[#01893D] focus:ring-[#01893D] border-2"
                    v-if="selectedOpenProvinces == true"
                  >
                    <div class="flex flex-col w-full h-[200px]">
                      <div
                        v-for="(province, index) in states.province"
                        :value="province.id"
                        :key="index"
                        class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                        v-on:click="
                          select_province(province.id, province.name.th)
                        "
                      >
                        <div
                          class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100"
                          @click="
                            (selectedProvinces = province.name.th),
                              (selectedOpenProvinces = !selectedOpenProvinces)
                          "
                        >
                          <div class="w-full items-center flex p-2">
                            <div
                              class="mx-2 hover:text-[#9BD226] text-sm text-[#01893D]"
                            >
                              {{ province.name.th }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  v-if="v$.province_id.$error"
                  class="text-red-500 text-sm font-medium border-red-500 float-right"
                  >{{ v$.province_id.$errors[0].$message }}</span
                >
              </div>
              <div class="w-full md:w-1/3 px-3 mb-3 md:mb-0">
                <span
                  class="relative w-full"
                  v-on:click="selectedOpenDistrict = !selectedOpenDistrict"
                >
                  <input
                    :class="
                      v$.district_id.$error
                        ? 'border-red-500'
                        : 'border-[#837D7B]'
                    "
                    placeholder="อำเภอ"
                    disabled
                    class="bg-white rounded-[8px] h-[36px] text-sm p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 focus:border-[#01893D] focus:ring-[#01893D] custom-input-select"
                    v-model="selectedDistrict"
                  />
                  <img
                    class="flex absolute right-[11px] top-[12.5px] w-2.5 bg-transparent rounded text-base text-gray-600"
                    src="@/assets/img/icons/select-down.svg"
                    alt=""
                    :class="selectedOpenDistrict ? 'rotate-180' : ''"
                  />
                  <!-- <input
                    placeholder="อำเภอ"
                    disabled
                    class="bg-white rounded-[10px] h-10 p-1 pr-12 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 border-[#01893D]"
                    v-model="selectedDistrict"
                  />
                  <img
                    class="flex absolute right-2 bg-transparent rounded text-base text-gray-600"
                    src="@/assets/img/icons/select-down.svg"
                    alt=""
                    :class="selectedOpenDistrict ? 'rotate-180' : ''"
                    style="width: 20px; top: 8px"
                  /> -->
                  <div
                    class="absolute shadow bg-white top-100 z-40 w-full lef-0 max-h-select overflow-y-auto rounded-[24px] mt-2 border-[#837D7B] focus:border-[#01893D] focus:ring-[#01893D] border-2"
                    v-if="selectedOpenDistrict == true"
                  >
                    <div class="flex flex-col w-full h-[200px]">
                      <div
                        v-for="(district, index) in states.district"
                        :value="district.id"
                        :key="index"
                        class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                        v-on:click="
                          select_district(district.id, district.name.th)
                        "
                      >
                        <div
                          class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100"
                          @click="
                            (selectedDistrict = district.name.th),
                              (selectedOpenDistrict = !selectedOpenDistrict)
                          "
                        >
                          <div class="w-full items-center flex p-2">
                            <div
                              class="mx-2 hover:text-[#9BD226] text-sm text-[#01893D]"
                            >
                              {{ district.name.th }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  v-if="v$.district_id.$error"
                  class="text-red-500 text-sm font-medium border-red-500 float-right"
                  >{{ v$.district_id.$errors[0].$message }}</span
                >
              </div>
              <div class="w-full md:w-1/3 px-3 mb-3 md:mb-0">
                <span
                  class="relative w-full"
                  v-on:click="
                    selectedOpenSubdistrict = !selectedOpenSubdistrict
                  "
                >
                  <input
                    :class="
                      v$.subdistrict_id.$error
                        ? 'border-red-500'
                        : 'border-[#837D7B]'
                    "
                    placeholder="ตำบล"
                    disabled
                    class="bg-white rounded-[8px] h-[36px] text-sm p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 focus:border-[#01893D] focus:ring-[#01893D] custom-input-select"
                    v-model="selectedSubdistrict"
                  />
                  <img
                    class="flex absolute right-[11px] top-[12.5px] w-2.5 bg-transparent rounded text-base text-gray-600"
                    src="@/assets/img/icons/select-down.svg"
                    alt=""
                    :class="selectedOpenSubdistrict ? 'rotate-180' : ''"
                  />
                  <!-- <input
                    placeholder="ตำบล"
                    disabled
                    class="bg-white rounded-[10px] h-10 p-1 pr-12 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 border-[#01893D]"
                    v-model="selectedSubdistrict"
                  />
                  <img
                    class="flex absolute right-2 bg-transparent rounded text-base text-gray-600"
                    src="@/assets/img/icons/select-down.svg"
                    alt=""
                    :class="selectedOpenSubdistrict ? 'rotate-180' : ''"
                    style="width: 20px; top: 8px"
                  /> -->
                  <div
                    class="absolute shadow bg-white top-100 z-40 w-full lef-0 max-h-select overflow-y-auto rounded-[24px] mt-2 border-[#837D7B] focus:border-[#01893D] focus:ring-[#01893D] border-2"
                    v-if="selectedOpenSubdistrict == true"
                  >
                    <div class="flex flex-col w-full h-[200px]">
                      <div
                        v-for="(subdistrict, index) in states.subdistrict"
                        :value="subdistrict.id"
                        :key="index"
                        class="boxfarm cursor-pointer w-full border-gray-100 rounded-t border-b"
                        v-on:click="
                          select_subdistrict(
                            subdistrict.id,
                            subdistrict.name.th
                          )
                        "
                      >
                        <div
                          class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100"
                          @click="
                            (selectedSubdistrict = subdistrict.name.th),
                              (selectedOpenSubdistrict =
                                !selectedOpenSubdistrict)
                          "
                        >
                          <div class="w-full items-center flex p-2">
                            <div
                              class="mx-2 hover:text-[#9BD226] text-sm text-[#01893D]"
                            >
                              {{ subdistrict.name.th }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  v-if="v$.subdistrict_id.$error"
                  class="text-red-500 text-sm font-medium border-red-500 float-right"
                  >{{ v$.subdistrict_id.$errors[0].$message }}</span
                >
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-3">
              <div class="w-full px-3 mb-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-base font-medium mb-1 relative"
                >
                  ตำแหน่ง <span class="text-red-500 text-sm">*กรุณาเปิดใช้งานตําแหน่งอุปกรณ์ของคุณก่อน</span>
                </label>
                <!-- <router-link to="/gpsMap"> -->
                <button
                  disabled
                  id="ck_gps"
                  @click="getgps"
                  type="button"
                  class="disabled:opacity-25 w-60 bg-[#01893D] hover:bg-[#fff] text-white font-bold py-2 px-2 hover:text-[#01893D] rounded-[10px] h-[40px] btn-custom mt-2"
                >
                  <img
                    alt=""
                    class="inline share_location lg:mt-0 bg-[#fff]"
                    style="width: 20px; height: 20px"
                  />
                  <span class="text-sm ml-1">รับตำแหน่งจาก GPS</span>
                </button>
                <!-- </router-link> -->
              </div>
              <!-- <div
                class="tracking-wide text-gray-700 text-base font-bold mb-2 pl-3 mt-2 w-full"
              >
                <p>ตำแหน่งของคุณ : --.------ , --.------</p>
              </div> -->
              <div v-if="states.showModal" class="w-full m-2">
                <GoogleMap
                  :api-key="api_key"
                  style="width: 100%; height: 555px"
                  :center="center"
                  :zoom="16"
                >
                  <Marker
                    :options="{
                      position: center,
                      clickable: true,
                      draggable: true,
                    }"
                    @dragend="updateMarker($event.latLng)"
                  />
                </GoogleMap>
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-3">
              <div class="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-base font-medium mb-2 relative"
                  >ละติจูด <span class="text-red-500">*</span></label
                >
                <input
                  :class="v$.lat.$error ? 'border-red-500' : 'border-[#837D7B]'"
                  class="bg-white rounded-[8px] h-[36px] text-sm p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 focus:border-[#01893D] focus:ring-[#01893D]"
                  id="lat"
                  type="text"
                  placeholder=""
                  v-model="states.lat"
                />
                <span
                  v-if="v$.lat.$error"
                  class="text-red-500 text-sm font-medium border-red-500 float-right"
                  >{{ v$.lat.$errors[0].$message }}</span
                >
              </div>
              <div class="w-full md:w-1/2 px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-base font-medium mb-2 relative"
                  >ลองจิจูด <span class="text-red-500">*</span></label
                >
                <input
                  :class="v$.lon.$error ? 'border-red-500' : 'border-[#837D7B]'"
                  class="bg-white rounded-[8px] h-[36px] text-sm p-1 pr-6 px-2 appearance-none outline-none w-full truncate whitespace-nowrap text-[#01893D] border border-1 focus:border-[#01893D] focus:ring-[#01893D]"
                  id="lon"
                  type="text"
                  placeholder=""
                  v-model="states.lon"
                />
                <span
                  v-if="v$.lon.$error"
                  class="text-red-500 text-sm font-medium border-red-500 float-right"
                  >{{ v$.lon.$errors[0].$message }}</span
                >
              </div>
              <div
                class="tracking-wide text-gray-700 text-base font-medium mb-2 pl-3 mt-2 w-full"
              >
                <p>
                  หมายเหตุ : การรับตำแหน่งจาก GPS จะทำให้คุณใช้งานเว็บไซต์นี้ได้อย่างมีประสิทธิภาพมากขึ้น
                </p>
              </div>
            </div>

            <div class="flex justify-center mt-4 mb-2">
              <button
                type="submit"
                class="bg-[#01893D] mr-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom w-[120px]"
              >
                <img
                  alt=""
                  class="inline check lg:mt-0 bg-[#fff]"
                  style="width: 20px; height: 20px"
                />
                <span class="text-sm ml-1">{{ save_button }}</span>
              </button>
              <button
                @click="closeForm"
                type="button"
                class="modal-close bg-[#01893D] ml-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom w-[120px]"
              >
                <img
                  alt=""
                  class="inline close lg:mt-0 bg-[#fff]"
                  style="width: 15px; height: 15px"
                />
                <span class="text-sm ml-1">ยกเลิก</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </NavbarMain>

  <!-- <div>
    <div
      v-if="states.showModal"
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
    >
      <div class="w-full">
        <div class="pl-4 pr-6 pt-4">
          <div class="pt-4 rounded-[16px] bg-[#fff] pb-6">
            <p class="flex justify-center text-xl font-bold my-[6px] pl-5">
              รับตำแหน่งจาก GPS
            </p>
            <form class="w-full px-4">
              <div class="w-full">
                <GoogleMap
                  :api-key="api_key"
                  style="width: 100%; height: 555px"
                  :center="center"
                  :zoom="16"
                >
                  <Marker
                    :options="{
                      position: center,
                      clickable: true,
                      draggable: true,
                    }"
                    @dragend="updateMarker($event.latLng)"
                  />
                </GoogleMap>
              </div>
              <div
                class="flex justify-center tracking-wide text-gray-700 text-sm font-bold mb-2 pl-3 mt-2 w-full"
              >
                <div class="text-center">
                  <p>ตำแหน่งของคุณ</p>
                  <p>ละติจูด : {{ states.lat_map }}</p>
                  <p>ลองจิจูด : {{ states.lon_map }}</p>
                </div>
              </div>
              <div class="flex justify-center mt-4 mb-2">
                <router-link :to="`/AddFarm?id=${states.farm_id_edit}`">
                  <button
                    type="button"
                    @click="savegps"
                    class="bg-[#01893D] mr-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom w-[120px]"
                  >
                    <img
                      alt=""
                      class="inline check lg:mt-0 bg-[#fff]"
                      style="width: 20px; height: 20px"
                    />
                    <span class="text-sm ml-1">ตกลง</span>
                  </button>
                </router-link>
                <router-link to="/AddFarm">
                  <button
                    @click="closegps"
                    class="modal-close bg-[#01893D] ml-2 hover:bg-[#fff] text-white font-bold py-2 pt-1.5 px-4 hover:text-[#01893D] rounded-[10px] h-9 btn-custom w-[120px]"
                  >
                    <img
                      alt=""
                      class="inline close lg:mt-0 bg-[#fff]"
                      style="width: 15px; height: 15px"
                    />
                    <span class="text-sm ml-1">ยกเลิก</span>
                  </button>
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="states.showModal"
      class="opacity-25 fixed inset-0 z-40 bg-black"
    ></div>
  </div> -->
</template>

<style>
@import "@/assets/styles/custom-icons.css";

input[type="date"]::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 1;
  display: block;
  background: url(@/assets/img/icons/calendar_month.png) no-repeat center;
  width: 20px;
  height: 20px;
  border-width: thin;
}

.btn-custom:hover img {
  background-color: #01893D;
}

.header-img {
  background-image: url("@/assets/img/img_landingpage/bg-device.png");
}
</style>
