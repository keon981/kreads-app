import { useEffect } from 'react'

import { DeviceProvider } from '@workspace/ui/components/device-provider'
import { Toaster } from '@workspace/ui/components/toast'

import type { Decorator, Preview } from '@storybook/react-vite'

import './preview.css'

// Mirrors apps/web: dark mode is the `dark` class on <html>
function ThemeRoot({ isDark, children }: { isDark: boolean, children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return children
}

const withTheme: Decorator = (Story, context) => (
  <ThemeRoot isDark={context.globals.theme === 'dark'}>
    <Story />
  </ThemeRoot>
)

// Sidebar and useIsMobile need DeviceProvider; toast needs Toaster
const withProviders: Decorator = Story => (
  <DeviceProvider initialIsMobile={false}>
    <div className="font-sans antialiased">
      <Story />
    </div>
    <Toaster />
  </DeviceProvider>
)

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withProviders, withTheme],
  parameters: {
    layout: 'centered',
  },
}

export default preview
