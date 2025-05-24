<template>
  <workerModal :department="department.activeDepartment || []" :users="user_store.activeUser" />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultMain>
    <headPart name="worker" :newToggleBtn="true">
      <getSelect
        @update-type="updateType"
        v-model="selectedType"
        :selected-type="selectedType"
        :name="departmentMessage"
        :array="department.activeDepartment"
        option_title="name"
      />
    </headPart>

    <workerTable
      :workers="worker.data"
      :count="worker.count"
      :limit="worker.limit"
      :page="worker.page"
    />

    <paginationPage
      v-model="store.worker.page"
      :count="worker.count"
      :limit="worker.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultMain>
</template>
<script setup>
import defaultHeader from '@/views/home/defaultHeader.vue'
import defaultMain from '@/views/home/defaultMain.vue'
import workerModal from './workerModal.vue'
import workerTable from './workerTable.vue'
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import getSelect from '@/assets/helpers/others/getSelect.vue'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { workerStore } from '@/stores/data/worker'
const store = workerStore()
const { worker } = storeToRefs(store)

import { userStore } from '@/stores/data/users'
const user_store = userStore()

import { departmentStore } from '@/stores/data/department'
const department = departmentStore()

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

const search = ref('')
const searchEvent = async () => {
  if (search.value?.length >= 3) {
    await store.allWorker(search.value, null)
  } else {
    if (search.value) {
      await store.allWorker()
    }
  }
}
watch(search, async (newVal) => {
  if (!newVal) {
    await store.allWorker()
  }
})

const changePage = (value) => {
  store.changePage(value)
  getData()
}

const selectedLimit = ref(worker.value.limit)
const updateLimit = async (value) => {
  worker.value.limit = value || selectedLimit.value
  getData()
  if (worker.value.page > 1) {
    worker.value.page = 1
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

const selectedType = ref(0)
const updateType = async () => {
  if (selectedType.value) {
    loading.setLoading(true)
    await store.allWorker(null, selectedType.value)
    return loading.setLoading(false)
  }
  getData()
}

const getData = async () => {
  try {
    loading.setLoading(true)
    await Promise.all([store.allWorker(), department.allDepartment(), user_store.allUsers()])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    worker.value.limit = selectedLimit.value
  }
  store.worker.page = +route.query.page || 1
  getData()
})

const departmentMessage = {
  en: 'Department',
  ru: 'Отдел',
  uz: 'Bo‘lim',
  kr: 'Бўлим',
}
</script>
