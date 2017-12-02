//Database connection and schema settings for STAR Module -  Written by Dhruv Malik.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var shortid = require('mongoose-shortid-nodeps');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

console.log('>> Establishing Database connection.');
mongoose.connect("mongodb://localhost:27017/star_module");
//Warning may be seen on console due to Mongoose issue #5304 on GitHub. This can safely be ignored.
let connection = mongoose.connection;

module.exports.connection = connection;

connection.once('open', function(){
    console.log('>> Connected.');
})
connection.on('error', function(error){
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
    originId: String,
    destinationId: String,
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
    originId: String,
    destinationId: String,
    quantity: Number,
    status: String,
    batches: Array,
    batchQuantity: Array
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
    locationId: String,
    quantity: Number,
    batches: Array,
    batchQuantity: Array
},{ collection: 'Inventory' }));

module.exports.plants = mongoose.model('plants', new Schema({
    name: String,
    owner: String,
    address: String,
    plantId: String,
    contact: String,
    phone: Number
},{ collection: 'plants' }));

module.exports._sessions = mongoose.model('_sessions', new Schema({
    currentLocation: String,
    authkey: String,
    userip: String,
    useragent: String
},{ collection: '_sessions' }));