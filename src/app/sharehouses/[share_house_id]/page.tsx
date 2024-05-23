interface IShareHousePageProps {
  params: {
    share_house_id: string;
  };
}

const ShareHousePage = ({
  params: { share_house_id },
}: IShareHousePageProps) => {
  return (
    <>
      <p>Share House Page</p>
      <p>Share House ID: {share_house_id}</p>
    </>
  );
};

export default ShareHousePage;
