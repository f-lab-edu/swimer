'use client'

import Header from './header';
import Footer from './footer';
import React, {useState} from 'react';
import Data from '../lib/requestdata';
import { PublicSwimmingPool } from '../lib/types';
import { LinksButton, SaveVisitButton } from './button';
import { Pagination } from "@nextui-org/pagination";

export default function Layout({children}: {children: React.ReactNode;}) {
    const [data, setData] = useState<PublicSwimmingPool[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResults, setSearchResults] = useState<PublicSwimmingPool[]>([]);
    const [inputValue, setInputValue] = useState('');
    const searchProperties = ["FACLT_NM", "SIGUN_NM"];
    let searchList: PublicSwimmingPool[] = data;

    const totalItems = data.length;
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const handleDataReceived = (receivedData: PublicSwimmingPool[]) => {
        setData(receivedData);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    function handleSearch(term: string) {
        const allPools = data.map((item) => item);

        const results = allPools.filter(pool =>
            searchProperties.some(prop =>
                pool[prop].replaceAll(" ", "").includes(term.replaceAll(" ", ""))
            )
        );
        setInputValue(term);
        setSearchResults(results);
    }

    if(inputValue !== ""){
        searchList = searchResults;
    }

    const currentItems = searchList.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>  
            <Header children={children}/>
            <Data onDataReceived={handleDataReceived} />
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto max-w-screen-xl">
                    <div className="w-full bg-white shadow-md rounded-md flex items-center">
                        <input type="text" placeholder="수영장 이름, 특정 지역 검색" className="w-full px-4 py-2 focus:outline-none rounded-md" onChange={(e) => handleSearch(e.target.value)}/>
                    </div>
                    <br/><br/>
                    {currentItems.map((item, index) => (
                    <div className="-my-8 divide-y-2 divide-gray-100" key={index}>
                        <div className="py-8 flex flex-wrap md:flex-nowrap">
                            <div className="md:flex-grow border-b-2 border-gray">
                                <h2 className="font-semibold text-2xl font-medium text-gray-900 title-font mb-2">{item.FACLT_NM}</h2>
                                <p className="leading-relaxed">{item.SIGUN_NM}</p>
                                <LinksButton id={item.id}/>
                            </div>
                            <div className="flex items-center border-b-2 border-gray">
                            <SaveVisitButton id={item.id}/>
                            </div>
                        </div>
                    </div>
                    ))}
                <div className="flex justify-center flex-wrap gap-4 items-center mt-5">
                    <Pagination total={Math.ceil(totalItems / itemsPerPage)} initialPage={currentPage} page={currentPage} onChange={(page: number) => handlePageChange(page)} color="primary"/>
                </div>
                </div>
            </section>
            <div>{children}</div>
            <Footer children={children}></Footer>
        </>
    )
}