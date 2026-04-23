import { X } from 'lucide-react';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface ProfilePageProps {
  stockData: StockData[];
  onClose: () => void;
}

export function ProfilePage({ stockData, onClose }: ProfilePageProps) {
  const totalValue = stockData.reduce((sum, stock) => sum + stock.price, 0);
  const totalChange = stockData.reduce((sum, stock) => sum + stock.change, 0);
  const totalChangePercent = stockData.length > 0 ? (totalChange / totalValue) * 100 : 0;
  const isPositive = totalChange >= 0;

  return (
    <div className="fixed inset-0 bg-[#F5F0E8] z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#008471] mb-2">My Profile</h1>
            <p className="text-[#898E46] font-medium">Your stock portfolio overview</p>
          </div>
          <button
            onClick={onClose}
            className="bg-[#C45F3F] text-white p-3 rounded-full hover:bg-[#C45F3F]/90 transition-all shadow-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-gradient-to-br from-[#008471] to-[#80B0E8] rounded-2xl p-6 shadow-xl mb-6">
          <h2 className="text-white/80 mb-2">Total Portfolio Value</h2>
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-5xl font-bold text-white">
              ${totalValue.toFixed(2)}
            </span>
            <span className={`text-2xl font-semibold ${isPositive ? 'text-white' : 'text-white/90'}`}>
              {isPositive ? '+' : ''}{totalChange.toFixed(2)} ({isPositive ? '+' : ''}{totalChangePercent.toFixed(2)}%)
            </span>
          </div>
          <p className="text-white/80">
            {stockData.length} {stockData.length === 1 ? 'stock' : 'stocks'} in watchlist
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#008471] mb-4">My Stocks</h2>

          {stockData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No stocks in your portfolio yet
            </div>
          ) : (
            <div className="space-y-3">
              {stockData.map((stock) => {
                const isStockPositive = stock.change >= 0;
                return (
                  <div
                    key={stock.symbol}
                    className="flex justify-between items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{stock.symbol}</h3>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div className={`text-sm font-semibold ${isStockPositive ? 'text-[#008471]' : 'text-[#C45F3F]'}`}>
                        {isStockPositive ? '+' : ''}{stock.change.toFixed(2)} ({isStockPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
