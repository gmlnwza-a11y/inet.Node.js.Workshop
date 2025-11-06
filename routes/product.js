var express = require('express');
var router = express.Router();
var userSchema = require('../models/user.models');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenMiddleware = require('../routes/middleware/token.middleware');
const productSchema = require('../models/product.Model');
const orderSchema = require('../models/order.model');


router.post('/', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    // Here you would typically save the product to the database
    // Simulate saving to DB
     let newProduct = new productSchema({
       name,
       price,
       stock,
     });
   
     let token = jwt.sign({ foo: "bar" }, "1234");
     await newProduct.save();

    res.status(201).json({
        status : 201 , 
        message : 'Product created successfully',
        data : newProduct 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status : 500 ,
      message: 'Server error',
      data : null
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, stock } = req.body;    

    // Find the product by ID and update it
    let updatedProduct = await productSchema.findByIdAndUpdate(productId, {
      name,
      price,
      stock
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ 
        status : 404 ,
        message: 'Product not found',
        data : null
      });
    }

    res.status(200).json({ 
        status : 200 ,
        message : 'Product updated successfully',
        data : updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        status : 500 ,
        message : 'Server error',
        data : null
    });
  }
}); 

// Allow POST to /:id for clients that send POST instead of PUT when updating
router.post('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, stock } = req.body;

    let updatedProduct = await productSchema.findByIdAndUpdate(productId, {
      name,
      price,
      stock
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ 
        status : 404 ,
        message : 'Product not found',
        data : null 
    });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        status : 500 ,
        message : 'Server error',
        data : null
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await productSchema.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        status : 404 ,
        message : 'Product not found',
        data : null
    });
    }   
    res.status(200).json({ 
        status : 200 ,
        message: 'Product deleted successfully',
        data: deletedProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        status : 500 ,
        message : 'Server error',
        data : null
    });
  }     
});

router.get('/', async (req, res) => {
  try {
    const products = await productSchema.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        status : 500 ,
        message : 'Server error',
        data : null 
    });
  } 
});

router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productSchema.findById(productId);

    if (!product) {
      return res.status(404).json({ 
        status : 404 ,
        message : 'ไม่พบสินค้า',
        data : null  
    });
    }    
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        status : 500 ,  
        message : 'Server error',
        data : null  
    });
  } 
});

router.post('/:id/orders', async (req, res) => {
  try {
    const productId = req.params.id;
    const { userId, quantity } = req.body;

    // Validate inputs
    if (!userId || !quantity) {
      return res.status(400).json({
        status : 400 ,
        message : 'userId and quantity are required',
        data : null
    });
    }

    if (quantity <= 0) {
      return res.status(400).json({ 
        status : 400 ,
        message : 'จำนวนต้องมากกว่า 0',
        data : null
    });
    }

    const product = await productSchema.findById(productId);

    if (!product) {
      return res.status(400).json({ 
        status : 400 ,
        message : 'ไม่พบสินค้า',
        data : null 
    });
    }

    // Check if the product is in stock
    if (quantity > product.stock) {
      return res.status(400).json({
        status : 400 ,
        message : 'จำนวนไม่พอ' ,
        data : null
    });
    }

    // Update product stock
    product.stock -= quantity;
    await product.save();

    // Create and save the order
    let newOrder = new orderSchema({
      user: userId,
      product: productId,
      quantity: quantity
    });

    await newOrder.save();

    res.status(201).json({ 
        status : 201 ,
        message : 'สั่งออเดอร์สำเร็จ', 
        data : newOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:id/orders', async (req, res) => {
  try {
    const productId = req.params.id;
    const orders = await orderSchema.find({ product: productId });
    res.status(200).json({
        status : 200 ,
        message : "ข้อมูลการสั่งซื้อสินค้าสำเร็จ",
        data : orders
    });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
});

























































module.exports = router;


