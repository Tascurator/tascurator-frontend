import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * The FloatingActionButton component is used to create a floating action button with a plus icon for the Dashboard page.
 *
 * @example
 * <FloatingActionButton />
 */
export function FloatingActionButton() {
  return (
    <Button variant="floating" size="floating" className="group">
      <Plus className="h-8 w-8 stroke-2 stroke-primary group-hover:opacity-50" />
    </Button>
  );
}
