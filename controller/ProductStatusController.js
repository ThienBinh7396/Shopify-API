const ProductStatus = require('../models/product-status');

const { handlePageError, handleRequestError, checkPostParams } = require('../utils/helper')

const checkProductStatusTitleIsExist = async ({ title }) => (await ProductStatus.findOne({ title })) !== null

module.exports = {
  get: async (req, res) => {
    try {
      const status = await ProductStatus.paginate({});

      return res.send({
        message: 'Get product status successfully!',
        data: status
      })

    } catch (err) {
      handlePageError(res, err)
    }
  },
  create: async (req, res) => {
    try {
      console.log(req.body)

      if (!checkPostParams(req, res, ['title'])) {
        return
      }

      const { title } = req.body;

      console.log(req.body)

      let _checkProductStatusTitleIsExist = await checkProductStatusTitleIsExist(req.body);

      if (_checkProductStatusTitleIsExist) {
        return handlePageError(res, {
          message: `${title} is already exist`
        })
      }

      const status = await ProductStatus.create(req.body);

      return res.send({
        message: 'Create status successfully!',
        data: status
      })
    } catch (err) {
      console.log(err);

      handlePageError(res, err)
    }
  },
  update: async (req, res) => {
    try {
      const { statusId } = req.params;

      const status = await ProductStatus.findOneAndUpdate({
        _id: statusId
      }, req.body, { new: true });

      return res.send({
        message: 'Update vendor successfully!',
        data: status
      })

    } catch (err) {
      handlePageError(res, err);
    }
  }
}
