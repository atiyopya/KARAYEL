import React from 'react';
import './OrderSizesGrid.css';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

const OrderSizesGrid = ({ quantities, onChange }) => {
  const handleInputChange = (size, value) => {
    let numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) numValue = 0;
    onChange({ ...quantities, [size]: numValue });
  };

  const handleIncrement = (size) => {
    const currentValue = quantities[size] || 0;
    onChange({ ...quantities, [size]: currentValue + 1 });
  };

  const handleDecrement = (size) => {
    const currentValue = quantities[size] || 0;
    if (currentValue > 0) {
      onChange({ ...quantities, [size]: currentValue - 1 });
    }
  };

  const total = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <div className="order-sizes-container">
      <div className="sizes-grid">
        {SIZES.map((size) => (
          <div key={size} className="size-input-wrapper">
            <label className="size-label">{size}</label>
            <div className="size-control">
              <button 
                className="size-btn minus" 
                onClick={() => handleDecrement(size)}
                type="button"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={quantities[size] || 0}
                onChange={(e) => handleInputChange(size, e.target.value)}
              />
              <button 
                className="size-btn plus" 
                onClick={() => handleIncrement(size)}
                type="button"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="total-summary">
        <span>Toplam Adet:</span>
        <span className="total-count">{total}</span>
      </div>
    </div>
  );
};

export default OrderSizesGrid;
