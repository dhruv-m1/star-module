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

module.exports.ProductList = mongoose.model('ProductList', new Schema({
    name: String,
    productId: String,
    description: String,
    supplier: String,
    category: String,
    cost: Number
},{ collection: 'ProductList' }));

module.exports.CategoryList = mongoose.model('CategoryList', new Schema({
    name: String,
    description: String
},{ collection: 'CategoryList' }));

module.exports.StockReceipt = mongoose.model('StockReceipt', new Schema({
    timestamp: String,
    productName: String,
    productId: String,
    batchId: String,
    origin: String,
    destination: String
},{ collection: 'StockReceipt' }));

module.exports.StockTransfer = mongoose.model('StockTransfer', new Schema({
    timestamp: String,
    productName: String,
    productId: String,
    origin: String,
    destination: String
},{ collection: 'StockTransfer' }));

module.exports.StockLocations = mongoose.model('StockLocations', new Schema({
    name: String,
    latitude: Number,
    longitude: Number,
    address: String,
    locationId: String,
    contact: String,
    phone: Number
},{ collection: 'StockLocations' }));

module.exports.Inventory = mongoose.model('Inventory', new Schema({
    productName: String,
    productId: String,
    loaction: String,
    quantity: Number
},{ collection: 'Inventory' }));

module.exports.Plants = mongoose.model('Plants', new Schema({
    name: String,
    owner: String,
    address: String,
    plantId: String,
    contact: String,
    phone: Number
},{ collection: 'plants' }));