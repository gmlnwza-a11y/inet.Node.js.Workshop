var express = require('express');
var router = express.Router();
var userSchema = require('../models/user.models');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenMiddleware = require('./middleware/token.middleware');
const uploadDir = path.join(__dirname, '../public/images');
const User = require('../models/user.models');
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ✅ [POST] login
// อนุมัติผู้ใช้
router.post('/:id/approve', tokenMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status : 404 ,
        message: 'User not found',
        data: null
    });
    }

    res.status(200).json({
        status: 200,
        message: 'User approved successfully ✅',
        data: user
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

module.exports = router;
