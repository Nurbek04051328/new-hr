<template>
  <div class="h-[calc(100%-60px)] p-4 pb-2">
    <div class="flex flex-col items-start gap-4 sm:block">
      <indexSetting />

      <div class="flex flex-col h-full w-full">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
import indexSetting from './indexSetting.vue'
</script>
