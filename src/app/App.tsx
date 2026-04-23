import { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { StockCard } from './components/StockCard';
import { StockChart } from './components/StockChart';
import { AddStockModal } from './components/AddStockModal';
import { ProfilePage } from './components/ProfilePage';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface ChartDataPoint {
  time: string;
  price: number;
}

const ALL_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'INTC', name: 'Intel Corporation' },
];

const INITIAL_PRICES: Record<string, number> = {
  'AAPL': 178.50,
  'GOOGL': 142.30,
  'MSFT': 420.80,
  'AMZN': 185.20,
  'TSLA': 245.60,
  'META': 512.40,
  'NVDA': 895.30,
  'NFLX': 625.70,
  'AMD': 165.80,
  'INTC': 42.30,
};

function generateChartData(basePrice: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let price = basePrice * 0.95;

  const times = ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00'];

  times.forEach((time) => {
    const volatility = basePrice * 0.02;
    price = price + (Math.random() - 0.48) * volatility;
    data.push({ time, price });
  });

  return data;
}

function generateMockData(symbols: string[]): StockData[] {
  return symbols.map(symbol => {
    const stock = ALL_STOCKS.find(s => s.symbol === symbol);
    const basePrice = INITIAL_PRICES[symbol] || 100;
    const volatility = basePrice * 0.03;
    const change = (Math.random() - 0.5) * volatility;
    const price = basePrice + change;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      name: stock?.name || symbol,
      price,
      change,
      changePercent,
    };
  });
}

export default function App() {
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'GOOGL', 'MSFT', 'TSLA']);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>('AAPL');
  const [chartData, setChartData] = useState<Record<string, ChartDataPoint[]>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const updatePrices = () => {
      setStockData(generateMockData(watchlist));
    };

    updatePrices();
    const interval = setInterval(updatePrices, 3000);

    return () => clearInterval(interval);
  }, [watchlist]);

  useEffect(() => {
    setChartData(prevData => {
      const newChartData: Record<string, ChartDataPoint[]> = {};
      watchlist.forEach(symbol => {
        if (!prevData[symbol]) {
          newChartData[symbol] = generateChartData(INITIAL_PRICES[symbol] || 100);
        } else {
          newChartData[symbol] = prevData[symbol];
        }
      });
      return newChartData;
    });
  }, [watchlist]);

  const addStock = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const removeStock = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
    if (selectedStock === symbol) {
      setSelectedStock(null);
    }
  };

  const availableStocks = ALL_STOCKS.filter(stock => !watchlist.includes(stock.symbol));
  const selectedStockData = stockData.find(s => s.symbol === selectedStock);

  if (showProfile) {
    return <ProfilePage stockData={stockData} onClose={() => setShowProfile(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="inline-block bg-[#80B0E8] px-6 py-3 rounded-2xl shadow-lg mb-3">
              <h1 className="text-4xl font-bold text-white">Stock Tracker</h1>
            </div>
            <p className="text-[#898E46] font-medium italic">monitor your favorite stocks in real-time.</p>
          </div>
          <button
            onClick={() => setShowProfile(true)}
            className="bg-[#F29CC3] text-white p-3 rounded-full hover:bg-[#F29CC3]/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            title="View Profile"
          >
            <User size={24} />
          </button>
        </div>

        {selectedStock && selectedStockData && (
          <div className="mb-6">
            <StockChart
              symbol={selectedStockData.symbol}
              name={selectedStockData.name}
              data={chartData[selectedStock] || []}
              currentPrice={selectedStockData.price}
              change={selectedStockData.change}
              changePercent={selectedStockData.changePercent}
              onClose={() => setSelectedStock(null)}
            />
          </div>
        )}

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#F4D242] text-[#008471] px-5 py-3 rounded-xl hover:bg-[#D6D35F] transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            Add Stock
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stockData.map((stock) => (
            <StockCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              price={stock.price}
              change={stock.change}
              changePercent={stock.changePercent}
              onClick={() => setSelectedStock(stock.symbol)}
              onRemove={() => removeStock(stock.symbol)}
            />
          ))}
        </div>

        {stockData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4 text-lg">No stocks in your watchlist</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-[#008471] hover:text-[#C45F3F] font-bold text-lg"
            >
              Add your first stock
            </button>
          </div>
        )}

        {showAddModal && (
          <AddStockModal
            availableStocks={availableStocks}
            onAdd={addStock}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </div>
    </div>
  );
}