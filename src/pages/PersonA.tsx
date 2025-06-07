
import { useState, useEffect } from "react";
import ChatHeader from "@/components/ChatHeader";
import ProductCard from "@/components/ProductCard";
import MessageBubble from "@/components/MessageBubble";
import OfferCard from "@/components/OfferCard";
import ChatInput from "@/components/ChatInput";
import { messageService, type Message } from "@/utils/messageService";

const PersonA = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load initial messages
    setMessages(messageService.getMessages());

    // Listen for storage changes to sync messages
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chat_messages' && e.newValue) {
        setMessages(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSendMessage = (text: string) => {
    const updatedMessages = messageService.addMessage(text, "seller");
    setMessages(updatedMessages);
  };

  const handleSendOffer = (amount: string) => {
    const updatedMessages = messageService.addMessage(
      `Offer accepted: ${amount}€ Order paid`, 
      "seller", 
      false, 
      true
    );
    setMessages(updatedMessages);
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
