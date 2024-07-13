// src/components/Portfolio/ManualPortfolioPopup.js
import React from 'react';
import Button from '../FormElements/Button';
import Input from '../FormElements/Input';

const ManualPortfolioPopup = ({
  isPopupOpen,
  setIsPopupOpen,
  manualTotalValue,
  setManualTotalValue,
  manualTimestamp,
  setManualTimestamp,
  logManualPortfolio
}) => (
  isPopupOpen && (
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
          <Button onClick={() => setIsPopupOpen(false)} className="bg-gray-600 hover:bg-gray-700 transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-gray-500/50">Cancel</Button>
          <Button onClick={logManualPortfolio} className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-purple-500/50">Save</Button>
        </div>
      </div>
    </div>
  )
);

export default ManualPortfolioPopup;
