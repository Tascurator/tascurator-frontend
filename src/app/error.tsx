'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const InternalServerError = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-6 pt-10 sm:pt-28 px-6 text-center">
        <p className="text-6xl">500</p>
        <p className="text-2xl">Internal Server Error</p>
        <p>There are some problem with our server. Please try again later.</p>
        <Image
          width={800}
          height={800}
          src="/internal-server-error.webp"
          alt="Internal Server Error"
          className="w-56"
        />
        <Button type={'button'} asChild>
          <Link href="/">Go back</Link>
        </Button>
      </div>
    </>
  );
};

export default InternalServerError;
