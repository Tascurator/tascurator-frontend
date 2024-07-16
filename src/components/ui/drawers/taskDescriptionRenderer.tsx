import { EditorContent, useEditor } from '@tiptap/react';
import { editorExtensions } from './CategoryCreationDrawer';

import { UseFormReturn } from 'react-hook-form';
import {
  TCategoryCreationSchema,
  TTaskCreationSchema,
  TTaskUpdateSchema,
} from '@/constants/schema';

interface TaskDescriptionProps {
  formControls: UseFormReturn<
    TCategoryCreationSchema | TTaskCreationSchema | TTaskUpdateSchema
  >;
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
