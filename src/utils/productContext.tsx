import React, { createContext, useContext, useEffect, useState } from "react";

export interface Product {
  id: string;
  productName: string;
  brand: string;
  condition: string;
  price: string;
  image: string; // This will be a URL after upload
  buyerName: string;
  address?: string; // Legacy field for full address
  street?: string; // New field for street
  postalCode?: string; // New field for postal code
  city?: string; // New field for city
  country?: string; // New field for country
}

interface ProductContextType {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  allProducts: Product[];
  addProduct: (product: Product) => void;
  getProductById: (id: string) => Product | null;
  deleteProduct: (id: string) => void;
}

const SELECTED_PRODUCT_KEY = "selected_product";
const ALL_PRODUCTS_KEY = "all_products";

const ProductContext = createContext<ProductContextType>({
  selectedProduct: null,
  setSelectedProduct: () => {},
  allProducts: [],
  addProduct: () => {},
  getProductById: () => null,
  deleteProduct: () => {},
});

export const useProduct = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Load the selected product from localStorage
  const loadSelectedProduct = (): Product | null => {
    try {
      const stored = localStorage.getItem(SELECTED_PRODUCT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  // Load all products from localStorage
  const loadAllProducts = (): Product[] => {
    try {
      const stored = localStorage.getItem(ALL_PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const [selectedProduct, setSelectedProductState] = useState<Product | null>(
    loadSelectedProduct()
  );
  const [allProducts, setAllProducts] = useState<Product[]>(loadAllProducts());

  // Set the selected product and save it to localStorage
  const setSelectedProduct = (product: Product | null) => {
    setSelectedProductState(product);
    if (product) {
      localStorage.setItem(SELECTED_PRODUCT_KEY, JSON.stringify(product));
    } else {
      localStorage.removeItem(SELECTED_PRODUCT_KEY);
    }
  };

  // Add a product to the list and save it to localStorage
  const addProduct = (product: Product) => {
    setAllProducts((prev) => {
      // Check if the product already exists, update it if it does
      const exists = prev.findIndex((p) => p.id === product.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = product;
        localStorage.setItem(ALL_PRODUCTS_KEY, JSON.stringify(updated));
        return updated;
      } else {
        const updated = [...prev, product];
        localStorage.setItem(ALL_PRODUCTS_KEY, JSON.stringify(updated));
        return updated;
      }
    });
  };

  // Get a product by its ID
  const getProductById = (id: string): Product | null => {
    return allProducts.find((product) => product.id === id) || null;
  };

  // Delete a product by its ID
  const deleteProduct = (id: string) => {
    setAllProducts((prev) => {
      const updated = prev.filter((product) => product.id !== id);
      localStorage.setItem(ALL_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });

    // If the selected product is being deleted, clear it
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
  };

  // When a product is selected, also add it to the list of all products
  useEffect(() => {
    if (selectedProduct) {
      addProduct(selectedProduct);
    }
  }, [selectedProduct]);

  return (
    <ProductContext.Provider
      value={{
        selectedProduct,
        setSelectedProduct,
        allProducts,
        addProduct,
        getProductById,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
