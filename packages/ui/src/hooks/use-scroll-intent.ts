import { useBoolean, useEventListener } from 'usehooks-ts'

const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp', ' '])

const PASSIVE_LISTENER_OPTIONS: AddEventListenerOptions = { passive: true }

// Only user input counts: `scroll` also fires for scroll restoration and programmatic scrolling
export function useHasScrollIntent(): boolean {
  const { value: hasScrollIntent, setTrue: setHasScrollIntent } = useBoolean(false)

  useEventListener('wheel', setHasScrollIntent, undefined, PASSIVE_LISTENER_OPTIONS)
  useEventListener('touchmove', setHasScrollIntent, undefined, PASSIVE_LISTENER_OPTIONS)
  useEventListener('keydown', (event) => {
    if (SCROLL_KEYS.has(event.key)) setHasScrollIntent()
  })

  return hasScrollIntent
}
