import React, { useState } from 'react';
import './MockupPreview.css';

const polarVariants = [
  { id: 'blue', label: 'Mavi Polar', value: '#1e3a8a', image: '/assets/polar/polar_blue.jpg' },
  { id: 'gray', label: 'Gri Polar', value: '#6b7280', image: '/assets/polar/polar_gray.jpg' },
  { id: 'red', label: 'Kırmızı Polar', value: '#dc2626', image: '/assets/polar/polar_red.jpg' },
  { id: 'black', label: 'Siyah Polar', value: '#000000', image: '/assets/polar/polar_black.jpg' },
  { id: 'green', label: 'Haki Polar', value: '#3f6212', image: '/assets/polar/polar_green.jpg' },
];

const MockupPreview = () => {
  const [logo, setLogo] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(polarVariants[0]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mockup-container glass-card">
      <div className="mockup-header">
        <div className="product-info">
          <h3>Fleece Polar Mont</h3>
          <p>Renk: {selectedVariant.label}</p>
        </div>
        <div className="color-selector">
          {polarVariants.map((v) => (
            <button
              key={v.id}
              className={`color-circle ${selectedVariant.id === v.id ? 'active' : ''}`}
              style={{ backgroundColor: v.value }}
              onClick={() => setSelectedVariant(v)}
              title={v.label}
            />
          ))}
        </div>
      </div>

      <div className="preview-area asset-preview">
        <div className="tshirt-display">
          <img src={selectedVariant.image} alt={selectedVariant.label} className="tshirt-base asset-image" />
          
          {/* Logo Overlays Calibrated for these Polar Templates */}
          {logo && (
            <>
              {/* Front Logo (Chest Left Figure) */}
              <div className="logo-overlay asset-front-logo">
                <img src={logo} alt="Front Logo" />
              </div>

              {/* Back Logo (Center Right Figure) */}
              <div className="logo-overlay asset-back-logo">
                <img src={logo} alt="Back Logo" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mockup-footer">
        <div className="upload-section">
          <label htmlFor="logo-upload" className="btn-secondary">Logo Yükle</label>
          <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} hidden />
        </div>
        
        <button className="btn-deactive" disabled>Logo Üret (Deaktif)</button>
      </div>
    </div>
  );
};

export default MockupPreview;
