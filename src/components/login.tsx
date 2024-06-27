'use client'

import Header from './header';
import Footer from './footer';

export default function Layout({children}: {children: React.ReactNode;}) {
    return (
      <>
          <Header children={children}/>
          <section className="text-gray-600 body-font overflow-hidden min-h-max md:mt-12 md:mb-12">
              <div className="container px-5 mx-auto max-w-screen-xl">
                <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto md:mr-auto w-full mt-10 md:mt-12">
                    <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
                    <div className="relative mb-4">
                        <label className="leading-7 text-sm text-gray-600">Email</label>
                        <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                    <div className="relative mb-7">
                        <label className="leading-7 text-sm text-gray-600">Password</label>
                        <input type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                    <button className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-gray-300 rounded text-lg">Login</button>
                </div>
              </div>
          </section>
          <br></br>
          <Footer children={children}></Footer>
      </>
    )
}