import { EditorContent, useEditor } from '@tiptap/react';
import { editorExtensions } from '../CategoryCreationDrawer';
import { useFormContext } from 'react-hook-form';
import { TTaskSchema } from '@/components/ui/drawers/tasks/TaskDrawerContent';

// Difference between TaskDescriptionRendererForCategory.tsx and TaskDescriptionEditor.tsx is only the schema type used
export const TaskDescriptionRenderer = () => {
  const { getValues } = useFormContext<TTaskSchema>();

  const editor = useEditor({
    extensions: editorExtensions,
    content: getValues('description') ?? '',
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};
