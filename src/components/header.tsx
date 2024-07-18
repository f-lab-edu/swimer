import Link from 'next/link';
import {singOut} from '@/data/firestore';
import {useAuthState} from '@/contexts/AuthContext';
import {User} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {UserIcon, WaterIcon} from '@/ui/icon';

const WithAuthenticatedUserControls = ({user}: {user: User}) => {
  const router = useRouter();
  const userUid = user?.uid;

  const handleClick = async () => {
    await singOut();
    router.push('/');
  };

  return (
    <div>
      <Link href={`/mypage/${userUid}`} className="mr-3">
        <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 text-blue-500">
          {`${user?.displayName}님`}
        </button>
      </Link>
      <button
        className="text-gray-300 text-sm mt-5 hover:text-gray-500"
        onClick={handleClick}
      >
        로그아웃
      </button>
    </div>
  );
};

const WithoutAuthenticatedUser = () => {
  return (
    <Link href={'/login'} className="mr-3">
      <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 text-blue-500">
        <UserIcon />
      </button>
    </Link>
  );
};

export default function Header() {
  const user = useAuthState();

  return (
    <>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 "
            href={'/'}
          >
            <WaterIcon />
            <span className="ml-3 text-2xl text-blue-500 w-32 font-bold">
              ㅇㅅㅇ
            </span>
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            {user ? (
              <WithAuthenticatedUserControls user={user} />
            ) : (
              <WithoutAuthenticatedUser />
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
