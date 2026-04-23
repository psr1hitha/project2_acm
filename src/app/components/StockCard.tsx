import { TrendingUp, TrendingDown, LineChart } from 'lucide-react';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  onClick: () => void;
  onRemove: () => void;
}

const CARD_COLORS = [
  'bg-[#80B0E8]',
  'bg-[#FFC0C0]',
  'bg-[#008471]',
  'bg-[#D1CAEA]',
  'bg-[#D6D35F]',
  'bg-[#C45F3F]',
  'bg-[#F4D242]',
  'bg-[#898E46]',
  'bg-[#F29CC3]',
];

export function StockCard({ symbol, name, price, change, changePercent, onClick, onRemove }: StockCardProps) {
  const isPositive = change >= 0;
  const colorIndex = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % CARD_COLORS.length;
  const bgColor = CARD_COLORS[colorIndex];

  return (
    <div
      className={`${bgColor} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white text-lg">{symbol}</h3>
          <p className="text-sm text-white/80">{name}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-white/70 hover:text-white text-xl px-2 leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="text-3xl font-bold text-white">
            ${price.toFixed(2)}
          </div>
        </div>

        <div className={`flex items-center gap-1 ${isPositive ? 'text-white' : 'text-white/90'}`}>
          {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          <span className="text-sm font-semibold">
            {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      <button
        onClick={onClick}
        className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold"
      >
        <LineChart size={16} />
        View Chart
      </button>
    </div>
  );
}
