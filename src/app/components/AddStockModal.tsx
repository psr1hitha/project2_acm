import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
}

interface AddStockModalProps {
  availableStocks: Stock[];
  onAdd: (symbol: string) => void;
  onClose: () => void;
}

export function AddStockModal({ availableStocks, onAdd, onClose }: AddStockModalProps) {
  const [search, setSearch] = useState('');

  const filteredStocks = availableStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
    stock.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl border-4 border-[#F4D242]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#008471]">Add Stock</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-[#C45F3F]">
            <X size={24} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#898E46]" size={20} />
          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-[#D1CAEA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008471] focus:border-[#008471]"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredStocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => {
                onAdd(stock.symbol);
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-[#D1CAEA]/30 transition-all transform hover:scale-102"
            >
              <div className="font-bold text-gray-900">{stock.symbol}</div>
              <div className="text-sm text-gray-600">{stock.name}</div>
            </button>
          ))}
          {filteredStocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No stocks found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
