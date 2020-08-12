const Categories = require("./../models/categories");
const { handlePageError, checkPostParams } = require("../utils/helper");

const checkTitleCategoriesIsExist = async ({ title }) => {
  return (await Categories.findOne({ title })) !== null;
};

module.exports = {
  get: async (req, res) => {
    try {
      const categories = await Categories.paginate(
        {},
        { limit: 20, page: req.query.page || 1 }
      );

      let categories_json = JSON.parse(JSON.stringify(categories));

      const cateWithCountProduct = await Categories.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category_id",
            as: "products",
          },
        },
        {
          $project: {
            count_product: { $size: "$products" },
          },
        },
      ]).exec();

      let cateWithCountProduct_json = JSON.parse(JSON.stringify(cateWithCountProduct));

      if (cateWithCountProduct_json) {
        categories_json.docs = categories_json.docs.reduce(
          (_categories, _current) => [
            ..._categories,
            {
              ..._current,
              ...cateWithCountProduct_json.find(
                (it) => it._id === _current._id
              ),
            },
          ],
          []
        );
      }

      return res.send({
        message: "Get categories successfully!",
        data: categories_json,
      });
    } catch (err) {
      handlePageError(res, err);
    }
  },
  create: async (req, res) => {
    try {
      if (!checkPostParams(req, res, ["title"])) return;

      const { title } = req.body;

      let _checkTitleCategoriesIsExist = await checkTitleCategoriesIsExist(
        req.body
      );

      if (_checkTitleCategoriesIsExist) {
        return handlePageError(res, {
          message: `${title} is already exist`,
        });
      }

      const categories = await Categories.create(req.body);

      return res.send({
        message: "Created new category successfully!",
        data: categories,
      });
    } catch (err) {
      handlePageError(res, err);
    }
  },
  update: async (req, res) => {
    try {
      const { categoryId } = req.params;

      const category = await Categories.findOneAndUpdate(
        {
          _id: categoryId,
        },
        req.body,
        { new: true }
      );

      return res.send({
        message: "Update category successfully!",
        data: category,
      });
    } catch (err) {
      handlePageError(res, err);
    }
  },
  delete: async (req, res) => {
    try {
      const { categoryId } = req.params;

      const categoryResult = await Categories.findOneAndDelete({
        _id: categoryId,
      });

      return res.send({
        message: categoryResult
          ? `Delete category with id ${categoryId} successfully`
          : `Can't find category with id ${categoryId}`,
      });
    } catch (err) {
      handlePageError(res, err);
    }
  },
};
