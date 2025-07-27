import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [transactions, setTransactions] = useState([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const generateMockTransaction = useCallback(() => {
    const types = ['buy', 'sell'];
    const protocols = ['Jupiter', 'Raydium', 'Orca'];
    
    return {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      amount: Math.floor(Math.random() * 100000),
      price: Math.random() * 0.1,
      walletAddress: `wallet${Math.floor(Math.random() * 60)}...${Math.random().toString(36).substr(2, 8)}`,
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      signature: `sig${Math.random().toString(36).substr(2, 16)}`
    };
  }, []);

  const simulateTransactions = useCallback(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance of new transaction
        const newTransaction = generateMockTransaction();
        setTransactions(prev => [newTransaction, ...prev.slice(0, 99)]); // Keep last 100 transactions
      }
    }, 2000);

    return interval;
  }, [generateMockTransaction]);

  const connect = useCallback(() => {
    setConnectionStatus('connecting');
    
    // Simulate WebSocket connection
    setTimeout(() => {
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      
      // Start generating mock transactions
      const interval = simulateTransactions();
      
      return () => {
        clearInterval(interval);
      };
    }, 1000);
  }, [simulateTransactions]);

  const disconnect = useCallback(() => {
    setConnectionStatus('disconnected');
    setSocket(null);
  }, []);

  const reconnect = useCallback(() => {
    if (reconnectAttempts < maxReconnectAttempts) {
      setReconnectAttempts(prev => prev + 1);
      setTimeout(() => {
        connect();
      }, 1000 * Math.pow(2, reconnectAttempts)); // Exponential backoff
    }
  }, [reconnectAttempts, connect]);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (connectionStatus === 'disconnected' && reconnectAttempts < maxReconnectAttempts) {
      reconnect();
    }
  }, [connectionStatus, reconnectAttempts, reconnect]);

  const value = {
    socket,
    connectionStatus,
    transactions,
    connect,
    disconnect,
    reconnect,
    reconnectAttempts
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
