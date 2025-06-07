import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChatHeader from "@/components/ChatHeader";
import ProductCard from "@/components/ProductCard";
import MessageBubble from "@/components/MessageBubble";
import ChatInput from "@/components/ChatInput";
import OfferInput from "@/components/OfferInput";
import { Button } from "@/components/ui/button";
import { messageService, type Message } from "@/utils/messageService";

const PersonB = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOfferInput, setShowOfferInput] = useState(false);

  useEffect(() => {
    // Load initial messages
    setMessages(messageService.getMessages());

    // Listen for localStorage changes (works across tabs on same device)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chat_messages_cross_device' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          const newMessages = data.messages || data;
          setMessages(newMessages);
          console.log('PersonB: Messages updated via storage event');
        } catch (error) {
          console.error('Error parsing storage data:', error);
        }
      }
    };

    // Listen for custom events (same device, different tabs)
    const handleCustomEvent = (e: CustomEvent) => {
      setMessages(e.detail.messages);
      console.log('PersonB: Messages updated via custom event');
    };

    // Poll for changes (works across devices sharing same localStorage)
    const pollInterval = setInterval(() => {
      const currentMessages = messageService.getMessages();
      setMessages(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(currentMessages)) {
          console.log('PersonB: Messages updated via polling');
          return currentMessages;
        }
        return prev;
      });
    }, 2000); // Check every 2 seconds

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('messagesUpdated', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('messagesUpdated', handleCustomEvent as EventListener);
      clearInterval(pollInterval);
    };
  }, []);

  const handleSendMessage = (text: string) => {
    const updatedMessages = messageService.addMessage(text, "buyer");
    setMessages(updatedMessages);
  };

  const handleMakeOffer = (amount: string) => {
    const updatedMessages = messageService.addMessage(
      `Offer received: ${amount}€`, 
      "buyer", 
      true
    );
    setMessages(updatedMessages);
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
        
        <div className="px-4 py-3 border-t border-gray-100">
          <Link to="/offers">
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
              📝 Contact seller
            </Button>
          </Link>
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
