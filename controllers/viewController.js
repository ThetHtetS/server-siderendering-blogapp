const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const categroyModel = require("../models/categoryModel")
const actionModel= require('../models/actionModel')
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require('../utils/appFeatures');
const mongoose = require('mongoose');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  // const featuredPosts = await postModel.find().limit(4);
  
  // req.query.limit = 3;
  // const features = new APIFeatures(postModel.find(), req.query)
  // .filter()
  // .sort()
  // .limitFields()
  // .paginate();
  
  const featuredPosts = await postModel.find().limit(4);
  // const postByCat = await features.query;
  const categories = await categroyModel.find();
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render("homePage", {
    title: "Exploring the Essence",
    featuredPosts,
    categories,
    // postByCat,
  });
});


exports.getPosts = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
 
  req.query.limit = 6;
  const currentPage = req.query.page || 1;
  const category = req.query.category;

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
  const posts = await features.query;
  
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render("userPosts", {
    title: "Exploring the Essence",
    categories,
    posts,
    currentPage,
    category,
    totalPage
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested post
  
  const post = await postModel.findOne({ slug: req.params.slug }).populate({
    path: "comments",
    fields: "comment user",
  }).populate({path: "author"});

  if (!post) {
    return next(new AppError("There is no post with that name.", 404));
  }

  // 2) Get The View Count
  var result = [];
  var postLike;
  if (post._id) {
    result = await actionModel.aggregate([
      { $match: {post: new mongoose.Types.ObjectId(post._id)}},
      { $count: 'total' } 
      ])
     // 3) check the user already like post or not
    postLike = await actionModel.find({
    user: new mongoose.Types.ObjectId(req.user.id),
    post: new mongoose.Types.ObjectId(post._id),
    actionType: 'like'
  })
  
    }
   

  let likeBoolean = postLike[0] ? true : false
  let viewCount = result[0] ? result[0].total : 0;
  // 3) Build template
  // 4) Render template using data from 1)
  res.status(200).render("post", {
    title: `${post.title} `,
    post,
    viewCount,
    likeBoolean
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

exports.getForgotPasswordForm =( req, res)=>{
  res.status(200).render("forgotPassword", {title: 'Reset Password'})
}

exports.getresetPasswordForm =( req, res)=>{
  res.status(200).render("resetPassword", {title: 'Reset Password', token: req.params.token })
}


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
