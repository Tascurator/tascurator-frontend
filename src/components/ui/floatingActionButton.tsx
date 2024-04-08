import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function FloatingActionButton() {
  return (
    <Button variant="floating" size="floating" className="group">
      <Plus className="h-8 w-8 stroke-2 stroke-primary group-hover:opacity-50" />
    </Button>
  );
}
