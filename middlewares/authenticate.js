import jwt from 'jsonwebtoken';
import secret from '../utility/config';
import  responseObj from '../utility/responseObject';
import log from '../utility/chalk';
const checkToken = (req, res, next) => {
  console.log("inside the tokkkkkk")
  const token = req.headers['x-access-token'];
  console.log(token)
  if(token){
    try {
        let decoded = jwt.verify(token, secret);
        if(!decoded)  {
            log(`UnAuthorised Entry from ${token}`,false)
            res.status(500).send(responseObj(500,'User access denied',null))
        }else{
            log(`User Authenticated`,true)
            next();
        }

      } catch(err) {
        log(`Error while decoding token`,false)
      }
  }else{
    log(`User not Authorised`,false)
    res.status(500).send(responseObj(500,'User not Authorised',null))
  }
}
export default checkToken