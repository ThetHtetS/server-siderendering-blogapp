const mongoose = require('mongoose');
const { unique } = require('next/dist/build/utils');
const Schema = mongoose.Schema;

const ActionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
          },
    
    post: {
             type: Schema.Types.ObjectId,
            ref: 'Posts',
          },
    actionType: 
          {
            type: String,
            enum: ["view", "like", "share"],
            default: "view"
          }   
},
{ timestamps: true ,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
},

)

ActionSchema.index( { user: 1, post: -1, actionType: 1 } , { unique: true } )

module.exports = mongoose.model('ActionLog', ActionSchema);
