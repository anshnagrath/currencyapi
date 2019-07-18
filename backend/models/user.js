
import { model, Schema } from 'mongoose'
import mongoose from '../database/database';

const userSchema = new Schema({
  firstName: {type:String,required:true},
  lastName: {type:String,required:true},
  email: {type:String,required:true},
  password:{type:String,required:true },
  active:{type:Boolean,default:false},
  userHash:{type:String},
  selectedProduct:{type:[mongoose.Schema.Types.ObjectId]}
},{timestamps:true})
export default model('user',userSchema);  