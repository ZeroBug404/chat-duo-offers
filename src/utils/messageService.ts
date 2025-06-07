
export type Message = {
  id: number;
  text: string;
  sender: "buyer" | "seller";
  timestamp: string;
  isOffer?: boolean;
  isOfferAccepted?: boolean;
};

const MESSAGE_STORAGE_KEY = 'chat_messages';

export const messageService = {
  getMessages: (): Message[] => {
    try {
      const stored = localStorage.getItem(MESSAGE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        {
          id: 1,
          text: "Hi there!",
          sender: "seller",
          timestamp: "09:15"
        }
      ];
    } catch {
      return [{
        id: 1,
        text: "Hi there!",
        sender: "seller",
        timestamp: "09:15"
      }];
    }
  },

  saveMessages: (messages: Message[]) => {
    try {
      localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
      // Trigger storage event for cross-tab communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: MESSAGE_STORAGE_KEY,
        newValue: JSON.stringify(messages)
      }));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  },

  addMessage: (text: string, sender: "buyer" | "seller", isOffer?: boolean, isOfferAccepted?: boolean) => {
    const messages = messageService.getMessages();
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isOffer,
      isOfferAccepted
    };
    const updatedMessages = [...messages, newMessage];
    messageService.saveMessages(updatedMessages);
    return updatedMessages;
  }
};
