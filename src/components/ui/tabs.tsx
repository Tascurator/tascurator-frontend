'use client';
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import { Root, List, Trigger, Content } from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
// import { useSearchParams } from 'next/navigation';

/**
 * The root component of the Tabs.
 * The usage is the same as the official documentation of shadcn/ui.
 *
 * @example
 * <Tabs defaultValue="tab-1">
 *   <TabsList>
 *     <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
 *     <TabsTrigger value="tab-3">Tab 3</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab-1">Content 1</TabsContent>
 *   <TabsContent value="tab-2">Content 2</TabsContent>
 *   <TabsContent value="tab-3">Content 3</TabsContent>
 * </Tabs>
 * @see {@link https://ui.shadcn.com/docs/components/tabs | Tabs}
 */
const Tabs = Root;

/**
 * The list component of the Tabs.
 * It should be used as a wrapper for the TabsTrigger components.
 *
 * @example
 * <TabsList>
 *   <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
 *   <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
 *   <TabsTrigger value="tab-3">Tab 3</TabsTrigger>
 * </TabsList>
 */

// const searchParams = useSearchParams();
// const tab = searchParams.get('tab') || 'Tasks';
const TabsList = forwardRef<
  ElementRef<typeof List>,
  ComponentPropsWithoutRef<typeof List>
>(({ className, ...props }, ref) => (
  <List
    ref={ref}
    className={cn(
      'flex w-full h-12 items-center justify-between rounded-xl bg-primary p-1.5 text-white',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = List.displayName;

/**
 * The trigger component of the Tabs.
 * It should be used as a child of the TabsList component.
 *
 * @example
 * <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
 */
const TabsTrigger = forwardRef<
  ElementRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ className, ...props }, ref) => (
  <Trigger
    ref={ref}
    className={cn(
      'flex items-center justify-center font-medium rounded-lg w-full px-3 py-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-black',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = Trigger.displayName;

/**
 * The content component of the Tabs.
 * It should be used as a child of the Tabs component for each tab.
 * The value prop should match the value prop of the TabsTrigger component.
 *
 * @example
 * <TabsContent value="tab-1">Content 1</TabsContent>
 */
const TabsContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
  <Content ref={ref} className={cn('mt-6', className)} {...props} />
));
TabsContent.displayName = Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
