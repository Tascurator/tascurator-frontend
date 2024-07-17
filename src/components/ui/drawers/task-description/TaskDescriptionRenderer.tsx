import { EditorContent, useEditor } from '@tiptap/react';
import { editorExtensions } from '../CategoryCreationDrawer';

import { UseFormReturn } from 'react-hook-form';
import { TTaskCreationSchema, TTaskUpdateSchema } from '@/constants/schema';

// Difference between TaskDescriptionRendererForCategory.tsx and TaskDescriptionEditor.tsx is only the schema type used
interface ITaskDescription {
  formControls: UseFormReturn<TTaskCreationSchema | TTaskUpdateSchema>;
}

export const TaskDescriptionRenderer = ({ formControls }: ITaskDescription) => {
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
