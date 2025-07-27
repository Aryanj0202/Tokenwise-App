import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocket';

export const useWebSocket = (url, options = {}) => {
  const [connectionState, setConnectionState] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const connect = useCallback(() => {
    if (url) {
      websocketService.connect(url);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  const sendMessage = useCallback((message) => {
    websocketService.send(message);
  }, []);

  const subscribe = useCallback((channel, callback) => {
    websocketService.subscribe(channel, callback);
  }, []);

  const unsubscribe = useCallback((channel, callback) => {
    websocketService.unsubscribe(channel, callback);
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      setConnectionState('connected');
      setError(null);
      setReconnectAttempts(0);
      
      if (optionsRef.current.onConnect) {
        optionsRef.current.onConnect();
      }
    };

    const handleDisconnect = (data) => {
      setConnectionState('disconnected');
      
      if (optionsRef.current.onDisconnect) {
        optionsRef.current.onDisconnect(data);
      }
    };

    const handleMessage = (data) => {
      setLastMessage(data);
      
      if (optionsRef.current.onMessage) {
        optionsRef.current.onMessage(data);
      }
    };

    const handleError = (error) => {
      setError(error);
      
      if (optionsRef.current.onError) {
        optionsRef.current.onError(error);
      }
    };

    const handleReconnecting = (attempts) => {
      setConnectionState('reconnecting');
      setReconnectAttempts(attempts);
      
      if (optionsRef.current.onReconnecting) {
        optionsRef.current.onReconnecting(attempts);
      }
    };

    const handleMaxReconnectAttempts = () => {
      setConnectionState('failed');
      
      if (optionsRef.current.onMaxReconnectAttempts) {
        optionsRef.current.onMaxReconnectAttempts();
      }
    };

    // Register event listeners
    websocketService.on('connect', handleConnect);
    websocketService.on('disconnect', handleDisconnect);
    websocketService.on('message', handleMessage);
    websocketService.on('error', handleError);
    websocketService.on('reconnecting', handleReconnecting);
    websocketService.on('maxReconnectAttemptsReached', handleMaxReconnectAttempts);

    // Auto-connect if URL is provided and autoConnect is not disabled
    if (url && optionsRef.current.autoConnect !== false) {
      connect();
    }

    return () => {
      // Cleanup event listeners
      websocketService.off('connect', handleConnect);
      websocketService.off('disconnect', handleDisconnect);
      websocketService.off('message', handleMessage);
      websocketService.off('error', handleError);
      websocketService.off('reconnecting', handleReconnecting);
      websocketService.off('maxReconnectAttemptsReached', handleMaxReconnectAttempts);
      
      // Disconnect if autoDisconnect is not disabled
      if (optionsRef.current.autoDisconnect !== false) {
        disconnect();
      }
    };
  }, [url, connect, disconnect]);

  // Update connection state based on service state
  useEffect(() => {
    const updateConnectionState = () => {
      setConnectionState(websocketService.getConnectionState());
    };

    const interval = setInterval(updateConnectionState, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    connectionState,
    lastMessage,
    error,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
    subscribe,
    unsubscribe,
    isConnected: connectionState === 'connected',
    isConnecting: connectionState === 'connecting',
    isReconnecting: connectionState === 'reconnecting'
  };
};

export default useWebSocket;
