'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import React, {useState} from 'react';
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
} from '@nextui-org/react';

export default function Layout({children}: {children: React.ReactNode}) {
  const {data, loading, error} = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<PublicSwimmingPool[]>([]);
  const [inputValue, setInputValue] = useState('');
  const searchProperties = ['FACLT_NM', 'SIGUN_NM'];
  let searchList: PublicSwimmingPool[] = data;

  const ITEMS_PER_PAGE = 10;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  function SwimmingPoolList() {
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
      <section className="text-gray-600 body-font overflow-hidden min-h-max flex-1">
        <div className="container px-5 py-24 mx-auto max-w-screen-xl">
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
            {totalItems > 0 ? (
              <SwimmingPoolList />
            ) : (
              <p className="text-gray-600 text-center">검색 결과가 없습니다.</p>
            )}
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
