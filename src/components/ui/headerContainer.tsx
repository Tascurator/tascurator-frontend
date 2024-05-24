import { ReactNode } from 'react';

interface HeaderContainerProps {
  children: ReactNode;
}

export default function HeaderContainer({ children }: HeaderContainerProps) {
  return (
    <header className="sticky top-0 z-10 bg-primary text-white max-w-screen-sm w-full">
      <div className="container flex items-center justify-between h-14 py-4 px-4">
        {children}
      </div>
    </header>
  );
}
