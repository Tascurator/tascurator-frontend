import Image from 'next/image';

const Logo = () => {
  return (
    <>
      <Image
        src="/logo.svg"
        alt="Tascurator Logo"
        className={'mt-24 mb-20 mx-auto'}
        width={88}
        height={80}
        priority
      />
    </>
  );
};

export { Logo };
