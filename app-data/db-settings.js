//Database connection and schema settings for STAR Module -  Written by Dhruv Malik.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

console.log('>> Establishing Database connection.');
mongoose.connect("mongodb://starbackend:star123!@ds131492.mlab.com:31492/star_module_testing");
//Warning may be seen on console due to Mongoose issue #5304 on GitHub. This can safely be ignored.
mongoose.connection.once('open', function(){
    console.log('>> Connected.');
}).on('error', function(error){
    console.log(`>> ERROR ---> Database Connection: ${error.message}`);
    console.log('---------------');
    console.log(error);
});
