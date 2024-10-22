// src/components/PortfolioDashboard.js
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import Card from './Card/Card';
import CardHeader from './Card/CardHeader';
import CardTitle from './Card/CardTitle';
import CardContent from './Card/CardContent';
import Button from './FormElements/Button';
import Input from './FormElements/Input';
import Select from './FormElements/Select';
import PortfolioChart from './Portfolio/PortfolioChart';
import NetworkCard from './Portfolio/NetworkCard';
import PortfolioLog from './Portfolio/PortfolioLog';
import ManualPortfolioPopup from './Portfolio/ManualPortfolioPopup';
import { CURRENCIES } from './constants';

const NETWORKS = ['Ethereum', 'Solana', 'Keplr'];
const DEFAULT_WALLETS = {
  Ethereum: ['Wallet 1', 'Wallet 2'],
  Solana: ['Wallet 1', 'Wallet 2'],
  Keplr: ['Wallet 1']
};

const PortfolioDashboard = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [currentValues, setCurrentValues] = useState({});
  const [currency, setCurrency] = useState('USD');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [manualTotalValue, setManualTotalValue] = useState('');
  const [manualTimestamp, setManualTimestamp] = useState('');
  const [wallets, setWallets] = useState(DEFAULT_WALLETS);

  useEffect(() => {
    const storedData = localStorage.getItem('portfolioData');
    const storedWallets = localStorage.getItem('wallets');
    if (storedData) {
      try {
        setPortfolioData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
    if (storedWallets) {
      try {
        setWallets(JSON.parse(storedWallets));
      } catch (error) {
        console.error('Error parsing stored wallets:', error);
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

  const addWallet = (network) => {
    const newWallets = { ...wallets };
    const walletNumber = newWallets[network].length + 1;
    newWallets[network].push(`Wallet ${walletNumber}`);
    setWallets(newWallets);
    localStorage.setItem('wallets', JSON.stringify(newWallets));
  };

  const deleteWallet = (network, walletIndex) => {
    const newWallets = { ...wallets };
    newWallets[network].splice(walletIndex, 1);
    setWallets(newWallets);
    localStorage.setItem('wallets', JSON.stringify(newWallets));

    const newCurrentValues = { ...currentValues };
    if (newCurrentValues[network]) {
      delete newCurrentValues[network][wallets[network][walletIndex]];
    }
    setCurrentValues(newCurrentValues);
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
        <div className="flex flex-col items-center w-28">
          <Select
            options={Object.keys(CURRENCIES)}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full mb-1"
          />
          <span className="text-sm text-gray-400 text-center">Inputs are always in USD.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {NETWORKS.map(network => (
          <NetworkCard 
            key={network} 
            network={network} 
            wallets={wallets[network]} 
            handleInputChange={handleInputChange} 
            addWallet={addWallet} 
            deleteWallet={deleteWallet} 
          />
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

      <ManualPortfolioPopup
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        manualTotalValue={manualTotalValue}
        setManualTotalValue={setManualTotalValue}
        manualTimestamp={manualTimestamp}
        setManualTimestamp={setManualTimestamp}
        logManualPortfolio={logManualPortfolio}
      />

      <PortfolioLog
        portfolioData={portfolioData}
        formatCurrency={formatCurrency}
        deleteEntry={deleteEntry}
      />

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
