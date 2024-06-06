'use client'

import Header from './header';
import Footer from './footer';
import Loading from './loading';
import ErrorPage from './error';
import React, {useState, useEffect} from 'react';

import { LinksButton, SaveVisitButton } from './button';

interface PublicSwimmingPool {
    FACLT_NM: string;
    SIGUN_NM: string;
    [key: string]: string;
}

export default function Layout({children}: {children: React.ReactNode;}) {
    const [data, setData] = useState<PublicSwimmingPool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchResults, setSearchResults] = useState<PublicSwimmingPool[]>([]);
    const [inputValue, setInputValue] = useState('');
    const searchProperties = ["FACLT_NM", "SIGUN_NM"];

    useEffect(() => {
        const requestType = "Type=json";
        const requestKey = "KEY=9e860bd7d3ee4d129d3390efe28a172a";
        const requestUrl = "https://openapi.gg.go.kr/PublicSwimmingPool?" + requestKey + "&" +  requestType;
        
        const fetchData = async () => {
            setLoading(true);
            try{
                const response = await fetch(requestUrl);

                if (!response.ok) {
                    throw new Error("응답 받기 실패");
                }

                const responseData = await response.json();
                const dataArray: PublicSwimmingPool[] = responseData.PublicSwimmingPool[1].row;

                setData(dataArray);
            }catch(error){
                console.error("fetching data 에러", error);
                setError("데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
            }finally{
                setLoading(false);
            }
        };

        fetchData();

    }, []);

    if (loading) {
        return <Loading />
    }

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
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto max-w-screen-xl">
                    <div className="w-full bg-white shadow-md rounded-md flex items-center">
                        <input type="text" placeholder="수영장 이름, 특정 지역 검색" className="w-full px-4 py-2 focus:outline-none rounded-md" onChange={(e) => handleSearch(e.target.value)}/>
                    </div>
                    <br/><br/>
                    {error && <ErrorPage message={error} />}
                    {searchList.map((item, index) => (
                    <div className="-my-8 divide-y-2 divide-gray-100" key={index}>
                    <div className="py-8 flex flex-wrap md:flex-nowrap">
                        <div className="md:flex-grow border-b-2 border-gray">
                            <h2 className="font-semibold text-2xl font-medium text-gray-900 title-font mb-2">{item.FACLT_NM}</h2>
                            <p className="leading-relaxed">{item.SIGUN_NM}</p>
                            <LinksButton />
                        </div>
                        <div className="flex items-center border-b-2 border-gray">
                        <SaveVisitButton />
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