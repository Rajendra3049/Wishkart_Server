const express = require("express");
const { orderModel } = require("../models/order.model");
const { cartModel } = require("../models/cart.model");

const orderRoute = express.Router();

orderRoute.get("/", async (req, res) => {
  const userId = req.headers.user_id;
  try {
    let orderData = await orderModel.find({
      userId: userId,
    });
    res.status(200).send(orderData);
  } catch (error) {
    res.status(500).send({ msg: "Error in getting order data", error: error });
  }
});

orderRoute.post("/", async (req, res) => {
  const userId = req.headers.user_id;
  const { user, address, amount } = req.body;
  console.log(userId, user, address, amount);
  try {
    if (userId) {
      let cartData = await cartModel.find({
        userId: userId,
      });

      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const idLength = 10;
      let transactionId = "";
      for (let i = 0; i < idLength; i++) {
        const randomDigit = Math.floor(Math.random() * 10);
        transactionId += randomDigit.toString();
      }

      let orderData = {
        user,
        products: cartData,
        address,
        amount,
        transactionID: transactionId,
        date: day + "/" + month + "/" + year,
        userId: req.headers.user_id,
      };

      await orderModel.insertMany(orderData);
      await cartModel.deleteMany({ userId });
      res.status(200).send({
        status: true,
        msg: "Order Placed successfully",
        transactionID: transactionId,
      });
    } else {
      res
        .status(401)
        .send({ status: false, msg: "You are not authorized, Please login" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in placing order", error: error });
  }
});

module.exports = { orderRoute };
