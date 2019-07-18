
import { model, Schema } from 'mongoose'

const productSchema = new Schema({
  status: {type:String,default:'pending'},
  userId:{type:[mongoose.Schema.Types.ObjectId],required:true},
  transactionAmount: {type:Number,required:true},
  currencySpent:{type:String},
  cuurentBought:{type:String}
},{timestamps:true})
export default model('product',productSchema);  