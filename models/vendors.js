const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const VendorSchema = new Schema({
  'title': String,
  'address': String,
  'phone': String,
  'logo': {
    'type': String,
    'default': 'https://res.cloudinary.com/do1xjyyru/image/upload/v1596535191/public/product_kqjo0i.svg'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toJSON: {
    virtuals: true,
  }
});

VendorSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('vendors', VendorSchema);