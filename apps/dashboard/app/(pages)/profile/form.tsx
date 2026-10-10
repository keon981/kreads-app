'use client'

import { useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { toast } from '@workspace/ui/components/toast'

import { SelectField, SwitchField } from '@/components/ui/field'

import type { OptionItem } from '@/types/option'
import type { LanguageCode, NotifyMethod, ProfileSettings } from './types'

const languageOptions: OptionItem<LanguageCode>[] = [
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
]

const notifyMethodOptions: OptionItem<NotifyMethod>[] = [
  { value: 'email', label: '電子郵件' },
  { value: 'webhook', label: 'Webhook' },
]

const switchFields: { key: 'shouldReceiveAnnouncements' | 'shouldNotifyLowQuota', label: string, description: string }[] = [
  { key: 'shouldReceiveAnnouncements', label: '接收系統公告', description: '新功能上線、維護排程等公告。' },
  { key: 'shouldNotifyLowQuota', label: '額度不足通知', description: '餘額低於預警門檻時立即通知。' },
]

interface ProfileSettingsFormProps {
  defaultSettings: ProfileSettings
}

export function ProfileSettingsForm({ defaultSettings }: ProfileSettingsFormProps): React.ReactNode {
  const [savedSettings, setSavedSettings] = useState<ProfileSettings>(defaultSettings)
  const [settings, setSettings] = useState<ProfileSettings>(defaultSettings)

  function setSettingsField<K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]): void {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  function handleThresholdChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const threshold = event.target.valueAsNumber
    setSettingsField('quotaWarningThreshold', Number.isNaN(threshold) ? 0 : threshold)
  }

  function handleEmailChangeClick(): void {
    toast.add({
      type: 'info',
      title: '已寄出驗證信',
      description: `請至 ${settings.email} 收信完成變更。`,
    })
  }

  function handleReset(): void {
    setSettings(savedSettings)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setSavedSettings(settings)
    toast.add({
      type: 'success',
      title: '已儲存變更',
      description: '個人設定已更新。',
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>帳號設定</CardTitle>
          <CardDescription>管理你的基本資料與通知偏好。</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>基本資料</FieldLegend>
              <FieldDescription>顯示名稱會出現在側邊欄與使用紀錄中。</FieldDescription>
              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="profile-display-name">顯示名稱</FieldLabel>
                  <Input
                    id="profile-display-name"
                    value={settings.displayName}
                    onChange={event => setSettingsField('displayName', event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-email">電子郵件</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      id="profile-email"
                      type="email"
                      value={settings.email}
                      onChange={event => setSettingsField('email', event.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={handleEmailChangeClick}>
                      變更
                    </Button>
                  </div>
                </Field>
                <SelectField
                  id="profile-language"
                  label="語言"
                  options={languageOptions}
                  value={settings.language}
                  onValueChange={value => setSettingsField('language', value)}
                />
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>通知設定</FieldLegend>
              <FieldDescription>選擇接收通知的方式，以及何時提醒你額度不足。</FieldDescription>
              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  id="profile-notify-method"
                  label="通知方式"
                  options={notifyMethodOptions}
                  value={settings.notifyMethod}
                  onValueChange={value => setSettingsField('notifyMethod', value)}
                />
                <Field>
                  <FieldLabel htmlFor="profile-quota-threshold">額度預警門檻（USD）</FieldLabel>
                  <Input
                    id="profile-quota-threshold"
                    type="number"
                    min={0}
                    step={1}
                    inputMode="numeric"
                    value={settings.quotaWarningThreshold}
                    onChange={handleThresholdChange}
                  />
                  <FieldDescription>餘額低於此金額時發送通知。</FieldDescription>
                </Field>
              </FieldGroup>
              <FieldGroup className="gap-3">
                {switchFields.map(({ key, label, description }) => (
                  <SwitchField
                    key={key}
                    id={`profile-${key}`}
                    label={label}
                    description={description}
                    checked={settings[key]}
                    onCheckedChange={checked => setSettingsField(key, checked)}
                    className="rounded-lg border p-3"
                  />
                ))}
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            取消
          </Button>
          <Button type="submit">儲存變更</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
