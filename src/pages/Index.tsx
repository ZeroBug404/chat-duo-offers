import { Button } from "@/components/ui/button";
import { useProduct } from "@/utils/productContext";
import {
  Crown,
  MessageCircle,
  PlusCircle,
  ShoppingBag,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { selectedProduct } = useProduct();
  const [showProductWarning, setShowProductWarning] = useState(false);

  const handleRoleSelect = (path: string) => {
    if (!selectedProduct) {
      setShowProductWarning(true);
    } else {
      navigate(path);
    }
  };

  // Reset warning when product is selected
  useEffect(() => {
    if (selectedProduct) {
      setShowProductWarning(false);
    }
  }, [selectedProduct]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Luxury Marketplace
        </h1>
        <p className="text-gray-600 mb-4">Select your role to continue</p>

        {selectedProduct ? (
          <div className="mb-6 bg-green-50 p-4 rounded-xl border border-green-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.brand}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">
                  {selectedProduct.brand}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedProduct.condition}
                </p>
                <p className="font-bold text-gray-900">
                  {selectedProduct.price}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full text-sm"
              onClick={() => navigate("/add-product")}
            >
              Change Product
            </Button>
          </div>
        ) : (
          <div className="mb-6">
            <Link to="/add-product">
              <Button className="w-full h-14 bg-green-600 text-white hover:bg-green-700 mb-2 text-lg font-medium rounded-xl">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add a Product First
              </Button>
            </Link>
            {showProductWarning && (
              <p className="text-amber-600 text-sm">
                Please add a product before continuing
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <Button
            className="w-full h-14 bg-black text-white hover:bg-gray-800 text-lg font-medium rounded-xl"
            onClick={() => handleRoleSelect("/person-a")}
          >
            <Crown className="w-5 h-5 mr-2" />
            Person A (Admin/Seller)
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-lg font-medium rounded-xl"
            onClick={() => handleRoleSelect("/person-b")}
          >
            <UserCircle className="w-5 h-5 mr-2" />
            Person B (Buyer)
          </Button>

          <div className="pt-4 border-t border-gray-100 space-y-2">
            <Link to="/add-product">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center text-gray-500 hover:text-gray-800"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Manage Products
              </Button>
            </Link>

            <Link to="/chat-manager">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center text-blue-500 hover:text-blue-800"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat Manager
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
