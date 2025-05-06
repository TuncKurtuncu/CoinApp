import React, { useState, useEffect } from 'react';
import { fetchAllCoins } from '../api/coinsApi';
import CoinLoader from './Loader';
import Pagination from './Buttons';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { auth, db } from '../api/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';

const AllCoins = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [favoriteCoins, setFavoriteCoins] = useState([]);
  const [user, setUser] = useState(null);

  const ItemsPerPage = 10;
  const IndexOfLastItem = currentPage * ItemsPerPage;
  const IndexOfFirstItem = IndexOfLastItem - ItemsPerPage;
  const currentCoins = allCoins.slice(IndexOfFirstItem, IndexOfLastItem);
  const totalPages = Math.ceil(allCoins.length / ItemsPerPage);

  // Auth dinleme
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Coin verilerini çek
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const allCoin = await fetchAllCoins();
      setAllCoins(allCoin);
      setLoading(false);
    };
    getData();
  }, []);

  // Favori verilerini yükle (önce Firestore, sonra local fallback)
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'favorites', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const firestoreFavorites = docSnap.data().coins || [];
            setFavoriteCoins(firestoreFavorites);
            localStorage.setItem('favoriteCoins', JSON.stringify(firestoreFavorites));
          } else {
            setFavoriteCoins([]);
          }
        } catch (err) {
          console.error("Firestore get error:", err);
        }
      } else {
        const stored = localStorage.getItem('favoriteCoins');
        if (stored) {
          setFavoriteCoins(JSON.parse(stored));
        }
      }
    };

    fetchFavorites();
  }, [user]);

  // Favori yıldız tıklama
  const toggleFavorite = async (coinId) => {
    if (!user) return;

    let updatedFavorites;
    if (favoriteCoins.includes(coinId)) {
      updatedFavorites = favoriteCoins.filter(id => id !== coinId);
    } else {
      updatedFavorites = [...favoriteCoins, coinId];
    }

    setFavoriteCoins(updatedFavorites);
    localStorage.setItem('favoriteCoins', JSON.stringify(updatedFavorites));

    try {
      await setDoc(doc(db, 'favorites', user.uid), { coins: updatedFavorites });
    } catch (err) {
      console.error("Firestore write error:", err);
    }
  };

  const formatPrice = (price) => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
  };

  return (
    <div>
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
          {loading ? (
            <tr>
              <td colSpan={5}>
                <div className="flex justify-center items-center py-10">
                  <CoinLoader />
                </div>
              </td>
            </tr>
          ) : currentCoins.length > 0 ? (
            currentCoins.map((coin) => (
              <tr key={coin.id} className="text-sm hover:bg-[#1e1d24]">
                <td className="px-4 py-2 flex items-center gap-2">
                  {user && (
                    <FaStar
                      className={`cursor-pointer text-lg ${
                        favoriteCoins.includes(coin.id) ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                      onClick={() => toggleFavorite(coin.id)}
                    />
                  )}
                  <Link to={`/coin/${coin.id}`} className="flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                    <div className="flex flex-col leading-tight">
                      <div className="uppercase font-semibold">{coin.symbol}</div>
                      <div className="w-32 truncate lg:w-auto sm:truncate-none text-gray-400 text-xs">
                        {coin.name || 'N/A'}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-2 text-right">
                  {coin.current_price != null ? formatPrice(coin.current_price) : 'N/A'}
                </td>
                <td
                  className={`px-4 py-2 text-right ${
                    coin.price_change_percentage_24h > 0
                      ? 'text-green-400'
                      : coin.price_change_percentage_24h < 0
                      ? 'text-red-400'
                      : 'text-white'
                  }`}
                >
                  {coin.price_change_percentage_24h != null
                    ? `${coin.price_change_percentage_24h.toFixed(3)}%`
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 text-right md:table-cell hidden">
                  {coin.total_volume != null ? coin.total_volume.toLocaleString() : 'N/A'}
                </td>
                <td className="px-4 py-2 text-right md:table-cell hidden">
                  {coin.market_cap != null ? coin.market_cap.toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                <CoinLoader />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="m-auto p-5">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default AllCoins;
