import React, { useEffect, useState } from 'react';
import { fetchAllCoins } from '../api/coinsApi';
import {  Link } from 'react-router-dom';

const SearchBar = () => {
    const [allCoins,setAllCoins] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResult , setSearchResult] = useState([]);

    useEffect(() =>{
        const getCoins = async () => {
            const coins = await fetchAllCoins();
            setAllCoins(coins);
        };
        getCoins();
    },[]);

    useEffect(()=>{
        if (searchTerm.trim() === '') {
            setSearchResult([]);
            return;
        }
        const filtered = allCoins.filter((coin)=>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResult(filtered.slice(0,5));
    },[searchTerm,allCoins]);





  return (
    
    <div className='flex flex-col items-center justify-center'>
      <div className=" relative w-72 md:w-[450px] border border-gray-400 rounded-md hover:border-gray-300">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search coin..."
              className="px-3 py-1 rounded-md text-white w-full"
            />

            {searchResult.length > 0 && (
              <ul className="absolute z-50 bg-[#15141a] text-white mt-1 rounded shadow w-full max-h-60 overflow-y-auto">
                {searchResult.map((coin) => (
                  <li key={coin.id}>
                    <Link
                      to={`/coin/${coin.id}`}
                      onClick={() => setSearchTerm('')}
                      className="flex items-center gap-2 px-3 py-2 hover:hover:bg-[#1e1d24]"
                    >
                      <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                      <span>{coin.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
    </div>
  )
}

export default SearchBar
