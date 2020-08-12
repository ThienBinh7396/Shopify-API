const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: String,
    price: Number,
    category_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
      },
    ],
    discount: Number,
    thumbnail: String,
    description: String,
    product_code: String,
    more_information: {
      type: String,
      default: "",
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendors",
    },
    galleries: [String],
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product-status",
      default: "5f2bde4558160a4283b3e8ac",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: {
      virtuals: true,
    },
  }
);

ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("products", ProductSchema);
