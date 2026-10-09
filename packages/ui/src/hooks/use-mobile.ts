import { MOBILE_QUERY } from '@workspace/ui/configs/constants'
import { useInitialIsMobile } from '@workspace/ui/contexts/device-provider'
import { useMediaQuery } from 'usehooks-ts'

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY, {
    defaultValue: useInitialIsMobile(),
    initializeWithValue: false,
  })
}
