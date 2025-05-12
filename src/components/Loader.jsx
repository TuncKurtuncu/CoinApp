import React, { useState, useEffect } from 'react';

const CoinLoader = () => {

  const [text, setText] = useState("Yükleniyor...");

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prevText) => (prevText === "Yükleniyor..." ? "Veriler İndiriliyor..." : "Yükleniyor..."));
    }, 4000)
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center h-20 justify-center mx-5 my-5 ">
      <div className="flex space-x-3">
        <div className="w-4 h-4 rounded-full bg-[#f5c32c] animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-[#f5c32c] animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-4 h-4 rounded-full bg-[#f5c32c] animate-bounce [animation-delay:-0.4s]"></div>
      </div>

    </div>
  );
};

export default CoinLoader;
