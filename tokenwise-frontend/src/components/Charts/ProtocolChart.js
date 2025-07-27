import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './Charts.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProtocolChart = ({ transactions }) => {
  const chartData = useMemo(() => {
    const protocolCounts = transactions.reduce((acc, tx) => {
      acc[tx.protocol] = (acc[tx.protocol] || 0) + 1;
      return acc;
    }, {});

    const protocols = Object.keys(protocolCounts);
    const counts = Object.values(protocolCounts);

    const colors = {
      'Jupiter': '#fdb462',
      'Raydium': '#80b3ff',
      'Orca': '#ff8080',
      'Unknown': '#9ca3af'
    };

    return {
      labels: protocols,
      datasets: [
        {
          data: counts,
          backgroundColor: protocols.map(protocol => colors[protocol] || colors['Unknown']),
          borderColor: protocols.map(protocol => colors[protocol] || colors['Unknown']),
          borderWidth: 2,
          hoverBackgroundColor: protocols.map(protocol => colors[protocol] || colors['Unknown']),
          hoverBorderWidth: 3
        }
      ]
    };
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 15,
          font: {
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
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
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} transactions (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    radius: '90%'
  };

  const totalTransactions = transactions.length;
  const protocolStats = useMemo(() => {
    const stats = {};
    transactions.forEach(tx => {
      if (!stats[tx.protocol]) {
        stats[tx.protocol] = {
          count: 0,
          volume: 0
        };
      }
      stats[tx.protocol].count += 1;
      stats[tx.protocol].volume += tx.amount;
    });
    return stats;
  }, [transactions]);

  return (
    <div className="protocol-chart">
      <div className="chart-container">
        <Doughnut data={chartData} options={options} />
        <div className="chart-center-text">
          <div className="center-number">{totalTransactions}</div>
          <div className="center-label">Total Transactions</div>
        </div>
      </div>
      
      <div className="protocol-stats">
        {Object.entries(protocolStats).map(([protocol, stats]) => (
          <div key={protocol} className="protocol-stat">
            <div className="protocol-name">{protocol}</div>
            <div className="protocol-details">
              <span className="stat-count">{stats.count} txs</span>
              <span className="stat-volume">{(stats.volume / 1000).toFixed(1)}K vol</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProtocolChart;
