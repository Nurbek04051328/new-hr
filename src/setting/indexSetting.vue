<template>
  <div class="min-w-[200px] h-full xl:hidden">
    <div class="bg-aside shadow p-1 h-full rounded-md">
      <nav class="flex flex-col h-full gap-2">
        <router-link
          v-for="item of setting"
          :key="item?.name"
          :to="{ name: item?.name || '' }"
          :class="[
            'flex items-center gap-1',
            'text-whiteText',
            'py-1.5 px-2 rounded-md hover:bg-hoverAside hover:text-blueText',
            item?.name == route?.name ? 'bg-hoverAside !text-blueText' : 'bg-transparent text-whiteText',
          ]"
        >
          <component :is="item?.meta?.icon" class="w-6 h-6" />
          <p class="flex-1">
            {{ item?.meta?.title[locale] || '' }}
          </p>
        </router-link>
      </nav>
    </div>
  </div>
</template>
<script setup>
import { setting } from '@/router/setting/setting'
import { useRoute } from 'vue-router'
const route = useRoute()

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>
