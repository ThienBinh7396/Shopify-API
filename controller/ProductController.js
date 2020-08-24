const Products = require("../models/products");

const {
  checkPostParams,
  handlePageError,
  handleRequestError,
  parseFieldStringToArray,
} = require("../utils/helper");

const findProductByTitleAndCode = async ({ title, product_code } = {}) =>
  await Products.findOne({ $or: [{ title }, { product_code }] });

module.exports = {
  get: async (req, res) => {
    try {
      const products = await Products.paginate(
        {},
        {
          limit: 20,
          page: req.query.page || 1,
          populate: ["vendor_id", "category_id", "status"],
        }
      );

      return res.send({
        message: "Get products successfully!",
        data: products,
      });
    } catch (err) {
      handlePageError(res, err);
    }
  },
  getTopSeller: async (req, res) => {
    try {
      const products = await Products.find(
        {},
        null,
        {
          sort: { sell: "desc" },
          limit: 5
        }
      ).populate(["vendor_id", "category_id", "status"]);

      return res.send({
        message: "Get products successfully!",
        data: products,
      });
    } catch (err) {
      handlePageError(res, err);
    }
  },
  getTopSale: async (req, res) => {
    try {
      const products = await Products.find(
        {
          discount: {
            $gte: 0,
          },
        },
        null,
        {
          sort: { discount: "desc" },
          limit: 5
        }
      ).populate(["vendor_id", "category_id", "status"]);

      return res.send({
        message: "Get products successfully!",
        data: products,
      });
    } catch (err) {
      handlePageError(res, err);
    }
  },
  getProductView: async (req, res) => {
    res.render("product");
  },
  create: async (req, res) => {
    try {
      if (
        !checkPostParams(req, res, [
          "title",
          "price",
          "thumbnail",
          "description",
          "product_code",
          "vendor_id",
          "galleries",
          "status",
        ])
      ) {
        return;
      }

      let checkTitleOrCodeExist = await findProductByTitleAndCode(req.body);

      if (checkTitleOrCodeExist) {
        return handlePageError(res, {
          message: `Title or product_code of product is already exist!`,
        });
      }

      const { galleries, colors, sizes, category_id } = req.body;

      const product = await Products.create({
        ...req.body,
        colors: req.body.colors || [],
        sizes: req.body.sizes || [],
      });

      return res.send({
        message: "Create product successfully",
        data: product,
      });
    } catch (err) {
      handlePageError(res, err);
    }
  },
  update: async (req, res) => {
    try {
      const { productId } = req.params;

      const productFromDB = await Products.findOne({ _id: productId });

      if (!productFromDB) {
        return handleRequestError(res, {
          message: `Can't find product with status ${productId}`,
        });
      }

      const { galleries, colors, sizes, category_id, status } = productFromDB;

      console.log(req.body);

      const product = await Products.findOneAndUpdate(
        {
          _id: productId,
        },
        {
          ...req.body,
          colors: req.body.colors || [],
          sizes: req.body.sizes || [],
        },
        { new: true }
      );

      return res.send({
        message: `Update product with identity ${productId} successfully!`,
        data: product,
      });
    } catch (err) {
      handlePageError(res, err);
    }
  },
};
