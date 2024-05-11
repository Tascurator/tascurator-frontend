interface IEditShareHousePageProps {
  params: {
    share_house_id: string;
  };
}

const EditShareHousePage = ({
  params: { share_house_id },
}: IEditShareHousePageProps) => {
  return (
    <>
      <p>Edit Share House Page</p>
      <p>Share House ID: {share_house_id}</p>
    </>
  );
};

export default EditShareHousePage;
