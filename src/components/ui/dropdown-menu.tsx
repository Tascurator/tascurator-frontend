'use client';

import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';
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
 * The root component of the DropdownMenu.
 * The usage is the same as the official documentation of shadcn/ui.
 *
 * @see https://ui.shadcn.com/docs/components/dropdown-menu
 * @example
 *   <DropdownMenu>
 *     <DropdownMenuTrigger asChild>
 *         <Citrus />
 *     </DropdownMenuTrigger>
 *     <DropdownMenuContent>
 *       <DropdownMenuGroup>
 *         <DropdownMenuItemWithIcon icon={<Citrus />}> Item 1 </DropdownMenuItemWithIcon>
 *         <DropdownMenuItemWithIcon icon={<Citrus />}> Item 2 </DropdownMenuItemWithIcon>
 *       </DropdownMenuGroup>
 *     </DropdownMenuContent>
 *   </DropdownMenu>
 */
const DropdownMenu = Root;

/**
 * The trigger component of the DropdownMenu.
 *
 * @example
 * <DropdownMenuTrigger asChild>
 *   <button className="p-4">
 *     <Citrus />
 *   </button>
 * </DropdownMenuTrigger>
 */
const DropdownMenuTrigger = Trigger;

/**
 * The group component of the DropdownMenu.
 * It can group multiple DropdownMenuItem components.
 *
 * @example
 * <DropdownMenuGroup>
 *   <DropdownMenuItem> Item 1 </DropdownMenuItem>
 *   <DropdownMenuItemWithIcon icon={<Citrus />}> Item 2 </DropdownMenuItemWithIcon>
 * </DropdownMenuGroup>
 */
const DropdownMenuGroup = Group;

/**
 * The content component of the DropdownMenu.
 *
 * @example
 * <DropdownMenuContent>
 *   <DropdownMenuGroup>
 *     <DropdownMenuItem> Item 1 </DropdownMenuItem>
 *     <DropdownMenuItemWithIcon icon={<Citrus />}> Item 2 </DropdownMenuItemWithIcon>
 *   </DropdownMenuGroup>
 * </DropdownMenuContent>
 */
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

/**
 * The dropdown menu item component.
 *
 * @example
 * <DropdownMenuItem> Item 1 </DropdownMenuItem>
 */
const DropdownMenuItem = forwardRef<
  ElementRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm p-2 text-black outline-none transition-colors focus:bg-gray-100 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 border border-b-slate-100 last:border-b-none',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = Item.displayName;

/**
 * The dropdown menu item component with an icon on the left side.
 * This can be used as the alternative to the DropdownMenuItem component.
 *
 * @example
 * <DropdownMenuItemWithIcon icon={<Citrus />}> Item 1 </DropdownMenuItemWithIcon>
 */
const DropdownMenuItemWithIcon = forwardRef<
  ElementRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item> & {
    icon: ReactNode;
  }
>(({ icon, ...props }, ref) => (
  <DropdownMenuItem ref={ref} {...props}>
    <div className="mx-2 text-black *:w-5">{icon}</div>
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
