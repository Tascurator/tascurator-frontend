import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IFloatingActionButtonProps {
  isMaxAmount: boolean;
}
/**
 * The FloatingActionButton component is used to create a floating action button with a plus icon for the Dashboard page.
 *
 * @example
 * <FloatingActionButton />
 */
export function FloatingActionButton({
  isMaxAmount,
}: IFloatingActionButtonProps) {
  return (
    <>
      <Button
        variant="floating"
        size="floating"
        className="group"
        disabled={isMaxAmount}
      >
        <Plus
          className={cn(
            'h-8 w-8 stroke-2 stroke-primary group-hover:opacity-50',
            isMaxAmount && 'stroke-slate-300 cursor-not-allowed',
          )}
        />
      </Button>
    </>
  );
}
