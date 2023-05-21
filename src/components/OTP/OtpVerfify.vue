<template>
<div id="otp" class="flex flex-row items-center justify-between px-2 sm:px-10 md:px-4" ref="otpCont">
    <input
      type="text"
      class="text-center w-[36px] sm:w-full h-[52px]  border-[#837D7B] focus:ring-[#01893D] focus:border-[#01893D] mr-1 rounded-[8px]"
      v-for="(item, index) in digits"
      :id="'digit'+index"
      :key="item+index"
      v-model="digits[index]"
      :autofocus="index === 0"
      maxlength="1"
      @keydown="handleKeyDown($event, index)"
    >
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue';

  const props = defineProps({
    default: String,

    digitCount: {
      type: Number,
      required: true
    }
  });

  let checkvalue = ref('');
  const digits = reactive([]) ;

  if (props.default && props.default.length === props.digitCount) {
    for (let i =0; i < props.digitCount; i++) {
      digits[i] = props.default.charAt(i)
    }
  } else {
    for (let i =0; i < props.digitCount; i++) {
      digits[i] = null;
    }
  }

  const otpCont = ref(null);
  const emit = defineEmits(['update:otp']);

const isDigitsFull = function () {
  for (const elem of digits) {
    if (elem == null || elem == undefined) {
      return false;
    }

  }

  return true;
};

  const handleKeyDown = function (event, index) {
    if (event.key !== "Tab" &&
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft"
    ) {
      event.preventDefault();
    }

    if (event.key === "Backspace") {
      digits[index] = null;

      if (index != 0) {
        (otpCont.value.children)[index-1].focus();
      }

      return;
    }

    if ((new RegExp('^([0-9])$')).test(event.key)) {
      digits[index] = event.key;

      if (index != props.digitCount - 1) {
        (otpCont.value.children)[index+1].focus();
      }
    }
    if (isDigitsFull()) {
        emit('update:otp', digits.join(''))
    }
  };
</script>

<style scoped>

</style>
