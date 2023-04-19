const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.mongoUrl;
const connection = mongoose.connect(mongoUrl);

module.exports = { connection };
