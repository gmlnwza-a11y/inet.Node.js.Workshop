const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    product : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt: { type: Date, default: Date.now }
}, { 
    timestamps: true 
})

module.exports = mongoose.model('Order', orderSchema);
