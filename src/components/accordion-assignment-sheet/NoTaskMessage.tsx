import { Sparkles } from 'lucide-react';

export const NoTaskMessage = () => {
  return (
    <p className="flex justify-center items-center gap-3 py-6">
      <Sparkles className="w-5 stroke-primary-light animate-pulse stroke-1" />
      No task
      <Sparkles className="w-5 stroke-primary-light animate-pulse stroke-1" />
    </p>
  );
};
