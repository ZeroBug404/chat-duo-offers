
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendOffer?: (amount: string) => void;
  onMakeOffer?: () => void;
  showOfferButton?: boolean;
}

const ChatInput = ({ onSendMessage, onSendOffer, onMakeOffer, showOfferButton = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleOfferAccepted = () => {
    if (onSendOffer) {
      onSendOffer("2 700");
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {showOfferButton && (
        <div className="mb-3">
          <Button 
            onClick={onMakeOffer}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Make an Offer
          </Button>
        </div>
      )}
      
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
      
      {onSendOffer && (
        <div className="mt-3">
          <Button 
            onClick={handleOfferAccepted}
            className="w-full bg-green-600 text-white hover:bg-green-700"
          >
            Send "Offer accepted 2 700€ Order paid"
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
