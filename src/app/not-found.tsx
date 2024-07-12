import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const NotFound = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-6 pt-10 sm:pt-28 px-6 text-center">
        <p className="text-5xl">Oops!</p>
        <p>
          It looks like the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <p className="text-sm">
          Don&apos;t worry, we&apos;ll help you find your way back to
          cleanliness! You can go back to the homepage or check out the links
          below.
        </p>
        <Image
          width={800}
          height={800}
          src="/not-found.webp"
          alt="404 Page not found"
          className="w-56"
        />
        <Button type={'button'} asChild>
          <Link href="/">Go back</Link>
        </Button>
      </div>
    </>
  );
};

export default NotFound;
