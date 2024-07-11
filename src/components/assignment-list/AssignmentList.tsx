'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TaskDescriptionDrawer } from '../ui/drawers/TaskDescriptionDrawer';
import {
  IAssignedData,
  IAssignedCategory,
  IAssignedTask,
} from '@/types/commons';
import { Button } from '../ui/button';

interface AssignmentListProps {
  tenantId: string;
  assignments: IAssignedData;
}

export const AssignmentList = ({
  tenantId,
  assignments,
}: AssignmentListProps) => {
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState<{ [taskId: string]: boolean }>({});
  const [allChecked, setAllChecked] = useState(false);
  const [currentTask, setCurrentTask] = useState<{
    title: string;
    description: string;
  }>({ title: '', description: '' });

  tenantId = 'fbfdf800-4008-4a89-ba11-db4c5cb3be1c';

  const handleCheckboxChange = (taskId: string) => {
    setIsChecked((prevChecked) => ({
      ...prevChecked,
      [taskId]: !prevChecked[taskId],
    }));
  };

  const handleAllCheckedChange = () => {
    setAllChecked((prevAllChecked) => {
      const newAllChecked = !prevAllChecked;
      const newIsChecked: { [taskId: string]: boolean } = {};
      tenantAssignments.forEach(({ task }) => {
        newIsChecked[task.id] = newAllChecked;
      });
      setIsChecked(newIsChecked);
      return newAllChecked;
    });
  };

  const { handleSubmit } = useForm();
  const onSubmit = () => {
    setTimeout(() => {
      console.log('test');
    }, 1000);
  };

  let tenantAssignments: { task: IAssignedTask; category: string }[] = [];
  if (assignments && assignments.assignments) {
    tenantAssignments = assignments.assignments
      .filter(
        (assignment: IAssignedCategory) => assignment.tenant?.id === tenantId,
      )
      .flatMap((assignment: IAssignedCategory) =>
        (assignment.tasks || []).map((task) => ({
          task,
          category: assignment.category?.name || '',
        })),
      );
  }

  console.log('tenantAssignments', tenantAssignments);

  if (!assignments || !assignments.assignments) {
    return <p>No assignments data available.</p>;
  }

  let lastCategory = '';

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {tenantAssignments.map(({ task, category }) => (
            <div key={task.id} className="mb-2">
              {category !== lastCategory && (
                <label className="flex items-center gap-1 mb-2 cursor-pointer">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={handleAllCheckedChange}
                  />
                  <h3 className="font-medium">{(lastCategory = category)}</h3>
                </label>
              )}
              <div className="flex justify-between items-center p-2 bg-white rounded-xl">
                <label className="flex flex-1 items-center gap-1 cursor-pointer">
                  <Checkbox
                    checked={isChecked[task.id] || false}
                    onCheckedChange={() => handleCheckboxChange(task.id)}
                  />
                  <p>{task.title}</p>
                </label>
                <Info
                  className="cursor-pointer"
                  onClick={() => {
                    setCurrentTask({
                      title: task.title,
                      description: task.description,
                    });
                    setOpen(true);
                  }}
                />
              </div>
            </div>
          ))}
          <Button>Save</Button>
        </form>
      </div>
      <TaskDescriptionDrawer
        open={open}
        setOpen={setOpen}
        title={currentTask.title}
        description={currentTask.description}
      />
    </>
  );
};

export default AssignmentList;
