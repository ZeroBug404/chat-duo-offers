import { Eye, MessageCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const ChatManager = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-center items-center px-6 py-4">
        <div className="text-center text-lg font-medium">Chat Manager</div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        {/* Icon and Description */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">
            Chat Manager
          </h1>
          <p className="text-gray-600">Manage your marketplace conversations</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/chat-manager/all"
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-medium text-lg flex items-center justify-center gap-3 hover:bg-green-700 transition-colors"
          >
            <Eye className="h-5 w-5" />
            Watch Chats
          </Link>

          <Link
            to="/chat-manager/create"
            className="w-full border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-medium text-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Start New Chat
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-center p-2">
        <div className="w-1/3 h-1.5 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default ChatManager;
