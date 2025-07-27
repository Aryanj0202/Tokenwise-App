import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useLocalStorage } from './useLocalStorage';

export const useTokenData = (tokenAddress) => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [topWallets, setTopWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useLocalStorage(`lastUpdate_${tokenAddress}`, null);

  const fetchTokenInfo = useCallback(async () => {
    if (!tokenAddress) return;

    setLoading(true);
    setError(null);

    try {
      const info = await api.getTokenInfo(tokenAddress);
      setTokenInfo(info);
    } catch (err) {
      setError(`Failed to fetch token info: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [tokenAddress]);

  const fetchTopWallets = useCallback(async (limit = 60) => {
    if (!tokenAddress) return;

    setLoading(true);
    setError(null);

    try {
      const wallets = await api.getTopWallets(tokenAddress, limit);
      setTopWallets(wallets);
      setLastUpdate(new Date().toISOString());
    } catch (err) {
      setError(`Failed to fetch top wallets: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [tokenAddress, setLastUpdate]);

  const fetchTransactions = useCallback(async (limit = 100, offset = 0) => {
    if (!tokenAddress) return;

    try {
      const newTransactions = await api.getTokenTransactions(tokenAddress, limit, offset);
      
      if (offset === 0) {
        setTransactions(newTransactions);
      } else {
        setTransactions(prev => [...prev, ...newTransactions]);
      }
    } catch (err) {
      setError(`Failed to fetch transactions: ${err.message}`);
    }
  }, [tokenAddress]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchTokenInfo(),
      fetchTopWallets(),
      fetchTransactions()
    ]);
  }, [fetchTokenInfo, fetchTopWallets, fetchTransactions]);

  const addTransaction = useCallback((transaction) => {
    setTransactions(prev => [transaction, ...prev.slice(0, 99)]);
  }, []);

  const updateWalletBalance = useCallback((walletAddress, newBalance) => {
    setTopWallets(prev => 
      prev.map(wallet => 
        wallet.address === walletAddress 
          ? { ...wallet, balance: newBalance }
          : wallet
      )
    );
  }, []);

  useEffect(() => {
    if (tokenAddress) {
      refreshData();
    }
  }, [tokenAddress, refreshData]);

  return {
    tokenInfo,
    topWallets,
    transactions,
    loading,
    error,
    lastUpdate,
    fetchTokenInfo,
    fetchTopWallets,
    fetchTransactions,
    refreshData,
    addTransaction,
    updateWalletBalance,
    setError
  };
};

export default useTokenData;
