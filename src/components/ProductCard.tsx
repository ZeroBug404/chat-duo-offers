interface ProductCardProps {
  brand: string;
  condition: string;
  price: string;
  image: string;
  title?: string;
}

const ProductCard = ({
  brand,
  condition,
  price,
  image,
  title,
}: ProductCardProps) => {
  return (
    <div className="px-4 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img src={image} alt={brand} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{condition}</p>
          <p className="font-bold text-lg text-gray-900">{price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
