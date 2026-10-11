export default function BlankLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background p-4">
      {children}
    </main>
  )
}
