import React, { useState } from 'react';
import TopMovers from '../components/TopMovers';
import Header from '../components/Header';
import CoinLoader from '../components/Loader';
import { Link } from "react-router-dom";

const TopVolume = () => {
  const [topVolume, setTopVolume] = useState([]);

  return (
    <div>
      <Header />
      <div className='grid justify-center items-center'>
        <div className='m-auto mt-20 flex items-center'>
          <span className='animate-pulse mr-1 text-4xl'>🚀</span>
          <span className='text-4xl text-white'>Top 10 Volume</span>
        </div>
        <div className='container m-auto mt-20'>
          <TopMovers onTopVolumeLoaded={(slicedPopulars) => setTopVolume(slicedPopulars)} hideUI={true} topVolumeCount={10} />
          <table className='w-full table-fixed text-white p-2'>
            <thead >
            <tr>
              <th className="px-4 text-left w-1/5">Name</th>
              <th className="px-4 text-right w-1/5">Price</th>
              <th className="px-4 text-right w-1/5">Change</th>
              <th className="px-4 text-right w-1/5 md:table-cell hidden">24h Volume</th>
              <th className="px-4 text-right w-1/5 md:table-cell hidden">Market Cap</th>
            </tr>
            </thead>
            <tbody>
              {topVolume.length > 0 ? (
                topVolume.map((coin) => (
                  <tr key={coin.id} className='text-sm hover:bg-[#1e1d24] overflow-hidden'>
                    <td className='px-4 py-2'>
                      <Link to={`/coin/${coin.id}`} className='flex items-center gap-2'>
                        <img src={coin.image} alt={coin.image} className='h-6 w-6' />
                        <div className='flex flex-col leading-tight'>
                          <span className='font-semibold uppercase'>{coin.symbol}</span>
                          <span className='w-32 truncate lg:w-auto sm:truncate-none text-gray-400 text-sm'>{coin.name}</span>
                        </div>
                      </Link>
                    </td>
                    <td className='px-4 py-2 text-right'>
                      ${coin.current_price ? coin.current_price.toLocaleString() : 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-right'>
                      {coin.price_change_percentage_24h !== null && coin.price_change_24h !== undefined ? (
                        <span className={coin.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-right md:table-cell hidden'>
                      ${coin.total_volume ? (coin.total_volume / 1e9).toFixed(2) + 'B' : 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-right md:table-cell hidden'>
                      ${coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) + 'B' : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='py-4'>
                    <CoinLoader />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TopVolume;
