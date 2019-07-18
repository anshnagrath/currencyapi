import user from '../models/user';
import  responseObj from '../utility/responseObject';
import log from '../utility/chalk';
import mailer from '../utility/mail';
import  bcrypt  from  'bcrypt';
import jwt from 'jsonwebtoken';
import product from '../models/product';
import mongoose from '../database/database'
import secret from '../utility/config';
import {alreadyVerified,mailString,mailErrorString} from '../public/htmlStrings/servehtml';

class AuthController {
static async createUser(req, res) {
 if(req.body && req.body.user.firstName && req.body.user.lastName && req.body.user.email&& req.body.user.password){
  const alreadyPresent = await user.findOne({email:req.body.user.email})
  if(!alreadyPresent){
  const hash = await bcrypt.hash( req.body.user.password ,10);
  req.body.user.password = hash;
  const userInstance = new user(req.body.user)
  const userIdHash = await bcrypt.hash( userInstance._id.toString() ,10);
   userInstance['userHash'] = userIdHash;
  const savedUser = await userInstance.save({userInstance}).catch((e)=>{log(`Error while saving Data: ${e} `,false)});
  if(savedUser){
    log("user sucessfully saved " + req.protocol+req.get('host'),true); 
    const link = req.protocol+'://'+ req.get('host')+"/api/verify?id=" + userIdHash;
    let mailStatus = await mailer(req.body.user.email,"confirmation of account",`Please click on the link to confirm the account ${link}`);
  
    mailStatus==true ? res.status(200).send(responseObj(200,'mailSent',null)): res.status(200).send(responseObj(400,'error while sending email',null))
  }else{
    log("error while saving user ",false);
    res.status(200).send(responseObj(400,'error while saving',null))
  } 
 }else{
  res.status(500).send(responseObj(500,'Please provide All the inputs',null))
  }
}else{
  res.status(500).send(responseObj(406,'Already a user',null))
}
}
static async authenticateUser(req, res) {
  console.log("testtttt")
  if(req.body.loginObject.email && req.body.loginObject.password ){
    console.log("testtttt")
    let currentUser = await user.findOne({email:req.body.loginObject.email}).catch((e)=>{log(`Error while fetching user: ${e}`,false)}); 
    if(currentUser.active  == true ){
      let compare = await bcrypt.compare(req.body.loginObject.password , currentUser.password).catch((e)=>log(`Error whilecomparing the password:${e}`,false));
      if(compare)  {
          const token = jwt.sign({ userId: currentUser._id }, secret,{ expiresIn: '1h' })
        if(token){
          res.setHeader('x-access-token', token);
          log("access granted",true); 
          res.status(200).send(responseObj(200,'ok',[{"id":currentUser._id}]));
        }else{
          log("Check secret",false);
          res.status(200).send(responseObj(400,'error',null))
        }
       }else{
        log("Wrong Password",false); 
       res.status(200).send(responseObj(400,'Wrong Password',null)); 
       } 
       

    }else{
      log("email not active",false); 
      res.status(200).send(responseObj(404,'user not Verified',null))
    }
   }else{
      log("please supply all the inputs",false); 
      res.status(500).send(responseObj(500,'Error',null));
   }
  }
  static async verifyUser(req, res) {
    if(req.query && 'id' in req.query ){
      const userIdHash = req.query.id.toString();
      const isVerified = await user.findOne({userHash:userIdHash}).catch((e)=>{log(e,false)});
      log(req.query.id,isVerified,false); 
      if(isVerified && isVerified.active != true){
        const verifiedUser = await user.findOneAndUpdate({userHash:userIdHash},{"active":true,userHash:''},{new:true}).catch((e)=>{log(e,false)});     
        if(verifiedUser.active == true){
          log("user verified ",true); 
          res.status(200).send(mailString);
        }else{
          log("user not updated",false); 
          res.status(200).send(mailErrorString);
        }
  
      
      }else{
        console.log(alreadyVerified,'test')
        res.status(500).send(alreadyVerified);
      }
     
    }
  }
  static async addToProductList(req,res){
    if(req.body.products && req.body.userId){
      let currentUser = await user.findOneAndUpdate({_id:req.body.userId},{$addToSet:{selectedProduct:req.body.products}},{new:true}).catch((e)=>{log(`Error while fetching ${e}`)});
      console.log(currentUser,"currentUser")
      if(currentUser){
           log("products Sucessfully Added",true);
             res.status(200).send(responseObj(200,'ok',null)); 
         }else{
             res.status(500).send(responseObj(400,'user not Found',null)); 
         }
    }
  }
  static async getUserProducts(req,res){
    
    if(req.params.id){
    
      let agregatedData = await user.aggregate([
        {
          $match:{
          _id:mongoose.Types.ObjectId(req.params.id)
        }
      },
        {
          $unwind:'$selectedProduct'
        },
        { $lookup: {
          from: "products",
          localField: "selectedProduct",
          foreignField: "_id",
          as: "allProducts"
       }},{
         $project:{
           'allProducts':1,
           '_id':0
         }
       },{
         $unwind:"$allProducts"

       },{
        $project:{
          "brand":"$allProducts.brand",
          "image":"$allProducts.image",
          "name":"$allProducts.name",
         "price":"$allProducts.price",
         "shortDescription":"$allProducts.shortDescription",
          "size":"$allProducts.size",
        }
       }
         ]).catch((e)=>{log(e,false)})
      

      if(agregatedData){
        log("Data aggregated",true);
        res.status(200).send(responseObj(200,'ok',agregatedData)); 
      }
      
    }else{
      log("Please supply userId",false);
      res.status(500).send(responseObj(400,'Please Provide user ID',null)); 
    }
    }
  }
 

export default AuthController;
