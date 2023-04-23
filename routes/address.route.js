const express = require("express");
const { addressModel } = require("../models/address.model");

const addressRoute = express.Router();

// addressRoute.get();
addressRoute.get("/", async (req, res) => {
  const userId = req.headers.user_id;
  try {
    let addressData = await addressModel.find({
      userId: userId,
    });
    res.status(200).send(addressData);
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Error in getting Address data", error: error });
  }
});

addressRoute.post("/", async (req, res) => {
  const userId = req.headers.user_id;
  try {
    if (userId) {
      req.body.userId = userId;

      await addressModel.insertMany(req.body);
      res.status(200).send({
        msg: "Address added successfully",
        address: req.body,
      });
    } else {
      res
        .status(401)
        .send({ status: false, msg: "You are not authorized, Please login" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in adding into cart", error: error });
  }
});

// addressRoute.patch();
addressRoute.patch("/:id", async (req, res) => {
  const userId = req.headers.user_id;
  const _id = req.params.id;

  try {
    let address = await addressModel.findOne({ _id, userId });
    if (address.length !== 0) {
      await addressModel.findByIdAndUpdate(_id, req.body);
      res.status(200).send({ status: true, msg: "Address Update" });
    } else {
      res.status(404).send({ msg: "Not Found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in updating address", error: error });
  }
});
// addressRoute.delete();
addressRoute.delete("/:id", async (req, res) => {
  const userId = req.headers.user_id;
  const _id = req.params.id;
  try {
    let address = await addressModel.findOne({ _id, userId });
    if (address.length !== 0) {
      await addressModel.findByIdAndRemove(_id);
      res.status(200).send({ status: true, msg: "Address Deleted" });
    } else {
      res.status(404).send({ msg: "Not Found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in delete address", error: error });
  }
});

module.exports = { addressRoute };
