<template>
  <usersModal :department="d_store.activeDepartment" :door="door_store.activeDoors" />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultMain>
    <headPart name="workers" :newToggleBtn="true">
      <typeSelect
        @update-type="updateType"
        v-model="selectedType"
        :selected-type="selectedType"
        :name="roleMessage"
        :array="role"
      />
    </headPart>

    <usersTable :user="users.data" :count="users.count" :page="users.page" :limit="users.limit" />

    <paginationPage
      v-model="store.users.page"
      :count="users.count"
      :limit="users.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultMain>
</template>
<script setup>
import defaultHeader from '@/views/home/defaultHeader.vue'
import defaultMain from '@/views/home/defaultMain.vue'
import usersTable from './usersTable.vue'
import usersModal from './usersModal.vue'
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import typeSelect from '@/assets/helpers/others/typeSelect.vue'
import { role } from '@/helpers/object'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { userStore } from '@/stores/data/users'
const store = userStore()
const { users } = storeToRefs(store)

import { departmentStore } from '@/stores/data/department'
const d_store = departmentStore()

import { doorStore } from '@/stores/data/door'
const door_store = doorStore()

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

const search = ref('')
const searchEvent = async () => {
  if (search.value?.length >= 2) {
    await store.allUsers(null, search.value)
  } else {
    if (search.value) {
      await store.allUsers()
    }
  }
}
watch(search, async (newVal) => {
  if (!newVal) {
    await store.allUsers()
  }
})

const changePage = (value) => {
  store.changePage(value)
  getData()
}

const selectedLimit = ref(users.value?.limit)
const updateLimit = (value) => {
  users.value.limit = value || selectedLimit.value
  getData()
  if (users.value.page > 1) {
    users.value.page = 1
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
    await store.allUsers(selectedType.value)
    return loading.setLoading(false)
  }
  getData()
}

const getData = async () => {
  try {
    loading.setLoading(true)
    await Promise.all([store.allUsers(), d_store.allDepartment(), door_store.allDoor()])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = +route.query.limit
    users.value.limit = selectedLimit.value
  }
  store.users.page = +route.query.page || 1
  getData()
})

const roleMessage = {
  en: 'Role',
  ru: 'Роль',
  uz: 'Roli',
  kr: 'Роли',
}
</script>
