// src/components/Portfolio/PortfolioLog.js
import React from 'react';
import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardTitle from '../Card/CardTitle';
import CardContent from '../Card/CardContent';
import Button from '../FormElements/Button';

const PortfolioLog = ({ portfolioData, formatCurrency, deleteEntry }) => (
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
              <tr key={index} className="hover:bg-gray-700 transition-colors duration-150">
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
);

export default PortfolioLog;
