<template>
  <div class="h-[calc(100%-60px)] p-4 pb-2">
    <div class="flex items-start gap-4 h-full sm:block">
      <indexSetting />

      <div class="flex-1 flex flex-col h-full">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
import indexSetting from './indexSetting.vue'
</script>
