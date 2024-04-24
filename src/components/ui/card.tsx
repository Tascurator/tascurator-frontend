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
  isLast?: boolean;
}

/**
 * @example
 * ```ts
 * return (
 * <Card>
 *  <CardHeader startDate={startDate} endDate={endDate} />
 *  <CardContent category={category} tenant={tenant} isComplete={isComplete} />
 *  <CardContent category={category} tenant={tenant} isComplete={isComplete} />
 *  <CardContent category={category} tenant={tenant} isComplete={isComplete} isLast={true} />
 * </Card>
 * )
 * ```
 */
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
  ({ className, startDate, endDate, title, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-2 pt-3.5 pl-3.5 pb-3 border-b-2 border-slate-300',
        className,
      )}
      {...props}
    >
      <CardTitle>{title}</CardTitle>
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
    <CalendarDays className="w-4 h-4" />
    <p
      ref={ref}
      className={cn('text-base text-muted-foreground', className)}
      {...props}
    />
  </div>
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, category, tenant, isComplete, isLast, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'pl-3.5 pt-2 pb-2.5 pr-4 border-b border-slate-300',
        isLast && 'border-0',
        className,
      )}
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
        <p className="pb-[7px] text-xl font-medium">{category}</p>
        <p>{tenant}</p>
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

export { Card, CardHeader, CardContent };
