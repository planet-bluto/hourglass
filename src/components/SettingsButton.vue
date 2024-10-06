<script setup lang="ts">
import SettingsIcon from './icons/SettingsIcon.vue'

import { SettingsEvents } from '../settings'

function clicked(e: any) {
  SettingsEvents.emit('opened')
}
</script>

<template>
  <button v-on:click="clicked">
    <SettingsIcon />
  </button>
</template>

<style scoped>
button {
  border: none;
  background: none;
  position: absolute;
  right: 0px;
  padding: 0px;
  width: 50px;
  height: 50px;
}

button > svg {
  width: 80%;
  height: 80%;
}
</style>
