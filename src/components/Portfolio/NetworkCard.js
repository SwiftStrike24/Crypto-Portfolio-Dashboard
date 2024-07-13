// src/components/Portfolio/NetworkCard.js
import React from 'react';
import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardTitle from '../Card/CardTitle';
import CardContent from '../Card/CardContent';
import Button from '../FormElements/Button';
import Input from '../FormElements/Input';

const NetworkCard = ({ network, wallets, handleInputChange, addWallet, deleteWallet }) => (
  <Card className="transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/50">
    <CardHeader>
      <CardTitle>{network} Network</CardTitle>
    </CardHeader>
    <CardContent>
      {wallets.map((wallet, index) => (
        <div key={wallet} className="mb-4 flex items-center">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-300 mb-1">{wallet}</label>
            <Input
              type="number"
              placeholder="Enter value (USD)"
              onChange={(e) => handleInputChange(network, wallet, e.target.value)}
              className="transition-all duration-300 ease-in-out focus:shadow-md focus:shadow-purple-500/50"
            />
          </div>
          <Button
            onClick={() => deleteWallet(network, index)}
            className="ml-2 bg-red-600 hover:bg-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      ))}
      <Button
        onClick={() => addWallet(network)}
        className="w-auto mt-2 bg-green-600 hover:bg-green-700 ml-auto px-3 py-1"
      >
        Add Wallet
      </Button>
    </CardContent>
  </Card>
);

export default NetworkCard;
