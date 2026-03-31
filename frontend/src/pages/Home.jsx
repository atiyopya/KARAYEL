import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Package, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import MockupPreview from '../components/MockupPreview';
import OrderSizesGrid from '../components/OrderSizesGrid';

const Home = () => {
  const [quantities, setQuantities] = useState({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, '3XL': 0 });
  const navigate = useNavigate();

  const total = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handlePlaceOrder = () => {
    if (total < 5) {
      toast.error('Minimum sipariş miktarı 5 adettir. Lütfen kontrol edin.');
      return;
    }

    // Redirect to payment screen instead of creating directly
    navigate('/payment', { 
      state: { 
        quantities, 
        total,
        productName: "Mavi Polar", // For demo purposes
        productPrice: 500 // Demo price per item
      } 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="hero"
    >
      <div className="title-row">
        <h1 className="gradient-text title">KAREYEL</h1>
        <div className="badge-new">SaaS Mode</div>
      </div>
      <p className="subtitle">Premium İş Elbisesi Tasarım ve Sipariş Yönetimi</p>
      
      <div className="glass-card main-card">
        <div className="card-header">
          <div className="card-title-group">
            <ShoppingBag size={24} className="accent-icon" />
            <div>
              <h2>Ürün Yapılandırma</h2>
              <p>Özel tasarımınızı oluşturun ve adetleri belirleyin</p>
            </div>
          </div>
          <div className="header-actions">
             <div className="min-order-tag">Min: 5 Adet</div>
          </div>
        </div>
        
        <div className="layout-grid">
          <div className="left-panel">
            <MockupPreview />
          </div>
          
          <div className="right-panel">
            <div className="panel-section">
              <h4 className="section-title"><Package size={16} /> Beden ve Miktar Seçimi</h4>
              <OrderSizesGrid 
                quantities={quantities} 
                onChange={setQuantities} 
              />
            </div>

            <div className="panel-section order-summary-panel">
              <h4 className="section-title"><Calculator size={16} /> Sipariş Özeti</h4>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Birim Fiyat:</span>
                  <span>500 ₺</span>
                </div>
                <div className="summary-row">
                  <span>Toplam Adet:</span>
                  <span>{total} Adet</span>
                </div>
                <div className="summary-row total-row">
                  <span>Genel Toplam:</span>
                  <span className="gradient-text">{total * 500} ₺</span>
                </div>
              </div>
            </div>

            <button 
              className={`btn-primary finalize-btn ${total < 5 ? 'disabled' : ''}`} 
              onClick={handlePlaceOrder}
            >
              Siparişi Onayla ve Devam Et <ChevronRight size={18} />
            </button>
            
            {total > 0 && total < 5 && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="warning-text"
              >
                ⚠️ Devam etmek için {5 - total} adet daha ürün eklemelisiniz.
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
