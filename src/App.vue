<template>
  <notificationPage />
  <router-view />
</template>
<script setup>
  import { onMounted, } from 'vue'
  import notificationPage from './assets/helpers/overlays/notificationPage.vue'
  
  import cookies from 'vue-cookies'
  import { socket } from './socket'
  
  import { notifStore } from '@/stores/helpers/notification'
  const notif = notifStore()



  onMounted(async () => {
    // Socket ishlash
    if (cookies.get('access-token')) {
      // Event sinxranizatsiya hodisasi
      socket.on("sync-end", async() => {
        notif.setNotif(true, sinxrEndMessage, 'success')
      });
      
    } 
  })

  const sinxrEndMessage = {
    en: 'Synchronization completed.',
    ru: 'Синхронизация завершилась.',
    uz: 'Sinxronizatsiya tugadi.',
    kr: 'Синхронизация тугади.',
  }

</script>
