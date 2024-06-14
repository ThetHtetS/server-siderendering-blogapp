const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const actionModel = require('../models/actionModel');
const categoryModel = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require('../utils/appFeatures');
//const AppError = require("../utils/appError");

exports.adminOverview = catchAsync(async (req, res, next) => {
  // 1) get last seven day views
    const day = new Date();
    day.setDate(day.getDate() - 7); //subtract seven day
    const weeklyViews = await actionModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: day
          }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          numViews: { $sum: 1 },
        }
      }
  ])
   console.log(weeklyViews , "views");
  // 2) get action log data
  const features = new APIFeatures(actionModel.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
  
  const actionLogs = await features.query.populate({
    path: "user",
    fields: "name",
  }).populate({path: "post", fields: "title"});;
 

  res.status(200).render("dashboard", { link: "/admin" , weeklyViews , actionLogs });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  res.status(200).render("add_catz");
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
 
  const categories = await categoryModel.find();

  res.status(200).render("category", {
    title: "All Categories",
    categories,
    link: "/admin/category",
  });
});
 
exports.getAllPosts = catchAsync(async (req, res, next) => {
  // 1) Get post data from collection
  req.query.limit = 3;
  const features = new APIFeatures(postModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  const currentPage = req.query.page || 1;
  let filter = {};
  if (req.query.category) filter.category= new mongoose.Types.ObjectId(req.query.category) 
 
  const total = await postModel.aggregate([
    { $match: filter} ,
    { $count: 'total' } 
  ]);
  
  let totalDocument = total[0] ? total[0].total : 0;
  let totalPage = Math.ceil(totalDocument/req.query.limit);
  const posts = await features.query.populate('author');
  const categories = await categoryModel.find();
  // 2) Build template
  // 3) Render that template using post data from 1)
  res.status(200).render("postAdmin", {
    title: "All Posts",
    posts,
    categories,
    link: "/admin/posts",
    currentPage,
    totalPage
  });
}); 


exports.newPost = catchAsync(async (req, res, next) => {
  const categories = await categoryModel.find();
  res.status(200).render("post_add", { categories, link: "/admin/post/new" });
});



exports.editPost = catchAsync(async (req, res, next) => {
  const post = await postModel.findById( req.params.id )
  const categories = await categoryModel.find();  
  res.status(200).render("post_add", { categories , post , link: "/admin/post/new" });
});



exports.getAllUsers = catchAsync(async (req, res, next) => {
  // 1) Get user data list from collection
  req.query.limit = 6;
  const features = new APIFeatures(userModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  
      const currentPage = req.query.page || 1;
      let filter = {};
      if (req.query.category) filter.category= new mongoose.Types.ObjectId(req.query.category) 
     
      const total = await userModel.aggregate([
        { $match: filter} ,
        { $count: 'total' } 
      ]);
      
      let totalDocument = total[0] ? total[0].total : 0;
      let totalPage = Math.ceil(totalDocument/req.query.limit);
    
  const users = await features.query;

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render("user", {
    title: "All User",
    users,
    link: "/admin/users",
    currentPage,
    totalPage
  });
});


