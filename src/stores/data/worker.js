import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive } from 'vue'

const url = '/worker'
import { notifStore } from '../helpers/notification'
const notif = notifStore()

import { loadingStore } from '../helpers/loading'
const loading = loadingStore()

import { useRouter, useRoute } from 'vue-router'

export const workerStore = defineStore('workerStore', () => {
  const router = useRouter()
  const route = useRoute()

  const worker = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const nextWorker = async (limit = 1) => {
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: worker.limit,
      },
    })
    console.log('NEXT', data)

    if (worker.count >= route?.query?.limit ? route?.query?.limit : worker.limit) {
      worker.data = [...worker.data, ...data.data.slice(0, limit-1)]
    } else {
      worker.data = [...data.data]
    }
  }

  const changePage = (value) => {
    worker.page = value
    router.push({ name: 'worker', query: { page: worker.page } })
  }

  const allWorker = async (search, department) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: worker.limit,
          page: worker.page,
          fullName: search,
          department,
        },
      })
      console.log('Worker', data)
      worker.data = [...data.data]
      worker.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addWorker = async (payload) => {
    console.log('Payload', payload)

    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      console.log('Kelgan', data)

      worker.data = [data, ...worker.data.slice(0, worker.limit - 1)]
      worker.count += 1
      loading.setLoading(false)
      notif.setNotif(true, workerAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveWorker = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.put(`${url}`, payload)
      console.log('Save Worker', data)

      worker.data = worker.data?.map((item) => {
        if (item?._id == data?._id) return data
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, workerUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getWorker = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeWorker = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`${url}/${id}`)
      worker.data = worker.data?.filter((item) => item?._id !== id)
      worker.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, workerDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }

  return {
    worker,
    allWorker,
    addWorker,
    saveWorker,
    getWorker,
    removeWorker,
    nextWorker,
    changePage,
  }
})

const workerDeletedMessage = {
  en: 'Worker deleted',
  ru: 'Работник удалён',
  uz: 'Ishchi o‘chirildi',
  kr: 'Ишчи ўчирилди',
}

const workerUpdatedMessage = {
  en: 'Worker updated',
  ru: 'Работник обновлён',
  uz: 'Ishchi yangilandi',
  kr: 'Ишчи янгиланди',
}

const workerAddedMessage = {
  en: 'Worker added',
  ru: 'Работник добавлен',
  uz: 'Ishchi qo‘shildi',
  kr: 'Ишчи қўшилди',
}
