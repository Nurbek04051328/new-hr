<template>
  <miniModal>
    <div class="flex flex-col gap-4">
      <div class="h-fit grid grid-cols-2 gap-4">
        <severalSelect
          :error="v$.department.$invalid && v$.department.$dirty"
          :guide="`${$t('department')} ${$t('empty')}`"
          v-model="data.department"
          :options="department"
          :placeholder="`${$t('search')}...`"
          :label="$t('department')"
          :required="true"
          name="department"
        />
        <multipleSelect
          :error="v$.user.$invalid && v$.user.$dirty"
          :guide="`${$t('user')} ${$t('empty')}`"
          v-model="data.user"
          :label="$t('user')"
          :placeholder="`${$t('search')}...`"
          :options="users"
          option_title="fullName"
          :required="true"
          name="user"
        />
        <birthDate
          v-model="data.birthDay"
          :error="v$.birthDay.$invalid && v$.birthDay.$dirty"
          :label="$t('birthDate')"
          placeholder="dd-mm-yyyy"
          :required="true"
          :guide="`${$t('birthDate')} ${$t('empty')}`"
          name="birthDay"
        />
        <defaultInput
          :error="v$.address.$invalid && v$.address.$dirty"
          :guide="`${$t('address')} ${$t('empty')}`"
          :placeholder="$t('address')"
          :label="$t('address')"
          v-model="data.address"
          :required="true"
          name="address"
        />
      </div>

      <div
        :class="['grid grid-cols-2 gap-4 sm:grid-cols-1 h-fit']"
        v-for="(item, index) of data.history"
        :key="index"
        v-motion-slide-visible-once-bottom
      >
        <defaultInput
          :placeholder="$t('company')"
          :label="$t('company')"
          v-model="item.company"
          :name="`company${index}`"
        />
        <defaultInput
          :placeholder="$t('staffPosition')"
          :label="$t('staffPosition')"
          v-model="item.staffPosition"
          :name="`staffPosition${index}`"
        />
        <birthDate
          v-model="item.enterDate"
          :label="$t('enterDate')"
          placeholder="dd-mm-yyyy"
          :name="`enterDate${index}`"
        />
        <birthDate
          v-model="item.leaveDate"
          :label="$t('leaveDate')"
          placeholder="dd-mm-yyyy"
          :name="`leaveDate${index}`"
        />

        <div class="col-span-2">
          <div class="flex items-end gap-4">
            <div class="flex-1">
              <textareaPage
                :name="`comment${index}`"
                v-model="item.comment"
                :placeholder="$t('comment')"
                :label="$t('comment')"
              />
            </div>

            <XMarkIcon
              v-if="index !== 0"
              class="w-9 h-9 p-1 text-whiteText flex items-center justify-center mt-6 bg-red-500 rounded-md cursor-pointer hover:bg-red-500/80"
              @click="clearItem(index)"
            />

            <button
              v-if="index === 0 || index === data.history.length - 1"
              class="w-9 h-9 flex items-center justify-center mt-6 rounded-md text-whiteText cursor-pointer bg-btn hover:bg-btnHover disabled:cursor-not-allowed"
              @click="updateItems(index)"
            >
              <PlusIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 ml-auto mt-4">
        <button type="button" @click="close" class="cancelBtn">
          {{ $t('cancel') }}
        </button>

        <button type="button" @click="send" class="btn">
          {{ $t('add') }}
        </button>
      </div>
    </div>
  </miniModal>
