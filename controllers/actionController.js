const actionModel = require('../models/actionModel')
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync')


exports.createAction= factory.createOne(actionModel); 
exports.lastSevenDayView = catchAsync(
    async (req, res, next) => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        const views = await actionModel.aggregate([
          {
            $match: {
              createdAt: {
                $gte: d
              }
            }
          },
          // {
          //   $unwind: '$orderItem'
          // },
          {
            $group: {
              _id: { $dayOfWeek: '$createdAt' },
              numViews: { $sum: 1 },
            }
          }
      ])
      console.log(views);

      res.status(200).json({
        views
      })
      }
)