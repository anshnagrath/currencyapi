
import { model, Schema } from 'mongoose'
import mongoose from '../database/database';

const userSchema = new Schema({
  Name: {type:String,required:true},
  isadmin: {type:Boolean,default:false},
  totalTransacAmmount:{type:Number,default:0 },
  currencies:{type:[]},
},{timestamps:true})
export default model('user',userSchema); 