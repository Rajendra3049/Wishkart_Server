const mongoose = require("mongoose");
const adminSchema = {
  email: String,
  password: String,
};

const adminModel = mongoose.model("admin", adminSchema);

module.exports = { adminModel };
