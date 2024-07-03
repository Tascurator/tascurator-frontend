import { cn } from '@/lib/utils';
import { Editor, EditorContent } from '@tiptap/react';

interface TaskDescriptionEditorProps {
  editor: Editor;
}

import {
  BoldIcon,
  ListIcon,
  ListOrderedIcon,
  UnderlineIcon,
} from 'lucide-react';

export const TaskDescriptionEditor = (
  editorProp: TaskDescriptionEditorProps,
) => {
  const { editor } = editorProp;

  const buttonCommonStyle =
    'size-12 w-full min-w-12 flex justify-center items-center focus:outline-none focus:bg-slate-300 hover:bg-slate-300';

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="w-full flex items-center bg-slate-100  rounded-t-xl">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            buttonCommonStyle,
            'rounded-tl-xl',
            editor.isActive('bold') && 'group-focus-within:bg-slate-300',
          )}
        >
          <BoldIcon className={'size-5'} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            buttonCommonStyle,
            editor.isActive('underline') && 'group-focus-within:bg-slate-300',
          )}
        >
          <UnderlineIcon className={'size-5'} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            buttonCommonStyle,
            editor.isActive('bulletList') && 'group-focus-within:bg-slate-300',
          )}
        >
          <ListIcon className={'size-5'} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            buttonCommonStyle,
            'rounded-tr-xl',
            editor.isActive('orderedList') && 'group-focus-within:bg-slate-300',
          )}
        >
          <ListOrderedIcon className={'size-5'} />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="h-full max-h-72 overflow-visible resize-none"
      />
    </>
  );
};
