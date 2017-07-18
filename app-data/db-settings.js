//Database connection and schema settings for STAR Module -  Written by Dhruv Malik.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var shortid = require('mongoose-shortid-nodeps');
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
    _id: {
        type: shortid,
        len: 6,
        alphabet: 'STOCKRECP1234567890', //Base will trigger is this character set is not sufficient.
        base: 64
    },
    timestamp: String,
    productName: String,
    productId: String,
    originName: String,
    originId: Number,
    destinationId: Number,
    quantity: Number
},{ collection: 'StockReceipt' }));

module.exports.StockTransfer = mongoose.model('StockTransfer', new Schema({
    _id: {
        type: shortid,
        len: 6,
        alphabet: 'STOCKRANFE1234567890', //Base will trigger is this character set is not sufficient.
        base: 64
    },
    timestamp: String,
    productName: String,
    productId: String,
    originId: Number,
    destinationId: Number,
    quantity: Number
},{ collection: 'StockTransfer' }));

module.exports.StockLocations = mongoose.model('StockLocations', new Schema({
    _id: {
        type: shortid,
        len: 9,
        alphabet: 'STOCKLCAIN1234567890', //Base will trigger is this character set is not sufficient.
        base: 64
    },
    name: String,
    map_url: String,
    address: String,
    locationId: String,
    contact: String,
    phone: Number
},{ collection: 'StockLocations' }));

module.exports.Inventory = mongoose.model('Inventory', new Schema({
    productName: String,
    productId: String,
    locationId: Number,
    quantity: Number,
    batches: Array,
    batchQuantity: Array
},{ collection: 'Inventory' }));

module.exports.Plants = mongoose.model('Plants', new Schema({
    name: String,
    owner: String,
    address: String,
    plantId: String,
    contact: String,
    phone: Number
},{ collection: 'plants' }));