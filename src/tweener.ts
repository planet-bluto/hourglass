var active_tweens: Array<any> = []
export function tween(
  duration: number,
  easingFunc: Function,
  func: Function,
  anim = true,
  FPS = 144
) {
  const frameWait = (func: TimerHandler) => {
    setTimeout(func, 1000 / FPS)
  }
  var frameFunc = anim ? requestAnimationFrame : frameWait

  var int = active_tweens.length
  var prom = new Promise<boolean>((res, _rej) => {
    var start: number | null = null
    function main(curr = Date.now()) {
      if (start == null) {
        start = curr
      }
      var progressMS = curr - start
      var progressPerc = progressMS / duration
      var perc = easingFunc(progressPerc)

      if (active_tweens[int] != false) {
        if (progressPerc >= 1) {
          perc = 1
          endTween()
        } else {
          frameFunc(main)
        }
        func(perc)
      } else {
        // print("CANCELED")
        endTween()
      }

      function endTween() {
        active_tweens[int] = false
        res(true)
      }
    }
    frameFunc(main)
  })

  active_tweens.push(prom)

  return int
}

export function awaitTween(tween_int: number) {
  var active_tween = active_tweens[tween_int]
  if (active_tween) {
    return active_tween
  } else {
    return null
  }
}

export function cancelTween(tween_int: number) {
  active_tweens[tween_int] = false
}

export function cancelAllTweens() {
  for (var i = active_tweens.length - 1; i >= 0; i--) {
    active_tweens[i] = false
  }
}

export function EASE_LINEAR(x: any) {
  return x
}

export function EASE_OUT_QUART(x: number) {
  return 1 - Math.pow(1 - x, 4)
}

export function EASE_OUT_BOUNCE(x: number) {
  const n1 = 7.5625
  const d1 = 2.75

  if (x < 1 / d1) {
    return n1 * x * x
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375
  }
}

export function EASE_IN_BOUNCE(x: number) {
  return 1 - EASE_OUT_BOUNCE(1 - x)
}

export function EASE_IN_OUT_BOUNCE(x: number) {
  return x < 0.5 ? (1 - EASE_OUT_BOUNCE(1 - 2 * x)) / 2 : (1 + EASE_OUT_BOUNCE(2 * x - 1)) / 2
}

export function EASE_OUT_BACK(x: number) {
  const c1 = 1.70158
  const c3 = c1 + 1

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

// function EASE_OUT_BOUNCE(x) {
// 	const n1 = 7.5625;
// 	const d1 = 2.75;

// 	if (x < 1 / d1) {
// 	    return n1 * x * x;
// 	} else if (x < 2 / d1) {
// 	    return n1 * (x -= 1.5 / d1) * x + 0.75;
// 	} else if (x < 2.5 / d1) {
// 	    return n1 * (x -= 2.25 / d1) * x + 0.9375;
// 	} else {
// 	    return n1 * (x -= 2.625 / d1) * x + 0.984375;
// 	}
// }

export function EASE_IN_OUT_SINE(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2
}

export function EASE_IN_OUT_CUBIC(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
