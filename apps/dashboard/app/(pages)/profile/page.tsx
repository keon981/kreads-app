import { profileSettings, profileStats } from '@/__mocks__/profile'
import { currentUser } from '@/__mocks__/user'
import { SectionPageLayout } from '@/components/blocks/section-page-layout'
import { ProfileHeader } from '@/views/pages/profile/profile-header'
import { ProfileSettingsForm } from '@/views/pages/profile/profile-settings-form'

export default function ProfilePage(): React.ReactNode {
  return (
    <SectionPageLayout
      title="個人設定"
      description="檢視帳號資訊，並管理基本資料與通知偏好。"
      className="mx-auto max-w-4xl"
    >
      <ProfileHeader user={currentUser} stats={profileStats} />
      <ProfileSettingsForm defaultSettings={profileSettings} />
    </SectionPageLayout>
  )
}
