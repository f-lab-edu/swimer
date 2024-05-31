'use client'

import Header from './header';
import Footer from './footer';
import Loading from './loading';
import ErrorPage from './error';
import React, {useState, useEffect} from 'react';

interface PublicSwimmingPool {
    FACLT_NM: string;
    SIGUN_NM: string;
}

export default function Layout({children}: {children: React.ReactNode;}) {
    const [data, setData] = useState<PublicSwimmingPool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <>  
            <Header children={children}/>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto max-w-screen-xl">
                    <div className="w-full bg-white shadow-md rounded-md flex items-center">
                        <input type="text" placeholder="수영장 이름, 특정 지역 검색" className="w-full px-4 py-2 focus:outline-none rounded-md" />
                        <button type="submit" className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                              <path d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                    </div>
                    <br/><br/>
                    {error && <ErrorPage message={error} />}
                    {data.map((item, index) => (
                    <div className="-my-8 divide-y-2 divide-gray-100" key={index}>
                    <div className="py-8 flex flex-wrap md:flex-nowrap">
                        <div className="md:flex-grow border-b-2 border-gray">
                            <h2 className="font-semibold text-2xl font-medium text-gray-900 title-font mb-2">{item.FACLT_NM}</h2>
                            <p className="leading-relaxed">{item.SIGUN_NM}</p>
                            <a className="text-blue-500 inline-flex items-center mt-4">Learn More
                                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                                <path d="M5 12h14"></path>
                                <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </a>
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