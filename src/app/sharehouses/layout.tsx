import { Header } from '@/components/ui/header';
import { ReactNode } from 'react';

interface IShareHousesLayoutProps {
  children: ReactNode;
}

const ShareHousesLayout = ({ children }: IShareHousesLayoutProps) => {
  const pageTitle = 'Sample Share House';
  return (
    <>
      <Header type={'HeaderItemWithDropDown'} pageTitle={pageTitle} />
      <div className="flex flex-col px-6 min-h-[calc(100dvh-56px)]">
        {children}
      </div>
    </>
  );
};

export default ShareHousesLayout;
