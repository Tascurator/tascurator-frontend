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
  // sharehouses/new
  const shareHouseNew = `${basePath}/new`;

  const shareHouseName = 'Sample Share House';
  const sharehouseIdMatch = pathname.match(/sharehouses\/([\w-]+)/);
  const sharehouseId = sharehouseIdMatch ? sharehouseIdMatch[1] : '';

  if (pathname === basePath) {
    HeaderComponent = <Header type={'HeaderItemForTop'} pageTitle={''} />;
  } else if (pathname === `${basePath}/new`) {
    HeaderComponent = (
      <Header type={'HeaderItemOnlyBreadcrumb'} pageTitle={'Setup'} />
    );
  } else if (editPathRegex.test(pathname)) {
    HeaderComponent = (
      <Header
        type={'HeaderItemWithDropDown'}
        pageTitle={shareHouseName}
        // sharehouseId={sharehouseId}
      />
    );
    // dashboard
  } else if (shareHousePathRegex.test(pathname)) {
    HeaderComponent = (
      <Header
        type={'HeaderItemWithDropDown'}
        pageTitle={shareHouseName}
        sharehouseId={sharehouseId}
      />
    );
  } else {
    HeaderComponent = (
      <Header type={'HeaderItemOnlyBreadcrumb'} pageTitle={''} />
    );
  }

  if (pathname === shareHouseNew) {
    return (
      <>
        {HeaderComponent}
        <div className="px-6">{children}</div>
      </>
    );
  }

  return (
    <>
      {HeaderComponent}
      {console.log(shareHouseNew)}
      <div className={shareHousePathRegex.test(pathname) ? '' : 'px-6'}>
        {children}
      </div>
    </>
  );
};

export default ShareHousesLayout;
