const mongoose = require("mongoose");
const productSchema = {
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
};

const productModel = mongoose.model("product", productSchema);

module.exports = { productModel };
