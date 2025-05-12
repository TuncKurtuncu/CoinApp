import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinLoader from "./Loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const CoinDetails = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [btcAmount, setBtcAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  function formatPrice(price) {
    if (price >= 1) {
      return `$${price.toFixed(2)}`; // Büyükse 2 ondalık
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`; // Orta düzeyse 4 ondalık
    } else {
      return `$${price.toFixed(8)}`; // Küçükse 8 ondalık
    }
  }


  const handleUsdChange = (e) => {
    const usd = e.target.value;
    setUsdAmount(usd);
    const btcValue = usd && coin.market_data.current_price.usd
      ? (parseFloat(usd) / coin.market_data.current_price.usd).toFixed(8)
      : '';
    setBtcAmount(btcValue);
  };

  const handleBtcChange = (e) => {
    const btc = e.target.value;
    setBtcAmount(btc);
    const usdValue = btc && coin.market_data.current_price.usd
      ? (parseFloat(btc) * coin.market_data.current_price.usd).toFixed(2)
      : '';
    setUsdAmount(usdValue);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}?sparkline=true`)
        if (res.data) {
          setCoin(res.data);
          setRetryCount(0);
        } else {
          throw new Error("Boş veri geldi");

        }
      } catch (error) {
        console.error("Veri çekme hatası :", error.message);
        setRetryCount(prev => prev + 1);
        const delay = Math.min(60000, 2000 * retryCount);
        setTimeout(getData, delay)
      }
    };

    getData();
    const interval = setInterval(() => {
      getData();
    }, 6000);
    return () => clearInterval(interval);
  }, [id]);

  if (!coin) return <CoinLoader />;

  const priceChange = coin.market_data.price_change_percentage_24h;

  // 7 günlük sparkline verisi: dizi şeklinde fiyatlar
  const chartData = coin.market_data.sparkline_7d?.price.map((price) => ({

    price: price
  }));


  return (

    <div className="flex flex-col mt-24 items-center lg:flex-row gap-8 p-8 rounded-xl bg-[#15141a] text-white overflow-hidden ">
      {/* Sol taraf - Coin Detayları */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-6">
          <img src={coin.image.large} alt={coin.name} className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h1>
            <p className="text-gray-400">Rank #{coin.market_cap_rank}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-4xl font-semibold">
            {formatPrice(coin.market_data.current_price.usd)}
          </p>
          <p className={`mt-2 text-sm ${coin.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            24h: {coin.market_data.price_change_percentage_24h?.toFixed(2)}%
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p>Market Cap</p>
            <p className="text-white">${coin.market_data.market_cap.usd?.toLocaleString()}</p>
          </div>
          <div>
            <p>Volume (24h)</p>
            <p className="text-white">${coin.market_data.total_volume.usd?.toLocaleString()}</p>
          </div>
          <div>
            <p>Circulating Supply</p>
            <p className="text-white">{coin.market_data.circulating_supply?.toLocaleString()}</p>
          </div>
          <div>
            <p>Total Supply</p>
            <p className="text-white">{coin.market_data.total_supply?.toLocaleString()}</p>
          </div>
        </div>
        {chartData && (
          <div className="w-full mt-10 h-72 " >
            <h2 className="text-xl font-bold mb-4">7-Day Price Chart</h2>
            <ResponsiveContainer width="100%" height="100%" >
              <LineChart data={chartData}>
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip
                  formatter={(value) => `$${value.toFixed(7)}`}
                  contentStyle={{
                    backgroundColor: "#1e1d24",  // Tooltip arka plan rengini değiştirebilirsin
                    borderRadius: "5px",
                    border: "none",
                    padding: "10px",
                  }}
                  itemStyle={{
                    color: "#00FFB3",  // Tooltip öğe yazılarının rengini değiştirebilirsin
                    fontWeight: "bold",
                  }}
                  labelStyle={{
                    fontSize: "14px",  // Etiket yazılarının stilini değiştirebilirsin
                    color: "#fff"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#00FFB3"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Sağ taraf - BTC Alım Kutusu */}
      <div className="w-full max-w-sm  bg-[#15141a] rounded-2xl p-6 shadow-md">
        <h2 className="text-xl  font-bold mb-4">Buy {coin.symbol.toUpperCase()}</h2>

        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">You Buy</p>
          <div className="flex items-center border border-gray-600 rounded px-4 py-2">
            <input
              type="number"
              className="bg-transparent outline-none w-full text-white"
              placeholder="0"
              value={btcAmount}
              onChange={handleBtcChange}
            />
            <span className="ml-2 font-semibold">{coin.symbol.toUpperCase()}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-2">
          ⇅ 1 {coin.symbol.toUpperCase()} ≈ {formatPrice(coin.market_data.current_price.usd)}
        </p>

        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">You Spend</p>
          <div className="flex items-center border border-gray-600 rounded px-4 py-2">
            <input
              type="number"
              className="bg-transparent outline-none w-full text-white"
              placeholder="10 - 50,000"
              value={usdAmount}
              onChange={handleUsdChange}
            />
            <span className="ml-2 font-semibold">USD</span>
          </div>
        </div>

        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded">
          Buy {coin.symbol.toUpperCase()}
        </button>
      </div>
    </div>
  );

};

export default CoinDetails;

