
import product from '../models/product';
import user from '../models/user';
import log from '../utility/chalk';
import  responseObj from '../utility/responseObject';
class ProductController {
static async getProducts(req, res) {
  let products = await product.find({}).catch((e)=>{log(e,false)});
  if(products) {
    log("Products fected successfully",true);
    res.status(200).send(responseObj(200,"ok",products)); 
  }else{
    log("Error Fetching Logs",false);
    res.status(200).send(responseObj(500,"error",null)); 
  }
}

}
export default ProductController;
