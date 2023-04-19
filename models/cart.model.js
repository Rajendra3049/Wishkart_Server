const mongoose = require("mongoose");
const { productModel } = require("./product.model");

const cartSchema = {
  userId: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: productModel,
  },
  quantity: Number,
};

const cartModel = mongoose.model("cart", cartSchema);

module.exports = { cartModel };
