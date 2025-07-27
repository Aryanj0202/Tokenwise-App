import React, { useState, useEffect } from 'react';
import { useToken } from '../../contexts/TokenContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import WalletsList from '../WalletsList/WalletsList';
import TransactionMonitor from '../TransactionMonitor/TransactionMonitor';
import BuySellChart from '../Charts/BuySellChart';
import ProtocolChart from '../Charts/ProtocolChart';
import WalletActivityChart from '../Charts/WalletActivityChart';
import TimeFilter from '../Filters/TimeFilter';
import './Dashboard.css';

const Dashboard = () => {
  const { tokenInfo, topWallets, loading } = useToken();
  const { transactions, connectionStatus } = useWebSocket();
  const [timeFilter, setTimeFilter] = useState('1h');
  const [dashboardStats, setDashboardStats] = useState({
    totalTransactions: 0,
    buyTransactions: 0,
    sellTransactions: 0,
    netDirection: 'neutral',
    totalVolume: 0,
    activeWallets: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      const buyTxs = transactions.filter(tx => tx.type === 'buy').length;
      const sellTxs = transactions.filter(tx => tx.type === 'sell').length;
      const totalTxs = transactions.length;
      
      const netDirection = buyTxs > sellTxs ? 'buy-heavy' : 
                          sellTxs > buyTxs ? 'sell-heavy' : 'neutral';
      
      const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      
      const activeWallets = new Set(transactions.map(tx => tx.walletAddress)).size;

      setDashboardStats({
        totalTransactions: totalTxs,
        buyTransactions: buyTxs,
        sellTransactions: sellTxs,
        netDirection,
        totalVolume,
        activeWallets
      });
    };

    calculateStats();
  }, [transactions]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getNetDirectionColor = (direction) => {
    switch (direction) {
      case 'buy-heavy':
        return 'var(--success-color)';
      case 'sell-heavy':
        return 'var(--danger-color)';
      default:
        return 'var(--text-secondary)';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Token Intelligence Dashboard</h1>
          <p className="dashboard-subtitle">
            Real-time monitoring for {tokenInfo?.symbol || 'Token'} holders and transactions
          </p>
        </div>
        <div className="dashboard-controls">
          <TimeFilter 
            value={timeFilter} 
            onChange={setTimeFilter} 
          />
          <div className="connection-indicator">
            <div className={`status-dot ${connectionStatus === 'connected' ? 'online' : 'offline'}`}></div>
            <span>{connectionStatus === 'connected' ? 'Live' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon buy">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 7H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-trend positive">+12.5%</div>
          </div>
          <div className="stat-value">{formatNumber(dashboardStats.buyTransactions)}</div>
          <div className="stat-label">Buy Transactions</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon sell">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 17H7V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-trend negative">-8.3%</div>
          </div>
          <div className="stat-value">{formatNumber(dashboardStats.sellTransactions)}</div>
          <div className="stat-label">Sell Transactions</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon volume">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-trend positive">+4.7%</div>
          </div>
          <div className="stat-value">{formatNumber(dashboardStats.totalVolume)}</div>
          <div className="stat-label">Total Volume</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon wallets">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.6977C21.7033 16.0414 20.9999 15.5796 20.2 15.38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8003 3.32715 17.5037 3.78888 18.01 4.44516C18.5163 5.10144 18.8008 5.91195 18.8008 6.74775C18.8008 7.58355 18.5163 8.39406 18.01 9.05034C17.5037 9.70662 16.8003 10.1684 16 10.3655" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-trend positive">+2.1%</div>
          </div>
          <div className="stat-value">{formatNumber(dashboardStats.activeWallets)}</div>
          <div className="stat-label">Active Wallets</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="grid-item chart-large">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Buy/Sell Activity</h3>
                <div className="card-actions">
                  <button className="btn btn-secondary btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <BuySellChart transactions={transactions} timeFilter={timeFilter} />
            </div>
          </div>

          <div className="grid-item">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Protocol Usage</h3>
                <div className="net-direction" style={{ color: getNetDirectionColor(dashboardStats.netDirection) }}>
                  {dashboardStats.netDirection.replace('-', ' ')}
                </div>
              </div>
              <ProtocolChart transactions={transactions} />
            </div>
          </div>

          <div className="grid-item">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Wallet Activity</h3>
                <span className="card-subtitle">Top performing wallets</span>
              </div>
              <WalletActivityChart transactions={transactions} wallets={topWallets} />
            </div>
          </div>

          <div className="grid-item wallets-list">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Top Token Holders</h3>
                <span className="card-subtitle">60 largest positions</span>
              </div>
              <WalletsList wallets={topWallets} loading={loading} />
            </div>
          </div>

          <div className="grid-item transactions-monitor">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Live Transactions</h3>
                <div className="live-indicator">
                  <div className="pulse-dot"></div>
                  <span>Live</span>
                </div>
              </div>
              <TransactionMonitor transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
