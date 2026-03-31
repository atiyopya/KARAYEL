import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, CheckCircle, PackageCheck, SendToBack } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Fallback if navigated without state
  const { quantities = {}, total = 0, productName = 'Ürün', productPrice = 0 } = location.state || {};
  const grandTotal = total * productPrice;

  if (total === 0) {
    return (
      <div className="payment-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Sipariş bilgisi bulunamadı.</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    // 1. Simüle edilmiş ödeme süreci
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Ödeme işlemi gerçekleştiriliyor...',
        success: 'Ödeme başarılı!',
        error: 'Ödeme başarısız oldu.',
      }
    ).then(async () => {
      // 2. Ödeme başarılıysa siparişi backend'e kaydet
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const firmId = user.firmId || 'firm-1';
        
        const orderData = {
          customerName: user.name || "Müşteri",
          status: 'PENDING',
          items: Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([size, quantity]) => ({
              productName: productName,
              size,
              quantity
            })),
          firmId,
          totalAmount: grandTotal,
          paymentMethod: paymentMethod === 'card' ? 'Kredi Kartı' : 'Havale/EFT'
        };

        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });

        if (response.ok) {
          toast.success('Siparişiniz üretime aktarıldı.');
          navigate('/admin');
        } else {
          throw new Error('Sipariş oluşturma hatası');
        }
      } catch (error) {
        toast.error('Sipariş kaydedilemedi ancak ödeme alındı. Lütfen destekle iletişime geçin.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="hero"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <ArrowLeft size={20} /> Geri Dön
        </button>
        <h1 className="title" style={{ fontSize: '2rem', margin: 0 }}>Ödeme ve Onay</h1>
      </div>

      <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Sol: Sipariş Özeti */}
        <div className="glass-card main-card" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <PackageCheck size={20} className="accent-icon" /> Sipariş Özeti
          </h3>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Ürün:</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{productName}</span>
            </div>
            
            <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Beden Dağılımı:</p>
              {Object.entries(quantities).map(([size, qty]) => (
                qty > 0 && (
                  <div key={size} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    <span>{size} Beden:</span>
                    <strong>{qty} Adet</strong>
                  </div>
                )
              ))}
            </div>

            <div className="summary-row total-row">
              <span>Ödenecek Tutar:</span>
              <span className="gradient-text" style={{ fontSize: '1.5rem' }}>{grandTotal.toLocaleString()} ₺</span>
            </div>
          </div>
        </div>

        {/* Sağ: Ödeme Yöntemi */}
        <div className="glass-card main-card" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <CreditCard size={20} className="accent-icon" /> Ödeme Yöntemi
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <label 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                border: `2px solid ${paymentMethod === 'card' ? 'var(--accent)' : 'var(--glass-border)'}`, 
                borderRadius: '12px', cursor: 'pointer', transition: 'var(--transition)',
                background: paymentMethod === 'card' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')} 
                style={{ accentColor: 'var(--accent)', transform: 'scale(1.2)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ color: 'var(--text-main)' }}>Kredi / Banka Kartı</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Anında onaylanır</span>
              </div>
            </label>

            <label 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                border: `2px solid ${paymentMethod === 'transfer' ? 'var(--accent)' : 'var(--glass-border)'}`, 
                borderRadius: '12px', cursor: 'pointer', transition: 'var(--transition)',
                background: paymentMethod === 'transfer' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'transfer'} 
                onChange={() => setPaymentMethod('transfer')} 
                style={{ accentColor: 'var(--accent)', transform: 'scale(1.2)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ color: 'var(--text-main)' }}>Havale / EFT</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dekont onayı gerekir</span>
              </div>
            </label>
          </div>

          <button 
            className="btn-primary finalize-btn" 
            onClick={handlePayment}
            disabled={loading}
            style={{ marginTop: 'auto' }}
          >
            {loading ? 'İşleniyor...' : <>Ödemeyi Tamamla ve Siparişi Ver <CheckCircle size={18} /></>}
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default PaymentScreen;
