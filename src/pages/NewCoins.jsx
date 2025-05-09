import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import CoinLoader from '../components/Loader';
import { Link } from "react-router-dom";
import { fetchNewlyListedCoins } from '../api/coinsApi'; // varsayım olarak

const NewCoins = () => {
  const [newCoins, setNewCoins] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const newCoinsCount = 10;

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const coins = await fetchNewlyListedCoins();
        console.log(coins[0]);
        const slicedNews = coins.slice(0, newCoinsCount);
        setNewCoins(slicedNews);
        setRetryCount(0);
        setLoading(false);
      } catch (error) {
        console.error("Yeni coin verisi çekme hatası:", error.message);
        setRetryCount(prev => prev + 1);
        const delay = Math.min(60000, 2000 * retryCount);
        setTimeout(getData, delay);
      }
    };

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

      <div className='grid justify-center items-center'>
        <div className='m-auto mt-20 flex items-center'>
          <span className='animate-pulse mr-1 text-4xl'>🆕</span>
          <span className='text-4xl text-white'>Top 10 New Coins</span>
        </div>
        <div className='container m-auto mt-20'>
          <table className='w-full table-fixed text-white p-2'>
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
              {loading || newCoins.length === 0 ? (
                <tr>
                  <td colSpan={5} className='py-4'>
                    <CoinLoader />
                  </td>
                </tr>
              ) : (
                newCoins.map((coin) => (
                  <tr key={coin.id} className='text-sm hover:bg-[#1e1d24] overflow-hidden'>
                    <td className='px-4 py-2'>
                      <Link to={`/coin/${coin.id}`} className='flex items-center gap-2'>
                        <img src={coin.image} alt={coin.image} className='h-6 w-6' />
                        <div className='flex flex-col leading-tight'>
                          <span className='font-semibold uppercase'>{coin.symbol}</span>
                          <span className='w-16 md:w-20 truncate lg:w-auto sm:truncate-none text-gray-400 text-sm'>{coin.name}</span>
                        </div>
                      </Link>
                    </td>
                    <td className='px-4 py-2 text-right'>
                      ${coin.price ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 12 }) : 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-right'>
                      <span className={`${
                        coin.price_change_percentage_24h > 0
                          ? "text-green-400"
                          : coin.price_change_percentage_24h < 0
                          ? "text-red-400"
                          : "text-white"
                      } w-16 text-right font-mono`}>
                        {coin.price_change_percentage_24h != null
                          ? coin.price_change_percentage_24h.toFixed(3) + '%'
                          : 'N/A'}
                      </span>
                    </td>
                    <td className='px-4 py-2 text-right md:table-cell hidden'>
                      ${coin.total_volume ? (coin.total_volume / 1e9).toFixed(2) + 'B' : 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-right md:table-cell hidden'>
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

export default NewCoins;
