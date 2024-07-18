import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskDescriptionDrawer } from '../ui/drawers/TaskDescriptionDrawer';

interface Tasks {
  id: string;
  title: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  tasks: Tasks[];
}

interface AssignmentCategoryTasksProps {
  category: Category;
  isChecked: { [taskId: string]: boolean };
  handleAllCheckedChange: (categoryId: string) => void;
  handleCheckboxChange: (taskId: string) => void;
  numericKey: number;
}

export const AssignmentCategoryTasks = ({
  category,
  isChecked,
  handleAllCheckedChange,
  handleCheckboxChange,
  numericKey,
}: AssignmentCategoryTasksProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTaskDetails, setCurrentTaskDetails] = useState<{
    title: string;
    description: string;
  }>({ title: '', description: '' });

  const setCurrentTask = (task: { title: string; description: string }) => {
    setCurrentTaskDetails(task);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div key={category.id}>
        {numericKey === 1 ? (
          <>
            <label className="flex items-center gap-1 mb-2 font-medium cursor-pointer">
              <Checkbox
                checked={category.tasks.every((task) => isChecked[task.id])}
                onCheckedChange={() => handleAllCheckedChange(category.id)}
                disabled={numericKey > 1}
              />
              <p>{category.name}</p>
            </label>

            {category.tasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center bg-white rounded-xl mb-2"
              >
                <label
                  className={cn(
                    `flex flex-1 items-center gap-1 py-2 px-3 cursor-pointer ${
                      isChecked[task.id] ? 'text-gray-500' : ''
                    }`,
                  )}
                >
                  <Checkbox
                    checked={isChecked[task.id] || false}
                    onCheckedChange={() => handleCheckboxChange(task.id)}
                    disabled={numericKey > 1}
                  />
                  <p>{task.title}</p>
                </label>

                <div className="flex items-center w-10 h-12 cursor-pointer">
                  <Info
                    className="stroke-gray-500"
                    onClick={() =>
                      setCurrentTask({
                        title: task.title,
                        description: task.description || '',
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="flex items-center gap-1 mb-2 font-medium text-gray-400">
              <Checkbox disabled />
              <p>{category.name}</p>
            </div>

            {category.tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl mb-2">
                <div className="flex flex-1 items-center gap-1 py-2 px-3 text-gray-400">
                  <Checkbox disabled />
                  <p>{task.title}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="h-0">
        <TaskDescriptionDrawer
          open={isDrawerOpen}
          setOpen={setIsDrawerOpen}
          title={currentTaskDetails.title}
          description={currentTaskDetails.description}
        />
      </div>
    </>
  );
};
