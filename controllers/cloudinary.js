const cloudinary = require("cloudinary");

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  // console.log("CONTROLLER HERE");
  let result = await cloudinary.v2.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: "auto", //automatically choose jpeg or png
  });
  // we will be sending Json data.
  // if we use file data, it will be req.files.file.path
  //image data is in the req.body. already resized in front end.
  console.log("upload result", result);
  // result = uploaded image URL
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};

exports.remove = (req, res) => {
  let image_id = req.body.public_id; //you need a unique id to remove it.
  //this time you don't need to wait.
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.status(200).send("OK"); //200がデフォルトなので、res.sendでいいんですけどね
  });
};
