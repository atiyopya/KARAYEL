import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

const MOTIVATION_QUOTES = [
  "Büyük başarılar, küçük detaylarda gizlidir.",
  "Geleceği şekillendirenler, bugünden harekete geçenlerdir.",
  "Kalite bir eylem değil, bir alışkanlıktır.",
  "İşini tutkuyla yap, başarı seni takip eder.",
  "Zirveye giden yol, disiplinden geçer."
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const randomQuote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Demo Bypass for User Convenience
    if (email === 'demo@kareyel.com' && password === 'demo123') {
      toast.success('Giriş başarılı! Hoş geldiniz.');
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'ADMIN' }));
      setTimeout(() => navigate('/'), 1000);
      return;
    }

    try {
      const resp = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      
      if (resp.ok) {
        toast.success('Giriş başarılı!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        toast.error(data.message || 'Giriş yapılamadı.');
      }
    } catch (err) {
      toast.error('Sunucu bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card light-auth-card"
      >
        <div className="auth-header">
          <div className="logo-icon"><ShieldCheck size={32} /></div>
          <h2>KAREYEL <span>SaaS</span></h2>
          <p>Yönetim paneline giriş yapın</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <Mail className="field-icon" size={18} />
            <input 
              type="email" 
              placeholder="E-posta" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <Lock className="field-icon" size={18} />
            <input 
              type="password" 
              placeholder="Şifre" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : <>Giriş Yap <LogIn size={18} /></>}
          </button>
        </form>

        <div className="auth-footer">
          <p>Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link></p>
          <motion.div 
            key={quote}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="motivational-quote"
          >
            "{quote}"
          </motion.div>
          <div className="demo-hint">Demo: demo@kareyel.com / demo123</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
