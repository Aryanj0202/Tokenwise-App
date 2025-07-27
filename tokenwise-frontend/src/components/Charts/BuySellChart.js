import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, subHours, subDays } from 'date-fns';
import './Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const BuySellChart = ({ transactions, timeFilter }) => {
  const chartData = useMemo(() => {
    const now = new Date();
    let startTime;
    let timeUnit;
    let labelFormat;

    // Determine time range based on filter
    switch (timeFilter) {
      case '1h':
        startTime = subHours(now, 1);
        timeUnit = 5; // 5 minute intervals
        labelFormat = 'HH:mm';
        break;
      case '24h':
        startTime = subDays(now, 1);
        timeUnit = 60; // 1 hour intervals
        labelFormat = 'HH:mm';
        break;
      case '7d':
        startTime = subDays(now, 7);
        timeUnit = 1440; // 1 day intervals
        labelFormat = 'MMM dd';
        break;
      default:
        startTime = subHours(now, 1);
        timeUnit = 5;
        labelFormat = 'HH:mm';
    }

    // Filter transactions by time
    const filteredTransactions = transactions.filter(
      tx => new Date(tx.timestamp) >= startTime
    );

    // Group transactions by time intervals
    const timeSlots = [];
    const current = new Date(startTime);
    
    while (current <= now) {
      timeSlots.push(new Date(current));
      current.setMinutes(current.getMinutes() + timeUnit);
    }

    const groupedData = timeSlots.map(slot => {
      const nextSlot = new Date(slot);
      nextSlot.setMinutes(nextSlot.getMinutes() + timeUnit);
      
      const slotTransactions = filteredTransactions.filter(tx => {
        const txTime = new Date(tx.timestamp);
        return txTime >= slot && txTime < nextSlot;
      });

      const buys = slotTransactions.filter(tx => tx.type === 'buy');
      const sells = slotTransactions.filter(tx => tx.type === 'sell');

      return {
        time: slot,
        buys: buys.length,
        sells: sells.length,
        buyVolume: buys.reduce((sum, tx) => sum + tx.amount, 0),
        sellVolume: sells.reduce((sum, tx) => sum + tx.amount, 0)
      };
    });

    return {
      labels: groupedData.map(d => format(d.time, labelFormat)),
      datasets: [
        {
          label: 'Buy Transactions',
          data: groupedData.map(d => d.buys),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1
        },
        {
          label: 'Sell Transactions',
          data: groupedData.map(d => d.sells),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1
        }
      ]
    };
  }, [transactions, timeFilter]);

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
            size: 12
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
            size: 11
          },
          maxRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
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

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BuySellChart;
