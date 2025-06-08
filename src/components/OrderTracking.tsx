import { ChevronLeft, HelpCircle, Check } from "lucide-react";
import { Link } from "react-router-dom";

const OrderTracking = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-gray-500">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="text-center text-lg font-medium">Ref #34798248</div>
        <div className="w-6"></div> {/* Empty div for spacing */}
      </div>

      {/* Product Info */}
      <div className="px-6 py-2">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-md">
            <img
              src="/placeholder.svg?height=80&width=80"
              alt="LOEWE Puzzle leather bag"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-xl">LOEWE</h2>
            <p className="text-lg">Puzzle leather bag</p>
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
        <p className="text-xl font-medium mt-1">July 25, 2023</p>
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 flex-1 mt-4 px-6 py-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-green-500"></div>

          {/* Sale confirmed */}
          <div className="flex gap-4 mb-12 relative">
            <div className="w-4 h-4 rounded-full bg-green-500 z-10 mt-1.5"></div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Sale confirmed
              </h3>
              <p className="text-gray-500">On July 14, 2023</p>
            </div>
          </div>

          {/* Item shipped */}
          <div className="flex gap-4 mb-12 relative">
            <div className="w-4 h-4 rounded-full bg-green-500 z-10 mt-1.5"></div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Item shipped
              </h3>
              <p className="text-gray-500">On July 17, 2023</p>
            </div>
          </div>

          {/* Item delivered */}
          <div className="flex gap-4 mb-12 relative">
            <div className="w-4 h-4 rounded-full bg-green-500 z-10 mt-1.5"></div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Item delivered
              </h3>
              <p className="text-gray-500">
                Tracking:{" "}
                <span className="text-gray-700">1Z8A566E9141004708</span>
              </p>
              <p className="text-gray-500">On July 20, 2023</p>
            </div>
          </div>

          {/* Sale complete */}
          <div className="flex gap-4 mb-12 relative">
            <div className="w-4 h-4 rounded-full bg-green-500 z-10 mt-1.5"></div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Sale complete
              </h3>
              <p className="text-gray-500">On July 23, 2023</p>
            </div>
          </div>

          {/* Payment scheduled */}
          <div className="flex gap-4 relative">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center z-10">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Payment scheduled
              </h3>
              <p className="text-gray-700">
                The amount will be visible on your account within 2 working
                days.
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
