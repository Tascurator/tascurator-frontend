'use client';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

/**
 *
 * A Loading spinner component to show while data is updating
 *
 * @example
 *
 * <LoadingSpinner isLoading={false} />
 *
 */

interface LoadingSpinnerProps {
  isLoading: boolean;
}

export const LoadingSpinner = ({ isLoading }: LoadingSpinnerProps) => {
  return <>{isLoading && <LoadingOverlay />}</>;
};

export const LoadingOverlay = () => {
  useLockBodyScroll();
  return (
    <>
      <div className="fixed left-0 top-0 z-50 bg-black/50 w-full h-full flex justify-center items-center">
        <div className=" border-gray-200 h-12 w-12 animate-spin rounded-full border-4 border-t-primary" />
      </div>
    </>
  );
};
