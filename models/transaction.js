
import { model, Schema } from 'mongoose'
import mongoose from '../database/database';

const transactionSchema = new Schema({
  status: {type:String,default:'pending'},
  userId:{type:mongoose.Schema.Types.ObjectId,required:true},
  transactionAmount: {type:Number,required:true},
  currencySpent:{
    amount:{
      type:Number
    },
    currenyName:{
      type:String
    }
  },
  cuurentBought:{
    amount:{
      type:Number
    },
    currenyName:{
      type:String
    }
  }
},{timestamps:true})
export default model('transaction',transactionSchema);  