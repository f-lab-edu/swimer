import Header from './header';
import Footer from './footer';
import Link from 'next/link';

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Header />
      <section className="text-gray-600 body-font overflow-hidden min-h-max">
        <div className="container px-5 mx-auto max-w-screen-xl">
          <div className="container px-5 py-24 mx-auto">
            <div className="-my-8 divide-y-2 divide-gray-100">
              <div className="flex justify-between items-center mb-7">
                <p className="text-2xl font-medium text-gray-900 title-font">
                  내가 방문한 수영장
                </p>
                <Link
                  href={'/'}
                  className="flex items-center text-blue-500 text-sm mt-3 hover:text-gray-300"
                >
                  <p className="mr-2">방문한 수영장 인증</p>
                  <svg
                    className="inline-flex h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>
              <div className="py-20 flex justify-center flex-wrap md:flex-nowrap bg-gray-200">
                <p>버전2에서 지도 진행 예정</p>
              </div>
            </div>
            <div className="-my-7">
              <div className="md:flex-grow mt-20">
                <div className="flex w-full mx-auto mb-5 flex-wrap bg-white rounded-lg overflow-hidden shadow-md p-4">
                  <p className="title-font text-gray-900 lg:w-3/4 lg:mb-0 mb-4">
                    소사벌 레포츠 타운
                  </p>
                  <div className="flex-grow"></div>
                  <div className="flex justify-between">
                    <p className="text-gray-500 text-sm">2024-06-28</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
