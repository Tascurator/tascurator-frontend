import { EditorContent, useEditor } from '@tiptap/react';
import { editorExtensions } from './TaskCreationDrawer';

import { UseFormReturn } from 'react-hook-form';
import { TTaskCreationSchema } from '@/constants/schema';
interface TaskDescriptionProps {
  formControls: UseFormReturn<TTaskCreationSchema>;
}

export const TaskDescriptionRenderer = ({
  formControls,
}: TaskDescriptionProps) => {
  const { getValues } = formControls;

  const editor = useEditor({
    extensions: editorExtensions,
    content: getValues('description') || '',
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};
