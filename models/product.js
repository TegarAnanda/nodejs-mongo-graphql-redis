const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const product = new Schema(
    {
        title: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        images: [{ type: String }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', product);;