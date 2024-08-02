import { CalendarClock } from 'lucide-react';

export const RotationCycleInformationMessage = () => {
  return (
    <div className="flex gap-2 items-center mt-1 text-gray-400">
      <CalendarClock className="w-5" />
      <p className="text-sm flex-1">
        Edited information will take effect the following rotation cycle.
      </p>
    </div>
  );
};
