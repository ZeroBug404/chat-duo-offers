import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import ProductCard from "@/components/ProductCard";
import { messageService, type Message } from "@/utils/messageService";
import { useProduct } from "@/utils/productContext";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PersonA = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedProduct, setSelectedProduct, getProductById } = useProduct();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for chat ID in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatId = params.get("chat");

    if (chatId) {
      // Find the product by ID
      const product = getProductById(chatId);

      if (product) {
        // Set as selected product
        setSelectedProduct(product);
        // Set as active chat
        messageService.setActiveChatId(chatId);
      }
    }
  }, [location, getProductById, setSelectedProduct]);

  // Redirect to home if no product is selected
  useEffect(() => {
    if (!selectedProduct) {
      navigate("/");
    }
  }, [selectedProduct, navigate]);

  useEffect(() => {
    if (!selectedProduct) return;

    const chatId = selectedProduct.id;

    // Set this as the active chat
    messageService.setActiveChatId(chatId);

    // Load initial messages for this specific chat
    setMessages(messageService.getMessages(chatId));

    // Listen for localStorage changes (works across tabs on same device)
    const handleStorageChange = (e: StorageEvent) => {
      // Check if this is for our chat's storage key
      const storageKey = messageService.getMessageStorageKey(chatId);
      if (e.key === storageKey && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          const newMessages = data.messages || data;
          // Ensure we always have an array before setting state
          if (Array.isArray(newMessages)) {
            setMessages(newMessages);
            // console.log("PersonA: Messages updated via storage event");
          } else {
            // console.error("Received messages is not an array:", newMessages);
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
      // Only update if this event is for our chat
      if (e.detail.chatId === chatId && Array.isArray(e.detail.messages)) {
        setMessages(e.detail.messages);
        // console.log("PersonA: Messages updated via custom event");
      }
    };

    // Poll for changes (works across devices sharing same localStorage)
    const pollInterval = setInterval(() => {
      try {
        const currentMessages = messageService.getMessages(chatId);

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
  }, [selectedProduct]);

  const handleSendMessage = (text: string) => {
    if (!selectedProduct) return;

    const chatId = selectedProduct.id;
    const updatedMessages = messageService.addMessage(
      text,
      "seller",
      false,
      false,
      false,
      undefined,
      undefined,
      chatId
    );
    setMessages(updatedMessages);
  };

  const handleSendOffer = (amount: string, address: string) => {
    if (!selectedProduct) return;

    const chatId = selectedProduct.id;

    const message = {
      // `Order received for ${amount}`,
      text: `${amount}. 
      You can send the item now to address ${address || "Dhaka"} `,
      sender: "seller" as const,
      isOffer: false,
      isOfferAccepted: true,
      hasButton: true, // hasButton
      buttonText: "Received Post Address Info By Whatsapp", // buttonText
      buttonAction: "track_shipment", // buttonAction
      productInfo: {
        image: selectedProduct?.image || "/uploads/chanel.png",
        title: selectedProduct?.productName || "Luxury Product",
        price: amount,
        condition: selectedProduct?.condition || "No description",
        address: address,
      },
    };

    const updatedMessages = messageService.addMessage(
      message.text,
      message.sender,
      message.isOffer,
      message.isOfferAccepted,
      message.hasButton,
      message.buttonText,
      message.buttonAction,
      chatId
    );

    // Add product info to the last message
    updatedMessages[updatedMessages.length - 1].productInfo =
      message.productInfo;

    // Save the updated messages
    messageService.saveMessages(updatedMessages, chatId);
    setMessages(updatedMessages);
  };

  const handleButtonClick = (action: string) => {
    if (action === "track_shipment") {
      navigate("/order-tracking");
    } else if (action === "accept_offer") {
      // Handle accepting the offer
      handleSendOffer(selectedProduct?.price || "0", "");
    } else if (action === "view_order_details") {
      // Navigate to order tracking page
      navigate("/order-tracking");
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
        name="Max"
        status="Online"
        backLink="/chat-manager/all"
        chatId={selectedProduct?.id}
      />

      <div className="bg-white">
        {selectedProduct ? (
          <ProductCard
            brand={selectedProduct.brand}
            condition={selectedProduct.condition}
            price={selectedProduct.price}
            image={selectedProduct.image}
            title={selectedProduct.productName}
          />
        ) : (
          <ProductCard
            brand="Dior"
            condition="Additional product details"
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
                onButtonClick={handleButtonClick}
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
        productInfo={{
          title: selectedProduct?.productName,
          image: selectedProduct?.image,
          brand: selectedProduct?.brand,
          condition: selectedProduct?.condition,
          street: selectedProduct?.street,
          postalCode: selectedProduct?.postalCode,
          city: selectedProduct?.city,
          country: selectedProduct?.country,
        }}
      />
    </div>
  );
};

export default PersonA;
