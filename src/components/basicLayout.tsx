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
import {OtterIcon, LocationDotIcon, AwardsIcon} from '@/ui/icon';

function TopReviewer({
  topAuthors,
}: {
  topAuthors: {authorUserId: string; authorName: string; reviewCount: number}[];
}) {
  const router = useRouter();

  const goToMyPage = (e: number) => {
    const userName = topAuthors[e].authorUserId;
    router.push(`/mypage/${userName}`);
  };
  return (
    <>
      <p className="flex justify-center text-3xl mb-9 font-semibold">
        이달의 수친자
      </p>
      <p className="flex justify-center mb-2">
        <OtterIcon />
      </p>
      <p className="flex justify-center text-sm text-blue-500 mb-5">
        방문한 수영장을 인증해서 오늘 수영 완료를 인증해보세요.
      </p>
      <Table
        aria-label="Example static collection table"
        align="center"
        color="default"
        selectionMode="single"
        onRowAction={e => goToMyPage(Number(e))}
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
                <AwardsIcon index={index} />
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
                {item.facltName}
              </h2>
              <p className="leading-relaxed">{item.sigunName}</p>
            </div>
            <div className="text-right">
              <SaveVisitButton swimmingPoolId={item.swimmingPoolId} />
            </div>
          </CardBody>
          <CardFooter>
            <MoveDetailButton swimmingPoolId={item.swimmingPoolId} />
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
  const searchProperties = ['facltName', 'sigunName'];
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
            <LocationDotIcon />
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
