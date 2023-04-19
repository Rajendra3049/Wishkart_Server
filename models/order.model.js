const mongoose = require("mongoose");
const orderSchema = {
  user: Object,
  products: Array,
  address: Object,
  amount: Number,
  transactionID: String,
  date: String,
  userId: String,
};

const orderModel = mongoose.model("orders", orderSchema);

module.exports = { orderModel };
