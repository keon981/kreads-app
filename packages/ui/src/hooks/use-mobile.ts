import { useInitialIsMobile } from '@workspace/ui/components/device-provider'
import { MOBILE_QUERY } from '@workspace/ui/lib/constants'
import { useMediaQuery } from 'usehooks-ts'

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY, {
    defaultValue: useInitialIsMobile(),
    initializeWithValue: false,
  })
}
