import SetupStepper from '@/components/setup-sharehouse/SetupStepper';

const NewSharehousePage = () => {
  return (
    <div>
      <SetupStepper initialStep={1} maxSteps={4} />
    </div>
  );
};

export default NewSharehousePage;
