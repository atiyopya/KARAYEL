import React, { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import './CSVImportModal.css';

const CSVImportModal = ({ isOpen, onClose, onImport }) => {
  const { CSVReader } = useCSVReader();
  const [data, setData] = useState(null);

  const handleUploadAccepted = (results) => {
    setData(results.data);
    toast.success(`${results.data.length - 1} satır veri okundu.`);
  };

  const handleImport = () => {
    if (!data) return;
    // Simple mapping logic for Kareyel orders
    const orders = data.slice(1).map((row, idx) => ({
      id: `CSV-${Date.now()}-${idx}`,
      orderNumber: `ORD-CSV-${idx + 1}`,
      status: 'PENDING',
      source: 'WEB',
      customer: { firstname: row[0] || 'Toplu', lastname: row[1] || 'Sipariş' },
      product: row[2] || 'Polar',
      items: [
        { size: 'S', quantity: parseInt(row[3]) || 0 },
        { size: 'M', quantity: parseInt(row[4]) || 0 },
        { size: 'L', quantity: parseInt(row[5]) || 0 },
        { size: 'XL', quantity: parseInt(row[6]) || 0 },
        { size: 'XXL', quantity: parseInt(row[7]) || 0 },
      ].filter(i => i.quantity > 0),
      totalAmount: (Math.random() * 5000 + 1000).toFixed(2),
      paymentStatus: 'UNPAID',
      createdAt: new Date().toISOString(),
    }));

    onImport(orders);
    toast.success('Toplu siparişler başarıyla eklendi!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="modal-content glass-card"
          >
            <div className="modal-header">
              <div className="title">
                <FileText className="accent" size={20} />
                <h3>CSV Toplu Sipariş Yükle</h3>
              </div>
              <button className="close-btn" onClick={onClose}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <p className="hint">Dosya Formatı: Ad, Soyad, Ürün, S, M, L, XL, XXL</p>
              
              <CSVReader onUploadAccepted={handleUploadAccepted}>
                {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
                  <div className="dropzone-container">
                    <div {...getRootProps()} className="dropzone">
                      {acceptedFile ? (
                        <div className="file-info">
                          <CheckCircle2 color="#10b981" />
                          <span>{acceptedFile.name}</span>
                        </div>
                      ) : (
                        <div className="upload-prompt">
                          <Upload size={32} />
                          <span>CSV Dosyasını Buraya Sürükleyin</span>
                        </div>
                      )}
                    </div>
                    <ProgressBar className="csv-progress" />
                  </div>
                )}
              </CSVReader>

              <div className="template-link">
                <Download size={14} /> Şablonu İndir (.csv)
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={onClose}>Vazgeç</button>
              <button 
                className="btn-primary" 
                disabled={!data} 
                onClick={handleImport}
              >
                İmport Et ({data ? data.length - 1 : 0} Satır)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CSVImportModal;
