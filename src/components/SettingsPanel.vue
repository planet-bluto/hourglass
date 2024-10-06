<script setup lang="ts">
import { ref } from 'vue'
import { SettingsEvents, Settings, updateSettings } from '../settings'
import TimerStateConfiguration from './settings_components/TimerStateConfiguration.vue'
import Checkbox from './settings_components/Checkbox.vue'

var opened = false
SettingsEvents.on('opened', togglePanel)

function clickedFade(e: any) {
  togglePanel()
}

function togglePanel() {
  console.log(Settings)
  opened = !opened

  var the_queue: number[] = []
  function queue(func: Function, ms: number) {
    clear_queue()
    var int = setTimeout(func, ms)
    the_queue.push(int)
  }
  function clear_queue() {
    the_queue.forEach((int) => {
      clearInterval(int)
      clearTimeout(int)
    })
    the_queue = []
  }

  var settings_container = document.getElementById('settings-container')
  var settings_fade = document.getElementById('settings-fade')
  if (settings_container != null && settings_fade != null) {
    if (opened) {
      settings_container.setAttribute('opened', '')
      settings_fade.style.setProperty('display', 'inline')
    } else {
      settings_container.removeAttribute('opened')
      queue(() => {
        if (settings_fade != null) {
          settings_fade.style.setProperty('display', 'none')
        }
      }, 500)
    }
  }
}

// -------------------------------------------------------------- //

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

function unwrapTime(raw_ms: number) {
  let ms = raw_ms + 950

  let hour = Math.floor(ms / HOUR)
  const minute = Math.floor((ms - HOUR * hour) / MINUTE)
  const second = Math.floor((ms - HOUR * hour - minute * MINUTE) / SECOND)

  return { hour, minute, second }
}

function stringifyTime(hour: number, minute: number, second: number) {
  return (
    String(hour).padStart(2, '0') +
    ':' +
    String(minute).padStart(2, '0') +
    ':' +
    String(second).padStart(2, '0')
  )
}

const activeDuration = ref({
  hour: unwrapTime(Settings.durations.active).hour,
  minute: unwrapTime(Settings.durations.active).minute,
  second: unwrapTime(Settings.durations.active).second
})

const breakDuration = ref({
  hour: unwrapTime(Settings.durations.break).hour,
  minute: unwrapTime(Settings.durations.break).minute,
  second: unwrapTime(Settings.durations.break).second
})

const longBreakDuration = ref({
  hour: unwrapTime(Settings.durations.long_break).hour,
  minute: unwrapTime(Settings.durations.long_break).minute,
  second: unwrapTime(Settings.durations.long_break).second
})

const refDurations = {
  active: activeDuration,
  break: breakDuration,
  long_break: longBreakDuration
}

function durationUpdate(event: InputEvent, key: string) {
  var thisRef = refDurations[key]

  let { hour, minute, second } = thisRef.value
  let duration = hour * HOUR + minute * MINUTE + second * SECOND

  console.log(`HOLY SHIT ${key} => `, stringifyTime(hour, minute, second), ' || ', duration)

  if (Object.keys(Settings.durations).includes(key)) {
    Settings.durations[key] = duration
    updateSettings()
  }
}

function checkboxUpdate(event: InputEvent, key: string) {
  if (!(event.target instanceof HTMLInputElement)) {
    return
  }
  console.log(`HOLY SHIT ${key} => `, event.target.checked)

  if (Object.keys(Settings).includes(key)) {
    Settings[key] = event.target.checked
    updateSettings()
  }
}

function portUpdate(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return
  }

  Settings.web_socket.port = Number(event.target.value)
  updateSettings()
}
</script>

<template>
  <div id="settings-container">
    <div id="settings-panel">
      <div id="settings-header"><p>SETTINGS</p></div>
      <div id="settings-inner-cont">
        <div id="settings-tsg-container">
          <TimerStateConfiguration
            type="active"
            v-model:hour="activeDuration.hour"
            v-model:minute="activeDuration.minute"
            v-model:second="activeDuration.second"
            @input="durationUpdate"
          />
          <TimerStateConfiguration
            type="break"
            v-model:hour="breakDuration.hour"
            v-model:minute="breakDuration.minute"
            v-model:second="breakDuration.second"
            @input="durationUpdate"
          />
          <TimerStateConfiguration
            type="long-break"
            v-model:hour="longBreakDuration.hour"
            v-model:minute="longBreakDuration.minute"
            v-model:second="longBreakDuration.second"
            @input="durationUpdate"
          />
        </div>
        <hr class="rounded" />
        <Checkbox
          settings_key="sounds_enabled"
          label="Enable Sounds"
          :checked="Settings.sounds_enabled"
          @input="checkboxUpdate"
        />
        <Checkbox
          settings_key="desktop_notifications_enabled"
          label="Enable Desktop Notifications"
          :checked="Settings.desktop_notifications_enabled"
          @input="checkboxUpdate"
        />
        <hr class="rounded" />
        <Checkbox
          settings_key="web_socket_enabled"
          label="Enable Web Socket Server"
          :checked="Settings.web_socket_enabled"
          @input="checkboxUpdate"
        />
        <div class="port-cont">
          <p>Port:</p>
          <input
            type="number"
            :value="Settings.web_socket.port"
            @input="
              ($event) => {
                portUpdate($event)
              }
            "
          />
        </div>
      </div>
    </div>
    <div id="settings-fade" :style="'display: none'" v-on:click="clickedFade"></div>
  </div>
</template>

<style scoped>
#settings-header {
  font-family: 'JUNEVILLE';
  font-size: 48px;
  display: flex;
  background: var(--theme-back-pos);
  width: 100%;
  height: 50px;
  margin-block-start: 0px;
  margin-block-end: 0px;
  border-top-left-radius: 20px;
}

#settings-header > p {
  transform: translateY(-18px);
  margin-left: 24px;
}

#settings-panel {
  position: absolute;
  z-index: 100;
  width: 50vw;
  height: 100vh;
  right: -50vw;
  background: var(--theme-back);
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  transition: 500ms;
}

*[opened] > #settings-panel {
  right: 0px;
}

#settings-inner-cont {
  width: calc(100% - 30px);
  height: calc(100% - 30px - 50px);
  padding: 15px;
  overflow-y: scroll;
  overflow-x: hidden;
}

#settings-fade {
  position: absolute;
  z-index: 99;
  width: 100vw;
  height: 100vh;
  background: #0000007c;
  opacity: 0;
  transition: 500ms;
}

*[opened] > #settings-fade {
  opacity: 1;
}

#settings-tsg-container {
  display: flex;
  flex-direction: column;
  place-content: space-between;
  height: 300px;
}

.port-cont {
  display: flex;
  font-size: 24px;
}

.port-cont > p {
  margin-right: 10px;
}

.port-cont > input {
  border: none;
  background: var(--theme-back-neg);
  color: white;
  border-radius: 5px;
  font-size: 24px;
}

/* Rounded border */
hr.rounded {
  border: none;
  border-top: 8px solid var(--theme-back-pos);
  border-radius: 5px;
  margin-top: 32px;
  margin-bottom: 32px;
}
</style>
