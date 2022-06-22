import type { NextPage } from "next";
import * as ethers from "ethers";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getBalance,
  getChainId,
  getEthereum,
  getProvider,
  getWalletAddress,
 
} from "../services/wallet-service";
import {
  getNetworkCurrency,
  getNetworkName,
  getNetworkTokens, 
  getNetworkNameLongo,
} from "../constants/network-id";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { Token } from "../types/token.type";
import NavLayout from "../layouts/NavLayout";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Transition } from '@headlessui/react'
import Image from 'next/image'
const Home: NextPage = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>( //ใช้ Record เพื่อจะเข้าถึงแบบนี้ EX. tokenBalances['USDT'] แล้วจะได้ตัวเลขค่าเหรียญเลย เหมือนออบเจ็คtokenBalances['USDT'] เป็นคีย์ 
    {}
  );

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const getTokenBalance = async ( //ดึงเหรียญของuser
    tokenAddress: string,
    ownerAddress: string
  ) => {
    const abi = ["function balanceOf(address owner) view returns (uint256)"];  //จะใช้smart contact รู้สองอย่าง api address(อยู่ในเหรียญอยู่แล้ว) **บังพิมพ์ผิด abi ที่จริงคือ api
    const contract = new ethers.Contract(tokenAddress, abi, getProvider()!); // เครื่องหมาย ! คือการบังคับอย่าเป็น Null
    return contract.balanceOf(ownerAddress)!; //ฟังก์ชั่น balanceOf ตรงกับที่เขียนไว้ใน abi
  };

  
    let test = "";
    if (address != null) {
      test = address.substring(0, 3) + "..." + address.substring(39, 42);
    
    }
  
  

  const addTokenToWallet = async (token: Token) => { //คลิกที่เหรียญในหน้าเว็บแล้วให้แอดใส่ในกระเป๋าMetamark
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: token.address, // The address that the token is at.
            symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: token.decimals, // The number of decimals in the token
            image: token.imageUrl, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadAccountData = async () => {  //โหลด address id Balance
    const addr = getWalletAddress();
    setAddress(addr);

    const chainId = await getChainId();
    setNetwork(chainId);

    const bal = await getBalance(addr);   //เหรียญของแต่ละเน็ตเวิร์ค เช่น bitkub มี เหรียญKub
    if (bal) setBalance(formatEther(bal)); //ถ้ามี bal ให้ทำ

    const tokenList = getNetworkTokens(chainId); //โหลดเหรียญทุกเหรียญ

    const tokenBalList = await Promise.all(    // Promise.all ยิงทุกอย่างเป็นparallelหมดเลย จะรอจนทุกตัวเสร็จหมดแล้วเก็บในtokenBalList เป็นสตริงตัวเลขว่าเหรียญที่1คืออะไร 
      tokenList.map((token) =>
        getTokenBalance(token.address, addr).then((res) => 
          formatUnits(res, token.decimals)  // ใช้formatUnits เพราะตัวเลขที่ได้เป็นบิ๊กนัมเบอร์ ถ้าจะเอาตัวเลขที่เราอ่านได้ต้องเป็นสตริง  formatUnitsกี่ตำแหน่งก็ได้ระบุข้างหลังformatUnits นี้กำหนดเป็นtoken.decimalsตำแหน่ง
        )
      )
    );

    tokenList.forEach((token, i) => {   //เอาข้อมูลทุกอย่างเซตใน tokenBalances
      tokenBalances[token.symbol] = tokenBalList[i]; // เนื่องจากtokenBalListเป็นอาร์เรย์แต่tokenBalancesเป็นออบเจ็ค
    });
    setTokenBalances({ ...tokenBalances });
  };

  useEffect(() => {
    loadAccountData(); //โหลดตอนโหลดหน้าเว็บ

    const handleAccountChange = (addresses: string[]) => { //เปลี่ยนแอคเคาน์โหลด ข้อมูล 1 ครั้ง
      setAddress(addresses[0]);
      loadAccountData();
    };

    const handleNetworkChange = (networkId: string) => { //เปลี่ยนเน็ตเวิร์คโหลด ข้อมูล 1 ครั้ง
      setNetwork(networkId); 
      loadAccountData();
    };

    getEthereum()?.on("accountsChanged", handleAccountChange);

    getEthereum()?.on("chainChanged", handleNetworkChange);
  }, []);

  return (
    
  <div className=" bg-pbg h-screen">
    <nav className=" border-gray-200 bg-white  sm:px-4 py-4  relative cursor-default ">
    <div className="container flex flex-wrap justify-between items-center mx-auto ">
   
    <div className=" flex ">
    <img src="bkf-logo.png" className="mr-3 h-6 sm:h-4 lg:h-6" alt="fin-logo" />
        
    </div>

    <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
          <div className="flex text-white space-x-12 items-center " >
            
            <p className="font-medium text-lightblue hover:text-textnav  lg:text-sm sm: text-xs">Pay</p>
            <p className="font-medium text-lightblue hover:text-textnav  lg:text-sm sm: text-xs">History</p>
            
            <select  className=" border border-x-sky-900 rounded shadow lg:text-sm sm:text-xs text-lightblue p-1 m-1">
                <option selected>Please change network</option>
                <option > <label>
                  {/* <img src={getNetworkNameLongo(network)} alt="netword" />   */}
                  
    
                  {getNetworkName(network)} 
                </label></option>
                
              </select>
              {/* <p className="font-medium text-lightblue hover:text-textnav  lg:text-sm sm: text-xs">{address}</p> */}
              <div className="flex items-center   ">
                
                <img
                  src={getNetworkNameLongo(network)}
                  className="h-6 -m-2 absolute"
                />
              <select  className=" border border-x-sky-900 rounded shadow lg:text-sm sm:text-xs text-white  bg-gradient-to-r from-cyan-700 to-indigo-900 py-1 px-4 m-1 w-28 ab">
                <option selected className=" px-4">{test}</option>
                <option >  Logout</option>
                
              </select>
            </div>
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
              className=" bg-pbg  space-y-1 sm:px-4 sm:py-5 text-white"
            >
             
             <p className="font-medium text-lightblue hover:text-textnav  lg:text-sm sm: text-xs">Pay</p>
            <p className="font-medium text-lightblue hover:text-textnav  lg:text-sm sm: text-xs">History</p>
            <select  className=" border border-x-sky-900 rounded shadow lg:text-sm sm:text-xs text-lightblue p-1 m-1">
                <option selected>Please change network</option>
                <option > 
                    {getNetworkName(network)} </option>
                
            </select>
            
            <div className="flex items-center   ">
                
                <img
                  src={getNetworkNameLongo(network)}
                  className="h-6 -m-2 absolute"
                />
              <select  className=" border border-x-sky-900 rounded shadow lg:text-sm sm:text-xs text-white  bg-gradient-to-r from-cyan-700 to-indigo-900 py-1 px-4 m-1 w-28 ab">
                <option selected className=" px-4">{test}</option>
                <option >  Logout</option>
                
              </select>
            </div>
        
            </div>
          </div>)}
				</Transition>
