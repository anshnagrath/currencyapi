
import { model, Schema } from 'mongoose'
import mongoose from '../database/database';
import { stringify } from 'querystring';

const userSchema = new Schema({
  Name: {type:String,required:true},
  isadmin: {type:Boolean,default:false},
  sold:{type:Number,default:0},
  bought:{type:Number,default:0},
  totalAmountSold:{type:Number,default:0 },
  totalAmountBought:{type:Number,default:0 },
  currencies:{type:Array},
},{timestamps:true})
export default model('user',userSchema); 