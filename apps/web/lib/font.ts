import { Geist_Mono, Oxanium, Space_Grotesk } from 'next/font/google'

import { cn } from '@workspace/ui/lib/utils'

const oxaniumHeading = Oxanium({ subsets: ['latin'], variable: '--font-heading' })

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

// Shared by the root layout and global-not-found, which renders without the layout
export const fontClassName = cn('antialiased', fontMono.variable, 'font-sans', spaceGrotesk.variable, oxaniumHeading.variable)
