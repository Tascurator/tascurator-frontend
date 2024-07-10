'use client';
import { Header } from '@/components/ui/header';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface IShareHousesLayoutProps {
  children: ReactNode;
}

const ShareHousesLayout = ({ children }: IShareHousesLayoutProps) => {
  const pathname = usePathname();

  let HeaderComponent;
  const basePath = '/sharehouses';
  const editPathRegex = new RegExp(`^${basePath}/[\\w-]+/edit$`);
  const shareHousePathRegex = new RegExp(`^${basePath}/[\\w-]+$`);

  const shareHouseName = 'Sample Share House'; // ここは動的に取得する必要があるかもしれません

  if (pathname === basePath) {
    HeaderComponent = <Header type={'HeaderItemForTop'} pageTitle={''} />;
  } else if (pathname === `${basePath}/new`) {
    HeaderComponent = (
      <Header type={'HeaderItemOnlyBreadcrumb'} pageTitle={'Setup'} />
    );
  } else if (editPathRegex.test(pathname)) {
    HeaderComponent = (
      <Header type={'HeaderItemWithDropDown'} pageTitle={shareHouseName} />
    );
  } else if (shareHousePathRegex.test(pathname)) {
    HeaderComponent = (
      <Header type={'HeaderItemWithDropDown'} pageTitle={shareHouseName} />
    );
  } else {
    HeaderComponent = (
      <Header type={'HeaderItemOnlyBreadcrumb'} pageTitle={''} />
    );
  }

  return (
    <>
      {HeaderComponent}
      <div className="px-6">{children}</div>
    </>
  );
};

export default ShareHousesLayout;
