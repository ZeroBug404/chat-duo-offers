import { messageService } from "@/utils/messageService";
import { useProduct } from "@/utils/productContext";
import {
  ChevronLeft,
  Copy,
  ImageIcon,
  MessageCircle,
  Share2,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ChatItem {
  id: string;
  productName: string;
  price: number;
  seller: string;
  hasImage: boolean;
}

const AllChats = () => {
  const navigate = useNavigate();
  const { selectedProduct, allProducts, setSelectedProduct, deleteProduct } =
    useProduct();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareableLink, setShareableLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  // Load all chats from products in localStorage
  useEffect(() => {
    // Convert products to chat items
    const chatItems = allProducts.map((product) => {
      const price = parseFloat(product.price.replace("€", "").trim());
      return {
        id: product.id,
        productName: product.productName,
        price: isNaN(price) ? 0 : price,
        seller: product.brand,
        hasImage: !!product.image,
      };
    });

    setChats(chatItems);
  }, [allProducts]);

  const handleDeleteChat = (id: string) => {
    // Delete the product from context (which also updates localStorage)
    deleteProduct(id);

    // Delete the chat messages from localStorage
    messageService.deleteChat(id);

    // Update the UI
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  const handlePersonClick = (chatId: string, person: "admin" | "customer") => {
    // Find the product details for this chat
    const product = allProducts.find((p) => p.id === chatId);

    if (!product) {
      alert("Product not found");
      return;
    }

    // Set as the selected product
    setSelectedProduct(product);

    // Set as the active chat
    messageService.setActiveChatId(chatId);

    // Navigate to the correct person page
    if (person === "admin") {
      navigate("/person-a");
    } else {
      navigate("/person-b");
    }
  };

  const handleShare = (chatId: string) => {
    // Generate shareable link (both admin and customer versions)
    const adminLink = messageService.getShareableLink(chatId, "admin");

    // Set the link to be shared
    setShareableLink(adminLink);

    // Show the dialog
    setShowShareDialog(true);
  };

  const handleCopyLink = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Chat Link
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Use this link to share the chat with others.
            </p>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <input
                  ref={linkInputRef}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={shareableLink}
                  readOnly
                />
              </div>
              <Button type="button" size="icon" onClick={handleCopyLink}>
                {copied ? (
                  <span className="text-green-500 text-xs">Copied!</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/chat-manager" className="text-gray-500">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="text-center text-lg font-medium">All Chats</div>
        <div className="w-6"></div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* New Chat Button */}
      <div className="p-4">
        <Link
          to="/chat-manager/create"
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full"
        >
          <MessageCircle className="h-5 w-5" />
          Create New Chat
        </Link>
      </div>

      {/* Chat List */}
      <div className="flex-1">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 pt-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-4">No chats available</p>
            <p className="text-gray-400 text-sm text-center">
              Create your first chat by clicking the "Create New Chat" button
              above
            </p>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                {/* Product Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {chat.productName}
                      </h3>
                      <p className="text-lg font-medium text-gray-900">
                        € {chat.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Seller: {chat.seller}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => handleShare(chat.id)}
                      className="text-gray-500 hover:text-blue-600 p-2"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePersonClick(chat.id, "admin")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Person A (Admin)
                  </button>
                  <button
                    onClick={() => handlePersonClick(chat.id, "customer")}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Person B (Customer)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-center p-2">
        <div className="w-1/3 h-1.5 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default AllChats;
