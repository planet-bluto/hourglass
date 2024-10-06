<script setup lang="ts">
import { onMounted } from 'vue'
import PaletteIcon from '../icons/PaletteIcon.vue'

const props = defineProps(['type'])

const hour = defineModel('hour')
const minute = defineModel('minute')
const second = defineModel('second')

const emit = defineEmits(['input'])

function fixZero() {
  var inputs: HTMLInputElement[] = Array.from(
    document.querySelectorAll('.tsg-input-container > input')
  )
  inputs.forEach((input) => {
    input.value = String(input.value).padStart(2, '0')
  })
}

onMounted(() => {
  fixZero()
})

function toTitleCase(str: String) {
  let words = str.split('-')
  let newWords: string[] = []

  words.forEach((word: String) => {
    newWords.push(word.charAt(0).toUpperCase() + word.slice(1))
  })

  return newWords.join(' ')
}
</script>

<template>
  <div class="timer-state-configuration">
    <div class="tsg-header-container">
      <PaletteIcon
        class="tsg-palette-icon"
        :style="`fill: var(--theme-${props.type || `inactive`})`"
      />
      <p class="tsg-header" :style="`color: var(--theme-${props.type || `inactive`})`">
        {{ toTitleCase(props.type || 'inactive') }}
      </p>
    </div>
    <div class="tsg-input-container">
      <input
        v-model="hour"
        @input="
          ($event) => {
            emit('input', $event, props.type?.replace('-', '_'))
            fixZero()
          }
        "
        type="number"
        min="0"
        step="1"
      />
      <p>:</p>
      <input
        v-model="minute"
        @input="
          ($event) => {
            emit('input', $event, props.type?.replace('-', '_'))
            fixZero()
          }
        "
        type="number"
        min="0"
        max="59"
        step="1"
      />
      <p>:</p>
      <input
        v-model="second"
        @input="
          ($event) => {
            emit('input', $event, props.type?.replace('-', '_'))
            fixZero()
          }
        "
        type="number"
        min="0"
        max="59"
        step="1"
      />
    </div>
  </div>
</template>

<style>
/* .timer-state-configuration {
  margin-bottom
} */

.tsg-palette-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.tsg-header-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.tsg-header {
  font-size: 20px;
}

.tsg-input-container {
  display: flex;
  place-content: space-between;
  width: 200px;
}

.tsg-input-container > * {
  align-self: center;
  font-size: 32px;
  font-family: Comfortaa;
}

.tsg-input-container > input {
  border: none;
  background: var(--theme-back-neg);
  border-radius: 9px;
  width: 60px;
  height: 40px;
  color: white;
  text-align: center;
}
</style>
