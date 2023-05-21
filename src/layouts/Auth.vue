<script setup>
  import Navbar from "@/components/Navbars/AuthNavbar.vue";
  import FooterSmall from "@/components/Footers/FooterSmall.vue";
</script>
<template>
  <div>
    <!-- <navbar /> -->
    <main>
      <section class="relative w-full h-full py-40 min-h-screen">
        <div
          class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
        ></div>
        <slot />
        <footer-small absolute />
      </section>
    </main>
  </div>
</template>