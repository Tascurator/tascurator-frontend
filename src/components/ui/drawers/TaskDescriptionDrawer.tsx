import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { editorExtensions } from '@/constants/tiptap-editor';
import { EditorContent, useEditor } from '@tiptap/react';

interface ITaskDescriptionDrawer {
  title: string;
  description: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * A drawer component to log out the user
 *
 * @param title - The title of the task
 * @param description - The description of the task
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <TaskDescriptionDrawer open={open} setOpen={setOpen} title={currentTask.title} description={currentTask.description} />
 *
 */

export const TaskDescriptionDrawer = ({
  title,
  description,
  open,
  setOpen,
}: ITaskDescriptionDrawer) => {
  const editor = useEditor({
    extensions: editorExtensions,
    content: description,
    editable: false,
  });

  if (!editor) {
    return null;
  }

  editor.commands.setContent(description);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent className={'h-[90%]'}>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription asChild>
          <EditorContent editor={editor} />
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
};
