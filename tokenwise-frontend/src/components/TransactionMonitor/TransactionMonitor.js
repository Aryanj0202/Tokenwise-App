import React, { useState, useEffect } from 'react';
import { formatters } from '../../utils/formatters';
import './TransactionMonitor.css';

const TransactionMonitor = ({ transactions }) => {
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [filterType, setFilterType] = useState('all');
  const [filterProtocol, setFilterProtocol] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    let filtered = transactions;

    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    if (filterProtocol !== 'all') {
      filtered = filtered.filter(tx => tx.protocol === filterProtocol);
    }

    setFilteredTransactions(filtered);
  }, [transactions, filterType, filterProtocol]);

  const getTransactionTypeIcon = (type) => {
    if (type === 'buy') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 7H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 7L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 17H7V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
  };

  const getProtocolColor = (protocol) => {
    switch (protocol) {
      case 'Jupiter':
        return 'var(--protocol-jupiter)';
      case 'Raydium':
        return 'var(--protocol-raydium)';
      case 'Orca':
        return 'var(--protocol-orca)';
      default:
        return 'var(--protocol-unknown)';
    }
  };

  const protocols = [...new Set(transactions.map(tx => tx.protocol))];

  return (
    <div className="transaction-monitor">
      <div className="monitor-controls">
        <div className="filter-group">
          <label htmlFor="type-filter">Type:</label>
          <select 
            id="type-filter"
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="protocol-filter">Protocol:</label>
          <select 
            id="protocol-filter"
            value={filterProtocol} 
            onChange={(e) => setFilterProtocol(e.target.value)}
          >
            <option value="all">All</option>
            {protocols.map(protocol => (
              <option key={protocol} value={protocol}>{protocol}</option>
            ))}
          </select>
        </div>

        <div className="auto-scroll-toggle">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          <span>Auto-scroll</span>
        </div>
      </div>

      <div className="transaction-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{filteredTransactions.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Buys:</span>
          <span className="stat-value buy">{filteredTransactions.filter(tx => tx.type === 'buy').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Sells:</span>
          <span className="stat-value sell">{filteredTransactions.filter(tx => tx.type === 'sell').length}</span>
        </div>
      </div>

      <div className={`transaction-list ${autoScroll ? 'auto-scroll' : ''}`}>
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p>No transactions found</p>
            <span>Transactions will appear here in real-time</span>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-header">
                <div className={`transaction-type ${transaction.type}`}>
                  {getTransactionTypeIcon(transaction.type)}
                  <span className="type-label">{transaction.type.toUpperCase()}</span>
                </div>
                <div className="transaction-time">
                  {formatters.formatTimeAgo(transaction.timestamp)}
                </div>
              </div>

              <div className="transaction-details">
                <div className="detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value amount">
                    {formatters.formatNumber(transaction.amount)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value price">
                    ${transaction.price.toFixed(6)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Wallet:</span>
                  <span className="detail-value wallet">
                    {transaction.walletAddress}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Protocol:</span>
                  <span 
                    className="detail-value protocol"
                    style={{ color: getProtocolColor(transaction.protocol) }}
                  >
                    {transaction.protocol}
                  </span>
                </div>
              </div>

              <div className="transaction-footer">
                <div className="transaction-hash">
                  <span className="hash-label">Tx:</span>
                  <code className="hash-value">{transaction.signature}</code>
                  <button 
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(transaction.signature)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
                <div className="transaction-value">
                  ${(transaction.amount * transaction.price).toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionMonitor;
