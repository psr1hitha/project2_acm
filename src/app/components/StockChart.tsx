import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';

interface ChartDataPoint {
  time: string;
  price: number;
}

interface StockChartProps {
  symbol: string;
  name: string;
  data: ChartDataPoint[];
  currentPrice: number;
  change: number;
  changePercent: number;
  onClose: () => void;
}

export function StockChart({ symbol, name, data, currentPrice, change, changePercent, onClose }: StockChartProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-[#008471]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-[#008471]">{symbol}</h2>
            <span className="text-gray-600">{name}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-gray-900">
              ${currentPrice.toFixed(2)}
            </span>
            <span className={`text-lg font-semibold ${isPositive ? 'text-[#008471]' : 'text-[#C45F3F]'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-[#008471] p-1"
        >
          <X size={24} />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} key={symbol}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#008471' : '#C45F3F'}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
