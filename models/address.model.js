const mongoose = require("mongoose");
const addressSchema = {
  name: String,
  phone: Number,
  house_no: String,
  road_name: String,
  pincode: Number,
  city: String,
  state: String,
  near_by_location: String,
  userId: String,
};

const addressModel = mongoose.model("address", addressSchema);

module.exports = { addressModel };
