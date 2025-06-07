
import { useState } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NumberPadModal from "@/components/NumberPadModal";

const Offers = () => {
  const [amount, setAmount] = useState("");
  const [showNumberPad, setShowNumberPad] = useState(false);

  const handleInputClick = () => {
    setShowNumberPad(true);
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    setShowNumberPad(false);
  };

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
          
          <Input
            value={amount ? `${amount}€` : ""}
            placeholder="0€"
            onClick={handleInputClick}
            readOnly
            className="text-center text-lg font-semibold cursor-pointer"
          />
        </div>
        
        {/* Home indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>

      <NumberPadModal 
        isOpen={showNumberPad}
        onClose={() => setShowNumberPad(false)}
        onSubmit={handleAmountChange}
        initialValue={amount}
      />
    </div>
  );
};

export default Offers;
