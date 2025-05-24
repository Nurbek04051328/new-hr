<template>
  <div class="parent" v-if="count > 0 && !loading.loading">
    <div class="child">
      <div class="tableDiv">
        <table class="table">
          <thead class="thead">
            <tr>
              <th class="th-first">№</th>
              <th class="th">{{ $t('photo') }}</th>
              <th class="th">{{ $t('fullName') }}</th>
              <th class="th">{{ $t('department') }}</th>
              <th class="th">{{ $t('role') }}</th>
              <th class="th-last"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) of workers"
              :key="item._id"
              :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
            >
              <td class="td-first">{{ (page - 1) * limit + index + 1 }}</td>
              <td class="td-img">
                <div class="size-14 overflow-hidden">
                  <img
                    v-if="item.user?.faceUrl?.length > 0"
                    :src="`${url}/${item.user?.faceUrl}`"
                    alt=""
                    class="object-contain size-full"
                  />
                  <UserIcon v-else :class="['object-contain size-full text-placeholder']" />
                </div>
              </td>
              <td class="td-second">{{ item.user?.fullName || '' }}</td>
              <td class="td">{{ item.department?.name || '' }}</td>
              <td class="td">{{ item.user?.role || '' }}</td>

              <td class="td-last">
                <dropdownPage
                  name="worker"
                  :id="item._id"
                  :boolen="index >= (count > 8 ? count - 3 : count)"
                />
                <tableButton name="worker" :id="item._id" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <removePage @remove="removeItem()" />

  <nothingPage :visibility="count <= 0 && !loading.loading" />
</template>
<script setup>
import nothingPage from '@/assets/helpers/others/nothingPage.vue'
import removePage from '@/assets/helpers/overlays/removePage.vue'
import { url } from '@/helpers/api'
import { UserIcon } from '@heroicons/vue/24/outline'
import dropdownPage from '@/assets/table/dropdownPage.vue'
import tableButton from '@/assets/table/tableButton.vue'

defineProps({
  workers: {
    type: Array,
    requreid: true,
  },
  count: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
})

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { removeStore } from '@/stores/helpers/remove'
const remove = removeStore()

import { workerStore } from '@/stores/data/worker'
const store = workerStore()

const removeItem = async () => {
  try {
    await store.removeWorker(remove.remove?.id)
    await store.nextWorker()
    remove.close()
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>
