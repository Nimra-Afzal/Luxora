"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart, updateQuantity } from "@/redux/features/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border-b pb-6"
          >
            <div className="flex gap-4 items-center">
              <img
                src={item.image}
                className="w-24 h-32 object-cover"
              />
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <button
                  onClick={() =>
                    dispatch(removeFromCart(item.productId))
                  }
                  className="text-sm text-gray-500 mt-2"
                >
                  🗑 Remove
                </button>
              </div>
            </div>

            <div>Rs. {item.price.toLocaleString()}</div>

            {/* Quantity */}
            <div className="flex items-center border rounded">
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      productId: item.productId,
                      quantity: item.quantity - 1,
                    })
                  )
                }
                className="px-3"
              >
                −
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      productId: item.productId,
                      quantity: item.quantity + 1,
                    })
                  )
                }
                className="px-3"
              >
                +
              </button>
            </div>

            <div className="font-medium">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 text-right">
        <h2 className="text-xl font-semibold">
          SUBTOTAL: Rs. {subtotal.toLocaleString()}
        </h2>

        <button className="mt-4 px-6 py-3 bg-black text-white rounded">
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
}
