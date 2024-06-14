'use client'

import Header from './header';
import Footer from './footer';
import React, {useState} from 'react';
import Data from '../lib/requestdata';

import LinksButton from './button';

interface PublicSwimmingPool {
    id: string;
    FACLT_NM: string;
    SIGUN_NM: string;
    CONTCT_NO: string;
    [key: string]: string;
}


export default function Layout({children}: {children: React.ReactNode;}) {
    const [data, setData] = useState<PublicSwimmingPool[]>([]);

    const handleDataReceived = (receivedData: PublicSwimmingPool[]) => {
        setData(receivedData);
    };

    const [searchResults, setSearchResults] = useState<PublicSwimmingPool[]>([]);
    const [inputValue, setInputValue] = useState('');
    const searchProperties = ["FACLT_NM", "SIGUN_NM"];


    function handleSearch(term: string) {
        const allPool = data.map((item) => (
            item
        ));

        const results = allPool.filter(pool =>
            searchProperties.some(prop =>
                pool[prop].replaceAll(" ", "").includes(term.replaceAll(" ", ""))
            )
        );
        setInputValue(term);
        setSearchResults(results);
    }
    
    let searchList: PublicSwimmingPool[] = data;

    if(inputValue !== ""){
        searchList = searchResults;
    }

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
                    {searchList.map((item, index) => (
                    <div className="-my-8 divide-y-2 divide-gray-100" key={index}>
                    <div className="py-8 flex flex-wrap md:flex-nowrap">
                        <div className="md:flex-grow border-b-2 border-gray">
                            <h2 className="font-semibold text-2xl font-medium text-gray-900 title-font mb-2">{item.FACLT_NM}</h2>
                            <p className="leading-relaxed">{item.SIGUN_NM}</p>
                            <LinksButton id={item.id}/>
                        </div>
                        <div className="flex items-center border-b-2 border-gray">
                        <a className="text-blue-500 inline-flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                        </a>
                        </div>
                    </div>
                </div>
            ))}
                </div>
            </section>
            <div>{children}</div>
            <Footer children={children}></Footer>
        </>
    )
}