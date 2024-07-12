import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

interface IValidationListItem {
  condition: boolean;
  constraint: string;
}

const ValidationListItem = ({ condition, constraint }: IValidationListItem) => {
  return (
    <li className={'flex items-center gap-1'}>
      <CircleCheck
        className={cn(
          'stroke-white w-4 h-4',
          { 'fill-primary': condition },
          { 'fill-gray-400': !condition },
        )}
      />
      <span
        className={cn(
          'text-sm',
          { 'text-gray-500': condition },
          { 'text-black': !condition },
        )}
      >
        {constraint}
      </span>
    </li>
  );
};

export { ValidationListItem };
