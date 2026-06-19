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
  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <PageContainer>
      {/* STICKY HEADER — search + cart icon */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 -mx-4 px-4 py-3 mb-6 flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 rounded-xl pl-9 pr-9 text-sm border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Cart button with badge */}
        <button
          onClick={() => setShowCart(true)}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 active:scale-95 transition shrink-0"
          aria-label={`Open cart, ${totalCartCount} item${totalCartCount !== 1 ? "s" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
            />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 10a4 4 0 01-8 0"
            />
          </svg>
          {totalCartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-black text-white text-[11px] font-semibold flex items-center justify-center leading-none">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-16 text-sm">
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

      {/* CART DRAWER + BACKDROP */}
      {showCart && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            style={{ backdropFilter: "blur(2px)" }}
            onClick={() => setShowCart(false)}
            aria-hidden="true"
          />
          <Cart
            cartItems={cartItems}
            addToCart={addToCart}
            decreaseCart={decreaseCart}
            setCart={setCart}
            onClose={() => setShowCart(false)}
          />
        </>
      )}
    </PageContainer>
  );
}