</template>
<script setup>
import miniModal from '@/assets/helpers/overlays/miniModal.vue'
import defaultInput from '@/assets/helpers/others/defaultInput.vue'
import birthDate from '@/assets/helpers/others/birthDate.vue'
import textareaPage from '@/assets/helpers/others/textareaPage.vue'
import { PlusIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import multipleSelect from '@/assets/helpers/others/multipleSelect.vue'
import severalSelect from '@/assets/helpers/others/severalSelect.vue'
defineProps({
  department: {
    type: Array,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
})

const updateItems = (index) => {
  if (index === data.value.history.length - 1) {
    data.value.history.push({
      company: '',
      staffPosition: '',
      enterDate: '',
      leaveDate: '',
      comment: '',
    })
  } else {
    data.value.history.splice(index, 1)
  }
}

const clearItem = (index) => {
  data.value.history.splice(index, 1)
}

import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { workerStore } from '@/stores/data/worker'
const store = workerStore()

import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { formatToISODate, fromDateToClassic } from '@/helpers/func'
import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

const data = ref({
  user: '',
  department: [],
  groups: [],
  birthDay: '',
  address: '',
  history: [
    {
      company: '',
      staffPosition: '',
      enterDate: '',
      leaveDate: '',
      comment: '',
    },
  ],
})

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  user: { required },
  department: { required },
  birthDay: { required },
  address: { required },
}
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    user: '',
    department: [],
    groups: [],
    birthDay: '',
    address: '',
    history: [
      {
        company: '',
        staffPosition: '',
        enterDate: '',
        leaveDate: '',
        comment: '',
      },
    ],
  }
  v$.value.$reset()
}

const close = () => {
  reset()
  modal_store.setModal(false, '', '')
}

watch(modal, async (newVal) => {
  if (!newVal.show) {
    reset()
  }
})

watch(modal, async (newVal) => {
  if (newVal?.id?.length > 0) {
    const res = await store.getWorker(newVal?.id)
    console.log('Res', res.data)

    const formattedBirthDay = fromDateToClassic(res.data.worker.birthDay)
    const formattedHistoryDates = res.data.history.map((item) => ({
      ...item,
      enterDate: fromDateToClassic(item.enterDate),
      leaveDate: fromDateToClassic(item.leaveDate),
    }))

    const emptyData = [
      { company: '', staffPosition: '', enterDate: '', leaveDate: '', comment: '' },
    ]

    data.value = {
      ...res.data.worker,
      birthDay: formattedBirthDay,
      history: res.data.history.length ? formattedHistoryDates : emptyData,
    }
  }
})


// AJOYIB DASTURCHI KODLARI BOSHLANADI SHU YERDAN BOSHLAB
const send = async () => {
  try {
    v$.value.$touch()
    const { user, department, groups, birthDay, address, history, _id } = data.value

    if (!v$.value.$invalid) {
      const historyDate = history.map((item) => {
        const formattedEnterDate = formatToISODate(item.enterDate)
        const formattedLeaveDate = formatToISODate(item.leaveDate)
        const currentDate = new Date()

        if (formattedEnterDate > formattedLeaveDate) {
          notif.setNotif(true, dateValidationMessage, 'warning')
          return
        }

        const tenDaysBeforeNow = new Date()
        tenDaysBeforeNow.setDate(currentDate.getDate() - 10)

        if (new Date(formattedLeaveDate) > tenDaysBeforeNow) {
          notif.setNotif(true, leaveDateValidationMessage, 'warning')
          return
        }

        return {
          ...item,
          enterDate: formattedEnterDate,
          leaveDate: formattedLeaveDate,
        }
      })

      const formatDate = formatToISODate(birthDay)
      if (historyDate.includes(undefined)) return

      const payload = {
        user,
        department,
        groups,
        birthDay: formatDate,
        address,
        history: historyDate,
      }

      if (modal_store.modal?.id?.length > 0) {
        await store.saveWorker({ _id, ...payload })
      } else {
        await store.addWorker(payload)
      }

      close()
    }
  } catch (err) {
    console.warn('Error', err)
  }
}

const dateValidationMessage = {
  en: 'The start date cannot be earlier than the end date!',
  ru: 'Дата начала не может быть раньше даты увольнения!',
  uz: 'Ishga kirish sanasi ishdan ketish sanasidan kichik bo‘lishi mumkin emas!',
  kr: 'Ишга кириш санаси ишдан кетиш санасидан кичик бўлиши мумкин эмас!',
}

const leaveDateValidationMessage = {
  en: 'The leave date must be at least 10 days before today!',
  ru: 'Дата увольнения должна быть не менее чем за 10 дней до сегодняшней даты!',
  uz: 'Ishdan ketish sanasi bugungi sanadan kamida 10 kun oldin bo‘lishi lozim!',
  kr: 'Ишдан кетиш санаси бугунги санадан камида 10 кун олдин бўлиши лозим!',
}
</script>
