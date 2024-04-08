'use client';
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import { Root, List, Trigger, Content } from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = Root;

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

const TabsContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
  <Content ref={ref} className={cn('mt-6', className)} {...props} />
));
TabsContent.displayName = Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
