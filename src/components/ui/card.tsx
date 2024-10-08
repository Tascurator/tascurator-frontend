import { forwardRef, HTMLAttributes } from 'react';

import { CalendarDays, CircleCheck } from 'lucide-react';
import { ICardContentProps } from '@/types/commons';
import { cn } from '@/lib/utils';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  startDate: string;
  endDate: string;
}

/**
 * The Card component is the root component for the Card component.
 * It should be used to wrap the CardHeader and CardContent components.
 *
 * @example
 * <Card>
 *  <CardHeader startDate={startDate} endDate={endDate} title={title} />
 *  <CardContent name={name} tenant={tenant} isComplete={isComplete} />
 *  <CardContent name={name} tenant={tenant} isComplete={isComplete} isLast={true} />
 * </Card>
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

/**
 * The CardHeader component is used to display the title and date range of the card.
 *
 * @example
 * <CardHeader startDate={startDate} endDate={endDate} title={title} />
 */
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

/**
 * The CardTitle component is used to display the title of the card.
 *
 * @example
 * <CardTitle>Your title</CardTitle>
 */
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

/**
 * The CardDescription component is used to display the date range of the card.
 *
 * @example
 * <CardDescription>Your description</CardDescription>
 */
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

/**
 * The CardContent component is used to display the name and tenant of the card.
 *
 * @example
 * <CardContent name={name} tenant={tenant} isComplete={isComplete} />
 */
const CardContent = forwardRef<HTMLDivElement, ICardContentProps>(
  (
    { className, name, tenant, isComplete, maxTasks, completedTasks, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'pl-3.5 pt-2 pb-2.5 pr-4 border-t border-slate-300',
        className,
      )}
      {...props}
    >
      <CardContentDescription
        tenant={tenant}
        name={name}
        isComplete={isComplete}
        maxTasks={maxTasks}
        completedTasks={completedTasks}
      />
    </div>
  ),
);
CardContent.displayName = 'CardContent';

/**
 * The CardContentDescription component is used to display the name and tenant of the card.
 * This is only used internally by the CardContent component.
 *
 * @example
 * <CardContentDescription tenant={tenant} name={name} isComplete={isComplete} />
 */
const CardContentDescription = forwardRef<
  HTMLParagraphElement,
  ICardContentProps
>(
  (
    { className, tenant, name, isComplete, maxTasks, completedTasks, ...props },
    ref,
  ) => (
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
          {maxTasks ? (
            <p className="pb-[7px] text-xl font-medium">
              {name} ({completedTasks}/{maxTasks})
            </p>
          ) : (
            <p className="pb-[7px] text-xl font-medium">{name}</p>
          )}
          <p>{tenant.name}</p>
        </div>
        <CircleCheck
          className={cn(
            'text-primary w-7 h-7 stroke-white fill-secondary-light hidden',
            isComplete && 'block',
          )}
        />
      </div>
    </div>
  ),
);
CardContentDescription.displayName = 'CardContentDescription';

export { Card, CardHeader, CardContent };
