'use client'

import { useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Switch } from '@workspace/ui/components/switch'
import { toast } from '@workspace/ui/components/toast'

import { languageOptions, notifyMethodOptions } from '@/__mocks__/profile'

import type { LanguageCode, NotifyMethod, ProfileSettings } from '@/types/profile'

interface ProfileSettingsFormProps {
  defaultSettings: ProfileSettings
}

export function ProfileSettingsForm({ defaultSettings }: ProfileSettingsFormProps): React.ReactNode {
  const [savedSettings, setSavedSettings] = useState<ProfileSettings>(defaultSettings)
  const [settings, setSettings] = useState<ProfileSettings>(defaultSettings)

  function setSettingsField<K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]): void {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  function handleLanguageChange(value: LanguageCode | null): void {
    if (value) {
      setSettingsField('language', value)
    }
  }

  function handleNotifyMethodChange(value: NotifyMethod | null): void {
    if (value) {
      setSettingsField('notifyMethod', value)
    }
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
                <Field>
                  <FieldLabel htmlFor="profile-language">語言</FieldLabel>
                  <Select items={languageOptions} value={settings.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="profile-language" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>通知設定</FieldLegend>
              <FieldDescription>選擇接收通知的方式，以及何時提醒你額度不足。</FieldDescription>
              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="profile-notify-method">通知方式</FieldLabel>
                  <Select items={notifyMethodOptions} value={settings.notifyMethod} onValueChange={handleNotifyMethodChange}>
                    <SelectTrigger id="profile-notify-method" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notifyMethodOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
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
                <Field orientation="horizontal" className="rounded-lg border p-3">
                  <FieldContent>
                    <FieldLabel htmlFor="profile-receive-announcements">接收系統公告</FieldLabel>
                    <FieldDescription>新功能上線、維護排程等公告。</FieldDescription>
                  </FieldContent>
                  <Switch
                    id="profile-receive-announcements"
                    checked={settings.receiveAnnouncements}
                    onCheckedChange={checked => setSettingsField('receiveAnnouncements', checked)}
                  />
                </Field>
                <Field orientation="horizontal" className="rounded-lg border p-3">
                  <FieldContent>
                    <FieldLabel htmlFor="profile-notify-low-quota">額度不足通知</FieldLabel>
                    <FieldDescription>餘額低於預警門檻時立即通知。</FieldDescription>
                  </FieldContent>
                  <Switch
                    id="profile-notify-low-quota"
                    checked={settings.notifyLowQuota}
                    onCheckedChange={checked => setSettingsField('notifyLowQuota', checked)}
                  />
                </Field>
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
