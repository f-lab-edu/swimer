export default function Footer() {
  return (
    <>
      <footer className="text-gray-600 body-font bg-blue-500">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <span className="ml-3 text-xl text-white">ㅇㅅㅇ</span>
          </a>
          <p className="text-sm text-white sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2024 ㅇㅅㅇ(오늘 수영 완료) —
            <a
              href=""
              className="text-white-500 ml-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              @jjisabi
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
