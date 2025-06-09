import { Check, ChevronLeft, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface OrderDetails {
  id: string;
  productName: string;
  brandName: string;
  price: string;
  image: string;
  condition: string;
  address: string; // Full address (legacy)
  street?: string; // Street address
  postalCode?: string; // Postal code
  city?: string; // City
  country?: string; // Country
  refNumber?: string;
}

const OrderTracking = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Get order details from location state
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
    } else {
      // Try to get from localStorage as fallback
      const storedOrder = localStorage.getItem("current_order_details");
      if (storedOrder) {
        try {
          setOrderDetails(JSON.parse(storedOrder));
        } catch (err) {
          console.error("Error parsing stored order details", err);
        }
      }
    }
  }, [location]);

  console.log("Order details:", orderDetails);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        {/* <Link to="/" className="text-gray-500"> */}
        <ChevronLeft className="h-6 w-6 text-[#c78568]" />
        {/* </Link> */}
        <div className="text-center text-lg font-medium">
          Ref #
          {orderDetails?.refNumber ||
            Math.floor(Math.random() * 90000000) + 10000000}
        </div>
        <div className="w-6"></div> {/* Empty div for spacing */}
      </div>

      {/* Product Info */}
      <div className="px-6 py-2">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-md">
            <img
              src={orderDetails?.image || "/placeholder.svg?height=80&width=80"}
              alt={orderDetails?.productName || "Product"}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-xl">{orderDetails?.productName}</h2>
            <p className="text-lg">{orderDetails?.brandName}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs">🤝</span>
              </div>
              <span className="text-gray-700">Direct Shipping</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      {/* Estimated Payment */}
      <div className="px-6 py-2">
        <p className="text-gray-500 uppercase text-sm">ESTIMATED PAYMENT</p>
        <p className="text-xl font-medium mt-1">
          {/* {orderDetails?.price} */} Next Week
        </p>
        {/* <p className="text-sm text-gray-500">
          {orderDetails?.id
            ? // Use a date 5 days in the future from now
              new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
        </p> */}
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 flex-1 mt-4 px-6 py-4">
        <div className="relative">
          {/* Gray timeline line for entire height */}
          <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-500"></div>
          {/* Green timeline line up to Item shipped (first two items plus spacing) */}
          <div
            className="absolute left-2 top-2 w-0.5 bg-green-500"
            style={{
              height: "calc(12rem * 0.6)" /* Height for 2 completed items */,
            }}
          ></div>

          {/* Sale confirmed */}
          <div className="flex gap-4 mb-12 relative">
            <div className="w-4 h-4 rounded-full bg-green-500 z-10 mt-1.5"></div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Sale confirmed
              </h3>
              <div className="text-gray-500">
                Sent the package to:
                {orderDetails?.street ? (
                  <div className="text-gray-700">
                    <p>{orderDetails.street}</p>
                    <p>
                      {orderDetails.postalCode}, {orderDetails.city}
                    </p>
                    <p>{orderDetails.country}</p>
                  </div>
                ) : (
                  <span className="text-gray-700 ml-1">
                    {orderDetails?.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Item shipped */}
          <div className="flex gap-4 mb-12 relative">
            <div className="w-4 h-4 rounded-full bg-blue-500 z-10 mt-1.5"></div>
            <div>
              <p className="text-[12px] text-blue-500">IN PROGRESS</p>
              <h3 className="text-lg font-medium text-gray-700">
                Item shipped
              </h3>
              {/* <p className="text-gray-500">
                {orderDetails?.id
                  ? // Use a date based on the order ID (which is a timestamp)
                    new Date(
                      parseInt(orderDetails.id) - 1 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : // Fallback to static date
                    new Date(
                      Date.now() - 6 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
              </p> */}
            </div>
          </div>

          {/* Item delivered */}
          <div className="flex gap-4 mb-12 relative">
            <div className="w-4 h-4 rounded-full bg-gray-500 z-10 mt-1.5"></div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Item delivered
              </h3>
              {/* <p className="text-gray-500">
                Tracking:{" "}
                <span className="text-gray-700">
                  {orderDetails?.refNumber || "1Z8A566E9141004708"}
                </span>
              </p> */}
              <div className="text-gray-500">
                Address:{" "}
                {orderDetails?.street ? (
                  <div className="text-gray-700">
                    <p>{orderDetails.street}</p>
                    <p>
                      {orderDetails.postalCode}, {orderDetails.city}
                    </p>
                    <p>{orderDetails.country}</p>
                  </div>
                ) : (
                  <span className="text-gray-700 ml-1">
                    {orderDetails?.address || "123 Main St, City"}
                  </span>
                )}
              </div>
              {/* <p className="text-gray-500">
                {orderDetails?.id
                  ? // Just a couple days after today
                    new Date(
                      Date.now() + 2 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : new Date(
                      Date.now() - 3 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
              </p> */}
            </div>
          </div>

          {/* Sale complete */}
          <div className="flex gap-4 mb-12 relative">
            <div className="w-4 h-4 rounded-full bg-gray-500 z-10 mt-1.5"></div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Sale complete
              </h3>
              {/* <p className="text-gray-500">
                {orderDetails?.id
                  ? // Future date for sale complete
                    new Date(
                      Date.now() + 4 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : new Date(
                      Date.now() - 1 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
              </p> */}
            </div>
          </div>

          {/* Payment scheduled */}
          <div className="flex gap-4 relative">
            <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center z-10">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Payment scheduled
              </h3>
              <p className="text-gray-700">
                {orderDetails?.price
                  ? `${orderDetails.price} will be visible on your account within 2 working days.`
                  : "The amount will be visible on your account within 2 working days."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Center Button */}
      <div className="p-6">
        <button className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 text-gray-700">
          <HelpCircle className="h-5 w-5" />
          <span className="font-medium">Help Center</span>
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-center p-2">
        <div className="w-1/3 h-1.5 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default OrderTracking;
