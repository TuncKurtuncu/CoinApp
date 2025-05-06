import './App.css'
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/Home';
import LoginRegisterPage from './pages/LoginRegister';
import { HashRouter, Routes, Route } from 'react-router-dom';
import TopGainers from './pages/TopGainers';
import TopLosers from './pages/TopLosers';
import Details from './pages/Details';
import TopVolume from './pages/TopVolume';
import NewCoins from './pages/NewCoins';
import Profile from './pages/Profile';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./api/firebase";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='bg-[#181A20] min-h-screen'> 
      <HashRouter> {/* HashRouter kullanıldı */}
        <Routes>
          <Route path="/" element={<HomePage user={user}/>}/>
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path='/gainers' element={<TopGainers/>} />
          <Route path='/losers' element={<TopLosers/>}/>
          <Route path='/topvolume' element={<TopVolume/>}/>
          <Route path='/newcoins' element={<NewCoins/>}/>
          <Route path='/coin/:id' element={<Details/>}/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
