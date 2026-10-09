import { BlankLayout } from '@/components/layout/blank-layout'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return <BlankLayout>{children}</BlankLayout>
}