</nav>



      {address ? (
        <div className="  p-5 flex  justify-center ">
          
            
          
        
        <div className=" container  lg:w-1/2 mx-auto absolute rounded-md shadow shadow-indigo-500 border-blue-700   ">
          {/* <p>Your wallet address is {address}</p>
          <p>
            Current network is {getNetworkName(network)} ({network})
          </p> */}
          
          <div className="  flex justify-center relative ">
            <p className=" text-white rounded-br-lg rounded-bl-lg px-12 py-3 bg-cyan-900  items-center flex justify-center  ">Wallet</p>
          </div>
          
      <div className=" mt-12 px-12  ">
          <div className=" flex  justify-between py-2">
            <p className="text-left">
              Assets
            </p>
            <p className=" items-end">
               Balance {balance} {getNetworkCurrency(network)}
            </p>
          </div>
          {/* <h4 className="font-bold text-lg">Token list</h4> */}
          <div>
            {getNetworkTokens(network).map((token) => (
              <div key={token.symbol} className="flex mb-4 bg-white rounded-lg p-4 shadow">
                <div >
                  <img
                    onClick={() => addTokenToWallet(token)}
                    src={token.imageUrl}
                    className="w-12 h-12 mr-8 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="text-base">
                    {token.name} ({token.symbol})
                  </div>
                  <div className=" text-base text-cyan-800">
                    ฿{tokenBalances[token.symbol] || 0} {token.symbol} 
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
          <div className=" flex justify-center py-3">
              <button className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-8 border border-blue-700 rounded-lg ">
                Scan QR
              </button>
          </div>
        </div>
        </div>
      ) : (
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={connectWallet}
        >
          Connect
        </button>
      )}
</div>
    
  );
};

export default Home;
