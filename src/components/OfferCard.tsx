
import { Button } from "@/components/ui/button";

interface OfferCardProps {
  amount: string;
  expiresIn: string;
  onAccept: () => void;
}

const OfferCard = ({ amount, expiresIn, onAccept }: OfferCardProps) => {
  console.log(amount);
  
  return (
    <div className="px-4 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Offer accepted: <span className="font-semibold">{amount}</span></p>
          <p className="text-xs text-gray-500">EXPIRES IN {expiresIn}</p>
        </div>
        <Button 
          onClick={onAccept}
          className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-lg"
        >
          Add to bag
        </Button>
      </div>
    </div>
  );
};

export default OfferCard;
