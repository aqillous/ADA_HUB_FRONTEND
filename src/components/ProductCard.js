export default function ProductCard({
  product,
  quantity,
  addToCart,
  decreaseCart,
}) {
  return (
    <div className="bg-white rounded-[14px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 overflow-hidden border border-[#f0f0f0] group">
      {/* IMAGE */}
      <div className="overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-[220px] object-cover group-hover:scale-102 transition-transform duration-300"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col justify-between h-[160px]">
        {/* NAME */}
        <div className="font-bold text-gray-800 text-base line-clamp-2">
          {product.name}
        </div>

        {/* PRICE */}
        <div className="mt-1 text-gray-900 font-thin text-lg">
          ${product.price}
        </div>

        {/* ACTION AREA */}
        <div className="mt-3 h-10 flex items-center">
          {quantity === 0 ? (
            <button
              onClick={addToCart}
              className="w-full bg-gray-800 text-white py-2 rounded-md font-medium hover:bg-gray-700 transition"
            >
              Add to cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-2 w-full">
              <button
                onClick={decreaseCart}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition"
              >
                −
              </button>
              <span className="font-semibold text-gray-900">{quantity}</span>
              <button
                onClick={addToCart}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
