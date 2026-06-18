import AddForm from "../components/AddForm";
import { authFetch } from "../utils/AuthFetch";
import API_BASE_URL from "../config";

export default function StoreAddProductPage() {
  const fields = [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "Enter product name",
      required: true,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter price",
      required: true,
    },
    {
      name: "image",
      label: "Product Image",
      type: "file",
      required: true,
    },
  ];

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("image", values.image);

    const res = await authFetch(`${API_BASE_URL}/admin/store/product/add`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.detail || "Error adding product");

    return { message: `Product added! ID: ${data.product.id}` };
  };

  return (
    <AddForm
      fields={fields}
      onSubmit={handleSubmit}
      backLink="/admin/store/products"
      title="Add Product"
    />
  );
}
