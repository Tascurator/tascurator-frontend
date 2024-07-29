import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ReactNode } from 'react';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';

interface ICommonDrawerBaseProps<T extends FieldValues> {
  title: string;
  formControls: UseFormReturn<T>;
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

interface ICommonDrawerWithFormSubmissionProps<T extends FieldValues>
  extends ICommonDrawerBaseProps<T> {
  formSubmission: true;
  onSubmit: SubmitHandler<T>;
}

type TCCommonDrawerProps<T extends FieldValues> =
  | ICommonDrawerBaseProps<T>
  | ICommonDrawerWithFormSubmissionProps<T>;

export const CommonDrawer = <T extends FieldValues>({
  title,
  formControls,
  open,
  setOpen,
  className,
  children,
  ...rest
}: TCCommonDrawerProps<T>) => {
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = formControls;

  return (
    <>
      {/* Lading spinner if the loadingSpinner === true */}
      {'formSubmission' in rest && <LoadingSpinner isLoading={isSubmitting} />}

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen} modal={!isSubmitting}>
        <DrawerTrigger />
        <DrawerContent className={className} asChild={'formSubmission' in rest}>
          {'formSubmission' in rest ? (
            <form onSubmit={handleSubmit(rest.onSubmit)}>
              <DrawerTitle>{title}</DrawerTitle>
              {children}
            </form>
          ) : (
            <>
              <DrawerTitle>{title}</DrawerTitle>
              {children}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
