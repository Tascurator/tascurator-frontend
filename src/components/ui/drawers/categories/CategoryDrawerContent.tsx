import { EditCategoryDrawerContent } from '@/components/ui/drawers/categories/EditCategoryDrawerContent';
import { ConfirmCategoryDrawerContent } from '@/components/ui/drawers/categories/ConfirmCategoryDrawerContent';
import { SubmitHandler } from 'react-hook-form';
import { TCategoryCreationSchema } from '@/constants/schema';
import { INPUT_TEXTS } from '@/constants/input-texts';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Placeholder from '@tiptap/extension-placeholder';

const { TASK_DESCRIPTION } = INPUT_TEXTS;

// Configure the Tiptap editor extensions
export const editorExtensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  Underline,
  ListItem.configure({
    HTMLAttributes: {
      class: '[&>p]:inline',
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: 'list-disc pl-6',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'list-decimal pl-6',
    },
  }),
  Placeholder.configure({
    placeholder: TASK_DESCRIPTION.placeholder,
    emptyEditorClass:
      'first:before:content-[attr(data-placeholder)] first:before:text-slate-400 first:before:float-left first:before:h-0 first:before:left-0 first:before:pointer-events-none',
  }),
];

interface ICategoryDrawerContent {
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
  confirmOpen: boolean;
  setConfirmOpen: (value: boolean) => void;
  onSubmit: SubmitHandler<TCategoryCreationSchema>;
}

export const CategoryDrawerContent = ({
  editOpen,
  setEditOpen,
  confirmOpen,
  setConfirmOpen,
  onSubmit,
}: ICategoryDrawerContent) => {
  const openConfirmationDrawer = () => {
    setEditOpen(false);
    setConfirmOpen(true);
  };

  const closeConfirmationDrawer = () => {
    setConfirmOpen(false);
    setEditOpen(true);
  };

  return (
    <>
      <EditCategoryDrawerContent
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        openConfirmationDrawer={openConfirmationDrawer}
      />

      <ConfirmCategoryDrawerContent
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        closeConfirmationDrawer={closeConfirmationDrawer}
        onSubmit={onSubmit}
      />
    </>
  );
};
