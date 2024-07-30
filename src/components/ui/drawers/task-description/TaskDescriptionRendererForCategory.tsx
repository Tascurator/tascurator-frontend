import { EditorContent, useEditor } from '@tiptap/react';
import { editorExtensions } from '@/components/ui/drawers/categories/CategoryDrawerContent';

import { useFormContext } from 'react-hook-form';
import { TCategoryCreationSchema } from '@/constants/schema';

// Difference between TaskDescriptionRendererForCategory.tsx and TaskDescriptionEditor.tsx is only the schema type used
export const TaskDescriptionRendererForCategory = () => {
  const { getValues } = useFormContext<TCategoryCreationSchema>();

  const editor = useEditor({
    extensions: editorExtensions,
    content: getValues('task.description') || '',
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};
