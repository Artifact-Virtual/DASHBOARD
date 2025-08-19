import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TokenomicsData } from '../types';

const data: TokenomicsData[] = [
  { name: 'Liquidity Pool', value: 51 },
  { name: 'Ecosystem Fund', value: 29 },
  { name: 'Team Allocation', value: 10 },
  { name: 'Marketing & CEX', value: 10 },
];

const COLORS = ['#ff4500', '#c03300', '#802200', '#401100']; // Orange to dark maroon/brown

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/50 backdrop-blur-md p-3 border border-white/10 rounded-sm">
        <p className="text-gray-200 font-light text-sm tracking-wider">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const Tokenomics: React.FC = () => {
  return (
    <div id="arcx-tokenomics" className="w-full h-full flex items-center justify-center p-8 md:p-16 bg-arcx-dark pl-24">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="w-full h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius="60%"
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#0a0a0a"
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="text-gray-300">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Tokenomics
            </h2>
            <p className="mt-4 text-gray-400 font-light max-w-xl">
                A fixed-supply model designed for long-term protocol health and decentralization.
            </p>
            <div className="mt-8 border-t border-white/10 pt-6">
                <ul className="space-y-3">
                {data.map((item, index) => (
                    <li key={item.name} className="flex items-center font-light text-sm tracking-wider">
                    <span
                        className="w-2 h-2 rounded-full mr-4"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="text-gray-400">{item.name}</span>
                    <span className="ml-auto text-gray-200">{item.value}%</span>
                    </li>
                ))}
                </ul>
                <div className="mt-6 space-y-2">
                    <p className="text-md font-light tracking-wider text-gray-400">Total Supply: <span className="text-arcx-orange">1,100,000 ARCX</span></p>
                    <p className="text-xs font-light tracking-wider text-gray-500">Status: <span className="text-green-400">Minting Finalized</span></p>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Tokenomics;