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
    address: string; // Full address (legacy)
    street?: string; // Street address
    postalCode?: string; // Postal code
    city?: string; // City
    country?: string; // Country
  };
};

const DEFAULT_MESSAGE_STORAGE_KEY = "chat_messages_cross_device";
const ACTIVE_CHAT_KEY = "active_chat_id";
const ALL_CHATS_KEY = "all_chat_ids";

export const messageService = {
  // Set the active chat ID
  setActiveChatId: (chatId: string) => {
    localStorage.setItem(ACTIVE_CHAT_KEY, chatId);

    // Make sure this chat ID is in the list of all chats
    const allChats = messageService.getAllChatIds();
    if (!allChats.includes(chatId)) {
      allChats.push(chatId);
      localStorage.setItem(ALL_CHATS_KEY, JSON.stringify(allChats));
    }
  },

  // Get the active chat ID
  getActiveChatId: (): string | null => {
    return localStorage.getItem(ACTIVE_CHAT_KEY);
  },

  // Get all chat IDs
  getAllChatIds: (): string[] => {
    try {
      const stored = localStorage.getItem(ALL_CHATS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Get message storage key for a specific chat
  getMessageStorageKey: (chatId?: string): string => {
    const activeId = chatId || messageService.getActiveChatId();
    return activeId ? `chat_messages_${activeId}` : DEFAULT_MESSAGE_STORAGE_KEY;
  },

  // Get messages for a specific chat
  getMessages: (chatId?: string): Message[] => {
    const storageKey = messageService.getMessageStorageKey(chatId);

    try {
      const stored = localStorage.getItem(storageKey);
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

      // Return an empty array if nothing found or invalid format
      return [];
    } catch {
      return [];
    }
  },

  // Save messages for a specific chat
  saveMessages: (messages: Message[], chatId?: string) => {
    const storageKey = messageService.getMessageStorageKey(chatId);

    try {
      const messageData = {
        messages,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(messageData));

      // Trigger custom event for same-device cross-tab communication
      window.dispatchEvent(
        new CustomEvent("messagesUpdated", {
          detail: {
            messages,
            chatId: chatId || messageService.getActiveChatId(),
            timestamp: Date.now(),
          },
        })
      );

      console.log(
        "Messages saved for chat",
        chatId || messageService.getActiveChatId(),
        ":",
        messages.length,
        "messages"
      );
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  },

  // Add message to a specific chat
  addMessage: (
    text: string,
    sender: "buyer" | "seller",
    isOffer?: boolean,
    isOfferAccepted?: boolean,
    hasButton?: boolean,
    buttonText?: string,
    buttonAction?: string,
    chatId?: string
  ) => {
    const messages = messageService.getMessages(chatId);
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
    messageService.saveMessages(updatedMessages, chatId);
    return updatedMessages;
  },

  // Get parsed data from localStorage for a specific chat
  getStoredData: (chatId?: string) => {
    const storageKey = messageService.getMessageStorageKey(chatId);

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        return data.messages || data; // Handle both old and new format
      }
      return null;
    } catch {
      return null;
    }
  },

  // Delete a chat
  deleteChat: (chatId: string) => {
    // Remove the chat messages
    localStorage.removeItem(messageService.getMessageStorageKey(chatId));

    // Update the list of all chats
    const allChats = messageService.getAllChatIds();
    const updatedChats = allChats.filter((id) => id !== chatId);
    localStorage.setItem(ALL_CHATS_KEY, JSON.stringify(updatedChats));

    // If this was the active chat, clear the active chat
    if (messageService.getActiveChatId() === chatId) {
      localStorage.removeItem(ACTIVE_CHAT_KEY);
    }
  },

  // Generate a shareable link for a specific chat
  getShareableLink: (
    chatId: string,
    role: "admin" | "customer" = "admin"
  ): string => {
    const baseUrl = window.location.origin;
    const path = role === "admin" ? "person-a" : "person-b";
    return `${baseUrl}/${path}?chat=${chatId}`;
  },
};
