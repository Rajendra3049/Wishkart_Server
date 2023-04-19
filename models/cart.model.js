const mongoose = require("mongoose");
const cartSchema = {
  id: Number,
  category: String,
  title: String,
  original_price: Number,
  discounted_price: Number,
  sizes: Array,
  images: Array,
  details: Object,
  rating: Number,
  seller_id: Number,
  userId: String,
  quantity: Number,
};

const cartModel = mongoose.model("cart", cartSchema);

module.exports = { cartModel };
