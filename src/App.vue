<template>
  <notificationPage />
  <router-view />
</template>
<script setup>
  import cookies from 'vue-cookies'
  import notificationPage from './assets/helpers/overlays/notificationPage.vue'
  
  import { socket } from './socket'
  import { onMounted, } from 'vue'
  
  import { notifStore } from '@/stores/helpers/notification'
  const notif = notifStore()

  import { doorStore } from './stores/data/door'
  const door__store = doorStore()
  import { eventStore } from './stores/data/event'
  const event__store = eventStore()


  onMounted(async () => {
    // Socket ishlash
    if (cookies.get('access-token')) {
      // Event sinxranizatsiya hodisasi
      socket.on("sync-end", async() => {
        notif.setNotif(true, sinxrEndMessage, 'success')
        console.log('sync-end');
        
      });
      socket.on("doors-status", async(status) => {
        // console.log('Doors status updated:', status);
        door__store.statusDoors = [...status];
      });
      socket.on("new-events", async(count) => {
        // console.log('new-events', count.count);
        if(count.count > 0) {
          await event__store.newEventForSocket(count.count)
        }
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
