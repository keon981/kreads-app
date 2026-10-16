import {
  BookmarkMenuItem,
  CopyLinkMenuItem,
  DeleteMenuItem,
  EditMenuItem,
  RetryMenuItem,
} from './issue-control'

import type { IssueMenuContent } from './issue-control'

export const issueMenuContent: Record<'failed' | 'owner' | 'viewer', IssueMenuContent> = {
  failed: [
    [{ MenuItem: RetryMenuItem }, { MenuItem: EditMenuItem }],
    [{ MenuItem: DeleteMenuItem }],
  ],
  owner: [
    [{ MenuItem: EditMenuItem }],
    [{ MenuItem: CopyLinkMenuItem }, { MenuItem: BookmarkMenuItem }],
    [{ MenuItem: DeleteMenuItem }],
  ],
  viewer: [
    [{ MenuItem: CopyLinkMenuItem }, { MenuItem: BookmarkMenuItem }],
  ],
}
