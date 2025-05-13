import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import logo from '../assets/logo.png';
import bg from '../assets/bg.png'
import CustomAlert from '../components/CustomAlert';

function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setAlertType("success");
        setAlertMessage("Giriş başarılı! Anasayfaya yönlendiriliyorsunuz");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setAlertType("success");
        setAlertMessage("Kayıt başarılı! Anasayfaya yönlendiriliyorsunuz");
      }
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setAlertType("error");
        setAlertMessage("Bu email daha önce kullanılmış.");
      } else {
        setAlertType("error");
        setAlertMessage("hatalı email ya da şifre");
      }
      setTimeout(() => {
        setAlertMessage(""); // alert otomatik kapanır
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen  flex items-center justify-center relative overflow-hidden " style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
       {alertMessage && (
          <CustomAlert
            message={alertMessage}
            type={alertType}
            onClose={() => setAlertMessage("")} 
          />
        )}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 w-[350px] text-white">
        <h1 className="text-2xl font-bold mb-6 text-center flex flex-col items-center">
          <div className="flex items-center mb-2">
            <Link to="/">
              <img src={logo} alt="CoinTrack Logo" className="w-10 h-10 mr-2" />
            </Link>
            <span className="text-white text-4xl">Coin</span>
            <span className="text-green-400 text-4xl">Track</span>
          </div>
          <span className="text-white">{isLogin ? 'Login' : 'Register'}</span>
        </h1>
       

        <form onSubmit={handleClick}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-4 rounded bg-white/10 text-white placeholder-white/60 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 rounded bg-white/10 text-white placeholder-white/60 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-6 rounded bg-white/10 text-white placeholder-white/60 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-white/80 text-[#181A20] py-2 rounded font-semibold transition transform active:scale-95"
          >
            {isLogin ? 'Log In' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-green-400 underline"
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-green-400 underline"
                onClick={() => setIsLogin(true)}
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default LoginRegisterPage;
