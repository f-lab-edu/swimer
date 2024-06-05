import Header from './header';
import Footer from './footer';

export default function Layout({children}: {children: React.ReactNode;}) {
    return (
      <>
      <Header children={children}/>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="-my-8 divide-y-2 divide-gray-100">
            <div className="py-8 flex flex-wrap md:flex-nowrap">
              <div className="md:w-64 mr-10 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                <img src="https://dummyimage.com/720x600"></img>
              </div>
              <div className="md:flex-grow mt-10">
                <h2 className="text-2xl font-medium text-gray-900 title-font mb-20">수원체육문화센터</h2>
                <p className="leading-relaxed">경기도 수원시 영통구 영통로</p>
                <p className="leading-relaxed">031-123-4567</p>
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
      </section>
      <Footer children={children}></Footer>
      </>
    )
}