'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import React, {useEffect, useState} from 'react';
import useData from '@/lib/requestdata';
import {PublicSwimmingPool} from '@/lib/types';
import MoveDetailButton from '@/components/moveDetailButton';
import SaveVisitButton from '@/components/saveVisitButton';
import ErrorPage from '@/components/error';
import {
  Card,
  CardFooter,
  CardBody,
  Spinner,
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import {fetchCountUserReview} from '@/data/firestore';
import {useRouter} from 'next/navigation';

function TopReviewer({
  topAuthors,
}: {
  topAuthors: {authorUserId: string; authorName: string; reviewCount: number}[];
}) {
  const router = useRouter();
  const getSvgColor = (index: number): string => {
    switch (index) {
      case 0:
        return '#FFD43B';
      case 1:
        return '#ababab';
      case 2:
        return '#cf9b2a';
      default:
        return 'currentColor';
    }
  };

  const moveMyPage = (e: number) => {
    const userName = topAuthors[e].authorUserId;
    router.push(`/mypage/${userName}`);
  };
  return (
    <>
      <p className="flex justify-center font-semibold text-3xl mb-6">
        이달의 수친자
      </p>
      <p className="flex justify-center font-semibold mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          className="text-blue-500 inline-flex items-center size-6 ml-2"
        >
          <path
            fill="#1079ea"
            d="M181.5 197.1l12.9 6.4c5.9 3 12.4 4.5 19.1 4.5c23.5 0 42.6-19.1 42.6-42.6V144c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v21.4c0 23.5 19.1 42.6 42.6 42.6c6.6 0 13.1-1.5 19.1-4.5l12.9-6.4 8.4-4.2L135.1 185c-4.5-3-7.1-8-7.1-13.3V168c0-13.3 10.7-24 24-24h16c13.3 0 24 10.7 24 24v3.7c0 5.3-2.7 10.3-7.1 13.3l-11.8 7.9 8.4 4.2zm-8.6 49.4L160 240l-12.9 6.4c-12.6 6.3-26.5 9.6-40.5 9.6c-3.6 0-7.1-.2-10.6-.6v.6c0 35.3 28.7 64 64 64h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H384V336 320c0-23.7 12.9-44.4 32-55.4c9.4-5.4 20.3-8.6 32-8.6V240c0-26.5 21.5-48 48-48c8.8 0 16 7.2 16 16v32 16 48c0 8.8 7.2 16 16 16s16-7.2 16-16V204.3c0-48.2-30.8-91-76.6-106.3l-8.5-2.8c-8-2.7-12.6-11.1-10.4-19.3s10.3-13.2 18.6-11.6l19.9 4C576 86.1 640 164.2 640 254.9l0 1.1h0c0 123.7-100.3 224-224 224h-1.1H256h-.6C132 480 32 380 32 256.6V256 216.8c-10.1-14.6-16-32.3-16-51.4V144l0-1.4C6.7 139.3 0 130.5 0 120c0-13.3 10.7-24 24-24h2.8C44.8 58.2 83.3 32 128 32h64c44.7 0 83.2 26.2 101.2 64H296c13.3 0 24 10.7 24 24c0 10.5-6.7 19.3-16 22.6l0 1.4v21.4c0 1.4 0 2.8-.1 4.3c12-6.2 25.7-9.6 40.1-9.6h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-13.3 0-24 10.7-24 24v8h56.4c-15.2 17-24.4 39.4-24.4 64H320c-42.3 0-78.2-27.4-91-65.3c-5.1 .9-10.3 1.3-15.6 1.3c-14.1 0-27.9-3.3-40.5-9.6zM96 128a16 16 0 1 1 0 32 16 16 0 1 1 0-32zm112 16a16 16 0 1 1 32 0 16 16 0 1 1 -32 0z"
          />
        </svg>
      </p>
      <p className="flex justify-center text-sm text-blue-500 mb-5">
        방문한 수영장을 인증해서 오늘 수영 완료를 인증해보세요.
      </p>
      <Table
        aria-label="Example static collection table"
        align="center"
        color="default"
        selectionMode="single"
        onRowAction={e => moveMyPage(Number(e))}
      >
        <TableHeader>
          <TableColumn>AWARDS</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>COUNT</TableColumn>
        </TableHeader>
        <TableBody>
          {topAuthors.map((author, index) => (
            <TableRow key={index}>
              <TableCell>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="text-blue-500 inline-flex items-center size-7"
                >
                  <path
                    fill={getSvgColor(index)}
                    d="M173.8 5.5c11-7.3 25.4-7.3 36.4 0L228 17.2c6 3.9 13 5.8 20.1 5.4l21.3-1.3c13.2-.8 25.6 6.4 31.5 18.2l9.6 19.1c3.2 6.4 8.4 11.5 14.7 14.7L344.5 83c11.8 5.9 19 18.3 18.2 31.5l-1.3 21.3c-.4 7.1 1.5 14.2 5.4 20.1l11.8 17.8c7.3 11 7.3 25.4 0 36.4L366.8 228c-3.9 6-5.8 13-5.4 20.1l1.3 21.3c.8 13.2-6.4 25.6-18.2 31.5l-19.1 9.6c-6.4 3.2-11.5 8.4-14.7 14.7L301 344.5c-5.9 11.8-18.3 19-31.5 18.2l-21.3-1.3c-7.1-.4-14.2 1.5-20.1 5.4l-17.8 11.8c-11 7.3-25.4 7.3-36.4 0L156 366.8c-6-3.9-13-5.8-20.1-5.4l-21.3 1.3c-13.2 .8-25.6-6.4-31.5-18.2l-9.6-19.1c-3.2-6.4-8.4-11.5-14.7-14.7L39.5 301c-11.8-5.9-19-18.3-18.2-31.5l1.3-21.3c.4-7.1-1.5-14.2-5.4-20.1L5.5 210.2c-7.3-11-7.3-25.4 0-36.4L17.2 156c3.9-6 5.8-13 5.4-20.1l-1.3-21.3c-.8-13.2 6.4-25.6 18.2-31.5l19.1-9.6C65 70.2 70.2 65 73.4 58.6L83 39.5c5.9-11.8 18.3-19 31.5-18.2l21.3 1.3c7.1 .4 14.2-1.5 20.1-5.4L173.8 5.5zM272 192a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM1.3 441.8L44.4 339.3c.2 .1 .3 .2 .4 .4l9.6 19.1c11.7 23.2 36 37.3 62 35.8l21.3-1.3c.2 0 .5 0 .7 .2l17.8 11.8c5.1 3.3 10.5 5.9 16.1 7.7l-37.6 89.3c-2.3 5.5-7.4 9.2-13.3 9.7s-11.6-2.2-14.8-7.2L74.4 455.5l-56.1 8.3c-5.7 .8-11.4-1.5-15-6s-4.3-10.7-2.1-16zm248 60.4L211.7 413c5.6-1.8 11-4.3 16.1-7.7l17.8-11.8c.2-.1 .4-.2 .7-.2l21.3 1.3c26 1.5 50.3-12.6 62-35.8l9.6-19.1c.1-.2 .2-.3 .4-.4l43.2 102.5c2.2 5.3 1.4 11.4-2.1 16s-9.3 6.9-15 6l-56.1-8.3-32.2 49.2c-3.2 5-8.9 7.7-14.8 7.2s-11-4.3-13.3-9.7z"
                  />
                </svg>
              </TableCell>
              <TableCell>{author.authorName}</TableCell>
              <TableCell>{author.reviewCount}번 인증</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

function SwimmingPoolList({
  currentItems,
}: {
  currentItems: PublicSwimmingPool[];
}) {
  return (
    <>
      {currentItems.map((item, index) => (
        <Card key={index} className="mb-4 px-4 py-4 h-auto">
          <CardBody>
            <div>
              <h2 className="font-semibold text-2xl text-gray-900 title-font mb-2">
                {item.FACLT_NM}
              </h2>
              <p className="leading-relaxed">{item.SIGUN_NM}</p>
            </div>
            <div className="text-right">
              <SaveVisitButton id={item.id} />
            </div>
          </CardBody>
          <CardFooter>
            <MoveDetailButton id={item.id} />
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default function Layout({children}: {children: React.ReactNode}) {
  const {data, loading, error} = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<PublicSwimmingPool[]>([]);
  const [inputValue, setInputValue] = useState('');
  const searchProperties = ['FACLT_NM', 'SIGUN_NM'];
  let searchList: PublicSwimmingPool[] = data;
  const [topAuthors, setTopAuthors] = useState<
    {authorUserId: string; authorName: string; reviewCount: number}[]
  >([]);

  const ITEMS_PER_PAGE = 10;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    async function fetchAuthors() {
      try {
        const authors = await fetchCountUserReview();
        setTopAuthors(authors);
      } catch (error) {
        console.error('Error fetching top authors:', error);
      }
    }

    fetchAuthors();
  }, []);

  function handleSearch(term: string) {
    const allPools = data.map(item => item);

    const results = allPools.filter(pool =>
      searchProperties.some(prop =>
        pool[prop].replaceAll(' ', '').includes(term.replaceAll(' ', '')),
      ),
    );
    setInputValue(term);
    setSearchResults(results);
  }

  if (inputValue !== '') {
    searchList = searchResults;
  }

  const totalItems = searchList.length;
  const currentItems = searchList.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <Spinner
        size="lg"
        className="flex flex-col items-center justify-center min-h-screen"
      />
    );
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="text-gray-600 px-5 py-24 body-font overflow-hidden">
        <div className="container px-5 mx-auto max-w-screen-xl">
          <TopReviewer topAuthors={topAuthors} />
        </div>
        <div className="container px-5 py-24 mx-auto max-w-screen-xl">
          <p className="flex justify-center font-semibold text-3xl mb-6">
            경기도 모든 수영장 {data.length}
          </p>
          <p className="flex justify-center font-semibold text-lg mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-500 w-5 h-5 mr-2"
              viewBox="0 0 384 512"
            >
              <path
                fill="#1079ea"
                d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
              />
            </svg>
          </p>

          <div className="w-full bg-white shadow-md rounded-md flex items-center">
            <input
              type="text"
              placeholder="수영장 이름, 특정 지역 검색"
              className="w-full px-4 py-2 focus:outline-none rounded-md"
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <br />
          <br />
          <div className="-my-8 divide-y-2 divide-gray-100 mb-10">
            <SwimmingPoolList currentItems={currentItems} />
          </div>
          <div className="flex justify-center flex-wrap gap-4 items-center mt-5">
            {totalItems > 0 && (
              <Pagination
                total={Math.ceil(totalItems / ITEMS_PER_PAGE)}
                initialPage={currentPage}
                page={currentPage}
                onChange={(page: number) => handlePageChange(page)}
                color="primary"
              />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
