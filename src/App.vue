<script setup lang="ts">
import Timer from './timer'

import { reactive } from 'vue'
import Hourglass from './components/Hourglass.vue'
import TimerElement from './components/Timer.vue'

import SettingsPanel from './components/SettingsPanel.vue'
import SettingsButton from './components/SettingsButton.vue'

const headerStyle = reactive({
  color: 'var(--theme-current-1)'
})
</script>

<template>
  <SettingsPanel />
  <header :style="headerStyle">
    <p>
      {{
        `${['ACTIVE', 'BREAK', 'LONG_BREAK'][Timer.state]}${Timer._currentState() == 'INACTIVE' ? ` (${Timer._currentState()})` : ''}`
      }}
    </p>
    <SettingsButton />
  </header>
  <main>
    <Hourglass />
    <TimerElement />
  </main>
</template>

<style scoped>
header {
  font-family: 'JUNEVILLE';
  font-size: 48px;
  display: flex;
  background: var(--theme-back-pos);
  width: 100%;
  height: 50px;
  margin-block-start: 0px;
  margin-block-end: 0px;
}

header > p {
  transform: translateY(-18px);
  margin-left: 24px;
}

main {
  height: calc(100% - 50px);
  display: flex;
}
</style>

<style>
* {
  --theme-current-1: v-bind('Timer.current_color_hex');
  --theme-current-2: v-bind('Timer.current_color_hex');
  --theme-current-3: v-bind('Timer.current_color_hex');
  /* transition: 500ms; */
  /* transition-property: var(--theme-current-1), var(--theme-current-2), var(--theme-current-3); */
}
</style>
