import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Factory, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Users, 
  Package,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import './ProductionView.css';

const MOCK_PRODUCTION = [
  {
    id: 'ORD-001', orderNumber: 'ORD-001', status: 'PENDING',
    customer: { firstname: 'Ahmet', lastname: 'Yılmaz' },
    product: 'Mavi Polar', colorImg: '/assets/polar/polar_blue.jpg',
    items: [{ size: 'XL', quantity: 5 }, { size: 'L', quantity: 3 }, { size: 'M', quantity: 2 }],
    logoUrl: null, createdAt: '2026-03-31T08:00:00Z',
  },
  {
    id: 'ORD-004', orderNumber: 'ORD-004', status: 'IN_PRODUCTION',
    customer: { firstname: 'Ali', lastname: 'Çelik' },
    product: 'Haki Polar', colorImg: '/assets/polar/polar_green.jpg',
    items: [{ size: 'L', quantity: 20 }],
    logoUrl: null, createdAt: '2026-03-31T16:00:00Z',
  },
];

const ProductionView = () => {
  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const totalItems = MOCK_PRODUCTION.reduce((acc, o) => acc + o.items.reduce((a, b) => a + b.quantity, 0), 0);

  const handleComplete = (id) => {
    if (window.confirm("Bu siparişin üretimini Tamamlandı olarak işaretlemek istediğinize emin misiniz? (1/2)")) {
      if (window.confirm("Bu işlem siparişi tamamlanmış olarak işaretleyecek. Onaylıyor musunuz? (2/2)")) {
        toast.success(`${id} üretimi başarıyla tamamlandı!`);
        // Here we would typically update state or call backend
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="production-view"
    >
      <div className="page-header">
        <div className="header-info">
          <h1><Factory size={28} className="accent" /> Üretim Hattı</h1>
          <p><Calendar size={14} /> {today} • Aktif iş listesi</p>
        </div>
        <div className="prod-stats-row">
          <div className="prod-stat-card glass-card">
            <span className="num">{MOCK_PRODUCTION.length}</span>
            <span className="label">Açık İş</span>
          </div>
          <div className="prod-stat-card glass-card highlight">
            <span className="num">{totalItems}</span>
            <span className="label">Toplam Adet</span>
          </div>
        </div>
      </div>

      <div className="production-grid">
        <AnimatePresence>
          {MOCK_PRODUCTION.map((order, idx) => {
            const totalQty = order.items.reduce((a, b) => a + b.quantity, 0);
            return (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`production-card glass-card ${order.status === 'IN_PRODUCTION' ? 'active-work' : ''}`}
              >
                <div className="prod-card-top">
                  <div className="order-id">
                    <span className="hash">#</span>{order.orderNumber}
                  </div>
                  {order.status === 'IN_PRODUCTION' && (
                    <div className="status-label live">
                      <div className="ping"></div> Üretimde
                    </div>
                  )}
                </div>

                <div className="prod-card-main-horizontal">
                  <div className="visual-preview-small">
                    <img src={order.colorImg} alt={order.product} className="base-prod-small" />
                  </div>

                  <div className="work-details-horizontal">
                    <div className="work-header">
                      <h3>{order.product}</h3>
                      <div className="customer-info">
                        <Users size={14} /> {order.customer.firstname} {order.customer.lastname}
                      </div>
                    </div>

                    <div className="sku-category-grid">
                      <span className="sku-label">Beden Dağılımı:</span>
                      <div className="sku-items">
                        {order.items.map(item => (
                          <div key={item.size} className="sku-box-small">
                            <span className="size">{item.size}</span>
                            <span className="qty">{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prod-card-bottom">
                  <div className="total-indicator">
                    <Package size={14} /> Toplam: <strong>{totalQty} Adet</strong>
                  </div>
                  <div className="actions">
                    <button className="btn-icon-sec"><FileText size={16} /></button>
                    <button className="btn-primary-mini" onClick={() => handleComplete(order.orderNumber)}>
                      <CheckCircle2 size={16} /> Tamamla
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Summary - Sticky/Floating or fixed bottom panel */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="production-summary-footer glass-card"
      >
        <div className="summary-left">
          <Layers size={20} className="accent" />
          <h4>Beden Toplamları:</h4>
        </div>
        <div className="summary-pills">
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
             const sum = MOCK_PRODUCTION.flatMap(o => o.items).filter(i => i.size === size).reduce((a, b) => a + b.quantity, 0);
             return sum > 0 ? (
               <div key={size} className="summary-pill">
                  <span className="sz">{size}</span>
                  <span className="qt">{sum}</span>
               </div>
             ) : null;
          })}
        </div>
        <div className="summary-total">
          Genel Toplam: <strong>{totalItems}</strong>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductionView;
