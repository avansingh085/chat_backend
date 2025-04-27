const multer = require('multer');
const User = require('../models/User');
const Image = require('../models/Image'); 
const upload= async (req, res) => {
  console.log("Uploading image...",req.body);
    try {
      
      if (!req.file) {
        return res.status(400).send({success:false, message: 'No file uploaded' });
      }
  
      const newImage = new Image({
        name: req.file.originalname,
        img: {
          data: req.file.buffer,        
          contentType: req.file.mimetype 
        }
      });
  
      const savedImage = await newImage.save();
 
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      // console.log(imageUrl,"IMAGE URL");
    if(req.body?.userId)
    {
   await User.findOneAndUpdate({ userId: req.body.userId },{ $set: { profilePicture: imageUrl } });
    }
      return res.status(200).send({success:true,message:"Image uploaded successfully", imageUrl: imageUrl });

    } catch (error) {
      console.log("Error during image upload:", error);
      return res.status(500).send({success:false, message: 'Error uploading image', error: error.message });
    }``
  }
module.exports = upload;