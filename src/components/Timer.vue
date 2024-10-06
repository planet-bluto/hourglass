<script setup lang="ts">
import Timer from '../timer'

import PauseIcon from './icons/PauseIcon.vue'
import PlayIcon from './icons/PlayIcon.vue'
import BackIcon from './icons/BackIcon.vue'
import NextIcon from './icons/NextIcon.vue'

import { clamp, lerp } from '../maths'

import { computed, reactive, ref } from 'vue'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

var EXAMPLE_TEST = 34 * MINUTE + 56 * SECOND

function zeroPad(str: string) {
  if (str.length < 2) {
    return '0' + str
  } else {
    return str
  }
}

function timerText(raw_ms: number, padMinute = true) {
  let ms = raw_ms + 950

  const HOURS = Math.floor(ms / HOUR)
  const MINUTES = Math.floor((ms - HOUR * HOURS) / MINUTE)
  const SECONDS = Math.floor((ms - HOUR * HOURS - MINUTES * MINUTE) / SECOND)

  return `${HOURS > 0 ? `${HOURS}:` : ''}${!padMinute && HOURS == 0 ? MINUTES : zeroPad(String(MINUTES))}:${zeroPad(String(SECONDS))}`
}

// ------------------------------------------------ //

// var duration = computed({
//   get() {
//     return Timer.time
//   },
//   set(newVal) {
//     Timer.time = newVal
//   }
// })

// ------------------------------------------------ //

const timelinePerc = computed({
  get() {
    return Timer._getPerc()
  },
  set(newVal) {}
})

var isTimelineDown = false
var timerWasRunning = false

function timelineDown(e) {
  isTimelineDown = true
  timerWasRunning = Timer.running
}

function timelineInputting(e) {
  var timelineElem = document.getElementById('timer-timeline')
  if (isTimelineDown && timelineElem) {
    var perc = clamp(
      (e.clientX - timelineElem.getBoundingClientRect().x) / timelineElem.clientWidth,
      0,
      1
    )
    Timer.seek(perc)
    // Timer.time = lerp(perc, Timer.TIMES[Timer.state], 0)
  }
}
document.body.addEventListener('mousemove', timelineInputting)

function timelineUp(e) {
  if (isTimelineDown) {
    var timelineElem = document.getElementById('timer-timeline')
    if (timelineElem) {
      var perc = clamp(
        (e.clientX - timelineElem.getBoundingClientRect().x) / timelineElem.clientWidth,
        0,
        1
      )

      Timer.seek(perc)
    }
    isTimelineDown = false
    if (timerWasRunning) {
      Timer.doneSeeking()
    }
  }
}
document.body.addEventListener('mouseup', timelineUp)

// ------------------------------------------------ //

function pauseTimer(_e: any) {
  Timer.pause()
  console.log(Timer.getTime())
}

function unpauseTimer(_e: any) {
  console.log('Starting Timer...')
  Timer.start()
}

function resetTimer(_e: any) {
  Timer.reset()
}

function skipTimerState(_e: any) {
  Timer.skip()
}
</script>

<template>
  <div id="timer">
    <div id="timer-inner">
      <div id="timer-label">
        <p id="timer-duration">{{ timerText(Timer.time) }}</p>
      </div>
      <div
        id="timer-timeline"
        v-on:mousedown="timelineDown"
        :style="{ '--progress': timelinePerc * 100 + '%' }"
      ></div>
      <div id="timer-buttons">
        <button class="timer-button" v-on:click="resetTimer"><BackIcon /></button>
        <button v-if="Timer.running" class="timer-button" v-on:click="pauseTimer">
          <PauseIcon />
        </button>
        <button v-else class="timer-button" v-on:click="unpauseTimer"><PlayIcon /></button>
        <button class="timer-button" v-on:click="skipTimerState"><NextIcon /></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#timer {
  display: flex;
  width: 65%;
  height: 100%;
  align-items: center;
  place-content: center;
  flex-direction: column;
}

#timer-inner {
  display: flex;
  width: 80%;
  height: 100%;
  align-items: center;
  place-content: center;
  flex-direction: column;
}

#timer-label {
  display: flex;
  width: 100%;
  place-content: center;
  background: var(--theme-back-pos);
  border-radius: 20px;
}

#timer-duration {
  font-family: 'RubikMonoOne';
  font-size: 64px;
  font-weight: 700;
  margin-top: 10px;
}

#timer-timeline {
  width: 100%;
  height: 20px;
  border-radius: 30px;
  border: solid var(--theme-back-neg) 12px;
  /* background: var(--theme-back-neg); */
  --progress: 25%;
  background: linear-gradient(
    to right,
    var(--theme-current-1) 0%,
    var(--theme-current-1) var(--progress),
    var(--theme-back-neg) var(--progress)
  );
  margin-top: 24px;
  margin-bottom: 15px;
}

#timer-buttons {
  display: grid;
  grid-template-columns: repeat(3, 64px);
  grid-gap: 15px;
}

.timer-button {
  background: none;
  border: none;
  width: 64px;
  height: 64px;
  padding: 0px;
}

.timer-button > svg {
  width: 64px;
  height: 64px;
}

.timer-button > svg > path {
  fill: var(--theme-current-1);
}
</style>
