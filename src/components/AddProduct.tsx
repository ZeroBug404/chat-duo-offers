import { useProduct } from "@/utils/productContext";
import { AlertCircle, Check, ChevronLeft, Upload } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
  productName: string;
  productPrice: string;
  buyerName: string;
  productPhoto: File | null;
  productCondition: string;
  brand: string;
}

interface FormErrors {
  productName?: string;
  productPrice?: string;
  buyerName?: string;
  productPhoto?: string;
  productCondition?: string;
  brand?: string;
}
const AddProduct = () => {
  const navigate = useNavigate();
  const { setSelectedProduct } = useProduct();
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    productPrice: "",
    buyerName: "",
    productPhoto: null,
    productCondition: "Good Condition",
    brand: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand name is required";
    }

    if (!formData.productPrice.trim()) {
      newErrors.productPrice = "Product price is required";
    } else if (
      isNaN(Number(formData.productPrice)) ||
      Number(formData.productPrice) <= 0
    ) {
      newErrors.productPrice = "Please enter a valid price";
    }

    if (!formData.buyerName.trim()) {
      newErrors.buyerName = "Buyer name is required";
    }

    if (!formData.productPhoto) {
      newErrors.productPhoto = "Product photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, productPhoto: file }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Clear error
      if (errors.productPhoto) {
        setErrors((prev) => ({ ...prev, productPhoto: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save product to context
      setSelectedProduct({
        id: Date.now().toString(),
        productName: formData.productName,
        brand: formData.brand,
        condition: formData.productCondition,
        price: `${formData.productPrice}€`,
        image: previewUrl || "/uploads/placeholder.svg",
        buyerName: formData.buyerName,
      });

      setSubmitStatus("success");

      // Reset form on success (after a delay to show success message)
      setTimeout(() => {
        navigate("/"); // Redirect back to index page after adding product
      }, 1500);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-gray-500">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="text-center text-lg font-medium">Add Product</div>
        <div className="w-6"></div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Form */}
      <div className="flex-1 px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Name */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Brand Name
            </label>
            <input
              type="text"
              id="brand"
              value={formData.brand}
              onChange={(e) => handleInputChange("brand", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.brand ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter brand name (e.g., Dior, Chanel)"
            />
            {errors.brand && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.brand}
              </p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              value={formData.productName}
              onChange={(e) => handleInputChange("productName", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.productName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.productName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.productName}
              </p>
            )}
          </div>

          {/* Product Price */}
          <div>
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                €
              </span>
              <input
                type="number"
                id="productPrice"
                value={formData.productPrice}
                onChange={(e) =>
                  handleInputChange("productPrice", e.target.value)
                }
                className={`w-full pl-8 pr-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.productPrice ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {errors.productPrice && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.productPrice}
              </p>
            )}
          </div>

          {/* Product Condition */}
          <div>
            <label
              htmlFor="productCondition"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Condition
            </label>
            <select
              id="productCondition"
              value={formData.productCondition}
              onChange={(e) =>
                handleInputChange("productCondition", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="New with tags">New with tags</option>
              <option value="Very Good Condition">Very Good Condition</option>
              <option value="Good Condition">Good Condition</option>
              <option value="Fair Condition">Fair Condition</option>
            </select>
          </div>

          {/* Buyer Name */}
          <div>
            <label
              htmlFor="buyerName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Buyer Name
            </label>
            <input
              type="text"
              id="buyerName"
              value={formData.buyerName}
              onChange={(e) => handleInputChange("buyerName", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.buyerName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter buyer name"
            />
            {errors.buyerName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.buyerName}
              </p>
            )}
          </div>

          {/* Product Photo */}
          <div>
            <label
              htmlFor="productPhoto"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Photo
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.productPhoto ? "border-red-500" : "border-gray-300"
              }`}
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative h-32 w-32 mx-auto">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Product preview"
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("productPhoto")?.click()
                    }
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("productPhoto")?.click()
                      }
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Upload a photo
                    </button>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                id="productPhoto"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {errors.productPhoto && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.productPhoto}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-medium text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">
                Product Added Successfully!
              </h3>
              <p className="text-sm text-green-600">
                Your product has been added to the system.
              </p>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-red-800">Error Adding Product</h3>
              <p className="text-sm text-red-600">
                Please try again or contact support if the problem persists.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-center p-2">
        <div className="w-1/3 h-1.5 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default AddProduct;
