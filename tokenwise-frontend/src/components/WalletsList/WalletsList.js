import React, { useState, useMemo } from 'react';
import { formatters } from '../../utils/formatters';
import './WalletsList.css';

const WalletsList = ({ wallets, loading }) => {
  const [sortBy, setSortBy] = useState('balance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(20);

  const sortedAndFilteredWallets = useMemo(() => {
    let filtered = wallets.filter(wallet => 
      wallet.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'lastActivity') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered.slice(0, showCount);
  }, [wallets, sortBy, sortOrder, searchTerm, showCount]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 9L12 5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 15L12 19L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    return sortOrder === 'asc' ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 15L12 19L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 9L12 5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="wallets-loading">
        <div className="loading-spinner"></div>
        <p>Loading wallets...</p>
      </div>
    );
  }

  return (
    <div className="wallets-list">
      <div className="wallets-controls">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <input
            type="text"
            placeholder="Search wallets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="show-count">
          <select 
            value={showCount} 
            onChange={(e) => setShowCount(Number(e.target.value))}
          >
            <option value={20}>Show 20</option>
            <option value={40}>Show 40</option>
            <option value={60}>Show 60</option>
          </select>
        </div>
      </div>

      <div className="wallets-table">
        <div className="table-header">
          <div className="header-cell rank">
            <button onClick={() => handleSort('id')}>
              Rank {getSortIcon('id')}
            </button>
          </div>
          <div className="header-cell address">
            <button onClick={() => handleSort('address')}>
              Wallet Address {getSortIcon('address')}
            </button>
          </div>
          <div className="header-cell balance">
            <button onClick={() => handleSort('balance')}>
              Balance {getSortIcon('balance')}
            </button>
          </div>
          <div className="header-cell percentage">
            <button onClick={() => handleSort('percentage')}>
              % Supply {getSortIcon('percentage')}
            </button>
          </div>
          <div className="header-cell transactions">
            <button onClick={() => handleSort('transactionCount')}>
              Transactions {getSortIcon('transactionCount')}
            </button>
          </div>
          <div className="header-cell activity">
            <button onClick={() => handleSort('lastActivity')}>
              Last Activity {getSortIcon('lastActivity')}
            </button>
          </div>
        </div>

        <div className="table-body">
          {sortedAndFilteredWallets.map((wallet, index) => (
            <div key={wallet.id} className="table-row">
              <div className="cell rank">
                <div className="rank-badge">#{wallet.id}</div>
              </div>
              <div className="cell address">
                <div className="wallet-address">
                  <div className="address-text">{wallet.address}</div>
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText(wallet.address)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="cell balance">
                <div className="balance-value">
                  {formatters.formatNumber(wallet.balance)}
                </div>
              </div>
              <div className="cell percentage">
                <div className="percentage-value">
                  {wallet.percentage.toFixed(2)}%
                </div>
              </div>
              <div className="cell transactions">
                <div className="transaction-count">
                  {wallet.transactionCount}
                </div>
              </div>
              <div className="cell activity">
                <div className="activity-time">
                  {formatters.formatTimeAgo(wallet.lastActivity)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wallets-footer">
        <div className="showing-info">
          Showing {sortedAndFilteredWallets.length} of {wallets.length} wallets
        </div>
        <div className="pagination">
          <button 
            className="btn btn-secondary btn-sm"
            disabled={showCount >= wallets.length}
            onClick={() => setShowCount(Math.min(showCount + 20, wallets.length))}
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletsList;
