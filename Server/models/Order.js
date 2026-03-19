import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
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
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMethod: {
      type: String,
      default: "card",
    },
    paymentProvider: {
      type: String,
      default: "mock",
    },
    billingDetails: {
      type: Object,
      default: {},
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    summary: {
      originalTotal: { type: Number, default: 0 },
      subtotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
