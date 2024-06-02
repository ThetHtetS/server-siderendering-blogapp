const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const categroyModel = require("../models/categoryModel")
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require('../utils/appFeatures');
const mongoose = require('mongoose');

// exports.getOverview = catchAsync(async (req, res, next) => {
//   // 1) Get tour data from collection
//   const featuredPosts = await postModel.find().limit(4);
  
//   req.query.limit = 3;
//   const features = new APIFeatures(postModel.find(), req.query)
//   .filter()
//   .sort()
//   .limitFields()
//   .paginate();

//   const postByCat = await features.query;
//   const categories = await categroyModel.find();
//   // 2) Build template
//   // 3) Render that template using tour data from 1)
//   res.status(200).render("homePage", {
//     title: "Exploring the Essence",
//     featuredPosts,
//     categories,
//     postByCat,
//   });
// });

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
 
  req.query.limit = 3;
  const currentPage = req.query.page || 1;
  const category = req.query.category;

  const featuredPosts = await postModel.find().limit(4);
  const categories = await categroyModel.find();
  let filter = {};
  if (req.query.category) filter.category= new mongoose.Types.ObjectId(req.query.category) 
 
  const total = await postModel.aggregate([
    { $match: filter} ,
    { $count: 'total' } 
  ]);
  
  let totalDocument = total[0] ? total[0].total : 0;
  let totalPage = Math.ceil(totalDocument/req.query.limit);
  const features = new APIFeatures(postModel.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
  const postByCat = await features.query;

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render("homePage", {
    title: "Exploring the Essence",
    featuredPosts,
    categories,
    postByCat,
    currentPage,
    category,
    totalPage
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const post = await postModel.findOne({ slug: req.params.slug }).populate({
    path: "comments",
    fields: "comment user",
  }).populate({path: "author"});

  if (!post) {
    return next(new AppError("There is no post with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("post", {
    title: `${post.title} `,
    post,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render("signup", {
    title: "Sign up your account",
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});
