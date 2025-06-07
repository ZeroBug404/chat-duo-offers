
import { useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import ProductCard from "@/components/ProductCard";
import MessageBubble from "@/components/MessageBubble";
import OfferCard from "@/components/OfferCard";
import ChatInput from "@/components/ChatInput";

const PersonA = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello Sandra",
      sender: "buyer",
      timestamp: "11:59"
    },
    {
      id: 2,
      text: "Your offer is a bit low, I'm ready to accept 2 800€.",
      sender: "seller",
      timestamp: "11:59"
    },
    {
      id: 3,
      text: "Hello Gintare, I'm sorry 😔 but I can't pay more that 2 700€",
      sender: "buyer",
      timestamp: "12:00"
    }
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender: "seller" as const,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendOffer = (amount: string) => {
    const offerMessage = {
      id: messages.length + 1,
      text: `Offer accepted: ${amount}€ Order paid`,
      sender: "seller" as const,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isOfferAccepted: true
    };
    setMessages([...messages, offerMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <ChatHeader 
        name="Max" 
        status="Active 2 days ago" 
        backLink="/"
      />
      
      <div className="bg-white">
        <ProductCard 
          brand="Dior"
          condition="Very Good Condition"
          price="2 907,27€"
          image="/lovable-uploads/1c4d29ae-9f26-4bc8-ba9b-075d52e645d2.png"
        />
        
        <OfferCard 
          amount="2 700€"
          expiresIn="11:59:59"
          onAccept={() => handleSendOffer("2 700")}
        />
      </div>

      <div className="px-4 py-6 space-y-4 bg-gray-50 min-h-[300px]">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <ChatInput onSendMessage={handleSendMessage} onSendOffer={handleSendOffer} />
    </div>
  );
};

export default PersonA;
