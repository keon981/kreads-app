import { RiAtLine, RiSearchLine } from '@remixicon/react'

import { roleFilterOptions } from '@/configs/auth-config'

import type { ConfirmMessage } from '@/components/blocks/confirm-dialog'
import type { OptionItem } from '@/types/option'
import type { UserActionType, UserRow, UserStatus, UserStatusFilter } from '@/types/user'
import type { DataTableFilterField } from '@/views/data-table-view'

export const userStatusLabels: Record<UserStatus, string> = {
  active: '正常',
  banned: '停權',
}

const statusOptions: OptionItem<UserStatusFilter>[] = [
  { label: '全部狀態', value: 'all' },
  ...(Object.keys(userStatusLabels) as UserStatus[]).map(status => ({ label: userStatusLabels[status], value: status })),
]

export const filterFields: DataTableFilterField[] = [
  { type: 'text', id: 'name', label: '名稱', icon: <RiSearchLine /> },
  { type: 'text', id: 'username', label: 'Username', icon: <RiAtLine /> },
  { type: 'select', id: 'role', label: '分組', options: roleFilterOptions },
  { type: 'select', id: 'status', label: '狀態', options: statusOptions },
]

export type ConfirmActionType = Extract<UserActionType, 'ban' | 'remove'>

export const actionSuccessTitles: Record<UserActionType, string> = {
  ban: '已停權',
  unban: '已解除停權',
  revoke: '已撤銷所有登入',
  remove: '已刪除使用者',
}

export function getActionConfirmMessage(type: ConfirmActionType, user: Pick<UserRow, 'name'>): ConfirmMessage {
  const messages: Record<ConfirmActionType, ConfirmMessage> = {
    ban: { title: `停權「${user.name}」？`, description: '對方會被登出，且無法再登入主站。', action: '停權' },
    remove: { title: `刪除「${user.name}」？`, description: '刪除後即無法恢復。', action: '刪除' },
  }

  return messages[type]
}
