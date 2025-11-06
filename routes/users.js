// var express = require('express');
// var router = express.Router();
// var userSchema = require('../models/user.models');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const tokenMiddleware = require('../routes/middleware/token.middleware');
// // ตรวจสอบให้แน่ใจว่าโฟลเดอร์ public/images มีอยู่
// const uploadDir = path.join(__dirname, '../public/images');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // ตั้งค่า multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // ✅ [GET] ดึงข้อมูลผู้ใช้ทั้งหมด
// router.get('/', async function (req, res, next) {
//   try {
//     const users = await userSchema.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// ✅ [POST] เพิ่มผู้ใช้ใหม่ + อัปโหลดรูป
// router.post('/', [tokenMiddleware, upload.single('image')], async function(req, res, next){
//   let { name, age, password } = req.body;  // ✅ เพิ่ม password ตรงนี้

//   let hashedPassword = await bcrypt.hash(password, 10);

//   let newUser = new userSchema({
//     name,
//     age,
//     password: hashedPassword,
//     image: req.file ? req.file.filename : null
//   });

//   let token = jwt.sign({ foo: "bar" }, "1234");
//   await newUser.save();
//   res.send(token);
// });


// // ✅ [PUT] แก้ไขข้อมูลผู้ใช้
// router.put('/:id', async function (req, res, next) {
//   try {
//     const { name, age } = req.body;
//     const { id } = req.params;
//     const user = await userSchema.findByIdAndUpdate(id, { name, age }, { new: true });
//     res.json(user);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // ✅ [DELETE] ลบผู้ใช้
// router.delete('/:id', async function (req, res, next) {
//   try {
//     const { id } = req.params;
//     const user = await userSchema.findByIdAndDelete(id);
//     res.json(user);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// module.exports = router;
