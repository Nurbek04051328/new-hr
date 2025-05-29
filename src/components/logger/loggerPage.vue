<template>

  <defaultHeader  />
  <defaultMain>
    <headPart name="event" :newToggleBtn="false" :count="event.count">
    </headPart>

    <eventTable
      :events="event.data"
      :count="event.count"
      :limit="event.limit"
      :page="event.page"
    />

    <paginationPage
      v-model="store.event.page"
      :count="event.count"
      :limit="event.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultMain>
</template>
<script setup>

import defaultHeader from '@/views/home/defaultHeader.vue'
import defaultMain from '@/views/home/defaultMain.vue'

import eventTable from './eventTable.vue'

import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'


import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { eventStore } from '@/stores/data/event'
const store = eventStore()
const { event } = storeToRefs(store)

import { userStore } from '@/stores/data/users'
const user_store = userStore()

import { departmentStore } from '@/stores/data/department'
const department = departmentStore()

import { branchStore } from '@/stores/data/branch'
const branch = branchStore()

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()


import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()





watch(search, async (newVal) => {
  if (!newVal) {
    await store.allEvent()
  }
})

const changePage = (value) => {
  store.changePage(value)
  getData()
}





const selectedLimit = ref(event.value.limit)

const updateLimit = async (value) => {
  event.value.limit = value || selectedLimit.value
  getData()
  if (event.value.page > 1) {
    event.value.page = 1
    route.query.page = 1
    getData()
  }
  const newQuery = { ...route.query }
  if (value !== 30) {
    newQuery.limit = value
  } else {
    delete newQuery.limit
  }
  router.replace({ query: newQuery })
}






const getData = async () => {
  try {
    loading.setLoading(true)
    await Promise.all([store.allEvent(searchEventData.value), department.allDepartment(), branch.allBranch(), user_store.allUsers()])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    event.value.limit = selectedLimit.value
  }
  store.event.page = +route.query.page || 1
  getData()
})

</script>