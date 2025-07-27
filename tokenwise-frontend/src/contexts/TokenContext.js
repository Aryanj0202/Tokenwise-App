import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const TokenContext = createContext();

export function TokenProvider({ children }) {
  const [tokenInfo, setTokenInfo] = useState({
    address: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
    symbol: 'TOKEN',
    name: 'Token Name',
    decimals: 9,
    supply: 1000000000
  });
  
  const [topWallets, setTopWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopWallets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulated API call - replace with actual API
      const mockWallets = Array.from({ length: 60 }, (_, i) => ({
        id: i + 1,
        address: `wallet${i + 1}...${Math.random().toString(36).substr(2, 8)}`,
        balance: Math.floor(Math.random() * 1000000),
        percentage: Math.random() * 10,
        lastActivity: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        transactionCount: Math.floor(Math.random() * 100)
      }));
      
      setTopWallets(mockWallets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopWallets();
  }, []);

  const value = {
    tokenInfo,
    topWallets,
    loading,
    error,
    setTokenInfo,
    setTopWallets,
    fetchTopWallets
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
}
