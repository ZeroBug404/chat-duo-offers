
import { type Message } from "@/utils/messageService";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOwnMessage = message.sender === "seller";
  
  if (message.isOfferAccepted) {
    return (
      <div className="flex justify-center">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          {message.text}
        </div>
      </div>
    );
  }

  if (message.isOffer) {
    return (
      <div className="flex justify-start">
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl text-sm font-medium max-w-xs">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className="flex items-start space-x-2 max-w-xs">
        {!isOwnMessage && (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
            <img 
              src="/lovable-uploads/1c4d29ae-9f26-4bc8-ba9b-075d52e645d2.png" 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className={`px-4 py-2 rounded-2xl ${
          isOwnMessage 
            ? "bg-black text-white rounded-br-md" 
            : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
        }`}>
          <p className="text-sm">{message.text}</p>
          <p className={`text-xs mt-1 ${
            isOwnMessage ? "text-gray-300" : "text-gray-500"
          }`}>
            {message.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
