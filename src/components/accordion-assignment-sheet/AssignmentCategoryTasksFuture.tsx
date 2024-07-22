import { Dot, Tag } from 'lucide-react';

interface AssignmentCategoryTasksFutureProps {
  category: {
    id: string;
    name: string;
    tasks: {
      id: string;
      title: string;
      description?: string;
    }[];
  };
}

export const AssignmentCategoryTasksFuture = ({
  category,
}: AssignmentCategoryTasksFutureProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 font-medium">
        <Tag className="w-4" />
        {category.name}
      </div>
      {category.tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-xl mb-2">
          <div className="flex items-center py-2 px-2">
            <Dot />
            {task.title}
          </div>
        </div>
      ))}
    </div>
  );
};
