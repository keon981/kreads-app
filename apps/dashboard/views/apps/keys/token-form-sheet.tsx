'use client'

import { useId, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet'
import { Switch } from '@workspace/ui/components/switch'
import { Textarea } from '@workspace/ui/components/textarea'

import { tokenGroups } from '@/__mocks__/keys'
import { useKeys } from '@/views/apps/keys/keys-context'
import { getTokenFormValues } from '@/views/apps/keys/token-utils'

import type { Token, TokenFormValues } from '@/types/keys'

export function TokenFormSheet(): React.ReactNode {
  const { isSheetOpen, setSheetOpen, editingToken } = useKeys()

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{editingToken ? '編輯令牌' : '新增令牌'}</SheetTitle>
          <SheetDescription>
            {editingToken ? '修改令牌的額度、期限與存取限制。' : '建立新的 API 令牌，建立後即可在應用程式中使用。'}
          </SheetDescription>
        </SheetHeader>
        <TokenForm key={editingToken?.id ?? 'new'} token={editingToken} />
      </SheetContent>
    </Sheet>
  )
}

interface TokenFormProps {
  token: Token | null
}

function TokenForm({ token }: TokenFormProps): React.ReactNode {
  const { saveToken } = useKeys()
  const [values, setValues] = useState<TokenFormValues>(() => getTokenFormValues(token))
  const fieldId = useId()

  function setValue<TKey extends keyof TokenFormValues>(key: TKey, value: TokenFormValues[TKey]): void {
    setValues(previous => ({ ...previous, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    saveToken(values)
  }

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
          <Field orientation="horizontal">
            <Switch
              id={`${fieldId}-unlimited`}
              checked={values.isUnlimited}
              onCheckedChange={checked => setValue('isUnlimited', checked)}
            />
            <FieldLabel htmlFor={`${fieldId}-unlimited`}>無限額度</FieldLabel>
          </Field>

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
          <Field orientation="horizontal">
            <Switch
              id={`${fieldId}-never-expires`}
              checked={values.isNeverExpires}
              onCheckedChange={checked => setValue('isNeverExpires', checked)}
            />
            <FieldLabel htmlFor={`${fieldId}-never-expires`}>永不過期</FieldLabel>
          </Field>

          <FieldSeparator />

          <Field>
            <FieldLabel htmlFor={`${fieldId}-group`}>分組</FieldLabel>
            <Select
              items={tokenGroups}
              value={values.group}
              onValueChange={(value) => {
                if (value !== null) {
                  setValue('group', value)
                }
              }}
            >
              <SelectTrigger id={`${fieldId}-group`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokenGroups.map(group => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>分組決定可用的渠道與計費倍率。</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${fieldId}-models`}>可用模型</FieldLabel>
            <Textarea
              id={`${fieldId}-models`}
              rows={3}
              placeholder={'gpt-4o\nclaude-sonnet-4'}
              value={values.models}
              onChange={event => setValue('models', event.target.value)}
            />
            <FieldDescription>每行一個模型，留空表示不限制。</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${fieldId}-ips`}>IP 限制</FieldLabel>
            <Textarea
              id={`${fieldId}-ips`}
              rows={3}
              placeholder={'203.0.113.10\n198.51.100.0/24'}
              value={values.allowIps}
              onChange={event => setValue('allowIps', event.target.value)}
            />
            <FieldDescription>每行一個 IP 或 CIDR，留空表示不限制。</FieldDescription>
          </Field>
        </FieldGroup>
      </div>
      <SheetFooter className="flex-row justify-end border-t">
        <SheetClose render={<Button type="button" variant="outline" />}>取消</SheetClose>
        <Button type="submit">{token ? '儲存變更' : '建立令牌'}</Button>
      </SheetFooter>
    </form>
  )
}
