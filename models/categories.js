const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
  'title': String,
  'thumbnail': {
    type: String,
    default: 'https://res.cloudinary.com/do1xjyyru/image/upload/v1596786305/public/img_478722_t4gsme.png'
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

CategoriesSchema.plugin(mongoosePaginate)

// Compile model from schema
module.exports = mongoose.model('categories', CategoriesSchema);
