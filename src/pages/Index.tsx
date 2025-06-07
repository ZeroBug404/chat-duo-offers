
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, Crown } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Luxury Marketplace</h1>
        <p className="text-gray-600 mb-8">Select your role to continue</p>
        
        <div className="space-y-4">
          <Link to="/person-a" className="block">
            <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 text-lg font-medium rounded-xl">
              <Crown className="w-5 h-5 mr-2" />
              Person A (Admin/Seller)
            </Button>
          </Link>
          
          <Link to="/person-b" className="block">
            <Button variant="outline" className="w-full h-14 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-lg font-medium rounded-xl">
              <UserCircle className="w-5 h-5 mr-2" />
              Person B (Buyer)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
