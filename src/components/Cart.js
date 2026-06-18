import { useState } from "react";
import { authFetch } from "../utils/AuthFetch";

export default function Cart({ cartItems, addToCart, decreaseCart, setCart }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    const payload = {
      items: cartItems.map((i) => ({ product_id: i.id, quantity: i.quantity })),
    };
    try {
      const res = await authFetch("http://localhost:8000/store/addOrder", {
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

  return (
    <div className="fixed right-5 top-32 w-[350px] max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-xl p-5 transition-all duration-300">
      <h2 className="font-bold text-xl mb-4">Your Cart</h2>

      {status === "loading" && (
        <div className="flex flex-col items-center py-10">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Placing your order...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl">
            ✓
          </div>
          <p className="mt-4 font-semibold">Order placed successfully</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-5 px-5 py-2 bg-black text-white rounded-lg"
          >
            Continue shopping
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center py-10 text-center">
          <p className="text-red-500 font-medium">Something went wrong</p>
          <button onClick={() => setStatus("idle")} className="mt-3 underline">
            Try again
          </button>
        </div>
      )}

      {status === "idle" && (
        <>
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center">Cart is empty</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="mb-4 border-b pb-3">
                  <div className="flex justify-between font-medium">
                    <span>{item.name}</span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => decreaseCart(item)}
                      className="w-8 h-8 border rounded-md hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <button
                onClick={handleSubmit}
                className="mt-4 w-full bg-black text-white py-3 rounded-xl hover:opacity-90 active:scale-95 transition"
              >
                Checkout
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
