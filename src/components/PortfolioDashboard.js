import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const NETWORKS = ['Ethereum', 'Solana', 'Keplr'];
const WALLETS = {
  Ethereum: ['Wallet 1', 'Wallet 2'],
  Solana: ['Wallet 1', 'Wallet 2'],
  Keplr: ['Wallet 1']
};

const CURRENCIES = {
  USD: { symbol: '$', rate: 1 },
  CAD: { symbol: 'CA$', rate: 1.25 }
};

const Card = ({ children, className }) => (
  <div className={`bg-gray-800 shadow-lg rounded-lg ${className} hover:transform hover:scale-105 transition-transform duration-200 dark:bg-gray-800`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-4 py-3 border-b border-gray-700 sm:px-6 dark:border-gray-600">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg leading-6 font-medium text-purple-300">
    {children}
  </h3>
);

const CardContent = ({ children }) => (
  <div className="px-4 py-3 sm:p-6">
    {children}
  </div>
);

const Button = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

const Input = ({ type, placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-white ${className}`}
  />
);

const Select = ({ options, value, onChange, className }) => (
  <select
    value={value}
    onChange={onChange}
    className={`mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-white ${className}`}
  >
    {options.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
);

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

const PortfolioDashboard = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [currentValues, setCurrentValues] = useState({});
  const [currency, setCurrency] = useState('USD');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [manualTotalValue, setManualTotalValue] = useState('');
  const [manualTimestamp, setManualTimestamp] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('portfolioData');
    if (storedData) {
      try {
        setPortfolioData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  }, []);

  const handleInputChange = (network, wallet, value) => {
    setCurrentValues(prev => ({
      ...prev,
      [network]: {
        ...prev[network],
        [wallet]: parseFloat(value) || 0
      }
    }));
  };

  const logPortfolio = () => {
    const timestamp = new Date().toLocaleString();
    const totalValue = Object.values(currentValues).reduce(
      (acc, network) => acc + Object.values(network).reduce((sum, value) => sum + value, 0),
      0
    );

    const newEntry = {
      timestamp,
      totalValue,
      ...currentValues
    };

    const updatedData = [...portfolioData, newEntry];
    setPortfolioData(updatedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));
  };

  const logManualPortfolio = () => {
    const formattedTimestamp = new Date(manualTimestamp).toLocaleString('en-US', { hour12: true });
    const newEntry = {
      timestamp: formattedTimestamp,
      totalValue: parseFloat(manualTotalValue),
      manual: true
    };

    const updatedData = [...portfolioData, newEntry];
    setPortfolioData(updatedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));
    setIsPopupOpen(false);
  };

  const deleteEntry = (index) => {
    const updatedData = portfolioData.filter((_, i) => i !== index);
    setPortfolioData(updatedData);
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value * CURRENCIES[currency].rate);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto w-full bg-gray-900 text-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-4 sm:mb-0">Portfolio Dashboard</h1>
        <div className="tooltip">
          <Select
            options={Object.keys(CURRENCIES)}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-24"
          />
          <span className="tooltiptext">Currency for viewing. Inputs are always in USD.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {NETWORKS.map(network => (
          <Card key={network} className="transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/50">
            <CardHeader>
              <CardTitle>{network} Network</CardTitle>
            </CardHeader>
            <CardContent>
              {WALLETS[network].map(wallet => (
                <div key={wallet} className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">{wallet}</label>
                  <Input
                    type="number"
                    placeholder="Enter value (USD)"
                    onChange={(e) => handleInputChange(network, wallet, e.target.value)}
                    className="transition-all duration-300 ease-in-out focus:shadow-md focus:shadow-purple-500/50"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Button onClick={logPortfolio} className="w-full sm:w-auto transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-purple-500/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Log Portfolio
        </Button>
        <Button onClick={() => setIsPopupOpen(true)} className="w-full sm:w-auto transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-purple-500/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v6H5a1 1 0 100 2h4v6a1 1 0 102 0v-6h4a1 1 0 100-2h-4V3a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Add Manual Portfolio
        </Button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-purple-300 mb-4">Add Manual Portfolio Entry</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Total Value (USD)</label>
              <Input
                type="number"
                placeholder="Enter total value"
                value={manualTotalValue}
                onChange={(e) => setManualTotalValue(e.target.value)}
                className="transition-all duration-300 ease-in-out focus:shadow-md focus:shadow-purple-500/50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Timestamp</label>
              <Input
                type="datetime-local"
                value={manualTimestamp}
                onChange={(e) => setManualTimestamp(e.target.value)}
                className="transition-all duration-300 ease-in-out focus:shadow-md focus:shadow-purple-500/50"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setIsPopupOpen(false)} className="bg-gray-600 hover:bg-gray-800 transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-gray-500/50">Cancel</Button>
              <Button onClick={logManualPortfolio} className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-purple-500/50">Save</Button>
            </div>
          </div>
        </div>
      )}

      <Card className="mb-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/50">
        <CardHeader>
          <CardTitle>Portfolio Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {portfolioData.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-800 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">{formatCurrency(entry.totalValue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <Button 
                        onClick={() => deleteEntry(index)} 
                        className="bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-red-500/50"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/50">
        <CardHeader>
          <CardTitle>Portfolio Value Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioChart data={portfolioData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))} currency={currency} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioDashboard;