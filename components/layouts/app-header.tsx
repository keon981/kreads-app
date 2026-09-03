import React from 'react'

function AppHeader() {
  return (
    <header
      className="sticky top-0 z-20 h-18 w-full flex shrink-0 items-center gap-2 bg-background/95 md:bg-background"
    >
      {/* bottom */}
      <div className="absolute bottom-0 left-2 w-[98%] md:border-b border-border"></div>

      {/* bottom left */}
      <div className="hidden md:block absolute top-15 -left-3 size-9 overflow-hidden">
        <div className="absolute top-2.75 left-3 size-12.5 md:border-t md:border-l border-border rounded-3xl shadow-[0_0_0_12px] shadow-background"></div>
      </div>

      {/* bottom right */}
      <div className="hidden md:block absolute overflow-hidden size-9 top-15 -right-3">
        <div className="absolute top-2.75 right-3 size-12.5 md:border-t md:border-r border-border rounded-3xl shadow-[0_0_0_12px] shadow-background"></div>
      </div>
    </header>
  )
}

export default AppHeader
