'use client';
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  HTMLAttributes,
} from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/lib/utils';

/**
 * The root component of the Drawer.
 * It should be used as a wrapper for the DrawerTrigger, DrawerContent, and DrawerOverlay components.
 *
 * @example
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button>Open Drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerTitle>Login</DrawerTitle>
 *     <DrawerDescription>
 *       // Your content here
 *     </DrawerDescription>
 *     <DrawerFooter>
 *       <DrawerClose asChild>
 *         <Button>Close</Button>
 *       </DrawerClose>
 *       <Button>Save</Button>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 */
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = 'Drawer';

/**
 * The trigger component to open the Drawer.
 *
 * @example
 * <DrawerTrigger asChild>
 *   <Button>Open Drawer</Button>
 * </DrawerTrigger>
 */
const DrawerTrigger = DrawerPrimitive.Trigger;

/**
 * The portal component to render the Drawer.
 * It should be used as a wrapper for the DrawerOverlay and DrawerContent components.
 *
 * @example
 * <DrawerPortal>
 *   <DrawerOverlay />
 *  <DrawerContent>
 */
const DrawerPortal = DrawerPrimitive.Portal;

/**
 * The close component to close the Drawer.
 *
 * @example
 * <DrawerClose asChild>
 *   <Button>Close</Button>
 * </DrawerClose>
 */
const DrawerClose = DrawerPrimitive.Close;

/**
 * The overlay component to display the overlay when the Drawer is open.
 *
 * @example
 * <DrawerOverlay />
 */
const DrawerOverlay = forwardRef<
  ElementRef<typeof DrawerPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-overlay', className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

/**
 * The content component to wrap the content of the Drawer.
 * Commonly used to display the title, description, and footer content inside this component.
 *
 * @example
 * <DrawerContent>
 *   <DrawerTitle>
 *     // Your title here
 *   </DrawerTitle>
 *   <DrawerDescription>
 *     // Your content here
 *   </DrawerDescription>
 *   <DrawerFooter>
 *     // Your footer content here
 *   </DrawerFooter>
 * </DrawerContent>
 */
const DrawerContent = forwardRef<
  ElementRef<typeof DrawerPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-full flex-col items-center rounded-t-xl border bg-background',
        className,
      )}
      {...props}
    >
      <div className="mx-auto my-4 h-2 w-24 rounded-full bg-primary-lightest" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

/**
 * The footer component to wrap the footer content of the Drawer.
 * Commonly used to display the actions buttons like save, close, etc. in this component.
 *
 * @example
 * <DrawerFooter>
 *   <DrawerClose asChild>
 *     <Button>Close</Button>
 *   </DrawerClose>
 *   <Button>Save</Button>
 * </DrawerFooter>
 */
const DrawerFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'w-full flex justify-center gap-x-6 px-6 pb-8 max-w-screen-sm',
      className,
    )}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

/**
 * The title component to display the title of the Drawer.
 *
 * @example
 * <DrawerTitle>Hello world</DrawerTitle>
 */
const DrawerTitle = forwardRef<
  ElementRef<typeof DrawerPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <div
    className={
      'w-full flex justify-center items-center text-left border-b border-b-slate-300'
    }
  >
    <DrawerPrimitive.Title
      ref={ref}
      className={cn(
        'w-full flex items-center text-2xl px-6 py-2.5 max-w-screen-sm',
        className,
      )}
      {...props}
    />
  </div>
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

/**
 * The description component to display the description of the Drawer.
 *
 * @example
 * <DrawerDescription>
 *   // Your content here
 * </DrawerDescription>
 */
const DrawerDescription = forwardRef<
  ElementRef<typeof DrawerPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn(
      'w-full h-full px-6 pt-5 pb-10 max-w-screen-sm overflow-y-auto',
      className,
    )}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
