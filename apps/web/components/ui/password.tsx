'use client'

import * as React from 'react'

import { RiEyeLine, RiEyeOffLine } from '@remixicon/react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

interface PasswordProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
}

function Password({
  className,
  visible,
  onVisibleChange,
  ...props
}: PasswordProps) {
  const [internalVisible, setInternalVisible] = React.useState(false)

  const isControlled = visible !== undefined
  const isVisible = isControlled ? visible : internalVisible

  const toggleVisible = () => {
    const next = !isVisible
    if (!isControlled) {
      setInternalVisible(next)
    }
    onVisibleChange?.(next)
  }

  return (
    <InputGroup className={className}>
      <InputGroupInput type={isVisible ? 'text' : 'password'} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          onClick={toggleVisible}
        >
          {isVisible ? <RiEyeOffLine /> : <RiEyeLine />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { Password }
