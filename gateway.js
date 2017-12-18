// Requiring Packages
const db = require('./app-data/db-settings');
const http = require('http');

const bcrypt = require('bcrypt');
//Commonly used 'DB Read' function wrapped in promises to simplfiy code in this file.
let typicalDBRead = (collection, query, filters, statsOnly) => {

    return new Promise((resolve, reject) => {
        if (statsOnly === true){

            db[collection].find(query,filters).count(function (err, result) {

                if (err != null) {console.log(err)}
                else {resolve(result)};
            });
        }else {
            db[collection].find(query,filters).exec(function (err, result) {
                resolve(result);
            });
        }

    });
}
// Function to get dataset stats for dashboard.
module.exports.getLocStats = (locid) => {
    return new Promise((resolve, reject) => {
        let count = 0;
        let stats = {
            inventory: null,
            categories: null,
            directory: {
                depots: null,
                factories: null
            },
            logs:{
                in: null,
                out: null,
                receipt: null
            },
            about: null
        };

        let done = () => {
            count++;
            if (count === 7){
                resolve(stats);
            }
        }

        typicalDBRead('StockLocations',{}, {}, true).then(function(result){stats.directory.depots = result; done();});
        typicalDBRead('plants', {}, {}, true).then(function(result){stats.directory.factories = result; done();});

        typicalDBRead('StockTransfer',{'destinationId': locid}, {}, true).then(function(result){stats.logs.in = result; done();});
        typicalDBRead('StockReceipt',{'destinationId': locid}, {}, true).then(function(result){stats.logs.receipt = result; done();});
        typicalDBRead('StockTransfer',{'originId': locid}, {}, true).then(function(result){stats.logs.out = result; done();});

        typicalDBRead('Inventory',{'locationId': locid}, {}, true).then(function(result){stats.inventory = result; done();});

        typicalDBRead('StockLocations',{'_id': locid}, {}, false).then(function(result){stats.about = result[0]; done();});

    });
}
//Will find and get location details based on ID
let getLocDetails = (id) => {
    return new Promise((resolve, reject) => {

        typicalDBRead('StockLocations',{'_id': id}, {}, false).then(function(result){
            resolve(result);
        });
        
    });
}
//Checks if the orgininating request is from an authenticated client.
module.exports.setConnection = (res, req) =>{
    return new Promise((resolve, reject) => {
        typicalDBRead('_sessions',{'_id': req.cookies.sessionId}, {}, false).then(function(result){

            if(result[0] === undefined) {
                resolve('err');
                return;
            }
            result[0] = JSON.parse(JSON.stringify(result[0]));
            bcrypt.compare(req.cookies.authkey, result[0].authkey, function(err, allow) {
                
                if(allow === true){
                    //If the client authenticates for the first time, their IP and User agent will be captured.
                    if (result[0].userip === "captureOnFirstAccess") {

                        db._sessions.updateOne({'_id': req.cookies.sessionId}, { userip: `${req.ip}`, useragent:`${req.headers['user-agent']}` }).exec(function(err, updateData){
                            getLocDetails(result[0].currentLocation).then(function(data){
                                resolve(data[0]);
                            });
                        });
                    }
                    //For any subsequent request, the IP, User-Agent, Auth Key & Session ID will be cross-checked.
                    else if (result[0].userip === req.ip && result[0].useragent === req.headers['user-agent']){
                        getLocDetails(result[0].currentLocation).then(function(data){
                            
                            resolve(data[0]);
                        });
                    }
                    else{
                        resolve('err');
                        return;
                    }
                }
            });
        });
    });
}
//Finds and returns inventory record for product being transferred.
module.exports.getTransferData = (location, article) => {
    return new Promise((resolve, reject) => {
        typicalDBRead('Inventory', {'locationId': location, 'productId': article}, {}, false).then(function(result){
            resolve(result[0]);
        });
    });
}
// Finds appropriate information and reutrns a combined JSON object for generating transfer slip.
module.exports.getTransferConfirmation = (logid) => {
    return new Promise((resolve, reject) => {
        typicalDBRead('StockTransfer', {'_id': logid}, {}, false).then(function(result){

            typicalDBRead('StockLocations', {'_id': result[0].destinationId}, {}, false).then(function(locationDetails){
                result = [result[0], locationDetails[0]]
                resolve(result);
            });
        });
    });
}
// Gets first 10 records for Inventory, Logs & Directory pages to avoid AJAX request on load.
module.exports.getFirstPage = (collection, locid) => {

    return new Promise((resolve, reject) => {

        if(collection === "Inventory"){

            db.Inventory.find({'locationId': locid}).limit(10).exec(function (err, result) {
                resolve({data: result});
            });

        } else if(collection === "StockTransfer"){

            db.StockTransfer.find({ $or: [ { originId: locid}, { destinationId: locid } ] } ).limit(10).exec(function (err, result) {
                resolve({data: result});
            });

        } else if(collection === "StockReceipt"){

            db.StockReceipt.find({destinationId: locid}).limit(10).exec(function (err, result) {
                resolve({data: result});
            });

        } else if(collection === "plants" || collection === "StockLocations"){

            db[collection].find().limit(10).exec(function (err, result) {
                resolve({data: result});
            });
        }
    });

}