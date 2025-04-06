const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: String,
  img: {
    data: Buffer,         // Store image as binary data
    contentType: String   // MIME type (e.g., 'image/jpeg')
  }
});

module.exports = mongoose.model('Image', imageSchema);