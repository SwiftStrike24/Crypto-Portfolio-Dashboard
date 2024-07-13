import React from 'react';
import PortfolioDashboard from './PortfolioDashboard';
import '../styles/tailwind.css';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <PortfolioDashboard />
    </div>
  );
};

export default App;
