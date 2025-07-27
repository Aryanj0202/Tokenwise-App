import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async getTokenInfo(address) {
    try {
      const response = await this.client.get(`/tokens/${address}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  async getTopWallets(tokenAddress, limit = 60) {
    try {
      const response = await this.client.get(`/tokens/${tokenAddress}/holders`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top wallets:', error);
      throw error;
    }
  }

  async getWalletTransactions(walletAddress, tokenAddress, limit = 100) {
    try {
      const response = await this.client.get(`/wallets/${walletAddress}/transactions`, {
        params: { tokenAddress, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      throw error;
    }
  }

  async getTokenTransactions(tokenAddress, limit = 100, offset = 0) {
    try {
      const response = await this.client.get(`/tokens/${tokenAddress}/transactions`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching token transactions:', error);
      throw error;
    }
  }

  async getProtocolStats(tokenAddress, timeRange = '24h') {
    try {
      const response = await this.client.get(`/tokens/${tokenAddress}/protocol-stats`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching protocol stats:', error);
      throw error;
    }
  }

  async getMarketData(tokenAddress) {
    try {
      const response = await this.client.get(`/tokens/${tokenAddress}/market-data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  async exportTransactions(tokenAddress, format = 'csv', filters = {}) {
    try {
      const response = await this.client.get(`/tokens/${tokenAddress}/export`, {
        params: { format, ...filters },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions_${tokenAddress}_${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error exporting transactions:', error);
      throw error;
    }
  }

  async getHistoricalData(tokenAddress, timeRange = '24h', granularity = '1h') {
    try {
      const response = await this.client.get(`/tokens/${tokenAddress}/historical`, {
        params: { timeRange, granularity }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  async searchWallets(query, limit = 10) {
    try {
      const response = await this.client.get('/wallets/search', {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching wallets:', error);
      throw error;
    }
  }
}

export const api = new ApiService();
export default api;
