import fs from "fs";
import productModel from "../models/productModel.js";

export const createProductController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;

    if (!name) {
      return res.status(500).send({ error: "Name is required" });
    }

    const product = new productModel({ ...req.fields });
    if (photo) {
      console.log("🚀 ~ createProductController ~ photo:", photo);
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    res.status(200).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

export const queryProductsController = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    console.log("🚀 ~ productPhotoController ~ product:", product);
    if (product.photo.data) {
      // res.set("content-type", product.photo.contentType);
      return res.type("png").status(200).send(product.photo.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting product photo",
      error,
    });
  }
};
