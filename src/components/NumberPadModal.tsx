
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface NumberPadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: string) => void;
  initialValue: string;
}

const NumberPadModal = ({ isOpen, onClose, onSubmit, initialValue }: NumberPadModalProps) => {
  const [amount, setAmount] = useState(initialValue);

  useEffect(() => {
    setAmount(initialValue);
  }, [initialValue, isOpen]);

  const handleNumberClick = (num: string) => {
    if (num === "⌫") {
      setAmount(prev => prev.slice(0, -1));
    } else {
      setAmount(prev => prev + num);
    }
  };

  const handleSubmit = () => {
    onSubmit(amount);
  };

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"], 
    ["7", "8", "9"],
    ["", "0", "⌫"]
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-xl p-4 animate-slide-up">
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
                {num === "⌫" ? "✕" : num}
              </button>
            ))
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={onClose}
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
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NumberPadModal;
