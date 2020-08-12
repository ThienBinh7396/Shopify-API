const Vendors = require('../models/vendors');

const { checkPostParams, handlePageError } = require('../utils/helper');

const checkVendorTitleIsExist = async ({ title }) => (await Vendors.findOne({ title })) !== null

module.exports = {
  get: async (req, res) => {
    try {
      const vendors = await Vendors.paginate({}, { limit: 20, page: req.query.page || 1 });

      let vendor_json = JSON.parse(JSON.stringify(vendors));

      const vendorWithCountProduct = await Vendors.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "vendor_id",
            as: "products",
          },
        },
        {
          $project: {
            count_product: { $size: "$products" },
          },
        },
      ]).exec();

      let vendorWithCountProduct_json = JSON.parse(JSON.stringify(vendorWithCountProduct));

      if (vendorWithCountProduct_json) {
        vendor_json.docs = vendor_json.docs.reduce(
          (_vendors, _current) => [
            ..._vendors,
            {
              ..._current,
              ...vendorWithCountProduct_json.find(
                (it) => it._id === _current._id
              ),
            },
          ],
          []
        );
      }

      return res.send({
        message: 'Get vendors successfully!',
        data: vendor_json
      })

    } catch (err) {
      handlePageError(res, err)
    }
  },
  create: async (req, res) => {
    try {
      console.log(req.body)

      if (!checkPostParams(req, res, ['title', 'address', 'phone'])) {
        return
      }

      const { title } = req.body;

      console.log(req.body)

      let _checkVendorTitleIsExist = await checkVendorTitleIsExist(req.body);

      if (_checkVendorTitleIsExist) {
        return handlePageError(res, {
          message: `${title} is already exist`
        })
      }

      const vendors = await Vendors.create(req.body);

      return res.send({
        message: 'Create vendors successfully!',
        data: vendors
      })
    } catch (err) {
      console.log(err);

      handlePageError(res, err)
    }
  },
  update: async (req, res) => {
    try {
      const { vendorId } = req.params;

      const vendor = await Vendors.findOneAndUpdate({
        _id: vendorId
      }, req.body, { new: true });

      return res.send({
        message: 'Update vendor successfully!',
        data: vendor
      })

    } catch (err) {
      handlePageError(res, err);
    }

  }
}
