'use client'

import { RiMoonLine, RiSunLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { useTheme } from 'next-themes'

export function ThemeSwitch(): React.ReactNode {
  const { resolvedTheme, setTheme } = useTheme()

  const handleToggleTheme = (): void => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button variant="ghost" size="icon" aria-label="切換主題" onClick={handleToggleTheme}>
      <RiSunLine className="dark:hidden" />
      <RiMoonLine className="hidden dark:block" />
    </Button>
  )
}
