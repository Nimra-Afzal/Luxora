import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,

    // Stripe payment reference
    paymentIntentId: {
      type: String,
      default: null,
      index: true,
    },
    // Identifies repeated payment initialization requests
checkoutKey: {
  type: String,
  default: null,
},

    // Payment lifecycle
    paymentStatus: {
      type: String,
      enum: ["unpaid", "processing", "paid", "failed"],
      default: "unpaid",
    },
inventoryDeducted: {
  type: Boolean,
  default: false,
},
    // Overall order status
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);


orderSchema.index(
  { user: 1, checkoutKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      checkoutKey: { $type: "string" },
    },
  }
);




export default mongoose.model("Order", orderSchema);

