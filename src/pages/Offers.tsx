
import { useState } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Offers = () => {
  const [amount, setAmount] = useState("");

  const handleNumberClick = (num: string) => {
    if (num === "⌫") {
      setAmount(prev => prev.slice(0, -1));
    } else {
      setAmount(prev => prev + num);
    }
  };

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"], 
    ["7", "8", "9"],
    ["", "0", "⌫"]
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <Link to="/person-b" className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="font-semibold text-gray-900 text-lg">Your offers</h1>
        <button className="p-1">
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Product Card */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src="/lovable-uploads/99fda41c-01ff-4167-94df-2316aa08bedd.png" 
              alt="Patagonia Swimwear"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Patagonia, Swimwear</h3>
            <p className="text-sm text-gray-600">Starting price: 220 €</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          💬 Contact seller
        </Button>
      </div>

      {/* Empty space */}
      <div className="flex-1 bg-gray-50"></div>

      {/* Bottom section with offer input */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Amount of the offer</p>
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {keypadNumbers.map((row, rowIndex) => 
              row.map((num, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => num && handleNumberClick(num)}
                  className={`h-12 rounded-lg font-semibold text-lg ${
                    num === "" 
                      ? "invisible" 
                      : "bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
                  }`}
                  disabled={num === ""}
                >
                  {num === "⌫" ? "✕" : num}
                  {num && num !== "⌫" && (
                    <div className="text-xs text-gray-400 mt-1">
                      {num === "2" && "ABC"}
                      {num === "3" && "DEF"}
                      {num === "4" && "GHI"}
                      {num === "5" && "JKL"}
                      {num === "6" && "MNO"}
                      {num === "7" && "PQRS"}
                      {num === "8" && "TUV"}
                      {num === "9" && "WXYZ"}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
