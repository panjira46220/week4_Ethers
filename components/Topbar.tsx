import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Transition } from '@headlessui/react'
import { useState,useEffect } from "react";



const Topbar = () => {
  const router = useRouter();

  console.log(router.pathname);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className=" border-gray-200  sm:px-4 py-4  relative cursor-default ">
    <div className="container flex flex-wrap justify-between items-center mx-auto ">
   
    <div className=" flex ">
    <img src="bkf-logo.png" className="mr-3 h-6 sm:h-4 lg:h-6" alt="fin-logo" />
        
    </div>

    <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
          <div className="flex text-white space-x-12  " >
            
            <p className="font-medium text-lightblue hover:text-textnav  lg:text-sm sm: text-xs">Pay</p>
            <p className="font-medium text-lightblue hover:text-textnav  lg:text-sm sm: text-xs">History</p>

              
            
          </div>
          
        </div>
    <div className="flex md:hidden">
    <button data-collapse-toggle="mobile-menu" type="button"className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu" aria-expanded="false"
    onClick={() => setIsOpen((isOpen) => !isOpen)}>
      <span className="sr-only">Open main menu</span>
      {!isOpen ? (
									<svg
										className="block h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								) : (
									<svg
										className="block h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								)}
      {/* <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
      <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg> */}
    </button>

    
    </div>
  </div>
  <Transition
					show={isOpen}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
				>
					{( ref) => (
						<div className="md:hidden h-screen " id="mobile-menu">
            <div
              ref={ref}
              className=" bg-darkbg  space-y-1 sm:px-4 sm:py-5 text-white"
            >
             {MENUS.map((menu) => (
          <Link key={menu.href} href={menu.href}>
            <a
              className={`hover:text-lightblue  transition font-medium ${
                router.pathname === menu.href ? "text-lightblue " : "         "
              }`}
            >
              <div className="space-x-4 py-2 lg:text-lg   sm:text-sm space-x-reverse...">
              {menu.text}
              </div>
            </a>
          </Link>
        ))}
            </div>
          </div>)}
				</Transition>
</nav>
    
  );
};

export default Topbar;