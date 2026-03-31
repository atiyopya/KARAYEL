import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Palette, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Factory, 
  BarChart3,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: <Palette size={20} />, label: 'Sipariş Oluştur' },
  { to: '/admin', icon: <ClipboardList size={20} />, label: 'Siparişler' },
  { to: '/production', icon: <Factory size={20} />, label: 'Üretim' },
  { to: '/finance', icon: <BarChart3 size={20} />, label: 'Finans' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin"}');
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.body.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    if (!isLightMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Çıkış yapıldı.');
    navigate('/login');
  };

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sidebar glass-card"
    >
      <div className="sidebar-brand">
        <div className="brand-icon"><ShieldCheck size={24} /></div>
        <div>
          <h3>KAREYEL</h3>
          <p>İş Elbiseleri <span>SaaS</span></p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Tema Değiştir">
          {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          <span>{isLightMode ? 'Koyu Tema' : 'Açık Tema'}</span>
        </button>
        
        <div className="user-badge">
          <div className="user-avatar">{user.name[0]}</div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">Yönetici</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Çıkış Yap">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
