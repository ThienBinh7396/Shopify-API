const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const ProductStatusSchema = new Schema({
    'title': String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    toJSON: {
        virtuals: true,
    }
});

ProductStatusSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('product-status', ProductStatusSchema);
