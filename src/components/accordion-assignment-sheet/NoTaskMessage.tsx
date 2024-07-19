import { Sparkles } from 'lucide-react';

export const NoTaskMessage = () => {
  return (
    <p className="flex justify-center items-center gap-3 p-4">
      <Sparkles className="w-4 stroke-primary-light animate-pulse" />
      No task
      <Sparkles className="w-4 stroke-primary-light animate-pulse" />
    </p>
  );
};
