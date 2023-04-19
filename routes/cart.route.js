const express = require("express");
const { cartModel } = require("../models/cart.model");

const cartRoute = express.Router();

cartRoute.get("/", async (req, res) => {
  const userId = req.headers.userid;
  try {
    let cartData = await cartModel.find({
      userId: userId,
    });
    res.status(200).send(cartData);
  } catch (error) {
    res.status(500).send({ msg: "Error in getting cart data", error: error });
  }
});

cartRoute.post("/", async (req, res) => {
  const userId = req.headers.userid;
  const id = req.body.id;

  try {
    let alreadyExist = await cartModel.find({ id, userId });

    if (alreadyExist.length !== 0) {
      res.send({ status: false, msg: "Already Added" });
    } else {
      if (userId) {
        req.body.userId = userId;
        req.body.quantity = 1;
        await cartModel.insertMany(req.body);
        res.status(200).send({
          msg: "Product added into cart successfully",
          product: req.body,
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

cartRoute.patch("/increase/:_id", async (req, res) => {
  const userId = req.headers.userid;
  const _id = req.params._id;

  try {
    let product = await cartModel.findOne({ _id, userId });
    if (product.length !== 0) {
      let newQuantity = product.quantity + 1;
      await cartModel.findByIdAndUpdate(_id, { quantity: newQuantity });
      res.status(200).send({ status: true, msg: "Quantity Increase" });
    } else {
      res.status(404).send({ msg: "Not Found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in increasing quantity", error: error });
  }
});

cartRoute.patch("/decrease/:_id", async (req, res) => {
  const userId = req.headers.userid;
  const _id = req.params._id;
  try {
    let product = await cartModel.findOne({ _id, userId });
    if (product.quantity > 0) {
      let newQuantity = product.quantity - 1;

      await cartModel.findByIdAndUpdate(_id, { quantity: newQuantity });
      res.status(200).send({ status: true, msg: "Quantity Decrease" });
    } else {
      res.status(400).send({ msg: "Error in decrease quantity", error: error });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in decreasing quantity", error: error });
  }
});

cartRoute.delete("/:_id", async (req, res) => {
  const userId = req.headers.userid;
  const _id = req.params._id;
  try {
    let product = await cartModel.findOne({ _id, userId });
    if (product.length !== 0) {
      await cartModel.findByIdAndRemove({ _id, userId });
      res.status(200).send({ status: true, msg: "Product Deleted from Cart" });
    } else {
      res.status(400).send({ msg: "Product not found", error: error });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in deleting product", error: error });
  }
});

module.exports = { cartRoute };
