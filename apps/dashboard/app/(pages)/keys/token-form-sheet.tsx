'use client'

import { useId, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet'
import { Textarea } from '@workspace/ui/components/textarea'

import { tokenGroups } from '@/__mocks__/keys'
import { SelectField, SwitchField } from '@/components/ui/field'

import { getTokenFormValues } from './utils'

import type { Token, TokenFormValues } from './types'

interface TokenFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  token: Token | null
  onSubmit: (values: TokenFormValues) => void
}

export function TokenFormSheet({ open, onOpenChange, token, onSubmit }: TokenFormSheetProps): React.ReactNode {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{token ? '編輯令牌' : '新增令牌'}</SheetTitle>
          <SheetDescription>
            {token ? '修改令牌的額度、期限與存取限制。' : '建立新的 API 令牌，建立後即可在應用程式中使用。'}
          </SheetDescription>
        </SheetHeader>
        <TokenForm key={token?.id ?? 'new'} token={token} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  )
}

interface TokenFormProps {
  token: Token | null
  onSubmit: (values: TokenFormValues) => void
}

function TokenForm({ token, onSubmit }: TokenFormProps): React.ReactNode {
  const [values, setValues] = useState<TokenFormValues>(() => getTokenFormValues(token))
  const fieldId = useId()

  function setValue<TKey extends keyof TokenFormValues>(key: TKey, value: TokenFormValues[TKey]): void {
    setValues(previous => ({ ...previous, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onSubmit(values)
  }

  const listFields: { key: 'models' | 'allowIps', label: string, placeholder: string, description: string }[] = [
    { key: 'models', label: '可用模型', placeholder: 'gpt-4o\nclaude-sonnet-4', description: '每行一個模型，留空表示不限制。' },
    { key: 'allowIps', label: 'IP 限制', placeholder: '203.0.113.10\n198.51.100.0/24', description: '每行一個 IP 或 CIDR，留空表示不限制。' },
  ]

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`${fieldId}-name`}>名稱</FieldLabel>
            <Input
              id={`${fieldId}-name`}
              required
              placeholder="例如：正式環境主令牌"
              value={values.name}
              onChange={event => setValue('name', event.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`${fieldId}-quota`}>額度（USD）</FieldLabel>
            <Input
              id={`${fieldId}-quota`}
              type="number"
              min={0}
              step={0.01}
              inputMode="decimal"
              disabled={values.isUnlimited}
              value={values.isUnlimited ? '' : values.totalQuota}
              placeholder={values.isUnlimited ? '無限額度' : undefined}
              onChange={event => setValue('totalQuota', Number(event.target.value))}
            />
          </Field>
          <SwitchField
            id={`${fieldId}-unlimited`}
            label="無限額度"
            checked={values.isUnlimited}
            onCheckedChange={checked => setValue('isUnlimited', checked)}
          />

          <FieldSeparator />

          <Field>
            <FieldLabel htmlFor={`${fieldId}-expires`}>過期時間</FieldLabel>
            <Input
              id={`${fieldId}-expires`}
              type="date"
              disabled={values.isNeverExpires}
              required={!values.isNeverExpires}
              value={values.isNeverExpires ? '' : values.expiresAt}
              onChange={event => setValue('expiresAt', event.target.value)}
            />
          </Field>
          <SwitchField
            id={`${fieldId}-never-expires`}
            label="永不過期"
            checked={values.isNeverExpires}
            onCheckedChange={checked => setValue('isNeverExpires', checked)}
          />

          <FieldSeparator />

          <SelectField
            id={`${fieldId}-group`}
            label="分組"
            description="分組決定可用的渠道與計費倍率。"
            options={tokenGroups}
            value={values.group}
            onValueChange={value => setValue('group', value)}
          />

          {listFields.map(({ key, label, placeholder, description }) => (
            <Field key={key}>
              <FieldLabel htmlFor={`${fieldId}-${key}`}>{label}</FieldLabel>
              <Textarea
                id={`${fieldId}-${key}`}
                rows={3}
                placeholder={placeholder}
                value={values[key]}
                onChange={event => setValue(key, event.target.value)}
              />
              <FieldDescription>{description}</FieldDescription>
            </Field>
          ))}
        </FieldGroup>
      </div>
      <SheetFooter className="flex-row justify-end border-t">
        <SheetClose render={<Button type="button" variant="outline" />}>取消</SheetClose>
        <Button type="submit">{token ? '儲存變更' : '建立令牌'}</Button>
      </SheetFooter>
    </form>
  )
}
