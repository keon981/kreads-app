import { Toaster } from '@workspace/ui/components/toast'
import { DeviceProvider } from '@workspace/ui/contexts/device-provider'

import { SignInDialog } from '@/components/blocks/sign-in'
import { AuthProvider } from '@/contexts/auth-provider'
import { QueryProvider } from '@/contexts/query-provider'

interface ProvidersProps
  extends React.ComponentProps<typeof AuthProvider>,
  Pick<React.ComponentProps<typeof DeviceProvider>, 'initialIsMobile'> {}

export function Providers({
  children,
  initialIsMobile,
  ...props
}: ProvidersProps): React.ReactNode {
  return (
    <DeviceProvider initialIsMobile={initialIsMobile}>
      <QueryProvider>
        <AuthProvider {...props}>
          {children}

          {/* fallback */}
          <SignInDialog />
          <Toaster />
        </AuthProvider>
      </QueryProvider>
    </DeviceProvider>
  )
}
