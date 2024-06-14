'use client'

import Header from './header';
import Footer from './footer';
import { useState } from 'react';
import Data from '../lib/requestdata'

interface PublicSwimmingPool {
  id: string;
  FACLT_NM: string;
  SIGUN_NM: string;
  CONTCT_NO: string;
  HMPG_ADDR: string;
  IRREGULR_RELYSWIMPL_LENG: string;
  IRREGULR_RELYSWIMPL_LANE_CNT: string;
  [key: string]: string;
}

export default function Layout({children, id}: {children: React.ReactNode; id: string  | undefined;}) {
    const [data, setData] = useState<PublicSwimmingPool[]>([]);

    const handleDataReceived = (receivedData: PublicSwimmingPool[]) => {
      setData(receivedData);
    };

    return (
      <>
      <Header children={children}/>
      <Data onDataReceived={handleDataReceived} />
      <section className="text-gray-600 body-font overflow-hidden">
      {data.map((item, index) => (
          <div key={index}>
          {item.id === id && 
                  <div className="container px-5 py-24 mx-auto">
                  <div className="-my-8 divide-y-2 divide-gray-100">
                    <div className="py-8 flex flex-wrap md:flex-nowrap">
                      <div className="md:w-64 mr-10 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                        <img src="https://dummyimage.com/720x600"></img>
                      </div>
                      <div className="md:flex-grow mt-10">
                        <h2 className="text-2xl font-medium text-gray-900 title-font mb-20">{item.FACLT_NM}</h2>
                        <p className="leading-relaxed">{item.SIGUN_NM}</p>
                        <p className="leading-relaxed">{item.CONTCT_NO}</p>
                        <p className="leading-relaxed">{item.HMPG_ADDR}</p>
                        {(item.IRREGULR_RELYSWIMPL_LENG && item.IRREGULR_RELYSWIMPL_LANE_CNT) !== null && <p className="leading-relaxed">{item.IRREGULR_RELYSWIMPL_LENG}m * {item.IRREGULR_RELYSWIMPL_LANE_CNT}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="-my-8">
                  <div className="md:flex-grow mt-10">
                        <p className="text-2xl font-medium text-gray-900 title-font mb-20">수영장 리뷰</p>
                        <p>굳굳 좋아요</p>
                      </div>
                  </div>
                </div>
          }
          </div>
      ))}
      </section>
      <Footer children={children}></Footer>
      </>
    )
}