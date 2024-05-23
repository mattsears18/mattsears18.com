import Image from 'next/image';
import Link from 'next/link';
// import linkedin image
import linkedinLogo from '../public/assets/images/linkedinLogo.png';

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen bg-slate-950">
      <div>
        <Link href={'https://www.linkedin.com/in/mattsears18'}>
          <Image src={linkedinLogo} alt={'LinkedIn Logo'} width={100} height={100} />
        </Link>
      </div>
    </main>
  );
}
