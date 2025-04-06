const getImage=async (req, res) => {
    try {
      const image = await Image.findById(req.params.id);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      res.set('Content-Type', image.img.contentType);
     return  res.status(200).send({img:image.img.data,success:true});
    } catch (error) {
     return res.status(500).send({ message: 'Error retrieving image', error: error.message });
    }
  }

  module.exports = getImage;