import { useState, useMemo, useCallback } from 'react';
import { formatters } from '../utils/formatters';

export const useTransactionFilter = (transactions) => {
  const [filters, setFilters] = useState({
    type: 'all',
    protocol: 'all',
    walletAddress: '',
    timeRange: '24h',
    minAmount: '',
    maxAmount: ''
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'desc'
  });

  const availableProtocols = useMemo(() => {
    const protocols = new Set(transactions.map(tx => tx.protocol));
    return Array.from(protocols).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by transaction type
    if (filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    // Filter by protocol
    if (filters.protocol !== 'all') {
      filtered = filtered.filter(tx => tx.protocol === filters.protocol);
    }

    // Filter by wallet address
    if (filters.walletAddress) {
      const searchTerm = filters.walletAddress.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.walletAddress.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by time range
    if (filters.timeRange !== 'all') {
      const now = new Date();
      let cutoffTime;

      switch (filters.timeRange) {
        case '1h':
          cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffTime = null;
      }

      if (cutoffTime) {
        filtered = filtered.filter(tx => new Date(tx.timestamp) >= cutoffTime);
      }
    }

    // Filter by amount range
    if (filters.minAmount) {
      const minAmount = parseFloat(filters.minAmount);
      if (!isNaN(minAmount)) {
        filtered = filtered.filter(tx => tx.amount >= minAmount);
      }
    }

    if (filters.maxAmount) {
      const maxAmount = parseFloat(filters.maxAmount);
      if (!isNaN(maxAmount)) {
        filtered = filtered.filter(tx => tx.amount <= maxAmount);
      }
    }

    return filtered;
  }, [transactions, filters]);

  const sortedTransactions = useMemo(() => {
    if (!sortConfig.key) return filteredTransactions;

    return [...filteredTransactions].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTransactions, sortConfig]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const updateSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      type: 'all',
      protocol: 'all',
      walletAddress: '',
      timeRange: '24h',
      minAmount: '',
      maxAmount: ''
    });
    setSortConfig({
      key: 'timestamp',
      direction: 'desc'
    });
  }, []);

  const getFilterStats = useMemo(() => {
    const stats = {
      total: sortedTransactions.length,
      buy: sortedTransactions.filter(tx => tx.type === 'buy').length,
      sell: sortedTransactions.filter(tx => tx.type === 'sell').length,
      totalVolume: sortedTransactions.reduce((sum, tx) => sum + tx.amount, 0),
      protocols: {}
    };

    sortedTransactions.forEach(tx => {
      stats.protocols[tx.protocol] = (stats.protocols[tx.protocol] || 0) + 1;
    });

    return stats;
  }, [sortedTransactions]);

  return {
    filters,
    sortConfig,
    availableProtocols,
    filteredTransactions: sortedTransactions,
    updateFilter,
    updateSort,
    resetFilters,
    filterStats: getFilterStats
  };
};

export default useTransactionFilter;
