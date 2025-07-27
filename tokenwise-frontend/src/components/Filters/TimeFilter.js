import React from 'react';
import './TimeFilter.css';

const TimeFilter = ({ value, onChange }) => {
  const timeOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  return (
    <div className="time-filter">
      <label className="filter-label">Time Range:</label>
      <div className="filter-options">
        {timeOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-button ${value === option.value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeFilter;
