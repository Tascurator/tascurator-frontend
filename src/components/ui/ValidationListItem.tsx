import { CircleCheck } from 'lucide-react';

interface IValidationListItem {
  condition: boolean;
  constraint: string;
}

const ValidationListItem = ({ condition, constraint }: IValidationListItem) => {
  return (
    <li className={'flex items-center gap-1'}>
      <CircleCheck
        className={`stroke-white w-4 h-4 ${condition ? 'fill-primary' : 'fill-gray-400'}`}
      />
      <span className={`text-sm ${condition ? 'text-gray-500' : 'text-black'}`}>
        {constraint}
      </span>
    </li>
  );
};

export { ValidationListItem };
