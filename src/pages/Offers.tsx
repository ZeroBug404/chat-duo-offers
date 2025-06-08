import NumberPadModal from "@/components/NumberPadModal";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/utils/productContext";
import { ArrowLeft, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { LuSend } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

const Offers = () => {
  const [amount, setAmount] = useState("");
  const [showNumberPad, setShowNumberPad] = useState(false);
  const { selectedProduct } = useProduct();
  const navigate = useNavigate();

  // Redirect to home if no product is selected
  useEffect(() => {
    if (!selectedProduct) {
      navigate("/");
    }
  }, [selectedProduct, navigate]);

  const handleInputClick = () => {
    setShowNumberPad(true);
  };

  const handleAmountChange = (newAmount: string) => {
    // Filter out any non-numeric characters
    const numericAmount = newAmount.replace(/[^0-9]/g, "");
    setAmount(numericAmount);
    setShowNumberPad(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <Link to="/chat-manager/all" className="p-1">
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
              src={selectedProduct?.image || "/uploads/placeholder.svg"}
              alt={selectedProduct?.productName || "Product"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {selectedProduct?.brand}, {selectedProduct?.productName}
            </h3>
            <p className="text-sm text-gray-600">
              Starting price: {selectedProduct?.price || "0€"}
            </p>
          </div>
        </div>

        <Link to={"/chat-manager/all"}>
          <Button
            variant="outline"
            className="w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            💬 Back to chats
          </Button>
        </Link>
      </div>

      {/* Empty space */}
      <div className="flex-1 bg-gray-50"></div>

      {/* Bottom section with offer input */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-4 py-4">
          <form action="" className="flex justify-between items-center">
            <div className="relative w-full flex items-center">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="Amount of the offer"
                onClick={handleInputClick}
                readOnly
                className="w-full text-lg font-semibold p-2 focus:outline-none pr-6"
              />
              {amount && (
                <span className="absolute right-2 text-lg font-semibold">
                  €
                </span>
              )}
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-full bg-orange-400 text-white hover:bg-orange-500 rounded-full flex items-center justify-center p-2"
                onClick={(e) => {
                  e.preventDefault();
                  if (!amount) {
                    alert("Please enter an amount for the offer.");
                    return;
                  }
                  // Log both the raw amount and formatted with euro symbol
                  console.log("Offer submitted:", amount);
                  console.log("Formatted amount:", `${amount}€`);
                  // Clear input after submission
                  setAmount("");
                }}
              >
                <LuSend size={20} className="h-[1rem] w-[1rem]" />
              </button>
            </div>
          </form>
        </div>

        {/* Home indicator */}
        {/* <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div> */}
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
