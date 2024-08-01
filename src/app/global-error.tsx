'use client';
import { Roboto } from 'next/font/google';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
const roboto = Roboto({ weight: ['400', '500'], subsets: ['latin'] });

const GlobalError = () => {
  return (
    <html lang="en">
      <body
        className={`flex justify-center items-start min-h-screen bg-primary-lightest ${roboto.className}`}
      >
        <main className="max-w-screen-sm min-h-screen w-full h-full bg-white relative">
          <div className="flex flex-col items-center gap-6 pt-10 sm:pt-28 px-6 text-center">
            <p className="text-5xl">Oops!</p>
            <p>Something went wrong.</p>
            <p className="text-sm">Please try again later.</p>
            <Image
              width={800}
              height={800}
              src="/global-error.webp"
              alt="Oops! Something went wrong."
              className="w-56"
            />
            <Button type={'button'} asChild>
              <Link href="/">Go back</Link>
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
