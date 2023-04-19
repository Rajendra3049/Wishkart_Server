const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { productRoutes } = require("./routes/product.route");
const { adminRoutes } = require("./routes/admin.route");
const { cartRoute } = require("./routes/cart.route");
const { addressRoute } = require("./routes/address.route");
const { orderRoute } = require("./routes/order.route");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "Backend for Wishkart" });
});

app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/user/cart", cartRoute);
app.use("/user/address", addressRoute);
app.use("/user/order", orderRoute);

app.listen(8000, async () => {
  await connection;
  console.log("working fine on port 8000");
});
