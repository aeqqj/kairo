import { animated, useReducedMotion, useSpring } from '@react-spring/web'
import { Sparkles } from 'lucide-react'

export default function App() {
  const reducedMotion = useReducedMotion()
  const entrance = useSpring({
    from: { opacity: 0, y: 8 },
    to: { opacity: 1, y: 0 },
    immediate: reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  })

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <animated.h1
        className="flex items-center gap-3 text-4xl font-bold"
        style={entrance}
      >
        <Sparkles aria-hidden="true" />
        Kairo
      </animated.h1>
    </main>
  )
}
