import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, ref, computed } from 'vue'

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
  // const lastStatistic = reactive({})
  const countAllEvent = reactive({})
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
      if(data) lastStatistic.value = {...data}
    } catch (err) {
      console.warn('Error', err)
    }
  }
  const getHomeLastEventsInfo = async () => {
    try {
      const {data} = await api.get(`${url}/home/last-events`)
      console.log("getHomeLastEventsInfo", data);
      if (data) countAllEvent.value = {...data}
      return data
    } catch (err) {
      console.warn('Error', err)
    }
  }

  return {
    getHomeLastInfo,
    getHomeLastEventsInfo,
    countAllEvent
  }
})

