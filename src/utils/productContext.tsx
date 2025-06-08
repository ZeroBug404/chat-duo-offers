import React, { createContext, useContext, useState } from "react";

export interface Product {
  id: string;
  productName: string;
  brand: string;
  condition: string;
  price: string;
  image: string; // This will be a URL after upload
  buyerName: string;
  address?: string; // Optional address for buyer
}

interface ProductContextType {
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const ProductContext = createContext<ProductContextType>({
  selectedProduct: null,
  setSelectedProduct: () => {},
});

export const useProduct = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <ProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
