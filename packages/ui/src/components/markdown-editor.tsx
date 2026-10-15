'use client'

import { useState } from 'react'

import Paragraph from '@tiptap/extension-paragraph'
import Underline from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import { EditorContent, EditorContext, useCurrentEditor, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ContextMenuCheckboxItem, ContextMenuItem } from '@workspace/ui/components/context-menu'
import { cn } from 'cn'

import type { Editor, EditorContextValue, UseEditorOptions } from '@tiptap/react'

// Escape block markers in plain text so GitHub doesn't render them as headings or lists
const BULLET_OR_HEADING_MARKER = /^(\s*)(#{1,6}(?=\s|$)|[-+*](?=\s))/gm
const ORDERED_LIST_MARKER = /^(\s*\d+)([.)])(?=\s)/gm

const MarkdownParagraph = Paragraph.extend({
  renderMarkdown: (node, helpers) => helpers.renderChildren(node.content ?? [])
    .replace(BULLET_OR_HEADING_MARKER, '$1\\$2')
    .replace(ORDERED_LIST_MARKER, '$1\\$2'),
})

// GitHub strips <u> and has no markdown underline syntax, but keeps <ins>
const InsUnderline = Underline.extend({
  parseHTML() {
    return [...(this.parent?.() ?? []), { tag: 'ins' }]
  },
  renderMarkdown: (node, helpers) => `<ins>${helpers.renderChildren(node.content ?? [])}</ins>`,
})

interface UseMarkdownEditorOptions extends Omit<UseEditorOptions, 'content' | 'contentType'> {
  defaultValue?: string
  placeholder?: string
}

interface UseMarkdownEditorReturn {
  editor: Editor | null
  value: string
  isDirty: boolean
}

interface MarkdownEditorProps extends EditorContextValue {
  children?: React.ReactNode
}

interface MarkdownEditorContentProps extends Omit<React.ComponentProps<typeof EditorContent>, 'editor'> { }

interface MarkdownEditorMarkItemProps
  extends Omit<React.ComponentProps<typeof ContextMenuCheckboxItem>, 'checked' | 'onCheckedChange'> {
  mark: string
}

interface MarkdownEditorClipboardItemProps extends Omit<React.ComponentProps<typeof ContextMenuItem>, 'onClick'> {
  command: 'copy' | 'cut'
}

function useMarkdownEditor({
  defaultValue = '',
  placeholder,
  extensions = [],
  onCreate,
  onUpdate,
  ...options
}: UseMarkdownEditorOptions = {}): UseMarkdownEditorReturn {
  const [initialMarkdown, setInitialMarkdown] = useState<string | null>(null)
  const [markdown, setMarkdown] = useState<string | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    ...options,
    extensions: [
      StarterKit.configure({ paragraph: false, underline: false }),
      MarkdownParagraph,
      InsUnderline,
      Placeholder.configure({ placeholder }),
      Markdown,
      ...extensions,
    ],
    content: defaultValue,
    contentType: 'markdown',
    onCreate: (props) => {
      setInitialMarkdown(props.editor.getMarkdown())
      onCreate?.(props)
    },
    onUpdate: (props) => {
      setMarkdown(props.editor.getMarkdown())
      onUpdate?.(props)
    },
  })

  const isDirty = markdown !== null && markdown !== initialMarkdown

  return {
    editor,
    // Keep the original value untouched until the user edits, so unchanged content isn't reformatted
    value: isDirty ? markdown.trim() : defaultValue,
    isDirty,
  }
}

function MarkdownEditor({ editor, children }: MarkdownEditorProps): React.ReactNode {
  return <EditorContext value={{ editor }}>{children}</EditorContext>
}

function MarkdownEditorContent({ className, ...props }: MarkdownEditorContentProps): React.ReactNode {
  const { editor } = useCurrentEditor()

  return (
    <EditorContent
      data-slot="markdown-editor-content"
      editor={editor}
      className={cn(
        'typeset typeset-post min-h-16 select-text [&_.ProseMirror]:min-h-16 [&_.ProseMirror]:outline-none',
        '[&_.is-editor-empty:first-child]:before:pointer-events-none [&_.is-editor-empty:first-child]:before:float-left [&_.is-editor-empty:first-child]:before:h-0 [&_.is-editor-empty:first-child]:before:text-muted-foreground [&_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]',
        className,
      )}
      {...props}
    />
  )
}

function MarkdownEditorMarkItem({ mark, ...props }: MarkdownEditorMarkItemProps): React.ReactNode {
  const { editor } = useCurrentEditor()
  const isActive = useEditorState({
    editor,
    selector: ({ editor }) => editor?.isActive(mark) ?? false,
  })

  return (
    <ContextMenuCheckboxItem
      checked={isActive ?? false}
      onCheckedChange={() => editor?.chain().focus().toggleMark(mark).run()}
      {...props}
    />
  )
}

function MarkdownEditorClipboardItem({ command, ...props }: MarkdownEditorClipboardItemProps): React.ReactNode {
  const { editor } = useCurrentEditor()
  const hasSelection = useEditorState({
    editor,
    selector: ({ editor }) => !(editor?.state.selection.empty ?? true),
  })

  const handleClick = (): void => {
    editor?.commands.focus()
    // Let ProseMirror handle the clipboard event so both HTML and plain text are written
    document.execCommand(command)
  }

  return <ContextMenuItem disabled={!hasSelection} onClick={handleClick} {...props} />
}

export {
  MarkdownEditor,
  MarkdownEditorClipboardItem,
  MarkdownEditorContent,
  MarkdownEditorMarkItem,
  useMarkdownEditor,
}
export type {
  MarkdownEditorClipboardItemProps,
  MarkdownEditorContentProps,
  MarkdownEditorMarkItemProps,
  MarkdownEditorProps,
  UseMarkdownEditorOptions,
  UseMarkdownEditorReturn,
}
