import AdminListPage from "../components/AdminListPage";
import API_BASE_URL from "../config";

export default function StoreProductsPage() {
  return (
    <AdminListPage
      fetchUrl={`${API_BASE_URL}/store/products`}
      deleteUrl={`${API_BASE_URL}/admin/store/product`}
      editUrl={`${API_BASE_URL}/admin/store/product`}
      addLink="/admin/store/products/add"
      editFields={[
        { name: "name", type: "text", label: "Product Name" },
        { name: "price", type: "number", label: "Price" },
        { name: "image", type: "file", label: "Image" },
      ]}
      showImageColumn={true} // <-- enable the custom first column for products
      renderItem={(product) => (
        <div className="flex items-center gap-4">
          {/* Product Image */}
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-20 h-20 object-cover rounded border"
            />
          )}

          {/* Product Name & Price */}
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-gray-900">
              {product.name || "Unnamed Product"}
            </span>
            <span className="text-gray-500">${product.price}</span>
          </div>
        </div>
      )}
    />
  );
}
