import { useMousePosition } from '../hooks/useCustomHooks'
import { useThemeStore } from '../hooks/useStore'

// Interactive cursor glow effect that follows the mouse
export default function CursorGlow() {
  const { x, y } = useMousePosition()
  const darkMode = useThemeStore(s => s.darkMode)

  if (!darkMode) return null

  return (
    <div
      className="cursor-glow hidden lg:block"
      style={{ left: x, top: y }}
    />
  )
}
