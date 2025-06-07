
import { useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import ProductCard from "@/components/ProductCard";
import MessageBubble from "@/components/MessageBubble";
import ChatInput from "@/components/ChatInput";
import OfferInput from "@/components/OfferInput";

const PersonB = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there!",
      sender: "seller",
      timestamp: "09:15"
    }
  ]);

  const [showOfferInput, setShowOfferInput] = useState(false);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender: "buyer" as const,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    setMessages([...messages, newMessage]);
  };

  const handleMakeOffer = (amount: string) => {
    const offerMessage = {
      id: messages.length + 1,
      text: `Offer received: ${amount}€`,
      sender: "buyer" as const,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isOffer: true
    };
    setMessages([...messages, offerMessage]);
    setShowOfferInput(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <ChatHeader 
        name="@sandra" 
        status=""
        backLink="/"
        showMenu={true}
      />
      
      <div className="bg-white">
        <ProductCard 
          brand="Chanel"
          condition="Very good condition"
          price="740€"
          image="/lovable-uploads/99fda41c-01ff-4167-94df-2316aa08bedd.png"
        />
        
        <div className="px-4 py-3 text-xs text-gray-500 bg-gray-50">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-black rounded text-white text-xs flex items-center justify-center font-bold">V</div>
            <div>
              <p>Vestiaire Collective is copied into this chat and may monitor it for fraud, safety and quality of service - see Privacy Policy</p>
              <p className="mt-1">If you have problems with another member, please use the report function.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4 bg-gray-50 min-h-[300px]">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {showOfferInput ? (
        <OfferInput 
          onSubmit={handleMakeOffer}
          onCancel={() => setShowOfferInput(false)}
        />
      ) : (
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onMakeOffer={() => setShowOfferInput(true)}
          showOfferButton={true}
        />
      )}
    </div>
  );
};

export default PersonB;
