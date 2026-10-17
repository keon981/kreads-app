import { RiSearchLine } from '@remixicon/react'

import { roleFilterOptions } from '@/configs/auth-config'

import type { ConfirmMessage } from '@/components/blocks/confirm-dialog'
import type { InviteRow, InviteStatus, InviteStatusFilter } from '@/types/invite'
import type { OptionItem } from '@/types/option'
import type { DataTableFilterField } from '@/views/data-table-view'

export const inviteStatusLabels: Record<InviteStatus, string> = {
  unused: '未使用',
  redeemed: '已核銷',
}

const statusOptions: OptionItem<InviteStatusFilter>[] = [
  { label: '全部狀態', value: 'all' },
  ...(Object.keys(inviteStatusLabels) as InviteStatus[]).map(status => ({ label: inviteStatusLabels[status], value: status })),
]

export const filterFields: DataTableFilterField[] = [
  { type: 'text', id: 'code', label: '邀請碼', icon: <RiSearchLine /> },
  { type: 'select', id: 'role', label: '分組', options: roleFilterOptions },
  { type: 'select', id: 'status', label: '狀態', options: statusOptions },
]

export function getDeleteConfirmMessage(targets: InviteRow[]): ConfirmMessage {
  const deletableCount = targets.filter(invite => invite.status === 'unused').length
  const keptCount = targets.length - deletableCount

  return {
    title: targets.length === 1 ? '刪除邀請碼？' : `刪除 ${deletableCount} 個邀請碼？`,
    description: keptCount > 0 ? `已核銷的 ${keptCount} 個會保留。` : '刪除後即無法恢復。',
    action: '刪除',
  }
}
