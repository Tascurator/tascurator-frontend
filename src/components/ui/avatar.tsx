'use client';

import { cn } from '@/lib/utils';
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import { Root, Image, Fallback } from '@radix-ui/react-avatar';

/**
 * The Avatar component that displays a user's profile picture.
 *
 * @example
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="User's profile picture" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 */
const Avatar = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      'relative flex justify-center items-center h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-300',
      className,
    )}
    {...props}
  />
));
Avatar.displayName = Root.displayName;

/**
 * The AvatarImage component is used to display the user's profile picture.
 *
 * @example
 * <AvatarImage src="https://example.com/avatar.jpg" alt="User's profile picture" />
 */
const AvatarImage = forwardRef<
  ElementRef<typeof Image>,
  ComponentPropsWithoutRef<typeof Image>
>(({ className, ...props }, ref) => (
  <Image
    ref={ref}
    className={cn('aspect-square w-full h-full', className)}
    {...props}
  />
));
AvatarImage.displayName = Image.displayName;

/**
 * The AvatarFallback component is used to display the user's initials when the profile picture is not available.
 *
 * @example
 * <AvatarFallback>JD</AvatarFallback>
 */
const AvatarFallback = forwardRef<
  ElementRef<typeof Fallback>,
  ComponentPropsWithoutRef<typeof Fallback>
>(({ className, ...props }, ref) => (
  <Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
