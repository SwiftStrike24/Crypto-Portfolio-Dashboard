// src/components/Portfolio/PortfolioChart.js
import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { CURRENCIES } from '../constants';

const PortfolioChart = ({ data, currency }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(entry => entry.timestamp),
        datasets: [{
          label: 'Portfolio Value',
          data: data.map(entry => entry.totalValue * CURRENCIES[currency].rate),
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#8B5CF6',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: '#9CA3AF',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: '#9CA3AF',
              callback: function(value) {
                return CURRENCIES[currency].symbol + value.toLocaleString();
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#9CA3AF'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            titleColor: '#F3F4F6',
            bodyColor: '#D1D5DB',
            borderColor: '#4B5563',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, currency]);

  return (
    <div className="h-64 md:h-80 lg:h-96">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PortfolioChart;
