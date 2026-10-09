interface BlankLayoutProps {
  children: React.ReactNode
}

export function BlankLayout({ children }: BlankLayoutProps): React.ReactNode {
  return (
    <div className="flex min-h-svh w-full">
      <main className="flex w-full flex-1 bg-background">
        {children}
      </main>
    </div>
  )
}
