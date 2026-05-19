// src/pages/SplashScreen.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { theme } from '../theme';
import logo from '../assets/logo.jpeg';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token || isAuthenticated) {
        navigate('/properties');
      } else {
        navigate('/login');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className={theme.page.centered}>
      <div className="flex flex-col items-center gap-5 text-center animate-pulse">

        {/* Top gold line
        <div className={theme.divider.gold} /> */}

        {/* Icon */}
        {/* <div className="w-16 h-16 border border-[#c5a880] bg-white flex items-center justify-center rounded-[1rem] */}
                        {/* shadow-[0_4px_24px_rgba(197,168,128,0.20)]"> */}
          {/* <Shield className="w-8 h-8 text-[#c5a880]" /> */}
          <img
                      src={logo}
                      alt="SecureWatch"
                      style={{
                        width:        '200px',
                        height:       '200px',
                        borderRadius: '50%',
                        objectFit:    'cover',
                        border:       '6px solid rgba(255,255,255,0.75)',
                        boxShadow:    '0 16px 48px rgba(0,0,0,0.22)',
                      }}
                    />
        {/* </div> */}

        {/* Brand */}
        <h1 className={theme.type.h1}>Uqaab</h1>
        <p className={theme.type.label}>Done Based Boundry Wall Monitering System</p>

        {/* Bottom gold line */}
        <div className={theme.divider.gold} />

      </div>
    </div>
  );
};

export default SplashScreen;