import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CoinLoader from '../components/Loader';
import { Link } from "react-router-dom";
import { fetchAllCoins } from '../api/coinsApi';

const TopVolume = () => {
  const [topVolume, setTopVolume] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const topVolumeCount = 10;

  const getData = async () => {
    try {
      setLoading(true);
      const allCoins = await fetchAllCoins();

      const validCoins = allCoins.filter(
        coin => coin.total_volume !== null && coin.total_volume !== undefined
      );

      const topVolumeCoins = [...validCoins]
        .sort((a, b) => b.total_volume - a.total_volume)
        .slice(0, topVolumeCount);

      setTopVolume(topVolumeCoins);
      setRetryCount(0);
      setLoading(false);
    } catch (error) {
      console.error("Top volume verisi çekme hatası:", error.message);
      setRetryCount(prev => prev + 1);
      const delay = Math.min(60000, 2000 * retryCount);
      setTimeout(getData, delay);
    }
  };

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

    return (
      <div>
        <div className='sticky top-0 z-50'>
          <Header />
        </div>
        <div className='grid justify-items-center'>
          <div className='m-auto mt-20 flex items-center'>
            <span className='animate-pulse mr-1 text-4xl'>🔥</span>
            <h3 className='text-4xl text-green-600'> Top 10 Volume</h3>
          </div>
          <div className='container m-auto mt-20'>
            <table className="w-full table-fixed text-white p-2">
              <thead>
                <tr>
                  <th className="px-4 text-left w-1/5">Name</th>
                  <th className="px-4 text-right w-1/5">Price</th>
                  <th className="px-4 text-right w-1/5">Change</th>
                  <th className="px-4 text-right w-1/5 md:table-cell hidden">24h Volume</th>
                  <th className="px-4 text-right w-1/5 md:table-cell hidden">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {loading || topVolume.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4">
                      <CoinLoader />
                    </td>
                  </tr>
                ) : (
                  topVolume.map((coin) => (
                    <tr key={coin.id} className="text-sm hover:bg-[#1e1d24] overflow-hidden">
                      <td className="px-4 py-2 ">
                        <Link to={`/coin/${coin.id}`} className="flex items-center gap-2">
                          <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                          <div className="flex flex-col leading-tight">
                            <span className="font-semibold uppercase">{coin.symbol}</span>
                            <span className="w-16 md:w-20 truncate lg:w-auto sm:truncate-none text-gray-400 text-sm">{coin.name}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-right">
                        ${coin.current_price ? coin.current_price.toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {coin.price_change_percentage_24h != null ? (
                          <span className={coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-right md:table-cell hidden">
                        ${coin.total_volume ? (coin.total_volume / 1e9).toFixed(2) + 'B' : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-right md:table-cell hidden">
                        ${coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) + 'B' : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

export default TopVolume;
