import React, { useState } from 'react';
import './WhatsAppSimulator.css';

const WhatsAppSimulator = ({ onParsed }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/whatsapp/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setParsedResult(data.parsed);
      if (onParsed) onParsed(data.parsed.sizes);
    } catch (error) {
      console.error('Simulation failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="whatsapp-simulator glass-card">
      <div className="header">
        <span className="icon">📱</span>
        <h4>WhatsApp Sipariş Simülatörü</h4>
      </div>
      
      <p className="hint">Örn: "Mavi Polar, 10 adet: 5 XL, 5 L"</p>
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="WhatsApp mesajını buraya yapıştırın..."
        rows="4"
      />
      
      <button 
        className="btn-secondary" 
        onClick={handleSimulate}
        disabled={loading || !message}
      >
        {loading ? 'Analiz ediliyor...' : 'Mesajı Çözümle'}
      </button>

      {parsedResult && (
        <div className="parsed-feedback">
          <h5>Tespit Edilen:</h5>
          <p><strong>Ürün:</strong> {parsedResult.product}</p>
          <div className="size-tags">
            {Object.entries(parsedResult.sizes).map(([size, qty]) => (
              <span key={size} className="size-tag">{size}: {qty}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSimulator;
