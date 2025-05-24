import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, computed } from 'vue'

const url = '/door'
import { notifStore } from '../helpers/notification'
const notif = notifStore()

import { loadingStore } from '../helpers/loading'
const loading = loadingStore()

import { useRouter, useRoute } from 'vue-router'

export const doorStore = defineStore('doorStore', () => {
  const router = useRouter()
  const route = useRoute()

  const door = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const activeDoors = computed(() => {
    return door.data.filter((item) => item.status)
  })

  const nextDoor = async (limit = 1) => {
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: door.limit,
      },
    })
    console.log('NEXT', data)

    if (door.count >= route?.query?.limit ? route?.query?.limit : door.limit) {
      door.data = [
        ...door.data,
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status == 'active',
          }
        }),
      ]
    } else {
      door.data = [...data.data]
    }
  }

  const changePage = (value) => {
    door.page = value
    router.push({ name: 'door', query: { page: door.page } })
  }

  const allDoor = async (search) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: door.limit,
          page: door.page,
          title: search,
        },
      })
      console.log('Door', data)
      door.data = [
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status == 'active',
          }
        }),
      ]
      door.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addDoor = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      console.log('Created Door', data)
      data.status = data.status == 'active'
      door.data = [data, ...door.data.slice(0, door.limit - 1)]
      door.count += 1
      loading.setLoading(false)
      notif.setNotif(true, doorAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveDoor = async (payload) => {
    try {
      loading.setLoading(true)
      console.log("ketdi payload", payload);
      
      const { data } = await api.put(`${url}`, payload)
      console.log('Keldi payload', data)

      door.data = door.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status == 'active',
          }
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, doorUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getDoor = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeDoor = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`${url}/${id}`)
      door.data = door.data?.filter((item) => item?._id !== id)
      door.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, doorDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }

  const statusDoor = async (id) => {
    try {
      if (!id) return false
      const { data } = await api.get(`${url}/status/${id}`)

      door.data = door.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status == 'active',
          }
        return item
      })
      notif.setNotif(true, statusUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error Status', err)
    }
  }

  return {
    door,
    allDoor,
    addDoor,
    saveDoor,
    getDoor,
    removeDoor,
    nextDoor,
    changePage,
    statusDoor,
    activeDoors,
  }
})

const statusUpdatedMessage = {
  en: 'Status updated',
  ru: 'Статус обновлён',
  uz: 'Holat yangilandi',
  kr: 'Ҳолат янгиланди',
}

const doorDeletedMessage = {
  en: 'Door deleted',
  ru: 'Дверь удалена',
  uz: 'Eshik o‘chirildi',
  kr: 'Эшик ўчирилди',
}

const doorUpdatedMessage = {
  en: 'Door updated',
  ru: 'Дверь обновлена',
  uz: 'Eshik yangilandi',
  kr: 'Эшик янгиланди',
}

const doorAddedMessage = {
  en: 'Door added',
  ru: 'Дверь добавлена',
  uz: 'Eshik qo‘shildi',
  kr: 'Эшик қўшилди',
}
