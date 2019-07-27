import user from '../models/user';
import  responseObj from '../utility/responseObject';
import log from '../utility/chalk';
import mailer from '../utility/mail';
import  bcrypt  from  'bcrypt';
import jwt from 'jsonwebtoken';

import mongoose from '../database/database'
import secret from '../utility/config';
import {alreadyVerified,mailString,mailErrorString} from '../public/htmlStrings/servehtml';

class AuthController {

static async authenticateUser(req, res) {
  if(req.body.username){
    let currentUser = await user.findOne({name:req.body.username.toUpperCase()}).catch((e)=>{log(`Error while fetching user: ${e}`,false)}); 
    if(currentUser){
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
      log("no user found",false); 
      res.status(200).send(responseObj(404,'user not found',null))
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
  static async getUserDetails(req,res){
  if(req.params && req.params.id){
   let userDetails = await user.findById(req.params.id);
      if(userDetails){
        res.status(200).send(responseObj(200,'ok',userDetails)); 
      }else{
        res.status(400).send(responseObj(400,'ok',[])); 
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
   
    }
  }
 

export default AuthController;
