const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String },
  age: { type: Number },
  password: { type: String },
  role: { type: String, default: 'user' , enum: ["user", "admin"] },
  isApproved: { type: Boolean, default: false },
}, { 
    timestamps: true 
})

module.exports = mongoose.model('users', userSchema);