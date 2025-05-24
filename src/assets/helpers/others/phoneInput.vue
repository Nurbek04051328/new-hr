<template>
  <div class="relative space-y-1">
    <label :for="name" class="block text-sm font-medium text-changeText ml-1">
      {{ label }}
      <span v-if="required" class="text-sm text-red-500 font-medium">*</span>
    </label>

    <div class="relative">
      <span
        class="absolute pointer-events-none transform left-2 text-base font-medium text-mainText border-r border-placeholder h-full flex items-center justify-center pr-1"
        >+998</span
      >

      <input
        v-maska="'(##) ###-##-##'"
        type="text"
        :placeholder="placeholder"
        @keypress.enter="send"
        :name="name"
        :id="name"
        :disabled="disabled"
        autocomplete="off"
        :value="phoneWithoutPrefix"
        @input="updatePhone"
        :class="[
          'w-full pl-14 pr-2 py-1.5 rounded-md bg-transparent outline-none',
          'text-mainText text-base font-medium',
          'ring-1 focus:ring-offset-[1.5px]',
          'placeholder:text-placeholder placeholder:text-sm',
          error
            ? 'ring-red-500 focus:ring-offset-red-500'
            : 'ring-border focus:ring-offset-hoverAside',
        ]"
      />
    </div>

    <span
      :class="[
        'absolute transform text-sm text-red-500',
        'left-1 ',
        error
          ? 'transition duration-100 -translate-y-1'
          : 'opacity-0 -translate-y-7 pointer-events-none',
      ]"
    >
      {{ guide }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { vMaska } from 'maska/vue'

const model = defineModel()
defineProps({
  label: { type: String, required: true },
  name: { type: String, required: true },
  error: { type: Boolean, required: false },
  guide: { type: String, required: false },
  placeholder: { type: String, required: false },
  required: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
})

const emit = defineEmits(['send', 'update:modelValue'])

const phoneWithoutPrefix = computed(() =>
  model.value.startsWith('+998 ') ? model.value.slice(5) : model.value,
)

const updatePhone = (event) => {
  let inputValue = event.target.value.replace(/\D/g, '')

  if (inputValue.startsWith('998')) {
    inputValue = inputValue.slice(3)
  }

  if (inputValue.length > 9) {
    inputValue = inputValue.slice(0, 9)
  }

  let formattedPhone = '+998 '

  if (inputValue.length >= 2) {
    formattedPhone += `(${inputValue.slice(0, 2)}) `
  } else if (inputValue.length > 0) {
    formattedPhone += `(${inputValue}`
  }

  if (inputValue.length >= 5) {
    formattedPhone += `${inputValue.slice(2, 5)}-`
  } else if (inputValue.length > 2) {
    formattedPhone += `${inputValue.slice(2, 5)}`
  }

  if (inputValue.length >= 7) {
    formattedPhone += `${inputValue.slice(5, 7)}-`
  } else if (inputValue.length > 5) {
    formattedPhone += `${inputValue.slice(5, 7)}`
  }

  if (inputValue.length >= 9) {
    formattedPhone += `${inputValue.slice(7, 9)}`
  } else if (inputValue.length > 7) {
    formattedPhone += `${inputValue.slice(7, 9)}`
  }
  model.value = formattedPhone
}

const send = () => {
  emit('send')
}
</script>
