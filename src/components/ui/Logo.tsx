import Image from 'next/image';

interface ILogo {
  // true: hide logo on mobile and show on tablet & laptop, false: always show logo
  responsive: boolean;
}

const Logo = ({ responsive }: ILogo) => {
  return (
    <>
      <Image
        src="/logo.svg"
        alt="Tascurator Logo"
        className={`mt-16 mb-12 mx-auto h-auto w-auto ${responsive && 'hidden md:block'}`}
        width={100}
        height={100}
        priority
      />
    </>
  );
};

export { Logo };
