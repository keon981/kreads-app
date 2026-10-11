import { RiBold, RiFileCopyLine, RiItalic, RiScissorsCutLine, RiStrikethrough, RiUnderline } from '@remixicon/react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu'
import {
  MarkdownEditor,
  MarkdownEditorClipboardItem,
  MarkdownEditorContent,
  MarkdownEditorMarkItem,
  useMarkdownEditor,
} from '@workspace/ui/components/markdown-editor'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { UseMarkdownEditorOptions } from '@workspace/ui/components/markdown-editor'

function MarkdownEditorDemo(options: UseMarkdownEditorOptions) {
  const { editor, value, isDirty } = useMarkdownEditor(options)

  return (
    <div className="flex w-96 flex-col gap-3">
      <MarkdownEditor editor={editor}>
        <ContextMenu>
          <ContextMenuTrigger>
            <MarkdownEditorContent />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-36">
            <MarkdownEditorMarkItem mark="bold">
              <RiBold />
              粗體
            </MarkdownEditorMarkItem>
            <MarkdownEditorMarkItem mark="italic">
              <RiItalic />
              斜體
            </MarkdownEditorMarkItem>
            <MarkdownEditorMarkItem mark="underline">
              <RiUnderline />
              底線
            </MarkdownEditorMarkItem>
            <MarkdownEditorMarkItem mark="strike">
              <RiStrikethrough />
              刪除線
            </MarkdownEditorMarkItem>
            <ContextMenuSeparator />
            <MarkdownEditorClipboardItem command="copy">
              <RiFileCopyLine />
              複製
            </MarkdownEditorClipboardItem>
            <MarkdownEditorClipboardItem command="cut">
              <RiScissorsCutLine />
              剪下
            </MarkdownEditorClipboardItem>
          </ContextMenuContent>
        </ContextMenu>
      </MarkdownEditor>
      <p className="text-sm text-muted-foreground">{isDirty ? '已修改' : '未修改'}</p>
      <pre className="rounded-md bg-muted p-2 text-xs whitespace-pre-wrap">{value}</pre>
    </div>
  )
}

const meta = {
  title: 'Components/MarkdownEditor',
  component: MarkdownEditorDemo,
  args: {
    placeholder: '有什麼新鮮事？',
  },
} satisfies Meta<typeof MarkdownEditorDemo>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithFormatting: Story = {
  args: {
    defaultValue: '一般文字 **粗體** *斜體* <ins>底線</ins> ~~刪除線~~',
  },
}

export const LegacyContent: Story = {
  args: {
    defaultValue: '### 舊標題\n\n- 清單一\n- 清單二\n\n> 引用\n\n[連結](https://github.com)',
  },
}
