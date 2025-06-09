import { type Message } from "@/utils/messageService";
import { useNavigate } from "react-router-dom";

interface MessageBubbleProps {
  message: Message;
  avatar?: string;
  onButtonClick?: (action: string) => void;
}

const MessageBubble = ({
  message,
  avatar,
  onButtonClick,
}: MessageBubbleProps) => {
  const isOwnMessage = message.sender === "seller";
  const navigate = useNavigate();

  console.log(message);

  const handleButtonClick = (action?: string) => {
    if (!action) return;

    if (onButtonClick) {
      onButtonClick(action);
    } else {
      // Default actions if no handler is provided
      switch (action) {
        case "track_shipment":
        case "view_order_details": {
          // If we have product info, pass it to the order tracking page
          if (message.productInfo) {
            // Create order details from the product info
            const orderDetails = {
              id: Date.now().toString(),
              productName: message.productInfo.title,
              brandName: message.productInfo.condition,
              price: message.productInfo.price,
              image: message.productInfo.image,
              condition: message.productInfo.condition,
              address: message.productInfo.address,
              street: message.productInfo.street,
              postalCode: message.productInfo.postalCode,
              city: message.productInfo.city,
              country: message.productInfo.country,
              refNumber: Math.floor(Math.random() * 90000000) + 10000000 + "",
            };

            // Store in localStorage as backup
            localStorage.setItem(
              "current_order_details",
              JSON.stringify(orderDetails)
            );

            // Navigate with state
            navigate("/order-tracking", { state: { orderDetails } });
          } else {
            navigate("/order-tracking");
          }
          break;
        }
        case "view_offer":
          navigate("/offers");
          break;
        default:
          console.log("Unhandled button action:", action);
      }
    }
  };

  console.log("MessageBubble rendered with message:", message);

  // Function to render text with line breaks
  const renderTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  if (message.isOfferAccepted) {
    return (
      <div className="flex flex-col items-center">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-sm font-medium my-2 whitespace-pre-line">
          {message.text}
          <p>
            <span className="text-black">Street:</span>{" "}
            {message.productInfo.street}
          </p>
          <p>
            <span className="text-black">Postal Code:</span>{" "}
            {message.productInfo.postalCode}
          </p>
          <p>
            <span className="text-black">City:</span> {message.productInfo.city}
          </p>
          <p>
            <span className="text-black">Country:</span>{" "}
            {message.productInfo.country}
          </p>

          <br />
          {message.hasButton && message.buttonText && (
            <div className="mt-2">
              <button
                // onClick={() => handleButtonClick(message.buttonAction)}
                className="bg-green-500 text-white px-4 py-1 rounded-md text-xs font-medium hover:bg-green-600 transition-colors"
              >
                {message.buttonText}
              </button>
            </div>
          )}
        </div>

        {/* Product info box - Show only for payment received messages */}
        {message.text.includes("Payment received") && (
          <div className="bg-white p-3 mt-3 w-full max-w-xs shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={message.productInfo?.image || "/uploads/chanel.png"}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {message.productInfo?.title || "Product"}
                </h4>

                <p className="text-sm text-gray-500 mb-1">
                  Sold at: {message.productInfo?.price}
                </p>

                <p className="text-sm text-gray-500 mb-1">
                  {message.productInfo?.condition || "No description"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                // Pass the message product info to order tracking
                if (message.productInfo) {
                  const orderDetails = {
                    id: Date.now().toString(),
                    productName: message.productInfo.title,
                    brandName: message.productInfo?.condition,
                    price: message.productInfo.price,
                    image: message.productInfo.image,
                    condition: message.productInfo.condition,
                    address: message.productInfo.address,
                    street: message.productInfo.street,
                    postalCode: message.productInfo.postalCode,
                    city: message.productInfo.city,
                    country: message.productInfo.country,
                    refNumber:
                      Math.floor(Math.random() * 90000000) + 10000000 + "",
                  };

                  // Store in localStorage and navigate
                  localStorage.setItem(
                    "current_order_details",
                    JSON.stringify(orderDetails)
                  );
                  navigate("/order-tracking", { state: { orderDetails } });
                } else {
                  handleButtonClick("view_order_details");
                }
              }}
              className="bg-black text-white text-xs px-3 py-3 rounded-md transition-colors w-full mt-2"
            >
              Order Information
            </button>
          </div>
        )}
      </div>
    );
  }

  if (message.isOffer) {
    return (
      <div className="flex justify-start">
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl text-sm font-medium max-w-xs whitespace-pre-line">
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
              src={avatar || "/lovable-uploads/customer.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? "bg-white text-black rounded-br-md border"
              : "bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-md"
          }`}
        >
          <p className="text-sm whitespace-pre-line">{message.text}</p>
          {message.hasButton && message.buttonText && (
            <div className="mt-2">
              <button
                onClick={() => handleButtonClick(message.buttonAction)}
                className={`${
                  isOwnMessage ? "bg-blue-500" : "bg-green-500"
                } text-white px-4 py-1 rounded-md text-xs font-medium hover:opacity-90 transition-colors`}
              >
                {message.buttonText}
              </button>
            </div>
          )}
          {/* <p
            className={`text-xs mt-1 ${
              isOwnMessage ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {message.timestamp}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
