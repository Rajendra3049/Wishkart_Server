const express = require("express");
const { cartModel } = require("../models/cart.model");

const cartRoute = express.Router();

cartRoute.get("/", async (req, res) => {
  const userId = req.headers.user_id;
  const productId = req.params.id;
  try {
    let cartData = await cartModel.find({ userId }).populate("productId");
    res.status(200).send(cartData);
  } catch (error) {
    res.status(500).send({ msg: "Error in getting cart data", error: error });
  }
});

cartRoute.post("/:id", async (req, res) => {
  const userId = req.headers.user_id;
  const productId = req.params.id;

  try {
    let alreadyExist = await cartModel.find({ productId, userId });

    if (alreadyExist.length !== 0) {
      let newQuantity = alreadyExist[0].quantity + 1;

      await cartModel.findByIdAndUpdate((_id = alreadyExist[0]._id), {
        quantity: newQuantity,
      });
      res.send({ status: true, msg: "Quantity Increase" });
    } else {
      if (userId) {
        let data = { userId, quantity: 1, productId };
        await cartModel.insertMany(data);
        res.status(200).send({
          msg: "Product added into cart successfully",
        });
      } else {
        res
          .status(401)
          .send({ status: false, msg: "You are not authorized, Please login" });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in adding into cart", error: error });
  }
});

cartRoute.patch("/increase/:id", async (req, res) => {
  const userId = req.headers.user_id;
  const cartProductId = req.params.id;

  try {
    let product = await cartModel.findOne({ _id: cartProductId, userId });
    console.log(product);
    if (product.length !== 0) {
      let newQuantity = product.quantity + 1;
      await cartModel.findByIdAndUpdate((_id = product._id), {
        quantity: newQuantity,
      });
      res.status(200).send({ status: true, msg: "Quantity Increase" });
    } else {
      res.status(404).send({ msg: "Not Found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in increasing quantity", error: error });
  }
});

cartRoute.patch("/decrease/:id", async (req, res) => {
  const userId = req.headers.user_id;
  const cartProductId = req.params.id;
  try {
    let product = await cartModel.findOne({ _id: cartProductId, userId });
    if (product.quantity > 1) {
      let newQuantity = product.quantity - 1;
      await cartModel.findByIdAndUpdate((_id = product._id), {
        quantity: newQuantity,
      });
      res.status(200).send({ status: true, msg: "Quantity Decrease" });
    } else {
      await cartModel.findByIdAndRemove({ _id: cartProductId, userId });
      res.status(200).send({ status: true, msg: "Product Deleted from Cart" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in decreasing quantity", error: error });
  }
});

cartRoute.delete("/:id", async (req, res) => {
  const userId = req.headers.user_id;
  const cartProductId = req.params.id;
  try {
    await cartModel.findByIdAndRemove({ _id: cartProductId, userId });
    res.status(200).send({ status: true, msg: "Product Deleted from Cart" });
  } catch (error) {
    res.status(500).send({ msg: "Error in deleting product", error: error });
  }
});

module.exports = { cartRoute };
