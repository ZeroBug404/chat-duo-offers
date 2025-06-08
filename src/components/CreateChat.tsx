import { useProduct } from "@/utils/productContext";
import { ChevronLeft, ImageIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
  productTitle: string;
  amount: string;
  sellerName: string;
  productImage: File | null;
  address: string; // Shipping address
}

const CreateChat = () => {
  const navigate = useNavigate();
  const { setSelectedProduct } = useProduct();
  const [formData, setFormData] = useState<FormData>({
    productTitle: "",
    amount: "",
    sellerName: "",
    productImage: null,
    address: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, productImage: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.productTitle.trim() ||
      !formData.amount.trim() ||
      !formData.sellerName.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save the product to context
      setSelectedProduct({
        id: Date.now().toString(),
        productName: formData.productTitle,
        brand: formData.sellerName, // Using seller name as brand for now
        condition: "New", // Default condition
        price: `${formData.amount}€`,
        image: previewUrl || "/uploads/placeholder.svg",
        buyerName: "Customer", // Default buyer name
        address: formData.address, // Shipping address
      });

      console.log("Creating chat with data:", formData);
      // Navigate to all chats view
      navigate("/chat-manager/all");
    } catch (error) {
      alert("Error creating chat. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/chat-manager" className="text-gray-500">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="text-center text-lg font-medium">Create New Chat</div>
        <div className="w-6"></div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Form */}
      <div className="flex-1 px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Title */}
          <div>
            <label
              htmlFor="productTitle"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Title
            </label>
            <input
              type="text"
              id="productTitle"
              value={formData.productTitle}
              onChange={(e) =>
                handleInputChange("productTitle", e.target.value)
              }
              placeholder="e.g., PlayStation 5 Disc Edition"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount (€)
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="450.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Shipping Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="123 Main St, City, Country"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Seller */}
          <div>
            <label
              htmlFor="sellerName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Seller Name
            </label>
            <input
              type="text"
              id="sellerName"
              value={formData.sellerName}
              onChange={(e) => handleInputChange("sellerName", e.target.value)}
              placeholder="Van Dijk"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image (Optional)
            </label>
            <div
              onClick={() => document.getElementById("productImage")?.click()}
              className="border border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
            >
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Product preview"
                    className="w-20 h-20 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-green-600">
                    Click to change image
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">Click to upload product image</p>
                  <p className="text-xs text-gray-500">Max 5MB</p>
                </div>
              )}
            </div>
            <input
              type="file"
              id="productImage"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </form>
      </div>

      {/* Submit Button */}
      <div className="p-6">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-medium text-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Chat...
            </>
          ) : (
            "Create Chat"
          )}
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-center p-2">
        <div className="w-1/3 h-1.5 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default CreateChat;
