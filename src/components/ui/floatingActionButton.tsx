import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function FloatingActionButton() {
  return (
    <Button variant="floating" size="icon">
      <Plus className="h-8 w-8" strokeWidth={2} />
    </Button>
  );
}
