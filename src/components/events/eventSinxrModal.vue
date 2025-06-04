<template>
  <miniModal title="Синхронизация событий">
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-1 bg-inherit">
        <VueDatePicker 
          v-model="date" 
          :placeholder="`Выберите месяц`" 
          range 
          :multi-calendars="{ solo: true }" 
          :locale="`ru`"
          :translations="datePickerTranslations"
          :inline="true"
          :auto-apply="true"
          class="w-full placeholder:text-black-500 peer" 
          :class="currentTheme === 'dark' ? 'dp-dark' : 'dp-light'"
        />
      </div>

      <div class="flex items-center gap-4 ml-auto mt-4">

        <button type="button" @click="syncData" class="btn">
          Синхронизация
        </button>
      </div>
    </div>
  </miniModal>
</template>
<script setup>

import { ref, watch, computed } from 'vue'
import miniModal from '@/assets/helpers/overlays/miniModal.vue'
import { storeToRefs } from 'pinia'
import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme } = storeToRefs(mode)


import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { eventStore } from '@/stores/data/event'
const store = eventStore()

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

let date = ref([])





const reset = () => {
  date.value = []
}


const close = () => {
  reset()
  modal_store.close()
}


const syncData = async () => {
  try {
    loading.setLoading(true); 
    // console.log("date.value", date.value);
    
    await store.syncEvent({
      start: date.value[0] ? date.value[0].toISOString() : null,
      end: date.value[1] ? date.value[1].toISOString() : null,
    }); 
    loading.setLoading(false);
    date.value = [] 
    close()
  } catch (err) {
    console.error('Sync error:', err);
    loading.setLoading(false);
  }
};

watch(modal, (newVal) => {
  if (!newVal?.show) {
    reset();
  }
})


const datePickerTranslations = {
  cancel: 'Отмена',
  select: 'Выбрать',
  range: 'Диапазон',
  startDate: 'Дата начала',
  endDate: 'Дата окончания',
  prevMonth: 'Предыдущий месяц',
  nextMonth: 'Следующий месяц',
  months: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ],
  weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};


</script>
