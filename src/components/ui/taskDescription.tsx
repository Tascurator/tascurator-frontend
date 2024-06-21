import { Editor, EditorContent } from '@tiptap/react';

interface TaskDescriptionProps {
  editor: Editor;
}

export const TaskDescription = (editorProp: TaskDescriptionProps) => {
  const { editor } = editorProp;

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};
