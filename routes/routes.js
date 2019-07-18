import express from "express";
import AuthController from "../controllers/AuthController";
import ProductController from "../controllers/ProductController"
import checktoken from '../middlewares/authenticate'
const router = express.Router();
router.get('/',function(req,res){res.render("serverup",{title:"Demo api",message:"Server is up and running"})});
router.post("/signup", AuthController.createUser);
router.get("/verify", AuthController.verifyUser);
router.post("/login", AuthController.authenticateUser);
router.get("/saveProducts/",checktoken,AuthController.getUserProducts);
router.post("/saveProducts/",checktoken,AuthController.addToProductList);
router.get("/getuserproducts/:id",checktoken,AuthController.getUserProducts);
router.get("/getproducts",checktoken,ProductController.getProducts);
export default router
