import express from "express";
import AuthController from "../controllers/AuthController";
import  TransactionController from '../controllers/transactionController';
import checktoken from '../middlewares/authenticate'
const router = express.Router();
router.get('/',function(req,res){res.render("serverup",{title:"Demo api",message:"Server is up and running"})});
router.post("/login", AuthController.authenticateUser);
router.get('/getUserDetails/:id',AuthController.getUserDetails);
router.post('/transact',TransactionController.saveTransaction);
router.get('/getAlltransactions',TransactionController.getAllTransaction);
router.get('/gettransaction/:id',TransactionController.getUserTransaction);
router.delete('/removetransaction/:id',TransactionController.deletetransaction);
export default router
