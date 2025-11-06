var express = require('express');
var router = express.Router();
var userSchema = require('../models/user.models');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenMiddleware = require('../routes/middleware/token.middleware');

// JWT token signing utility function
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || '1234', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ตรวจสอบให้แน่ใจว่าโฟลเดอร์ public/images มีอยู่
const uploadDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// ✅ [POST] สมัครสมาชิกใหมม่
router.post('/register', async function(req, res, next){
  const { name, age, password } = req.body;
  console.log(req.body);
  try {
      if (!password) {
    return res.status(400).json({
      status : 400 , 
      message : "Password is required",
      data : null
    });
  }

  let hashedPassword = await bcrypt.hash(password, 10);

  let newUser = new userSchema({
    name,
    age,
    password: hashedPassword,
  });

  let token = jwt.sign({ foo: "bar" }, "1234");
  await newUser.save();
  res.send(token);
    
  } catch (error) {
    console.error(error);
  }

  });

  router.post('/login', async function(req, res, next){
    const { name, password } = req.body;
    
    try {
      const user = await userSchema.findOne({ name });
      if (!user) {
        return res.status(401).json({ 
          status : 401 ,
          message: 'Invalid name or password',
          data: null
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          status : 401 ,
          message: 'Invalid name or password',
          data: null
        });
      }
      const token = signToken(user._id);
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status : 500 ,
         message: 'Server error',
         data: null
      });
    }

  })


module.exports = router;