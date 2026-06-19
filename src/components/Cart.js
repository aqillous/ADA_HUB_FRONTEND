import { useState, useEffect, useRef } from "react";
import { authFetch } from "../utils/AuthFetch";
import API_BASE_URL from "../config";

export default function Cart({
  cartItems,
  addToCart,
  decreaseCart,
  setCart,
  onClose,
}) {
  const [status, setStatus] = useState("idle");
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef(null);
  const startYRef = useRef(null);
  const currentYRef = useRef(0);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  // Touch handlers for swipe-down-to-close
  const onTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (startYRef.current === null) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta < 0) return; // don't allow swiping up
    currentYRef.current = delta;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const onTouchEnd = () => {
    const delta = currentYRef.current;
    currentYRef.current = 0;
    startYRef.current = null;
    if (sheetRef.current) {
      sheetRef.current.style.transition =
        "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)";
    }
    if (delta > 120) {
      handleClose();
    } else {
      // Snap back
      if (sheetRef.current) {
        sheetRef.current.style.transform = "translateY(0)";
      }
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSubmit = async () => {
    if (cartItems.length === 0) return;
    setStatus("loading");
    const payload = {
      items: cartItems.map((i) => ({ product_id: i.id, quantity: i.quantity })),
    };
    try {
      const res = await authFetch(`${API_BASE_URL}/store/addOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return setStatus("error");
      setStatus("success");
      setCart({});
    } catch {
      setStatus("error");
    }
  };

  // Resolve image from possible field names
  const getImage = (item) => item.image_url || null;

  return (
    <div
      ref={sheetRef}
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col"
      style={{
        maxHeight: "85dvh",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        borderRadius: "20px 20px 0 0",
        background: "white",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.12)",
      }}
    >
      {/* DRAG HANDLE — touch target for swipe */}
      <div
        className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-10 h-1 rounded-full bg-gray-200" />
      </div>

      {/* HEADER — also swipeable */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div>
          <h2 className="font-semibold text-lg text-gray-900">Your cart</h2>
          {cartItems.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {cartItems.reduce((s, i) => s + i.quantity, 0)} item
              {cartItems.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          aria-label="Close cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-600"
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
      </div>

      {/* BODY — scrollable */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
        {status === "loading" && (
          <div className="flex flex-col items-center py-14 gap-4">
            <div className="w-10 h-10 border-[3px] border-gray-200 border-t-black rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Placing your order…</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center py-14 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-semibold text-gray-900">Order placed!</p>
            <p className="text-sm text-gray-400">We'll be in touch soon.</p>
            <button
              onClick={() => {
                setStatus("idle");
                handleClose();
              }}
              className="mt-3 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
            >
              Continue shopping
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center py-14 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <p className="font-semibold text-gray-900">Something went wrong</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-1 text-sm text-gray-500 underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {status === "idle" && cartItems.length === 0 && (
          <div className="flex flex-col items-center py-14 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
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
            </div>
            <p className="font-medium text-gray-700">Your cart is empty</p>
            <p className="text-sm text-gray-400">
              Add some products to get started
            </p>
            <button
              onClick={handleClose}
              className="mt-3 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
            >
              Browse products
            </button>
          </div>
        )}

        {status === "idle" && cartItems.length > 0 && (
          <div className="flex flex-col gap-1">
            {cartItems.map((item) => {
              const img = getImage(item);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    {/* Fallback icon — always in DOM, hidden when image loads */}
                    <div
                      className="w-full h-full items-center justify-center"
                      style={{ display: img ? "none" : "flex" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-7 h-7 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 15l-5-5L5 21"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Info + stepper */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      ${item.price} each
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseCart(item)}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition"
                        aria-label="Decrease quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition"
                        aria-label="Increase quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <p className="font-semibold text-sm text-gray-900 shrink-0">
                    ${item.price * item.quantity}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER */}
      {status === "idle" && cartItems.length > 0 && (
        <div className="shrink-0 px-5 pt-3 pb-6 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-xl font-bold text-gray-900">
              ${totalPrice}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-base hover:opacity-90 active:scale-[0.98] transition"
          >
            Checkout · ${totalPrice}
          </button>
        </div>
      )}
    </div>
  );
}
