export type Message = {
  id: number;
  text: string;
  sender: "buyer" | "seller";
  timestamp: string;
  isOffer?: boolean;
  isOfferAccepted?: boolean;
  hasButton?: boolean;
  buttonText?: string;
  buttonAction?: string; // Can be used to determine what action to take when the button is clicked
  productInfo?: {
    image: string;
    title: string;
    price: string;
    condition: string;
  };
};

const MESSAGE_STORAGE_KEY = "chat_messages_cross_device";

export const messageService = {
  getMessages: (): Message[] => {
    try {
      const stored = localStorage.getItem(MESSAGE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if it's a wrapped object with messages property
        if (
          parsed &&
          typeof parsed === "object" &&
          Array.isArray(parsed.messages)
        ) {
          return parsed.messages;
        }
        // If it's already an array, return it
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      // Default messages if nothing found or invalid format
      return [
        {
          id: 1,
          text: "Hi there!",
          sender: "seller",
          timestamp: "09:15",
        },
      ];
    } catch {
      return [
        {
          id: 1,
          text: "Hi there!",
          sender: "seller",
          timestamp: "09:15",
        },
      ];
    }
  },

  saveMessages: (messages: Message[]) => {
    try {
      const messageData = {
        messages,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messageData));

      // Trigger custom event for same-device cross-tab communication
      window.dispatchEvent(
        new CustomEvent("messagesUpdated", {
          detail: { messages, timestamp: Date.now() },
        })
      );

      console.log("Messages saved:", messages.length, "messages");
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  },

  addMessage: (
    text: string,
    sender: "buyer" | "seller",
    isOffer?: boolean,
    isOfferAccepted?: boolean,
    hasButton?: boolean,
    buttonText?: string,
    buttonAction?: string
  ) => {
    const messages = messageService.getMessages();
    const newMessage: Message = {
      id: Date.now(), // Use timestamp for unique ID across devices
      text,
      sender,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOffer,
      isOfferAccepted,
      hasButton,
      buttonText,
      buttonAction,
    };
    const updatedMessages = [...messages, newMessage];
    messageService.saveMessages(updatedMessages);
    return updatedMessages;
  },

  // Method to get parsed data from localStorage
  getStoredData: () => {
    try {
      const stored = localStorage.getItem(MESSAGE_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.messages || data; // Handle both old and new format
      }
      return null;
    } catch {
      return null;
    }
  },
};
