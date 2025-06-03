<template>
  <usersModal :department="d_store.activeDepartment" :door="door_store.door.data" />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultMain>
    <headPart name="workers" :newToggleBtn="true" :count="users.count">
      <getSelect
        @update-type="updateType"
        v-model="searchUserData.department"
        :name="departmentMessage"
        class="w-full"
        placeholder="Выберите отдел"
        :array="d_store.activeDepartment"
        option_title="name"
      />
      <typeSelect
        @update-type="updateType"
        v-model="searchUserData.role"
        class="w-full"
        placeholder="Выберите роль"
        :name="roleMessage"
        :array="role"
      />
      <button
        @click="clearSearch"
        class="flex items-center gap-2 px-2 py-2 bg-redColor text-white rounded hover:bg-hoverRed"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
      <button
        @click="updateType"
        class="flex items-center gap-2 px-2 py-2 bg-greenColor text-white rounded hover:bg-hoverGreen"
      >
        <MagnifyingGlassIcon class="w-5 h-5" />
      </button>
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
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import typeSelect from '@/assets/helpers/others/typeSelect.vue'
import { role } from '@/helpers/object'
import getSelect from '@/assets/helpers/others/getSelect.vue'
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

const searchUserData = ref({
  department: '',
  role: '',
})
const updateType = async () => {
  if (searchUserData.value) {
    loading.setLoading(true)
    const filtered = Object.fromEntries(
      Object.entries(searchUserData.value).filter(([_, v]) => v !== '')
    )
    await store.allUsers(filtered)
    return loading.setLoading(false)
  }
  getData()
}

const clearSearch = async () => {
  searchUserData.value = {
    department: '',
    role: '',
  }
  getData()
};

const getData = async () => {
  try {
    loading.setLoading(true)
    await Promise.all([store.allUsers(), d_store.allDepartment(), door_store.allDoor({status: 'active', doorStatus:'online'})])
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
const departmentMessage = {
  en: 'Department',
  ru: 'Отдел',
  uz: 'Bo‘lim',
  kr: 'Бўлим',
}
</script>
