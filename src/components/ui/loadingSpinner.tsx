'use client';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useEffect } from 'react';

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
  // Reset the body's overflow when isLoading becomes false
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <div className="fixed left-0 top-0 z-[9999] bg-black/50 w-full h-full flex justify-center items-center pointer-events-auto">
        <div className=" border-gray-200 h-12 w-12 animate-spin rounded-full border-4 border-t-primary" />
      </div>
    </>
  );
};
