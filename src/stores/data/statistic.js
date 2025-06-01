import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, computed } from 'vue'

const url = '/statistic'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRouter, useRoute } from 'vue-router'

export const statisticStore = defineStore('statisticStore', () => {
  const loading = loadingStore()
  const notif = notifStore()
  const router = useRouter()
  const route = useRoute()

  const statistic = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  // const allDoor = async (search) => {
  //   try {
  //     const { data } = await api.get(url, {
  //       params: {
  //         limit: door.limit,
  //         page: door.page,
  //         title: search,
  //       },
  //     })
  //     console.log('Door', data)
  //     door.data = [
  //       ...data.data.map((item) => {
  //         return {
  //           ...item,
  //           status: item.status == 'active',
  //         }
  //       }),
  //     ]
  //     door.count = data?.count
  //   } catch (err) {
  //     console.warn('Error', err)
  //   }
  // }

  const getHomeLastInfo = async () => {
    try {
      const {data} = await api.get(`${url}/home/events-count`)
      console.log("data", data);
      
      return data
    } catch (err) {
      console.warn('Error', err)
    }
  }
  const getHomeLastEventsInfo = async () => {
    try {
      const {data} = await api.get(`${url}/home/last-events`)
      console.log("data", data);
      
      return data
    } catch (err) {
      console.warn('Error', err)
    }
  }

  return {
    getHomeLastInfo,
    getHomeLastEventsInfo
  }
})

