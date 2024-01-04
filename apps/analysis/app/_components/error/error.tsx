'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export const Error: React.FC<ErrorPageProps> = ({ error, reset }) => {
  const router = useRouter();
  console.log('error', error);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-5">
      <Image src="/images/Cable.png" width={80} height={80} alt="cable" />
      <div className="text-center max-w-lg space-y-2">
        <h1 className="text-black dark:text-white font-sans font-bold text-2xl">Oops!</h1>
        <p className="text-black dark:text-white font-sora leading-6 text-lg">
          Looks like there’s something when wrong
        </p>
      </div>
      <Link
        href="/"
        rel="noopener noreferrer"
        replace
        onClick={() => reset()}
        className="font-sans text-black font-bold bg-primary px-6 py-2 flex justify-center items-center rounded-lg hover:opacity-80 w-[330px] h-[60px]"
      >
        Back to Home
      </Link>
    </div>
  );
};
