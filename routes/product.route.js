const express = require("express");
const { productModel } = require("../models/product.model");
const { adminAuth } = require("../middlewares/adminAuth");

const productRoutes = express.Router();

productRoutes.get("/", async (req, res) => {
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

    if (queryParams.sizes) {
      const sizes = queryParams.sizes.split(",");
      queryObj.sizes = { $in: sizes };
    }

    if (queryParams.rating_gte && !queryParams.rating_lte) {
      queryObj.rating = { $gte: parseFloat(queryParams.rating_gte) };
    } else if (queryParams.rating_lte && !queryParams.rating_lte) {
      queryObj.rating = { $lte: parseFloat(queryParams.rating_lte) };
    } else if (queryParams.rating_gte && queryParams.rating_lte) {
      queryObj.rating = {
        $gte: parseFloat(queryParams.rating_gte),
        $lte: parseFloat(queryParams.rating_lte),
      };
    }
    if (queryParams.discounted_price_gte && !queryParams.discounted_price_lte) {
      queryObj.discounted_price = {
        $gte: parseFloat(queryParams.discounted_price_gte),
      };
    } else if (
      queryParams.discounted_price_lte &&
      !queryParams.discounted_price_lte
    ) {
      queryObj.discounted_price = {
        $lte: parseFloat(queryParams.discounted_price_lte),
      };
    } else if (
      queryParams.discounted_price_gte &&
      queryParams.discounted_price_lte
    ) {
      queryObj.discounted_price = {
        $gte: parseFloat(queryParams.discounted_price_gte),
        $lte: parseFloat(queryParams.discounted_price_lte),
      };
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
      productData = await productModel
        .find(queryObj)
        .sort({ id: 1 })
        .skip(startIndex)
        .limit(limit);
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

productRoutes.post("/", adminAuth, async (req, res) => {
  try {
    await productModel.insertMany(req.body);
    res
      .status(200)
      .send({ msg: "New product added successfully", product: req.body });
  } catch (error) {
    res.status(500).send({ msg: "Error in adding new product" });
  }
});

productRoutes.delete("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let productData = await productModel.findById(id);
    if (productData) {
      await productModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "product delete successfully" });
    } else {
      res.status(404).send({ msg: "Product not available" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in deleting product" });
  }
});
productRoutes.patch("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let productData = await productModel.findById(id);
    if (productData) {
      await productModel.findByIdAndUpdate(id, req.body);
      res.status(200).send({ msg: "Product update successfully" });
    } else {
      res.status(404).send({ msg: "Product not available" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error in updating product" });
  }
});

module.exports = { productRoutes };
