import { forwardRef, HTMLAttributes } from 'react';

import { CalendarDays, CircleCheck } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  startDate: string;
  endDate: string;
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  category: string;
  tenant: string;
  isComplete: boolean;
}

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl bg-card text-card-foreground shadow-[0_4px_8px_0_rgb(0,0,0,0.25)]',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, startDate, endDate, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5  p-[14px] border-b-2 border-slate-300',
        className,
      )}
      {...props}
    >
      <CardTitle>Task Assignment</CardTitle>
      <CardDescription>
        {startDate} - {endDate}
      </CardDescription>
    </div>
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div className="flex items-center gap-1">
    <CalendarDays className="" size={16} />
    <p
      ref={ref}
      className={cn('text-base text-muted-foreground', className)}
      {...props}
    />
  </div>
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, category, tenant, isComplete, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-[14px] border-b border-slate-300', className)}
      {...props}
    >
      <CardContentDescription
        tenant={tenant}
        category={category}
        isComplete={isComplete}
      />
    </div>
  ),
);
CardContent.displayName = 'CardContent';

const CardContentDescription = forwardRef<
  HTMLParagraphElement,
  CardContentProps
>(({ className, tenant, category, isComplete, ...props }, ref) => (
  <div className="flex items-center">
    <p
      ref={ref}
      className={cn('text-base text-muted-foreground', className)}
      {...props}
    />
    <div
      className={cn(
        'flex justify-between items-center w-full',
        isComplete && 'text-gray-500',
      )}
    >
      <div>
        <p>{category}</p>
        <div>{tenant}</div>
      </div>
      <CircleCheck
        className={cn(
          'text-primary w-7 h-7 stroke-white fill-secondary-light hidden',
          isComplete && 'block',
        )}
      />
    </div>
  </div>
));
CardContentDescription.displayName = 'CardContentDescription';

const CardFooter = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, tenant, category, isComplete, ...props }, ref) => (
    <div ref={ref} className={cn('p-[14px]', className)} {...props}>
      <CardContentDescription
        tenant={tenant}
        category={category}
        isComplete={isComplete}
      />
    </div>
  ),
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
