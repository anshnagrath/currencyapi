
import { model, Schema } from 'mongoose'

const productSchema = new Schema({
  name: {type:String,required:true},
  brand:{type:String,required:true},
  shortDescription: {type:String,required:true},
  sizes:{type:Array},
  price:{type:Object,required:true},
  image:{type:String}
},{timestamps:true})
export default model('product',productSchema);  