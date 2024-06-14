import Header from './header';
import Footer from './footer';
import { useState } from 'react';
import Data from '../lib/requestdata';

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

export default function Layout({children, id}: {children: React.ReactNode; id: string | undefined;}) {
  const [data, setData] = useState<PublicSwimmingPool[]>([]);

  const handleDataReceived = (receivedData: PublicSwimmingPool[]) => {
    setData(receivedData);
  };
    return (
      <>
        <Header children={children}/>
        <Data onDataReceived={handleDataReceived} />
        <section className="text-gray-600 body-font relative">
          {data.map((item, index) => (
            <div key={index}>
              {item.id === id && 
              <div className="container px-5 py-20 mx-auto flex justify-center items-center">
                <div className="lg:w-2/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:w-full md:relative z-10">
                  <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">{item.FACLT_NM}</h2>
                  <p className="leading-relaxed mb-5 text-gray-600">{item.SIGUN_NM}</p>
                  <div className="relative mb-4">
                      <textarea id="message" name="message" placeholder="후기를 입력해주세요" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                  </div>
                  <button className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg">등록</button>
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