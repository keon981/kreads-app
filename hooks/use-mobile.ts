import { useMediaQuery } from 'usehooks-ts'

import { MOBILE_QUERY } from '@/configs/constants'
import { useInitialIsMobile } from '@/contexts/device-provider'

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY, {
    defaultValue: useInitialIsMobile(),
    initializeWithValue: false,
  })
}
