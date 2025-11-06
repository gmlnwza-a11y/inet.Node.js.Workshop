var express = require('express');
var router = express.Router();
var userSchema = require('../models/user.models');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenMiddleware = require('../routes/middleware/token.middleware');
const orderSchema = require('../models/order.model');
const productSchema = require('../models/product.Model');   

router.get('/', async (req, res) => {
  try {
    const orders = await orderSchema.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        status : 500 ,
        message: 'Server error',
        data : null
    });
  } 
});


module.exports = router;