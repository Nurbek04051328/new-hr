<template>
  <div class="px-[25px] py-[15px] rounded-[13px] shadow-sm bg-hover space-y-4">
    <div class="flex justify-between">
      <div class="text-[#817295] text-[18px] w-[55%]">
        <div class="flex gap-4 mb-4">
          <div class="text-[#483D5B] text-[18px] font-bold">
            Количество всех записей
          </div>
        </div>
        <div class=" text-base">
          <div
            v-for="(item, index) of list"
            :key="index"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2"
            >
              <div :class="['w-3 h-3 rounded-full', `${item.bg}`]"></div>
              <div>{{ item.title }}</div>
            </div>
            <div class="text-[#483D5B] text-[17px] font-bold">{{ item.value }}</div>
          </div>
        </div>
      </div>
      <apexchart width="180" type="radialBar" :options="options" :series="series"></apexchart>
    </div>
  </div>
</template>
<script setup>
import { computed, watchEffect, defineProps } from 'vue'
const props = defineProps(['count'])
// Icon import
import { UserGroupIcon } from '@heroicons/vue/24/outline'
import ApexCharts from 'apexcharts'

// const series = computed(() => [props?.count?.activated || 0, props?.count?.notActivated || 0])
const series = computed(() => list.value.map((t) => t.value) || [])

const list = computed(() => [
  {
    class: '#22c55e',
    bg: 'bg-greenColor',
    title: 'Общий',
    value:  props?.count?.total || 0,
  },
  {
    class: '#ef4444',
    bg: 'bg-redColor',
    title: 'Сегодня',
    value: props?.count?.today || 0,
  },
  {
    class: '#60a5fa',
    bg: 'bg-blueColor',
    title: 'Еженедельно',
    value: props?.count?.week || 0,
  },
  {
    class: '#fde047',
    bg: 'bg-yellowColor',
    title: 'Ежемесячно',
    value: props?.count?.month || 0,
  },
])

const options = computed(() => ({
  chart: {
    id: `Hr-vuechart-events`,
    type: 'radialBar',
    height: 180
  },
  labels: list.value.map((t) => t.title) || [],
  legend: {
    show: false
  },
  colors: list.value.map((t) => t.class) || [],
  dataLabels: {
    enabled: false
  }
}))

watchEffect(() => {
  if (series.value.every((val) => val !== undefined)) {
    ApexCharts.exec('vuechart-events', 'updateSeries', series.value)
  }
})
</script>