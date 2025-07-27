import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WalletActivityChart = ({ transactions, wallets }) => {
  const chartData = useMemo(() => {
    // Get top 5 most active wallets
    const walletActivity = {};
    
    transactions.forEach(tx => {
      if (!walletActivity[tx.walletAddress]) {
        walletActivity[tx.walletAddress] = [];
      }
      walletActivity[tx.walletAddress].push(tx);
    });

    const topWallets = Object.entries(walletActivity)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 5)
      .map(([address, txs]) => ({
        address,
        transactions: txs,
        count: txs.length
      }));

    // Create time series data for each wallet
    const now = new Date();
    const hoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Create hourly time slots
    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
      const slotTime = new Date(hoursAgo.getTime() + i * 60 * 60 * 1000);
      timeSlots.push(slotTime);
    }

    const colors = [
      '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981'
    ];

    const datasets = topWallets.map((wallet, index) => {
      const data = timeSlots.map(slot => {
        const nextSlot = new Date(slot.getTime() + 60 * 60 * 1000);
        const txsInSlot = wallet.transactions.filter(tx => {
          const txTime = new Date(tx.timestamp);
          return txTime >= slot && txTime < nextSlot;
        });
        return txsInSlot.length;
      });

      return {
        label: `${wallet.address.slice(0, 8)}...`,
        data,
        borderColor: colors[index],
        backgroundColor: colors[index] + '20',
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2
      };
    });

    return {
      labels: timeSlots.map(slot => 
        slot.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      ),
      datasets
    };
  }, [transactions, wallets]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} transactions`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 45,
          maxTicksLimit: 8
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 10
          },
          stepSize: 1
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Calculate wallet statistics
  const walletStats = useMemo(() => {
    const stats = {};
    transactions.forEach(tx => {
      if (!stats[tx.walletAddress]) {
        stats[tx.walletAddress] = {
          transactions: 0,
          volume: 0,
          lastActivity: tx.timestamp
        };
      }
      stats[tx.walletAddress].transactions += 1;
      stats[tx.walletAddress].volume += tx.amount;
      
      if (new Date(tx.timestamp) > new Date(stats[tx.walletAddress].lastActivity)) {
        stats[tx.walletAddress].lastActivity = tx.timestamp;
      }
    });

    return Object.entries(stats)
      .sort(([, a], [, b]) => b.transactions - a.transactions)
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="wallet-activity-chart">
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="wallet-stats">
        <div className="stats-header">
          <h4>Top Active Wallets</h4>
        </div>
        <div className="stats-list">
          {walletStats.map(([address, stats], index) => (
            <div key={address} className="wallet-stat">
              <div className="wallet-indicator" style={{ backgroundColor: ['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981'][index] }}></div>
              <div className="wallet-info">
                <div className="wallet-address">{address.slice(0, 8)}...</div>
                <div className="wallet-metrics">
                  <span className="metric">{stats.transactions} txs</span>
                  <span className="metric">{(stats.volume / 1000).toFixed(1)}K vol</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletActivityChart;
