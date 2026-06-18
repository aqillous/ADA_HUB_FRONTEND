import { useState, useEffect } from "react";
import PageContainer from "./layouts/PageContainer";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import API_BASE_URL from "./config";

export default function ADAStorePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);

  // Fetch products
  useEffect(() => {
    fetch(`${API_BASE_URL}/store/products`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const addToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  const decreaseCart = (product) => {
    setCart((prev) => {
      const current = prev[product.id];
      if (!current || current.quantity <= 1) {
        const newCart = { ...prev };
        delete newCart[product.id];
        return newCart;
      }
      return {
        ...prev,
        [product.id]: { ...current, quantity: current.quantity - 1 },
      };
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const cartItems = Object.values(cart);

  return (
    <PageContainer>
      {/* SEARCH & CART BUTTON */}
      <div className="w-full flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 h-[50px] rounded-xl px-5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
        />

        <button
          className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:opacity-90 transition shadow-md"
          onClick={() => setShowCart(!showCart)}
        >
          Cart ({cartItems.length})
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-10">
            No products found
          </p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id]?.quantity || 0}
              addToCart={() => addToCart(product)}
              decreaseCart={() => decreaseCart(product)}
            />
          ))
        )}
      </div>

      {/* CART */}
      {showCart && (
        <Cart
          cartItems={cartItems}
          addToCart={addToCart}
          decreaseCart={decreaseCart}
          setCart={setCart}
        />
      )}
    </PageContainer>
  );
}
