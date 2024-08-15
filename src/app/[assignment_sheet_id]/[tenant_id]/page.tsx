import { AccordionAssignmentSheet } from '@/components/accordion-assignment-sheet/AccordionAssignmentSheet';
import { AccordionAssignmentSheetFuture } from '@/components/accordion-assignment-sheet/AccordionAssignmentSheetFuture';
import { api } from '@/lib/hono';
import { convertToPDT, formatDate } from '@/utils/dates';
import { notFound } from 'next/navigation';

interface IAssignmentSheetPageProps {
  params: {
    assignment_sheet_id: string;
    tenant_id: string;
  };
}

const AssignmentSheetPage = async ({
  params: { assignment_sheet_id, tenant_id },
}: IAssignmentSheetPageProps) => {
  // Fetch data for a specific tenant and assignment sheet
  const res = await api.assignments[':assignmentSheetId'][':tenantId'].$get({
    param: {
      assignmentSheetId: assignment_sheet_id,
      tenantId: tenant_id,
    },
  });

  // Convert response to JSON
  const rotations = await res.json();

  // Check for error in data and display it if found
  if ('error' in rotations) {
    notFound();
  }

  return (
    <>
      <header className="bg-primary text-white">
        <div className="flex items-center h-14 py-4 px-4 text-xl">
          Your Tasks
        </div>
      </header>

      <div className="px-6">
        {/* Current rotation */}
        <AccordionAssignmentSheet
          startDate={formatDate(convertToPDT(new Date(rotations[1].startDate)))}
          endDate={formatDate(convertToPDT(new Date(rotations[1].endDate)))}
          categories={rotations[1].categories}
          assignmentSheetId={assignment_sheet_id}
          tenantId={tenant_id}
        />

        {/* Future rotations */}
        {Object.entries(rotations)
          .slice(1)
          .map(([key, rotation]) => (
            <AccordionAssignmentSheetFuture
              key={key}
              startDate={formatDate(convertToPDT(new Date(rotation.startDate)))}
              endDate={formatDate(convertToPDT(new Date(rotation.endDate)))}
              categories={rotation.categories}
            />
          ))}
      </div>
    </>
  );
};

export default AssignmentSheetPage;
