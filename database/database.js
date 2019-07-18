import mongoose from 'mongoose';
import log from '../utility/chalk';
mongoose.connect('mongodb://localhost/dbo',{ useNewUrlParser: true }).catch((e)=>log(log(e,false)));
mongoose.connection.on('connected', function () {
    log('connected to database',true);
});
mongoose.connection.on('disconnected', function () {
    log('Mongoose default connection disconnected',false);
});
export default mongoose