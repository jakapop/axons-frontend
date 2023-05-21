<script setup>
import NavbarMain from "../layouts/NavbarMain.vue";
import HeaderFarm from "../components/Headers/HeaderFarm.vue";
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import Swal from "sweetalert2";
import router from "@/router";

const mainStore = useMainStore();

let url = new URL(window.location.href);
const boards_serial = url.searchParams.get("board");
const boards_name = url.searchParams.get("board_name");
console.log(boards_name);
const state = reactive({
    board_name: boards_name
})


const confirm = () => {

    Swal.fire({
        title: "แก้ไขชื่อบอร์ด",
        text:"คุณยืนยันที่จะแก้ไขชื่อบอร์ดใช่หรือไม่",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#01893D",
        cancelButtonColor: "#D22626",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก"
    }).then((result) => {
        if (result.isConfirmed == true) {
            ApiCore.put("v2/projects/" + mainStore.CustomerFarmId + "/boards/" + boards_serial, {
                name: state.board_name,
            }).then((response) => {
                console.log(response.status);
                if (response.status == 200) {
                    router.push('/selectBoard');
                }
            });
        }
    }).catch((error) => response.send(error.message));



};

const cancel = () => {
    router.push('selectBoard');
};

</script>
<template>
    <NavbarMain>
        <HeaderFarm />
        <div class="m-4">
            <h1 class="text-[#302421] text-[22px] font-medium mb-4">แก้ไขบอร์ด</h1>
            <div class="bg-white rounded-lg p-4">
                <div class="flex flex-row justify-center items-center mb-4">
                    <img class="inline w-16 md:w-[96px] md:h-[96px]" src="/img/boards/all/2309.svg" />
                </div>
                <input type="text" v-model="state.board_name" oninput="this.value = this.value.toUpperCase();"
                    class="w-full h-[36px] rounded-lg focus:border-[#01893D] focus:ring-[#01893D]">
            </div>
            <div class="flex flex-row justify-center items-center mt-8">
                <button @click="confirm()"
                    class="w-[124px] bg-[#01893D] mr-2 hover:bg-[#fff] text-white font-bold px-2 hover:text-[#01893D] rounded-[10px] h-[36px] ">
                    <img alt="" class="inline check lg:mt-0 bg-[#fff]" />
                    <span class="text-sm ml-1">ยืนยัน</span>
                </button>
                <button @click="cancel()"
                    class="w-[124px] bg-[#01893D] hover:bg-[#fff] text-white font-bold px-2 hover:text-[#01893D] rounded-[10px] h-[36px] ">
                    <img alt="" class="inline close lg:mt-0 bg-[#fff]" />
                    <span class="text-sm ml-1">ยกเลิก</span>
                </button>

            </div>
        </div>
    </NavbarMain>
</template>



<style></style>