import { useState, useEffect } from "react";
import { ChevronLeft, ImageIcon, Trash2, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "@/utils/productContext";

interface ChatItem {
  id: string;
  productName: string;
  price: number;
  seller: string;
  hasImage: boolean;
}

const AllChats = () => {
  const navigate = useNavigate();
  const { selectedProduct } = useProduct();
  const [chats, setChats] = useState<ChatItem[]>([
    {
      id: "1",
      productName: "ps 3",
      price: 330.0,
      seller: "van dijk",
      hasImage: true,
    },
    {
      id: "2",
      productName: "Playstation 5 disc editor",
      price: 34532.0,
      seller: "Vad der Dussen",
      hasImage: true,
    },
    {
      id: "3",
      productName: "Play Station",
      price: 3453.0,
      seller: "Van Dijk",
      hasImage: true,
    },
  ]);

  // Add the selected product to the chats list if it exists and isn't already in the list
  useEffect(() => {
    if (selectedProduct && !chats.some(chat => chat.id === selectedProduct.id)) {
      const price = parseFloat(selectedProduct.price.replace('€', '').trim());
      setChats(prevChats => [
        ...prevChats,
        {
          id: selectedProduct.id,
          productName: selectedProduct.productName,
          price: isNaN(price) ? 0 : price,
          seller: selectedProduct.brand,
          hasImage: !!selectedProduct.image,
        }
      ]);
    }
  }, [selectedProduct]);

  const handleDeleteChat = (id: string) => {
    setChats(chats.filter((chat) => chat.id !== id));
  };

  const handlePersonClick = (chatId: string, person: "admin" | "customer") => {
    // Find the chat to get its details
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    // If this is the selected product's chat, we can navigate directly
    if (selectedProduct && selectedProduct.id === chatId) {
      // Navigate to the correct person page
      if (person === "admin") {
        navigate("/person-a");
      } else {
        navigate("/person-b");
      }
    } else {
      // For other chats, we need to update the selected product first
      // This is a simplified implementation; in a real app, you'd fetch the product details
      alert(`To chat about this product, please select it first from the products page`);
      navigate("/add-product");
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      

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
              Create your first chat by clicking the "Create New Chat" button above
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
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
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
