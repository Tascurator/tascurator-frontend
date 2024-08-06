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

/**
 * Common drawer component
 *
 * This is a useful component for creating a drawer with a form without having to write the boilerplate code.
 * It handles the loading spinner and form submission.
 *
 * @param title - The title of the drawer
 * @param open - The state of the drawer
 * @param setOpen - The function to change the state of the drawer
 * @param className - The className for the DrawerContent component
 * @param onSubmit - The function to handle the form submission. If null, the drawer will not have a form.
 * @param children - The children components inside the drawer under DrawerTitle
 *
 * @example
 * const [open, setOpen] = useState(false);
 * const formControls = useForm();
 *
 * return (
 *   <FormProvider {...formControls}>
 *     <CommonDrawer title="Drawer title" open={open} setOpen={setOpen} onSubmit={onSubmit}>
 *       <DrawerDescription>
 *         <Input {...register('inputName')} />
 *         <FormMessage>{errors.inputName?.message}</FormMessage>
 *         <Button type="submit">Submit</Button>
 *       </DrawerDescription>
 *       <DrawerFooter>
 *         <Button onClick={() => setOpen(false)}>Close</Button>
 *       </DrawerFooter>
 *     </CommonDrawer>
 *   </FormProvider>
 * );
 *
 * @note The <CommonDrawer> component should be wrapped in a <FormProvider> component from react-hook-form in order to work properly.
 */
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

  const onOpenChange = (open: boolean) => {
    /**
     * Prevent the drawer from closing if the form is submitting
     */
    if (isSubmitting && !open) return;

    setOpen(open);
  };

  return (
    <>
      {/* Lading spinner if the loadingSpinner === true */}
      {onSubmit && <LoadingSpinner isLoading={isSubmitting} />}

      {/* Drawer */}
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger />
        <DrawerContent className={className} asChild={!!onSubmit}>
          {onSubmit ? (
            <form
              onSubmit={(e) => {
                /**
                 * In case the form is nested in another form, prevent submitting the parent form by stopping the event propagation
                 */
                e.stopPropagation();

                void handleSubmit(onSubmit)(e);
              }}
            >
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
