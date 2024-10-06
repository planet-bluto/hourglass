import { lerp } from './maths'

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0]
}

export function rgbToHex(r: number, g: number, b: number) {
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  r = Math.min(r, 255)
  g = Math.min(g, 255)
  b = Math.min(b, 255)
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')
}

//colorChannelA and colorChannelB are ints ranging from 0 to 255
export function colorChannelMixer(
  colorChannelA: number,
  colorChannelB: number,
  amountToMix: number
) {
  var channelA: number = colorChannelA * amountToMix
  var channelB: number = colorChannelB * (1 - amountToMix)
  return parseInt(String(channelA + channelB))
}
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
export function colorMixer(rgbA: number[], rgbB: number[], amountToMix: number) {
  var r = lerp(amountToMix, rgbA[0], rgbB[0])
  var g = lerp(amountToMix, rgbA[1], rgbB[1])
  var b = lerp(amountToMix, rgbA[2], rgbB[2])
  return [r, g, b]
}

export function hexLerp(hexA: string, hexB: string, x: number) {
  let rgbA = hexToRgb(hexA)
  let rgbB = hexToRgb(hexB)

  if (rgbA && rgbB) {
    let newRgb = colorMixer(rgbA, rgbB, x)
    let newHex = rgbToHex(newRgb[0], newRgb[1], newRgb[2])
    return newHex
  } else {
    return hexA
  }
}
