import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive } from 'vue'

const url = '/event'
import { notifStore } from '../helpers/notification'
const notif = notifStore()

import { loadingStore } from '../helpers/loading'
const loading = loadingStore()

import { useRouter, useRoute } from 'vue-router'




export const eventStore = defineStore('eventStore', () => {
  const router = useRouter()
  const route = useRoute()

  const event = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const allEvent = async (search) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: event.limit,
          page: event.page,
          ...search
        },
      })
      console.log('event', data)
      event.data = [...data.data]
      event.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addCalendarEvent = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      console.log('Created Event', data)
      event.data = [data, ...event.data.slice(0, event.limit - 1)]
      event.count += 1
      loading.setLoading(false)
      notif.setNotif(true, eventAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const changePage = (value) => {
    event.page = value
    router.push({ name: 'event', query: { page: event.page } })
  }
  const changeWorkerPage = (value) => {
    event.page = value
    router.push({ name: 'worker-events', query: { page: event.page } })
  }


  const syncEvent = async (payload) => {
    try {
      console.log("payload", payload);
      console.log(`${url}/sync`);
      
      
      // loading.setLoading(true)
      const { data } = await api.post(`${url}/sync`, payload)
      console.log("data", data);
      
      // loading.setLoading(false)
      if(data) notif.setNotif(true, sinxrStartMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getEvent = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }
  
  
  const endEvent = async () => {
    notif.setNotif(true, sinxrEndMessage, 'success')
  }


  return {
    event,
    allEvent,
    getEvent,
    changePage,
    syncEvent,
    endEvent,
    changeWorkerPage,
    addCalendarEvent
  }
})

const eventAddedMessage = {
  en: 'Event added',
  ru: 'События добавлена',
  uz: 'Zapis qo‘shildi',
  kr: 'Запис қўшилди',
}


const sinxrStartMessage = {
  en: 'Synchronization has started.',
  ru: 'Синхронизация началась.',
  uz: 'Sinxronizatsiya boshlandi.',
  kr: 'Синхронизация бошланди.',
}
const sinxrEndMessage = {
  en: 'Synchronization completed.',
  ru: 'Синхронизация завершилась.',
  uz: 'Sinxronizatsiya tugadi.',
  kr: 'Синхронизация тугади.',
}


