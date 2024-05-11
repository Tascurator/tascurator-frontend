interface IAssignmentSheetPageProps {
  params: {
    assignment_sheet_id: string;
    tenant_id: string;
  };
}

const AssignmentSheetPage = ({
  params: { assignment_sheet_id, tenant_id },
}: IAssignmentSheetPageProps) => {
  return (
    <>
      <p>Assignment Sheet Page</p>
      <p>
        Assignment Sheet ID: {assignment_sheet_id}, Tenant ID: {tenant_id}
      </p>
    </>
  );
};

export default AssignmentSheetPage;
