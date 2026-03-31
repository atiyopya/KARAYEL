import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await resp.json();
      
      if (resp.ok) {
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Kayıt Olunamadı.');
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
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="auth-card light-auth-card"
      >
        <div className="auth-header">
          <div className="logo-icon"><UserPlus size={32} /></div>
          <h2>Yeni Hesap <span>SaaS</span></h2>
          <p>Kareyel dünyasına katılın</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <Building2 className="field-icon" size={18} />
            <input 
              type="text" 
              placeholder="Firma Adı" 
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="input-group">
              <User className="field-icon" size={18} />
              <input 
                type="text" 
                placeholder="Ad" 
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Soyad" 
                className="no-icon-padding"
                style={{ paddingLeft: '1rem' }}
                value={formData.lastname}
                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <Mail className="field-icon" size={18} />
            <input 
              type="email" 
              placeholder="E-posta" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          
          <div className="input-group">
            <Lock className="field-icon" size={18} />
            <input 
              type="password" 
              placeholder="Şifre" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Kaydediliyor...' : <>Hemen Kayıt Ol <UserPlus size={18} /></>}
          </button>
        </form>

        <div className="auth-footer">
          <p>Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
