import { messageService } from "@/utils/messageService";
import { useProduct } from "@/utils/productContext";
import { ChevronLeft, Copy, ImageIcon, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface FormData {
  productTitle: string;
  amount: string;
  sellerName: string;
  productImage: File | null;
  address: string; // Shipping address (legacy field, kept for compatibility)
  secondDescription: string; // Second product description
  street: string; // New field for street address
  postalCode: string; // New field for postal code
  city: string; // New field for city
  country: string; // New field for country
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
    secondDescription: "",
    street: "",
    postalCode: "",
    city: "",
    country: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareableLink, setShareableLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopyLink = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNavigateToChat = () => {
    navigate("/person-a");
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

      // Generate a unique ID for this chat/product
      const productId = Date.now().toString();

      // Create product object
      const product = {
        id: productId,
        productName: formData.productTitle,
        brand: formData.sellerName, // Using seller name as brand for now
        condition: formData.secondDescription, // Use second product description instead of condition
        price: `€${formData.amount}`,
        image: previewUrl || "/uploads/placeholder.svg",
        buyerName: "Customer", // Default buyer name
        address: `${formData.street}, ${formData.postalCode}, ${formData.city}, ${formData.country}`, // Full address for backward compatibility
        street: formData.street,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
      };

      // Save the product to context (this will also add it to allProducts)
      setSelectedProduct(product);

      // Set this chat as the active one
      messageService.setActiveChatId(productId);

      console.log("Creating chat with data:", formData);

      // Auto-trigger the Payment Received functionality for this specific chat
      triggerPaymentReceivedMessage(product);

      // Generate shareable links
      const adminLink = messageService.getShareableLink(productId, "admin");
      const customerLink = messageService.getShareableLink(
        productId,
        "customer"
      );

      // Store the links
      setShareableLink(adminLink);

      // Show the share dialog
      setShowShareDialog(true);
    } catch (error) {
      alert("Error creating chat. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to trigger the Payment Received message automatically
  const triggerPaymentReceivedMessage = (product: any) => {
    const chatId = product.id;

    // Then add the payment received message with all necessary details
    const paymentMessage = {
      text: `Payment received: ${product.price}
       
      You can now ship the item to:`,
      sender: "seller" as const,
      isOffer: false,
      isOfferAccepted: true,
      hasButton: true,
      buttonText: "Whatsapp shipping details",
      buttonAction: "track_shipment",
      productInfo: {
        image: product.image,
        title: product.productName,
        price: product.price,
        condition: product.condition, // This is already the second description
        address: product.address,
        street: product.street,
        postalCode: product.postalCode,
        city: product.city,
        country: product.country,
      },
    };

    // Add the payment received message to this specific chat
    const updatedMessages = messageService.addMessage(
      paymentMessage.text,
      paymentMessage.sender,
      paymentMessage.isOffer,
      paymentMessage.isOfferAccepted,
      paymentMessage.hasButton,
      paymentMessage.buttonText,
      paymentMessage.buttonAction,
      chatId
    );

    // Add product info to the last message
    updatedMessages[updatedMessages.length - 1].productInfo =
      paymentMessage.productInfo;

    // Save the updated messages for this specific chat
    messageService.saveMessages(updatedMessages, chatId);

    console.log("Auto-triggered Payment Received message for chat", chatId);
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
              Your chat has been created successfully! Use the link below to
              share it with others.
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
            <Button
              onClick={handleNavigateToChat}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue to Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

          {/* Street */}
          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Street
            </label>
            <input
              type="text"
              id="street"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              placeholder="123 Main St"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Postal Code */}
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              placeholder="10001"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="New York"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="United States"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Second Product Description */}
          <div>
            <label
              htmlFor="secondDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Second Product Description
            </label>
            <input
              type="text"
              id="secondDescription"
              value={formData.secondDescription}
              onChange={(e) =>
                handleInputChange("secondDescription", e.target.value)
              }
              placeholder="Additional product details"
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
