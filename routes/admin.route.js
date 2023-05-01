const express = require("express");
const { adminModel } = require("../models/admin.model");
const { orderModel } = require("../models/order.model");
const { productModel } = require("../models/product.model");
const jwt = require("jsonwebtoken");

const adminRoutes = express.Router();
adminRoutes.get("/", async (req, res) => {
  try {
    let adminFound = await adminModel.find();
    console.log(adminFound);
    res.status(200).send({ admin: adminFound });
  } catch (error) {
    res.status(500).send({ msg: "Error in getting admin" });
  }
});

adminRoutes.get("/dashboard", async (req, res) => {
  try {
    let productsLength = 0;
    let ordersLength = 0;
    let category = [];

    await productModel
      .countDocuments({})
      .then((productCount) => {
        productsLength = productCount;
      })
      .catch((err) => {
        console.log(err);
      });

    await productModel
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ])
      .then((results) => {
        category = results;
      })
      .catch((err) => {
        console.log(err);
      });

    await orderModel
      .countDocuments({})
      .then((orderCount) => {
        ordersLength = orderCount;
      })
      .catch((err) => {
        console.log(err);
      });
    res
      .status(200)
      .send({
        products: productsLength,
        Orders: ordersLength,
        category: category,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error in getting admin", error: error });
  }
});

adminRoutes.get("/orders", async (req, res) => {
  try {
    let orders = await orderModel.find();

    res.status(200).send({ orders: orders });
  } catch (error) {
    res.status(500).send({ msg: "Error in getting orders" });
  }
});

adminRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let adminFound = await adminModel.find({ email, password });

    if (adminFound.length == 1) {
      let token = jwt.sign({ foo: "bar" }, "wishkart");
      res.status(200).send({ admin: adminFound, token: token });
    } else {
      res.status(400).send({ msg: "Wrong Credentials" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in admin login" });
  }
});

module.exports = { adminRoutes };
