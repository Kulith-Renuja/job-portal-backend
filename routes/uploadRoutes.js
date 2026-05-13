const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const { protectUniversal } = require('../middleware/universalProtect');

const router = express.Router();
const upload = multer({ storage });

// POST /api/v1/upload
router.post('/',  protectUniversal, upload.single('image'), (req, res) => {
  res.status(200).json({
    url: req.file.path
  });
});

module.exports = router;
