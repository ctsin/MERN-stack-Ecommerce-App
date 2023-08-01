import express from "express";
import ExpressFormidable from "express-formidable";
import {
  createProductController,
  queryProductsController,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/create-product", ExpressFormidable(), createProductController);
router.get("/products", queryProductsController);
router.get("/product-photo/:pid", queryProductsController);

export default router;
