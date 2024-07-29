import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ReactNode } from 'react';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';

interface ICommonDrawer<T extends FieldValues> {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  onSubmit: SubmitHandler<T> | null;
  children: ReactNode;
}

export const CommonDrawer = <T extends FieldValues>({
  title,
  open,
  setOpen,
  className,
  onSubmit,
  children,
}: ICommonDrawer<T>) => {
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useFormContext<T>();

  return (
    <>
      {/* Lading spinner if the loadingSpinner === true */}
      {onSubmit && <LoadingSpinner isLoading={isSubmitting} />}

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen} modal={!isSubmitting}>
        <DrawerTrigger />
        <DrawerContent className={className} asChild={!!onSubmit}>
          {onSubmit ? (
            <form onSubmit={handleSubmit(onSubmit)}>
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
