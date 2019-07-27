
import user from '../models/user';
import log from '../utility/chalk';
import mongoose from '../database/database'
import  responseObj from '../utility/responseObject';
import Transaction from '../models/transaction';
class TransactionController {
//escrow part
static async adminTransaction(transactionamount,type,currency,userdetails,transaction){
let admin = await user.findOne({isadmin:true}).catch((e)=>log(e,false));
  let escrowMoney = admin.currencies.find(o=>o.currencytype.trim().toLowerCase() == 'escrow');
  //increament inadmin escrow currency
  console.log(escrowMoney,'escrowwwwMoney')
  escrowMoney.ammount = parseInt(escrowMoney.ammount) - parseInt(transactionamount);
  let updateadmin = await user.findByIdAndUpdate(admin._id,admin,{new:true}).catch((e)=>log(e,false)); 
  //transfer equivalent numbers of currency to user
  console.log(updateadmin,'escrowwwwMoney')
  let currencyaskedfor = userdetails.currencies.find(o=>o.currencytype.trim().toLowerCase() == currency.trim().toLowerCase());
  currencyaskedfor.ammount = parseInt(currencyaskedfor.ammount) + parseInt(transactionamount)
  console.log(currencyaskedfor,currency,'escrowwwwMoney')

  let updateduser= await user.findByIdAndUpdate(userdetails._id,userdetails,{new:true}).catch((e)=>log(e,false));
  console.log(updateduser,'userisss')
  //update transaction state
  if(updateduser){
    transaction['status']  = 'completed'
    let updateTransaction = await Transaction.findByIdAndUpdate(transaction._id,transaction,{new:true}).catch((e)=>log(e,false))

  }
  



}
static async deletetransaction(req,res){
  if(req.params.id){
    let transaction = await Transaction.findById(req.params.id);
    if(transaction && transaction.status == 'completed'){
    let currentUser = await user.findById(transaction.userId).catch((e)=>{log(e,false)})
    if(currentUser){
      let decAmmount = '-'+ transaction.currencySpent.amount.toString();
      let adminupdate = await user.findOneAndUpdate({isadmin:true,'currencies.currencytype':'escrow'},{$inc:{'currencies.$.ammount':parseInt(decAmmount)}}).catch((e)=>{log(e,false)})
      
      if(adminupdate){
      //refund ammount to user
     let currencyObject = currentUser.currencies.find(o=>o.currencytype.trim().toLowerCase()  == transaction.currencySpent.currenyName.trim().toLowerCase());
     currencyObject.ammount = parseInt(currencyObject.ammount) + parseInt(transaction.currencySpent.amount);
     let ftcurrency = currentUser.currencies.find(o=>o.currencytype.trim().toLowerCase()  == 'ft');
     ftcurrency.ammount = parseInt(ftcurrency.ammount) - parseInt(transaction.currencySpent.amount);
     let updateUser = await user.findByIdAndUpdate(transaction.userId,currentUser,{new:true}).catch((e)=>{log(e,false)})
     let removeTransaction = await Transaction.remove({_id:mongoose.Types.ObjectId(req.params.id)}).catch((e)=>{log((e)=>{console.error(e)})})
     if(updateUser && removeTransaction){
       console.log(updateUser,'reverseTest')
      res.status(200).send(responseObj(200,'transaction reversed',[])); 
     }else{
       res.status(200).send(responseObj(405,'Error while reversing transactoin',[])); 
     }

    }}else{
      res.status(200).send(responseObj(405,'Error while reversing transactoin',[]))
    } 
  }else{
    res.status(200).send(responseObj(407,'Transaction not completed',[])); 
    }
  }else{
    res.status(500).send(responseObj(500,'Please supply all the inputs',[])); 
  }

}
static async updateUser(userdetails,transactionAmount,currencySold,currencyBought){
  let updatedData = await user.findOneAndUpdate({_id:mongoose.Types.ObjectId(userdetails._id)},userdetails,{new:true}).catch((e)=>{log(e,false)});
  let newtransaction = {}
  newtransaction['userId'] = userdetails._id;
  newtransaction['transactionAmount'] = transactionAmount;
  newtransaction['currencySpent']={'amount': transactionAmount , 'currenyName': currencySold};
  newtransaction['cuurentBought'] = {'amount':transactionAmount,'currencyName':currencyBought}
  let transaction = new Transaction(newtransaction);
  let saveTrasaction = await transaction.save().catch((e)=>{log(e,false)});
  let admin = await user.findOne({isadmin:true}).catch((e)=>{log(e,false)});
  let escrowMoney = admin.currencies.find(o=>o.currencytype.trim().toLowerCase() == 'escrow')
  //increament inadmin escrow currency
  escrowMoney.ammount = parseInt(escrowMoney.ammount) + parseInt(transactionAmount);
  let updateadmin = await user.findByIdAndUpdate(admin._id,admin,{new:true}).catch((e)=>{log(e,false)});
 // console.log(io,'ioyou there')
  return transaction


}



static async saveTransaction ( req, res ) {
 
if( req.body.userId  && req.body.transactionAmount && req.body.type){
let userdetails = await user.findById(req.body.userId)
if(userdetails && userdetails.isadmin == false){

if(req.body.type == 'sell'){
  let amountPresent = userdetails.currencies.find(o=>o.currencytype.trim().toLowerCase() == req.body.currencySold.trim().toLowerCase())
   console.log(amountPresent, req.body.transactionAmount,'ammountPresent')
  if(amountPresent.ammount > req.body.transactionAmount){
    userdetails.totalAmountSold =+  req.body.transactionAmount;
    amountPresent.ammount  = amountPresent.ammount - req.body.transactionAmount;
    let transaction = await TransactionController.updateUser(userdetails,req.body.transactionAmount,req.body.currencySold,'ft')
    console.log(transaction,'sac')
    setTimeout(()=>{
      TransactionController.adminTransaction(req.body.transactionAmount,req.body.type,'ft',userdetails,transaction)
    },5000);
    res.status(200).send(responseObj(200,'Trade added',[])); 
  }else{
    res.status(200).send(responseObj(402,'you dont have enough currency',[])); 
  }
}else if(req.body.type == 'buy'){
  let amountPresent = userdetails.currencies.find(o=>o.currencytype.trim().toLowerCase() == 'ft')
  if(amountPresent.ammount  > 0){
    userdetails.totalAmountBought =+  req.body.transactionAmount;
    amountPresent.ammount  = amountPresent.ammount - req.body.transactionAmount;
    let transaction = await TransactionController.updateUser(userdetails,req.body.transactionAmount,'ft',req.body.currencyBought);
      setTimeout(()=>{
        TransactionController.adminTransaction(req.body.transactionAmount,req.body.type,req.body.currencyBought,userdetails,transaction)
      },5000)
    res.status(200).send(responseObj(200,'Trade added',[])); 
 

  }
  else
  {
    res.status(200).send(responseObj(403,'ft is not present',[])); 
  }
  
}


}else{
  res.status(403).send(responseObj(403,'Admin is not allowed',[])); 
}
}else{
  res.status(500).send(responseObj(500,'Please supply all the inputs',[])); 
}


}

 
static async  getAllTransaction(req,res){
let allTransactions = await Transaction.find({},{'status':0,'userId':0,}).catch((e)=>{log(e,false)})
if(allTransactions) {
  res.status(200).send(responseObj(200,'ok',allTransactions)); 
}else{
  res.status(200).send(responseObj(404,'error',[])); 
}
}
 static async getUserTransaction(req,res){
  if(req.params && req.params.id){
  let allTransactions = await Transaction.find({userId:mongoose.Types.ObjectId(req.params.id)},{'userId':0}).catch((e)=>{log(e,false)})
  if(allTransactions) {
    res.status(200).send(responseObj(200,'ok',allTransactions)); 
  }else{
    res.status(200).send(responseObj(404,'error',[])); 
  }
}else{
  res.status(500).send(responseObj(500,'Please supply all the inputs',[])); 
}
  }
}
export default TransactionController;
