import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { auth, db } from '../api/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { fetchAllCoins } from '../api/coinsApi';
import { FaStar } from 'react-icons/fa';




function Profile() {
  const user = auth.currentUser;
  const [favoriteCoins, setFavoriteCoins] = useState([]);
  const [allCoins, setAllCoins] = useState([]);
  const [coinDetails, setCoinDetails] = useState([]);
  const [portfolioEntries, setPortfolioEntries] = useState([]);

  const [coinId, setCoinId] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [formMessage, setFormMessage] = useState('');



  // Favoriler
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const docRef = doc(db, 'favorites', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firebaseFavorites = docSnap.data().coins || [];
          setFavoriteCoins(firebaseFavorites);
          localStorage.setItem('favoriteCoins', JSON.stringify(firebaseFavorites));
        }
      } else {
        const storedFavorites = localStorage.getItem('favoriteCoins');
        if (storedFavorites) {
          setFavoriteCoins(JSON.parse(storedFavorites));
        }
      }
    };
    fetchFavorites();
  }, [user]);
  const handleUnfollowCoin = async (coinIdToRemove) => {
    if (user) {
      const docRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let updatedFavorites = docSnap.data().coins || [];
        updatedFavorites = updatedFavorites.filter((coinId) => coinId !== coinIdToRemove);

        // Firebase'deki veriyi güncelle
        await setDoc(docRef, { coins: updatedFavorites });

        // State'i güncelle
        setFavoriteCoins(updatedFavorites);
        localStorage.setItem('favoriteCoins', JSON.stringify(updatedFavorites));
      }
    }
  };

  // Tüm coinler
  useEffect(() => {
    const getAllCoins = async () => {
      const coins = await fetchAllCoins();
      setAllCoins(coins);
    };
    getAllCoins();
  }, []);

  // Favori detayları
  useEffect(() => {
    const getFavoriteCoinDetails = () => {
      const favoritesWithDetails = allCoins.filter(coin => favoriteCoins.includes(coin.id));
      setCoinDetails(favoritesWithDetails);
    };
    if (allCoins.length > 0 && favoriteCoins.length > 0) {
      getFavoriteCoinDetails();
    }
  }, [allCoins, favoriteCoins]);

  // Portföy verileri
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (user) {
        const docRef = doc(db, 'portfolio', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const entries = docSnap.data().entries || [];
          setPortfolioEntries(entries);
        }
      }
    };
    fetchPortfolio();
  }, [user]);

  const handleAddCoin = async (e) => {
    e.preventDefault();
    if (!coinId || !buyPrice || !amount) {
      setFormMessage('Tüm alanları doldurun');
      return;
    }

    const coin = allCoins.find(c => c.id === coinId);
    if (!coin) {
      setFormMessage('Geçersiz coin ID');
      return;
    }

    const currentPrice = coin.current_price;
    const profitLoss = (currentPrice - parseFloat(buyPrice)) * parseFloat(amount);

    const newEntry = {
      coinId,
      buyPrice: parseFloat(buyPrice),
      amount: parseFloat(amount),
      currentPrice,
      profitLoss: parseFloat(profitLoss.toFixed(2))
    };

    const updatedEntries = [...portfolioEntries, newEntry];
    await setDoc(doc(db, 'portfolio', user.uid), {
      entries: updatedEntries
    });

    setPortfolioEntries(updatedEntries);
    setCoinId('');
    setBuyPrice('');
    setAmount('');
    setFormMessage('Coin başarıyla eklendi.');
  };
  const handleDeleteCoin = async (indexToDelete) => {
    const updatedEntries = portfolioEntries.filter((_, index) => index !== indexToDelete);

    try {
      await setDoc(doc(db, 'portfolio', user.uid), {
        entries: updatedEntries
      });
      setPortfolioEntries(updatedEntries);
    } catch (error) {
      console.error('Silme işlemi başarısız:', error);
    }
  };


  const totalProfitLoss = portfolioEntries.reduce((acc, entry) => {
    const liveCoin = allCoins.find(c => c.id === entry.coinId);
    const livePrice = liveCoin?.current_price || entry.currentPrice;
    const profitLoss = (livePrice - entry.buyPrice) * entry.amount;
    return acc + profitLoss;
  }, 0);


  return (
    <>

      <header className="sticky top-0 z-50">
        <Header />
      </header>
      <main>
        <div className='items-center justify-items-center text-white mt-5'>
          <h1 className="text-3xl font-bold mb-2">👤{user?.displayName || 'Belirtilmemiş'} </h1>
          <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
        </div>
        <div className="text-white p-6 flex flex-col lg:flex-row justify-between gap-10">

          {/* Sol */}
          <div className="lg:w-1/2">



            <h2 className="text-2xl font-semibold mb-3">⭐ Takip Edilen Coinler</h2>
            {coinDetails.length === 0 ? (
              <p className="text-gray-400">Henüz takip edilen coin yok.</p>
            ) : (
              <ul className="space-y-5">
                {coinDetails.map((coin) => (
                  <li key={coin.id} className="bg-[#1e1d24] p-4 rounded-lg hover:bg-[#2a2931] transition w-full">
                    <Link to={`/coin/${coin.id}`} className="flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                      <div>
                        <div className="text-lg font-medium">
                          {coin.name} ({coin.symbol}) - ${coin.current_price}
                        </div>
                        <div
                          className={`text-sm ${coin.price_change_percentage_24h > 0
                            ? 'text-green-400'
                            : coin.price_change_percentage_24h < 0
                              ? 'text-red-400'
                              : 'text-white'
                            }`}
                        >
                          {coin.price_change_percentage_24h?.toFixed(2)}%
                        </div>
                      </div>
                    </Link>
                    {/* Takipten Çık Butonu */}
                    <button
                      onClick={() => handleUnfollowCoin(coin.id)}
                      className="mt-3 mx-auto w-5 h-5 gap-3"
                    >
                      <FaStar
                        className={`cursor-pointer text-lg ${favoriteCoins.includes(coin.id) ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        onClick={() => toggleFavorite(coin.id)}
                      />
                    </button>
                  </li>
                ))}
              </ul>

            )}

          </div>

          {/* Sağ */}
          <div className="lg:w-1/2 ">
            <h2 className="text-2xl font-semibold mb-3">💼 Portföy</h2>

            {/* Coin Ekleme Formu */}
            <form onSubmit={handleAddCoin} className="mb-6 bg-[#1e1d24] p-4 rounded-lg space-y-4">
              <h3 className="text-xl font-semibold">🛒 Coin Ekle</h3>

              <div>
                <label>Coin ID:</label>
                <input
                  type="text"
                  value={coinId}
                  onChange={(e) => setCoinId(e.target.value)}
                  placeholder="örnek: bitcoin"
                  className="w-full bg-[#2a2931] p-2 rounded mt-1"
                />
              </div>
              <div>
                <label>Alış Fiyatı ($):</label>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full bg-[#2a2931] p-2 rounded mt-1"
                />
              </div>
              <div>
                <label>Adet:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#2a2931] p-2 rounded mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-950 p-2 rounded-lg hover:bg-blue-900 text-white mt-3"
              >
                Coin Ekle
              </button>

              {formMessage && <p className="text-sm mt-2">{formMessage}</p>}
            </form>

            {/* Alım Listesi */}
            {portfolioEntries.length === 0 ? (
              <p className="text-gray-400">Henüz coin eklenmedi.</p>
            ) : (
              <table className="w-full text-sm text-left bg-[#1e1d24] rounded-lg">
                <thead className="text-white border-b border-gray-600">
                  <tr>
                    <th className="p-2">Coin</th>
                    <th className=" hidden md:block p-2">Alış Fiyatı</th>
                    <th className="p-2">Adet</th>
                    <th className=" hidden md:block p-2">Mevcut Fiyat</th>
                    <th className="p-2">Kar/Zarar</th>
                    <th className="p-2">Sil</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioEntries.map((entry, index) => {
                    const liveCoin = allCoins.find(c => c.id === entry.coinId);
                    const livePrice = liveCoin?.current_price || entry.currentPrice;
                    const profitLoss = ((livePrice - entry.buyPrice) * entry.amount).toFixed(2);

                    return (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="p-2">{entry.coinId}</td>
                        <td className="hidden md:block p-2">${entry.buyPrice}</td>
                        <td className="p-2">{entry.amount}</td>
                        <td className="hidden md:block p-2">${livePrice}</td>
                        <td className={`p-2 ${profitLoss > 0 ? 'text-green-400' : profitLoss < 0 ? 'text-red-400' : ''}`}>
                          ${profitLoss}
                        </td>
                        <td className="p-2">
                          <button onClick={() => handleDeleteCoin(index)}>🗑️</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <div className="mt-4 text-lg font-semibold">
              Toplam Kar/Zarar: <span className={`${totalProfitLoss > 0 ? 'text-green-400' : totalProfitLoss < 0 ? 'text-red-400' : 'text-white'}`}>${totalProfitLoss.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;
