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
      <div className="px-6">{children}</div>
    </>
  );
};

export default ShareHousesLayout;
