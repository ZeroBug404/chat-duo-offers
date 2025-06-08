import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import OfferCard from "@/components/OfferCard";
import ProductCard from "@/components/ProductCard";
import { messageService, type Message } from "@/utils/messageService";
import { useProduct } from "@/utils/productContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PersonA = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedProduct } = useProduct();
  const navigate = useNavigate();

  // Redirect to home if no product is selected
  useEffect(() => {
    if (!selectedProduct) {
      navigate("/");
    }
  }, [selectedProduct, navigate]);

  useEffect(() => {
    // Load initial messages
    setMessages(messageService.getMessages());

    // Listen for localStorage changes (works across tabs on same device)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "chat_messages_cross_device" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          const newMessages = data.messages || data;
          // Ensure we always have an array before setting state
          if (Array.isArray(newMessages)) {
            setMessages(newMessages);
            console.log("PersonA: Messages updated via storage event");
          } else {
            console.error("Received messages is not an array:", newMessages);
            // Fallback to empty array
            setMessages([]);
          }
        } catch (error) {
          console.error("Error parsing storage data:", error);
        }
      }
    };

    // Listen for custom events (same device, different tabs)
    const handleCustomEvent = (e: CustomEvent) => {
      if (Array.isArray(e.detail.messages)) {
        setMessages(e.detail.messages);
        console.log("PersonA: Messages updated via custom event");
      } else {
        console.error(
          "Custom event messages is not an array:",
          e.detail.messages
        );
        setMessages([]);
      }
    };

    // Poll for changes (works across devices sharing same localStorage)
    const pollInterval = setInterval(() => {
      try {
        const currentMessages = messageService.getMessages();

        // Extra safety check to ensure we have an array
        if (!Array.isArray(currentMessages)) {
          console.error(
            "PersonA Polling: Messages is not an array:",
            currentMessages
          );
          return;
        }

        setMessages((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(currentMessages)) {
            console.log("PersonA: Messages updated via polling");
            return currentMessages;
          }
          return prev;
        });
      } catch (error) {
        console.error("PersonA: Error during polling:", error);
      }
    }, 2000); // Check every 2 seconds

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "messagesUpdated",
      handleCustomEvent as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "messagesUpdated",
        handleCustomEvent as EventListener
      );
      clearInterval(pollInterval);
    };
  }, []);

  const handleSendMessage = (text: string) => {
    const updatedMessages = messageService.addMessage(text, "seller");
    setMessages(updatedMessages);
  };

  const handleSendOffer = (amount: string, address: string) => {
    console.log("Sending offer for amount:", amount);

    const updatedMessages = messageService.addMessage(
      // `Order received for ${amount}`,
      `Payment received: ${amount}. You can sent the item now to address ${address}`,
      "seller",
      false,
      true
    );
    setMessages(updatedMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      <ChatHeader
        name="Max"
        status="Active 2 days ago"
        backLink="/chat-manager/all"
      />

      <div className="bg-white">
        {selectedProduct ? (
          <ProductCard
            brand={selectedProduct.brand}
            condition={selectedProduct.condition}
            price={selectedProduct.price}
            image={selectedProduct.image}
          />
        ) : (
          <ProductCard
            brand="Dior"
            condition="Very Good Condition"
            price="2 907,27€"
            image="/uploads/dior_bag.png"
          />
        )}

        {/* <OfferCard
          amount={selectedProduct?.price}
          expiresIn="11:59:59"
          onAccept={() => handleSendOffer(selectedProduct?.price)}
        /> */}
      </div>

      <div className="px-4 py-6 bg-white h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide">
        <div className="flex flex-col space-y-4">
          {Array.isArray(messages) &&
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                avatar={"/uploads/admin.png"}
              />
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        onSendOffer={handleSendOffer}
        price={selectedProduct?.price || "0€"}
        address={selectedProduct?.address || ""}
      />
    </div>
  );
};

export default PersonA;
