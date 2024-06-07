'use client'

import Header from './header';
import Footer from './footer';
import { fetchReviewData, addDataToFirestore } from '../data/firestore';
import React, {useState} from 'react';

interface ReviewData {
  id: string;
  name: string;
  address: string;
  contents: string;
}

export default function Layout({children}: {children: React.ReactNode;}) {
  const [review, setReview] = useState<ReviewData[]>([]);
  const [textareaData, setTextareaData] = useState('');

  const reviewData = async() => {
    const response = await fetchReviewData();
    setReview(response);
  };

  reviewData();

  fetchReviewData();
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextareaData(event.target.value);
  };

  const handleAddData = () => {
    addDataToFirestore(textareaData);
  };

  return (
    <>
      <Header children={children}/>
      <section className="text-gray-600 body-font relative">
          <div className="container px-5 py-20 mx-auto flex justify-center items-center">
              <div className="lg:w-2/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:w-full md:relative z-10">
              <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">수원체육문화센터</h2>
              <p className="leading-relaxed mb-5 text-gray-600">경기도 수원시 영통구 영통로 123</p>
              <div className="relative mb-4">
                  <textarea value={textareaData} onChange={handleChange} id="message" name="message" placeholder="후기를 입력해주세요" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
              </div>
              <button type="submit" onClick={handleAddData} className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg">등록</button>
              </div>
          </div>
      </section>
      <Footer children={children}></Footer>
    </>
  )
}