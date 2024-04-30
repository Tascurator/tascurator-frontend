'use client';

import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import {
  Root,
  Trigger,
  Group,
  Content,
  Portal,
  Item,
} from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/utils';

/**
 * @see https://ui.shadcn.com/docs/components/dropdown-menu
 * @example
 * ```tsx
 * return (
 *   <DropdownMenu>
 *     <DropdownMenuTrigger asChild>
 *       <button className="p-4">
 *         <Citrus />
 *       </button>
 *     </DropdownMenuTrigger>
 *     <DropdownMenuContent>
 *       <DropdownMenuGroup>
 *         <DropdownMenuItemWithIcon icon={<Citrus />}> Item 1 </DropdownMenuItemWithIcon>
 *         <DropdownMenuItemWithIcon icon={<Citrus />}> Item 2 </DropdownMenuItemWithIcon>
 *       </DropdownMenuGroup>
 *     </DropdownMenuContent>
 *   </DropdownMenu>
 * )
 */
const DropdownMenu = Root;

const DropdownMenuTrigger = Trigger;

const DropdownMenuGroup = Group;

const DropdownMenuContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[14rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </Portal>
));
DropdownMenuContent.displayName = Content.displayName;

const DropdownMenuItem = forwardRef<
  ElementRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-black font-bold outline-none transition-colors focus:bg-gray-100 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = Item.displayName;

const DropdownMenuItemWithIcon = forwardRef<
  ElementRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item> & {
    icon: React.ReactNode;
  }
>(({ icon, ...props }, ref) => (
  <DropdownMenuItem ref={ref} {...props}>
    <div className="mx-2 text-black">{icon}</div>
    {props.children}
  </DropdownMenuItem>
));
DropdownMenuItemWithIcon.displayName = 'DropdownMenuItemWithIcon';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuItemWithIcon,
};
