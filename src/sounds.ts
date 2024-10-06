import { Settings } from './settings'

var NO_SFX = false
var sfxVolume = 0.6

export async function playSound(sound: string, ext = 'wav', volumeOverride = sfxVolume) {
  if (!NO_SFX) {
    var audioElem = new Audio(`sfx/${sound}.${ext}`)
    audioElem.volume = Settings.sounds_enabled ? volumeOverride : 0
    audioElem.play()

    return new Promise<void>((res, rej) => {
      audioElem.addEventListener('ended', (event) => {
        res()
      })
    })
  } else {
    return new Promise<void>((res, rej) => {
      res()
    })
  }
}
