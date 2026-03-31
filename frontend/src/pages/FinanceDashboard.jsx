import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  PieChart as PieIcon, 
  Activity, 
  DollarSign,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie,
  AreaChart,
  Area
} from 'recharts';
import './FinanceDashboard.css';

const MOCK_FINANCE_DATA = [
  { name: 'Ocak', revenue: 45000, profit: 12000 },
  { name: 'Şubat', revenue: 52000, profit: 15000 },
  { name: 'Mart', revenue: 61000, profit: 18000 },
  { name: 'Nisan', revenue: 75000, profit: 22000 },
];

const SOURCE_DATA = [
  { name: 'Web Satış', value: 42, color: '#3b82f6' },
  { name: 'WhatsApp', value: 58, color: '#10b981' },
];

const FinanceDashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="finance-dashboard"
    >
      <div className="page-header">
        <div className="header-info">
          <h1><Wallet size={28} className="accent" /> Finansal Analitik</h1>
          <p>Kareyel SaaS • Genel performans özeti</p>
        </div>
        <div className="finance-top-cards">
          <div className="f-card glass-card">
            <div className="f-card-icon blue"><TrendingUp size={20} /></div>
            <div className="f-card-content">
              <span className="label">Toplam Gelir</span>
              <span className="value">₺158.420</span>
              <span className="trend plus"><ArrowUpRight size={12} /> %12.5</span>
            </div>
          </div>
          <div className="f-card glass-card">
            <div className="f-card-icon green"><Activity size={20} /></div>
            <div className="f-card-content">
              <span className="label">Net Kâr</span>
              <span className="value">₺42.150</span>
              <span className="trend plus"><ArrowUpRight size={12} /> %8.2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="finance-layout-grid">
        {/* Main Growth Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="chart-card glass-card main-growth"
        >
          <div className="card-header-inner">
            <div className="title">
              <TrendingUp size={18} />
              <h4>Gelir & Kâr Projeksiyonu</h4>
            </div>
            <div className="period-badge">Son 4 Ay</div>
          </div>
          
          <div className="chart-wrapper">
             <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={MOCK_FINANCE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `₺${v/1000}k` } />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" fill="none" strokeWidth={3} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Source Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="chart-card glass-card source-split"
        >
          <div className="card-header-inner">
             <div className="title">
                <PieIcon size={18} />
                <h4>Sipariş Kanalları</h4>
             </div>
          </div>
          <div className="pie-wrapper">
             <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={SOURCE_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {SOURCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="pie-legend">
                {SOURCE_DATA.map(item => (
                  <div key={item.name} className="legend-row">
                    <span className="dot" style={{ background: item.color }}></span>
                    <span className="label">{item.name}</span>
                    <span className="val">%{item.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>

        {/* Recent Activity List */}
        <div className="chart-card glass-card full-row tx-list">
           <div className="card-header-inner">
              <div className="title">
                 <ArrowUpRight size={18} />
                 <h4>Son Finansal Hareketler</h4>
              </div>
              <button className="text-btn">Tümünü Gör <ChevronRight size={14} /></button>
           </div>
           
           <div className="tx-table-wrap">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="tx-row">
                   <div className="tx-info-main">
                      <div className="tx-icon"><DollarSign size={16} /></div>
                      <div>
                        <span className="tx-id">Sipariş #{1024 + i}</span>
                        <span className="tx-desc">Müşteri Ödemesi Alındı</span>
                      </div>
                   </div>
                   <div className="tx-date">31 Mart 2026, 14:20</div>
                   <div className="tx-method">Kredi Kartı</div>
                   <div className="tx-amount plus">+₺450.00</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinanceDashboard;
