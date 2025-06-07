
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface OfferInputProps {
  onSubmit: (amount: string) => void;
  onCancel: () => void;
}

const OfferInput = ({ onSubmit, onCancel }: OfferInputProps) => {
  const [amount, setAmount] = useState("");

  const handleNumberClick = (num: string) => {
    if (num === "⌫") {
      setAmount(prev => prev.slice(0, -1));
    } else {
      setAmount(prev => prev + num);
    }
  };

  const handleSubmit = () => {
    if (amount) {
      onSubmit(amount);
    }
  };

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"], 
    ["7", "8", "9"],
    ["", "0", "⌫"]
  ];

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Amount of the offer</p>
        <div className="text-2xl font-bold text-center py-4 bg-gray-50 rounded-lg">
          {amount || "0"}€
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
              {num}
            </button>
          ))
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button 
          onClick={onCancel}
          variant="outline" 
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-black text-white hover:bg-gray-800"
          disabled={!amount}
        >
          Send Offer
        </Button>
      </div>
    </div>
  );
};

export default OfferInput;
