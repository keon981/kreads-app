import { AuthProvider } from '@/contexts/auth-provider'
import { ThemeProvider } from '@/contexts/theme-provider'

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof AuthProvider>): React.ReactNode {
  return (
    <ThemeProvider>
      <AuthProvider {...props}>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
