import axios from 'axios';



const BASE_URL = 'https://api.coingecko.com/api/v3';


export const fetchAllCoins = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 250,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Coin verileri alınırken hata oluştu:', error);
    return [];
  }
};


//Popüler Coinler (Market Cap En Yüksek)
export const fetchPopularCoins = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h'
    );

    if (Array.isArray(response.data)) {
    
      return response.data;
      
    } else {
      throw new Error('Geçersiz veri formatı');
    }
  } catch (error) {
    console.error('Popüler coin verisi alınamadı:', error);
    return [];
  }
};


// Yeni çıkan coinleri getir (son 5)
export const fetchNewlyListedCoins = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'id_asc',
        per_page: 20, // Sayfa başına 20 coin çekiyoruz
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      },
    });

    // Geçerli olan coin'leri filtrele (name ve price kontrolü)
    const validCoins = response.data.filter(
      (coin) => coin.name && coin.current_price && coin.symbol && coin.image 
      && coin.current_price && coin.price_change_percentage_24h != null
    );

    // Filtrelenmiş ve istenilen veriyi almak
    const newestCoins = validCoins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
    }));
    
    return newestCoins;
  } catch (error) {
    console.error('Yeni coinler alınırken hata oluştu:', error.message);
    return []; // Hata durumunda boş array döndür
  }
};