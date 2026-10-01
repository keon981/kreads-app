import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/auth-provider'

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
