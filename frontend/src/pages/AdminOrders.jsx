import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  FileDown, 
  FileUp, 
  CreditCard, 
  Clock, 
  Truck, 
  CheckCircle,
  Globe,
  MessageCircle,
  MoreVertical,
  X,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import CSVImportModal from '../components/CSVImportModal';
import './AdminOrders.css';

// --- Improved Mock Data with real-world distribution ---
const INITIAL_ORDERS = [
  {
    id: 'ORD-001', orderNumber: 'ORD-001', status: 'PENDING', source: 'WHATSAPP',
    customer: { firstname: 'Ahmet', lastname: 'Yılmaz' },
    product: 'Mavi Polar', color: 'Mavi',
    items: [{ size: 'XL', quantity: 5 }, { size: 'L', quantity: 3 }, { size: 'M', quantity: 2 }],
    totalAmount: '2500.00', paymentStatus: 'UNPAID', createdAt: '2026-03-31T08:00:00Z',
    customerPhone: '+905551234567',
  },
  {
    id: 'ORD-002', orderNumber: 'ORD-002', status: 'IN_PRODUCTION', source: 'WEB',
    customer: { firstname: 'Mehmet', lastname: 'Kaya' },
    product: 'Siyah Polar', color: 'Siyah',
    items: [{ size: 'XXL', quantity: 10 }, { size: 'XL', quantity: 8 }],
    totalAmount: '5400.00', paymentStatus: 'PAID', createdAt: '2026-03-30T14:00:00Z',
    customerPhone: '',
  },
];

const STATUS_MAP = {
  PENDING: { label: 'Bekliyor', color: '#fbbf24', icon: <Clock size={14} /> },
  IN_PRODUCTION: { label: 'Üretimde', color: '#3b82f6', icon: <Truck size={14} /> },
  COMPLETED: { label: 'Tamamlandı', color: '#10b981', icon: <CheckCircle size={14} /> },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filterSource, setFilterSource] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = orders.filter(o => {
    const matchesSource = filterSource === 'ALL' || o.source === filterSource;
    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o.customer.firstname.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSource && matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    const confirmMsg = newStatus === 'IN_PRODUCTION' 
      ? `Bu siparişi Üretime Göndermek istediğinize emin misiniz? (1/2)` 
      : `Bu siparişi Tamamlandı olarak işaretlemek istediğinize emin misiniz? (1/2)`;
      
    if (!window.confirm(confirmMsg)) return;
    if (!window.confirm('Bu işlem geri alınamaz. Onaylıyor musunuz? (2/2)')) return;
    
    // Update local state immediately
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    toast.success(`${orderId} durumu başarıyla güncellendi.`);

    // Fire WhatsApp notification via backend
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          orderNumber: order?.orderNumber,
          customerName: `${order?.customer?.firstname} ${order?.customer?.lastname}`,
          customerPhone: order?.customerPhone || null,
        })
      });
      
      if (order?.customerPhone) {
        toast.success('📱 WhatsApp bildirimi gönderildi!');
      }
    } catch (err) {
      console.error('WhatsApp notification failed:', err);
    }
  };

  const handleBulkImport = (newOrders) => {
    setOrders(prev => [...newOrders, ...prev]);
  };

  const totalQty = (items) => items.reduce((a, b) => a + b.quantity, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-orders"
    >
      <div className="page-header">
        <div className="header-info">
          <h1>Sipariş Yönetimi</h1>
          <p>Tüm kaynaklardan gelen {orders.length} sipariş yönetiliyor</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setIsImportModalOpen(true)}>
            <FileUp size={18} /> Toplu İçe Aktar
          </button>
          <button className="btn-primary">
            <FileDown size={18} /> Excel İndir
          </button>
        </div>
      </div>

      {/* Modern Filter Row */}
      <div className="filter-row glass-card">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Sipariş no veya müşteri ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['ALL', 'PENDING', 'IN_PRODUCTION', 'COMPLETED'].map(s => (
            <button
              key={s}
              className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'ALL' ? 'Tümü' : STATUS_MAP[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-layout">
        {/* Main Table */}
        <div className="orders-table-container glass-card">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Ürün</th>
                <th>Kaynak</th>
                <th>Toplam</th>
                <th>Durum</th>
                <th>Ödeme</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((order, idx) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedOrder(order)}
                    className={selectedOrder?.id === order.id ? 'selected' : ''}
                  >
                    <td className="bold-text">{order.orderNumber}</td>
                    <td>{order.customer.firstname} {order.customer.lastname}</td>
                    <td>{order.product}</td>
                    <td>
                      <span className={`source-tag ${order.source.toLowerCase()}`}>
                        {order.source === 'WEB' ? <Globe size={14} /> : <MessageCircle size={14} />}
                        {order.source}
                      </span>
                    </td>
                    <td><span className="qty-badge">{totalQty(order.items)}</span></td>
                    <td>
                      <div className="status-pill" style={{ color: STATUS_MAP[order.status].color, borderColor: STATUS_MAP[order.status].color + '33' }}>
                        {STATUS_MAP[order.status].icon} {STATUS_MAP[order.status].label}
                      </div>
                    </td>
                    <td>
                      <span className={`payment-pill ${order.paymentStatus.toLowerCase()}`}>
                        ₺{order.totalAmount}
                      </span>
                    </td>
                    <td><button className="icon-btn"><MoreVertical size={16} /></button></td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Selected Order Detail Sidebar */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="order-sidebar glass-card"
            >
              <div className="sidebar-header">
                <h3>Detaylar</h3>
                <button className="icon-btn" onClick={() => setSelectedOrder(null)}><X size={18} /></button>
              </div>
              
              <div className="sidebar-body">
                <div className="detail-item">
                  <span className="label">Müşteri</span>
                  <span className="value">{selectedOrder.customer.firstname} {selectedOrder.customer.lastname}</span>
                </div>

                <div className="detail-item">
                  <span className="label">📱 WhatsApp</span>
                  <span className="value" style={{ fontSize: '0.9rem' }}>{selectedOrder.customerPhone || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belirtilmemiş</span>}</span>
                </div>
                
                <div className="size-distribution">
                  <h4 className="sub-title"><Package size={14} /> Beden Dağılımı</h4>
                  {selectedOrder.items.map(item => (
                    <div key={item.size} className="distribution-row">
                      <span className="dist-size">{item.size}</span>
                      <div className="dist-bar"><div className="fill" style={{ width: `${(item.quantity / totalQty(selectedOrder.items)) * 100}%` }}></div></div>
                      <span className="dist-qty">{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="sidebar-actions">
                  <button className="btn-primary" onClick={() => handleStatusChange(selectedOrder.id, 'IN_PRODUCTION')}>Üretime Gönder</button>
                  <button className="btn-secondary" onClick={() => handleStatusChange(selectedOrder.id, 'COMPLETED')}>Tamamlandı</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CSVImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleBulkImport}
      />
    </motion.div>
  );
};

export default AdminOrders;
