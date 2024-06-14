const multer = require('multer');
const sharp = require('sharp');
const Post = require('./../models/postModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.accessKey,
  secretAccessKey: process.env.secretAccessKey,
  region: 'us-east-1'
});

const s3 = new AWS.S3();

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// exports.uploadImages = upload.single('imageCover');

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  // 1) Cover image
  // req.body.imageCover = `post-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();
    // .toFile(`public/img/posts/${req.body.imageCover}`);


   
    
  //2) Images


  // req.body.images = [];

  // await Promise.all(
  //   req.files.images.map(async (file, i) => {
  //     const filename = `post.${Date.now()}-${i + 1}.jpeg`;

  //     await sharp(file.buffer)
  //       .resize(2000, 1333)
  //       .toFormat('jpeg')
  //       .jpeg({ quality: 90 })
  //       .toFile(`public/img/posts/${filename}`);

  //     req.body.images.push(filename);
  //   })
  // );

  next();
});

exports.uploadS3 = catchAsync(
  async(req,res,next)=>{
    console.log(req.files);
    console.log(req.files[0].originalname)
    const params = {
      Bucket: 'blogimagefile',
      Key: `${req.files[0].originalname}`,
      Body: 'imageCover',
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };


    // Store the image in S3
    // const result = await s3.upload(params).promise();


    // Save the image URL to the database
    // Replace this with your own database logic
    // const imageUrl = result.Location;
    // req.body.imageCover= imageUrl;
    // const imageModel = new Image({ url: imageUrl });
    // await imageModel.save();


    // // Return the image URL to the Vue.js app
    // res.send({ url: imageUrl });
    // console.log(imageUrl)
    next()

});
  
 
exports.getAllPosts =factory.getAll(Post);
exports.getPost = factory.getOne( Post,  { path: 'comments' });


exports.setPostAuthorId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.author) req.body.author = req.user.id;
  next();
}; 

exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
