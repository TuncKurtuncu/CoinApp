import React, { useEffect, useState } from 'react';
import { fetchAllCoins, fetchNewlyListedCoins,fetchPopularCoins } from '../api/coinsApi';
import CoinLoader from './Loader';
import { Link } from 'react-router-dom';



const TopMovers = ({onGainerLoaded, onLoserLoaded ,onTopVolumeLoaded,onNewCoinsLoaded, hideUI = false, newCoinsCount, gainersCount, losersCount,topVolumeCount}) => {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [populars, setPopulars] = useState([]);
  const [newCoins, setNewCoins] = useState([]);
  const defaultGainersCount = 5;
  const defaultLosersCount = 5;
  const defaultTopVolumeCount = 5;
  const defaultNewCoinsCoun =5;
  
  

  useEffect(() => {
    const getData = async () => {
      
      
      const allCoins = await fetchAllCoins();
      const popularCoins = await fetchPopularCoins();
      const coins = await fetchNewlyListedCoins();
        
        
    
      
      // Geçerli yüzde değişim olanları filtrele
      const validCoins = allCoins.filter(
        coin => coin.price_change_percentage_24h !== null
      );

      // Kazananlar
      const topGainers = [...validCoins]
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, gainersCount || defaultGainersCount );

      // Kaybedenler
      const topLosers = [...validCoins]
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, losersCount || defaultLosersCount);

        


      const slicedPopulars = popularCoins.slice(0, topVolumeCount  || defaultTopVolumeCount);
      const slicedNews = coins.slice(0, newCoinsCount||defaultNewCoinsCoun);
      setPopulars(slicedPopulars);
      setGainers(topGainers);
      setLosers(topLosers);
      setNewCoins(slicedNews); 
      
      if (onGainerLoaded) {
        onGainerLoaded(topGainers);
       
      }

      if (onLoserLoaded) {
        onLoserLoaded(topLosers);
      }

      if (onTopVolumeLoaded) {
        onTopVolumeLoaded(slicedPopulars)
      }
      if (onNewCoinsLoaded) {
        onNewCoinsLoaded(slicedNews)
      }
    };
    

    getData();
  }, []);

  if (hideUI) {
    return null;
  }

  return (
    <nav>
    <div className='grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 '>
      <Link to="/topvolume">
   <div className="flex flex-col w-72 p-5 mt-10 mx-5 border rounded-md border-gray-400 xl:mx-20 items-center hover:border-gray-200">
   <div className="flex items-center ">
      <span className="animate-pulse mr-1 mb-2 ">🚀</span>
       <h2 className="text-xl font-bold mb-2 text-green-600">Top Volume</h2>
       </div>
   { populars.length > 0 ?  (
     <div>
     <ul className=''>
       {populars.map(coin => (
         <li key={coin.id} className="text-sm justify-items-center">
           <div className="flex items-center gap-4 py-1 border-b border-gray-400 w-fit">
             <div className="flex items-center gap-2 text-white w-48">
               <img src={coin.image} alt={coin.name} className="w-4 h-4" />
               <span
                className="text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis"
                title={coin.name}
              >
                {coin.name}
              </span>
             </div>
             <span className={`${coin.price_change_percentage_24h > 0
                             ? "text-green-400"
                             : coin.price_change_percentage_24h < 0
                             ? "text-red-400"
                             : "text-white"} w-16 text-right font-mono`}>
                               {coin.price_change_percentage_24h.toFixed(3)}%
               </span>
           </div>
         </li>
       ))}
     </ul>
     </div>
    
   ):(
    <CoinLoader/>
   )}
   
  </div>
  </Link>
  

   <Link to='/gainers'>
  <div className="flex flex-col w-72 p-5 mt-10 mx-5 border rounded-md border-gray-400 xl:mx-20 items-center  hover:border-gray-200">
  <div className="flex items-center ">
  <span className="animate-pulse mr-1 mb-2 ">🔥</span>
    <h2 className="text-xl font-bold mb-2 text-green-600">Top Gainers</h2>
    </div>
    {gainers.length >0 ? (
      <div>
      <ul className=''>
      {gainers.map(coin => (
        <li key={coin.id} className="text-sm justify-items-center">
          <div className="flex items-center gap-4 py-1 border-b border-gray-400 w-fit">
            <div className="flex items-center gap-2 text-white w-48">
              <img src={coin.image} alt={coin.name} className="w-4 h-4" />
              <span
                className="text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis"
                title={coin.name}
              >
                {coin.name}
              </span>
            </div>
            <span className="text-green-500 w-16 text-right font-mono">
              {coin.price_change_percentage_24h.toFixed(3)}%
            </span>
          </div>
        </li>
      ))}
    </ul>
    </div>):(
      <CoinLoader/>
    )}
    
    
  </div>
  </Link>

    <Link to='/losers'>
  <div href='/' className="flex flex-col w-72 p-5 mt-10 mx-5 border rounded-md border-gray-400 xl:mx-20  items-center  hover:border-gray-200">
  <div className="flex items-center ">
  <span className="animate-pulse mr-1 mb-2 ">📉</span>
    <h2 className="text-xl font-bold mb-2 text-red-600"> Top Losers</h2>
    </div>
    {losers.length >0 ?( <div>
    <ul className=' '>
      {losers.map(coin => (
        <li key={coin.id} className="text-sm justify-items-center">
          <div className="flex items-center gap-4 py-1 border-b border-gray-400 w-fit">
            <div className="flex items-center gap-2 text-white w-48">
              <img src={coin.image} alt={coin.name} className="w-4 h-4" />
              <span
                className="text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis"
                title={coin.name}
              >
                {coin.name}
              </span>
            </div>
            <span className="text-red-500 w-16 text-right font-mono">
              {coin.price_change_percentage_24h.toFixed(3)}%
            </span>
          </div>
        </li>
      ))}
    </ul>
    </div>):(
      <CoinLoader/>
    )}
   
  </div>
  </Link>

    <Link to='/newcoins'>
  <div className="flex flex-col w-72 p-5 mt-10 mx-5 border rounded-md border-gray-400 xl:mx-20 items-center  hover:border-gray-200">
  <div className="flex items-center">
    <span className="animate-pulse mr-1 mb-2">🆕</span>
    <h2 className="text-xl font-bold mb-2 text-green-600">New Listing</h2>
  </div>
  {newCoins.length >0 ?(<div>
  <ul>
    {
      newCoins
      .filter((coin) => coin.price_change_percentage_24h != null)
      .map((coin) => (
        <li key={coin.id} className="text-sm justify-items-center">
          <div className="flex items-center gap-4 py-1 border-b border-gray-400 w-fit">
            <div className="flex items-center gap-2 text-white w-48">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-4 h-4"
              />
              <span
                className="text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis"
                title={coin.name}
              >
                {coin.name}
              </span>
            </div>
            {coin.price_change_percentage_24h !== undefined ? (
              <span
                className={`${
                  coin.price_change_percentage_24h > 0
                    ? "text-green-400"
                    : coin.price_change_percentage_24h < 0
                    ? "text-red-400"
                    : "text-white"
                } w-16 text-right font-mono`}
              >
                {coin.price_change_percentage_24h != null
          ? coin.price_change_percentage_24h.toFixed(3) + '%'
          : 'N/A'}
              </span>
            ) : (
              <span className="text-gray-400 w-16 text-right font-mono">—</span>
            )}
          </div>
        </li>
      ))
    }
  </ul>
  </div>):(
     <CoinLoader/>
  )}
  
</div>
</Link>

</div>
</nav>

  );
};

export default TopMovers;
