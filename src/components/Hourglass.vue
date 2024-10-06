<script setup lang="js">
import Timer from '../timer'

import { reactive } from 'vue'
import { tween, EASE_IN_OUT_CUBIC } from '../tweener'
import { lerp } from '../maths'
import SocketEvents from '../socket_events'

SocketEvents.on('mao', (status) => {
  console.log('Got MAO MAAAOOO MAO MAO MAAO', status)
})

const HourglassVisualStyle = reactive({
  transform: `rotate(45deg) scale(0.75)`
})

setInterval(() => {
  if (Timer.running) {
    tween(900, EASE_IN_OUT_CUBIC, (x) => {
      var angle = lerp(x, 0, 180)
      HourglassVisualStyle.transform = `rotate(${Math.round(angle)}deg) scale(0.75)`
      // console.log(HourglassVisualStyle.transform)
    })
  }
}, 1000)
</script>

<template>
  <div id="hourglass">
    <svg
      :style="HourglassVisualStyle"
      width="519"
      height="669"
      viewBox="0 0 519 669"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M55.4677 557.136L223.212 334.145L55.4677 111.154C35.4593 84.5552 54.4358 46.5339 87.7196 46.5339L431.845 46.5339C465.129 46.5339 484.105 84.5553 464.097 111.154L296.353 334.145L464.097 557.136C484.105 583.735 465.129 621.756 431.845 621.756L87.7196 621.756C54.4358 621.756 35.4592 583.735 55.4677 557.136ZM260.108 285.53L395.922 104.984L124.293 104.984L260.108 285.53ZM395.922 563.306L260.108 382.76L124.293 563.306H395.922Z"
        fill="var(--theme-current-2)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M471.793 587.431C470.484 595.788 466.573 603.625 460.681 609.695C453.581 617.009 443.606 621.756 431.845 621.756L87.7196 621.756C75.9583 621.756 65.9834 617.008 58.884 609.695C52.9919 603.625 49.0803 595.788 47.7717 587.431C46.195 577.361 48.3974 566.535 55.4677 557.136L223.212 334.145L55.4677 111.154C48.3974 101.755 46.1951 90.9293 47.7718 80.8594C49.0804 72.5019 52.9919 64.6648 58.884 58.595C65.9835 51.2815 75.9583 46.5339 87.7196 46.5339L431.845 46.5339C443.606 46.5339 453.581 51.2815 460.681 58.5951C466.573 64.6648 470.484 72.502 471.793 80.8595C473.37 90.9294 471.167 101.755 464.097 111.154L296.353 334.145L464.097 557.136C471.167 566.535 473.37 577.361 471.793 587.431ZM354.402 334.145L501.168 139.04C544.175 81.8692 503.386 0.145055 431.845 0.145051L87.7196 0.14502C16.1786 0.145012 -24.6101 81.8689 18.3966 139.04L55.4677 111.154L18.3966 139.04L165.163 334.145L18.3965 529.25C-24.6101 586.421 16.1786 668.145 87.7196 668.145L431.845 668.145C503.386 668.145 544.175 586.421 501.168 529.25L354.402 334.145Z"
        fill="#0D0D0D"
      />
    </svg>
  </div>
</template>

<style scoped>
#hourglass {
  width: 35%;
  height: 100%;
  display: flex;
  align-items: center;
  place-content: center;
}

#hourglass > svg {
  max-width: 100%;
  max-height: 100%;
}
</style>
