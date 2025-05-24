<template>
  <logoutPage />
  <overlayMenu />
  <searchPage />
  <!-- <loadingPage /> -->
  <div :class="['h-full flex']">
    <defaultAside />
    <div class="h-full flex-1 overflow-hidden">
      
      <router-view />
    </div>
  </div>
</template>
<script setup>
import defaultAside from '@/views/home/defaultAside.vue'
import overlayMenu from '@/assets/helpers/overlays/overlayMenu.vue'
import searchPage from '@/assets/helpers/overlays/searchPage.vue'
import loadingPage from '@/assets/helpers/others/loadingPage.vue'

// OVERLAYS
import logoutPage from '@/assets/helpers/overlays/logoutPage.vue'
</script>
