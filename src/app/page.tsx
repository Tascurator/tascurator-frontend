'use client';
import { useState } from 'react';
import { TaskCreationDrawer } from '@/components/ui/drawers/TaskCreationDrawer';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [open, setOpen] = useState(false);
  const task = {
    id: '1',
    category: 'Kitchen',
    title: 'Clean the kitchen',
    description:
      '<ul><li>Clean the kitchen and make it shine.</li><li>Clean the kitchen and make it shine.</li></ul><ol><li>Clean the kitchen and make it shine.</li><li>Clean the kitchen and make it shine.</li></ol>',
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Button onClick={() => setOpen(true)}>open</Button>
      <TaskCreationDrawer task={task} open={open} setOpen={setOpen} />
    </main>
  );
}
