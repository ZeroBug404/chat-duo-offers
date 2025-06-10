import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendOffer?: (amount: string, address: string) => void;
  onMakeOffer?: () => void;
  showOfferButton?: boolean;
  price?: string;
  address?: string;
  productInfo?: {
    title?: string;
    image?: string;
    brand?: string;
    condition?: string;
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
}

const ChatInput = ({
  onSendMessage,
  onSendOffer,
  onMakeOffer,
  showOfferButton = false,
  price,
  address,
  productInfo,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleOfferAccepted = () => {
    // Create order details for the order tracking page with improved product info
    const orderDetails = {
      id: Date.now().toString(),
      productName: productInfo?.title || "Product",
      brandName: productInfo?.condition,
      price: price || "0",
      image: productInfo?.image || "/placeholder.svg",
      condition: productInfo?.condition || "No description",
      address: address || "Not specified",
      street: productInfo?.street || "",
      postalCode: productInfo?.postalCode || "",
      city: productInfo?.city || "",
      country: productInfo?.country || "",
      refNumber: Math.floor(Math.random() * 90000000) + 10000000 + "",
    };

    // Store in localStorage as backup
    localStorage.setItem("current_order_details", JSON.stringify(orderDetails));

    // Navigate to order tracking page
    navigate("/order-tracking", { state: { orderDetails } });
    // }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* {showOfferButton && (
        <div className="mb-3">
          <Link to="/offers">
            <Button
              // onClick={onMakeOffer}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Make an Offer
            </Button>
          </Link>
        </div>
      )} */}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write message"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        <button
          type="submit"
          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* {onSendOffer && ( */}
      <div className="mt-3">
        <Button
          onClick={handleOfferAccepted}
          className="w-full bg-green-600 text-white hover:bg-green-700"
        >
          Payment received
        </Button>
      </div>
      {/* )} */}
    </div>
  );
};

export default ChatInput;
