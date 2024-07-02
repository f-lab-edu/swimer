import Header from './header';
import Footer from './footer';
import { useState } from 'react';
import useData from '../lib/requestdata';
import Loading from './loading';
import ErrorPage from './error';
import { addDataToFirestore } from '../data/firestore';
import { useRouter } from 'next/navigation';

export default function Layout({id}: {readonly id: string}) {
  const { data, loading, error } = useData();
  const [textareaData, setTextareaData] = useState<string>('');
  const router = useRouter();

  const handleAddData = async () => {
    const selectedItem = data.find(item => item.id === id);
    if (!selectedItem) return;

    const addData = {
      id: selectedItem.id,
      name: selectedItem.FACLT_NM,
      address: selectedItem.SIGUN_NM,
      contents: textareaData,
      user: "JM"
    };

    addDataToFirestore(addData).then(() => {
      alert("리뷰가 등록되었습니다.");
      setTextareaData("");
      router.push("/");
    })
    .catch(error => {
      alert("다시 시도해주세요.");
    });
  };
  
  if (loading) {
    return <Loading />
  }

  if(error){
    return <ErrorPage message={error}/>
  }

  return (
    <>
      <Header />
      <section className="text-gray-600 body-font relative">
        {data.map((item, index) => (
          <div key={index}>
            {item.id === id && 
            <div className="container px-5 py-20 mx-auto flex justify-center items-center">
              <div className="lg:w-2/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:relative z-10">
                <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">{item.FACLT_NM}</h2>
                <p className="leading-relaxed mb-5 text-gray-600">{item.SIGUN_NM}</p>
                <div className="relative mb-4">
					        <textarea onChange={(e) => setTextareaData(e.target.value)} value={textareaData} id="message" name="message" placeholder="후기를 입력해주세요" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
					      </div>
					      <button type="submit" onClick={handleAddData} className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg">등록</button>
              </div>
            </div>
            }
          </div>
        ))}
      </section>
      <Footer />
    </>
  )
}