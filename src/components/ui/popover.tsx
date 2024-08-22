'use client';

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { Root, Trigger, Content, Portal } from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

/**
 * The root component of the Popover.
 * The usage is the same as the official documentation of shadcn/ui.
 *
 * @example
 * <Popover>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>Place content for the popover here.</PopoverContent>
 * </Popover>
 * @see {@link https://ui.shadcn.com/docs/components/popover | Popover}
 */
const Popover = Root;

/**
 * The trigger component of the Popover.
 *
 * @example
 * <PopoverTrigger>Open</PopoverTrigger>
 */
const PopoverTrigger = Trigger;

/**
 * The content component of the Popover.
 *
 * @example
 * <PopoverContent>Place content for the popover here.</PopoverContent>
 */
const PopoverContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </Portal>
));
PopoverContent.displayName = Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
