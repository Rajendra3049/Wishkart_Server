const express = require("express");
const { adminModel } = require("../models/admin.model");
const { orderModel } = require("../models/order.model");
const { productModel } = require("../models/product.model");
const { adminAuth } = require("../middlewares/adminAuth");
const jwt = require("jsonwebtoken");

const adminRoutes = express.Router();
adminRoutes.get("/", async (req, res) => {
  try {
    let adminFound = await adminModel.find();

    res.status(200).send({ admin: adminFound });
  } catch (error) {
    res.status(500).send({ msg: "Error in getting admin" });
  }
});

adminRoutes.get("/dashboard", adminAuth, async (req, res) => {
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
    res.status(200).send({
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

// get products
adminRoutes.get("/products", async (req, res) => {
  try {
    const queryParams = req.query;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;

    const queryObj = {};

    if (queryParams.category) {
      queryObj.category = { $in: queryParams.category };
    }
    if (queryParams.title) {
      queryObj.title = { $regex: queryParams.title, $options: "i" };
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalProducts = await productModel.countDocuments(queryObj);
    const totalPages = Math.ceil(totalProducts / limit);

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalProducts: totalProducts,
      limit: limit,
      nextPage: endIndex < totalProducts ? page + 1 : null,
      prevPage: startIndex > 0 ? page - 1 : null,
    };

    let productData;

    if (Object.keys(queryParams).length) {
      if (queryParams.order === "asc") {
        productData = await productModel
          .find(queryObj)
          .sort({ discounted_price: 1 })
          .skip(startIndex)
          .limit(limit);
      } else if (queryParams.order === "desc") {
        productData = await productModel
          .find(queryObj)
          .sort({ discounted_price: -1 })
          .skip(startIndex)
          .limit(limit);
      } else {
        productData = await productModel
          .find(queryObj)
          .skip(startIndex)
          .limit(limit);
      }
    } else {
      productData = await productModel
        .find()
        .sort({ id: 1 })
        .skip(startIndex)
        .limit(limit);
    }

    if (productData.length == 0) {
      res.status(404).send({ msg: "Not Found" });
    } else {
      res.status(200).send({ products: productData, pagination: pagination });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in getting products" });
  }
});

// add product
adminRoutes.post("/products", adminAuth, async (req, res) => {
  try {
    await productModel.insertMany(req.body);
    res
      .status(200)
      .send({ msg: "New product added successfully", product: req.body });
  } catch (error) {
    res.status(500).send({ msg: "Error in adding new product" });
  }
});

// delete product
adminRoutes.delete("/products/:_id", adminAuth, async (req, res) => {
  const { _id } = req.params;
  try {
    let productData = await productModel.findById(_id);
    if (productData) {
      await productModel.findByIdAndRemove(_id);
      res.status(200).send({ msg: "product delete successfully" });
    } else {
      res.status(404).send({ msg: "Product not available" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in deleting product" });
  }
});

// update product
adminRoutes.patch("/products/:_id", adminAuth, async (req, res) => {
  const { _id } = req.params;
  try {
    let productData = await productModel.findById(_id);
    if (productData) {
      await productModel.findByIdAndUpdate(_id, req.body);
      res.status(200).send({ msg: "Product update successfully" });
    } else {
      res.status(404).send({ msg: "Product not available" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in updating product" });
  }
});

module.exports = { adminRoutes };
