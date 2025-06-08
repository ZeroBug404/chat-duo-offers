import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import OfferInput from "@/components/OfferInput";
import ProductCard from "@/components/ProductCard";
import { messageService, type Message } from "@/utils/messageService";
import { useProduct } from "@/utils/productContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PersonB = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOfferInput, setShowOfferInput] = useState(false);
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
            console.log("PersonB: Messages updated via storage event");
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
        console.log("PersonB: Messages updated via custom event");
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
            "PersonB Polling: Messages is not an array:",
            currentMessages
          );
          return;
        }

        setMessages((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(currentMessages)) {
            console.log("PersonB: Messages updated via polling");
            return currentMessages;
          }
          return prev;
        });
      } catch (error) {
        console.error("PersonB: Error during polling:", error);
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
    const updatedMessages = messageService.addMessage(text, "buyer");
    setMessages(updatedMessages);
  };

  const handleMakeOffer = (amount: string) => {
    const updatedMessages = messageService.addMessage(
      `Offer received: ${amount}€`,
      "buyer",
      true,
      false,
      true, // hasButton
      "Accept Offer", // buttonText
      "accept_offer" // buttonAction
    );
    setMessages(updatedMessages);
    setShowOfferInput(false);
  };

  const handleButtonClick = (action: string) => {
    console.log("Button clicked with action:", action);
    if (action === "track_shipment") {
      navigate("/order-tracking");
    } else if (action === "view_offer") {
      navigate("/offers");
    }
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
        name="@sandra"
        status=""
        backLink="/chat-manager/all"
        showMenu={true}
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
            brand="Chanel"
            condition="Very good condition"
            price="740€"
            image="/uploads/chanel.png"
          />
        )}

        <div className="px-4 py-3 text-xs text-gray-500 bg-gray-50">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 p-5 bg-gray-200 text-black rounded-full text-2xl flex items-center justify-center font-bold ">
              V
            </div>
            <div>
              <p>
                Vestiaire Collective is copied into this chat and may monitor it
                for fraud, safety and quality of service - see{" "}
                <span className="underline">Privacy Policy</span>
              </p>
              <p className="mt-1">
                If you have problems with another member, please use the{" "}
                <span className="underline">report function</span>.
              </p>
            </div>
          </div>
        </div>

        {/* <div className="px-4 py-3 border-t border-gray-100">
          <Link to="/offers">
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <BiMessageRoundedDots
                style={{ width: "1.5rem", height: "1.5rem" }}
              />{" "}
              Contact seller
            </Button>
          </Link>
        </div> */}
      </div>

      <div className="px-4 py-6 bg-white h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide">
        <div className="flex flex-col space-y-4">
          {Array.isArray(messages) &&
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                avatar={"/uploads/customer.png"}
                onButtonClick={handleButtonClick}
              />
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showOfferInput ? (
        <OfferInput
          onSubmit={handleMakeOffer}
          onCancel={() => setShowOfferInput(false)}
        />
      ) : (
        <ChatInput
          onSendMessage={handleSendMessage}
          // onMakeOffer={() => setShowOfferInput(true)}
          showOfferButton={true}
        />
      )}
    </div>
  );
};

export default PersonB;
