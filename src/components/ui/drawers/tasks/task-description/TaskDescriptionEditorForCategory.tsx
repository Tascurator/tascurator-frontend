import { EditorContent, useEditor } from '@tiptap/react';

import { useFormContext } from 'react-hook-form';
import { editorExtensions } from '@/constants/tiptap-editor';

import { TCategoryCreationSchema } from '@/constants/schema';
import { EditorButtons } from './EditorButtons';

// Difference between TaskDescriptionEditorForCategory.tsx and TaskDescriptionEditor.tsx is only the schema type used
interface ITaskDescriptionEditor {
  taskDescription: string;
}

export const TaskDescriptionEditorForCategory = ({
  taskDescription,
}: ITaskDescriptionEditor) => {
  const { setValue } = useFormContext<TCategoryCreationSchema>();

  const editor = useEditor({
    extensions: editorExtensions,
    editorProps: {
      attributes: {
        class: 'p-2 w-full h-full overflow-auto resize-none focus:outline-none',
      },
    },
    content: taskDescription || '',
    onUpdate: ({ editor }) => {
      const descriptionData = editor.getHTML();
      setValue('task.description', descriptionData, { shouldValidate: true });
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditorButtons editor={editor} />
      <EditorContent
        tabIndex={0}
        editor={editor}
        className="h-full max-h-72 min-h-72 overflow-visible resize-none"
      />
    </>
  );
};
