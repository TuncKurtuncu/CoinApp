import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from '../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../api/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';


function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();





  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");  // Ana sayfaya yönlendir
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#15141a] shadow-md text-white px-6 py-4">
      <div className="flex items-center justify-between flex-wrap">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <h1 className="text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-white">Coin</span>
            <span className="text-green-400">Track</span>
          </h1>
        </div>

        {/* Nav Linkleri */}
        <nav className="hidden md:flex gap-6 lg:gap-10 xl:gap-16 text-sm lg:text-base font-medium">
          <Link to="/" className="hover:text-green-400">Home</Link>
          <Link to="/newcoins" className="hover:text-green-400">New Listing</Link>
          <Link to="/topvolume" className="hover:text-green-400">Top Volume</Link>
          <Link to="/gainers" className="hover:text-green-400">Top Gainers</Link>
          <Link to="/losers" className="hover:text-green-400">Top Losers</Link>
        </nav>



        {/* Kullanıcı Butonları */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-3">
            {user ? (
              <>
                <Link to="/profile" className="px-3 py-1 border border-blue-500 text-blue-400 rounded-md hover:bg-blue-600 hover:text-white transition">Profil</Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 border border-red-500 text-red-400 rounded-md hover:bg-red-600 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1 border w-fit border-green-500 text-green-400 rounded-md hover:bg-green-600 hover:text-white transition">Login / Register</Link>
            )}
          </div>

          {/* Mobil Menü Butonu */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#15141a] bg-opacity-10 backdrop-blur-sm flex flex-col gap-4 items-center justify-center z-40">
          <button className="absolute top-4 right-6 text-white text-3xl" onClick={() => setIsOpen(false)}>
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          <Link to="/" onClick={() => setIsOpen(false)} className="text-white text-lg hover:text-green-400">Home</Link>
          <Link to="/newcoins" onClick={() => setIsOpen(false)} className="text-white text-lg hover:text-green-400">New Listing</Link>
          <Link to="/topvolume" onClick={() => setIsOpen(false)} className="text-white text-lg hover:text-green-400">Top Volume</Link>
          <Link to="/gainers" onClick={() => setIsOpen(false)} className="text-white text-lg hover:text-green-400">Top Gainers</Link>
          <Link to="/losers" onClick={() => setIsOpen(false)} className="text-white text-lg hover:text-green-400 pb-16">Top Losers</Link>


          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="px-3 py-1  border border-blue-500 text-blue-400 rounded-md hover:bg-blue-600 hover:text-white transition">Profil</Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-red-500 text-red-400 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="px-3 py-1 w-fit border border-green-500 text-green-400 rounded-md hover:bg-green-600 hover:text-white transition">Login / Register</Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
