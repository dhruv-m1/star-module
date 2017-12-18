const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const db = require('../../../app-data/db-settings');
const gateway = require('../../../gateway');
const validator = require('../validate');
const fs = require('fs');
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
//POST Requests

router.post("/receive" , function(req, res){
    //checking if request is comming from an authenticated source using validator function
    validator.permissions('null', res, req, "verifiy-loc").then(function(validation){
        res.set('Content-Type', 'application/json');
        let collection;
        //Checking if scanned consignment is a receipt or transfer.
        if (req.body.log === "T"){
            collection = "StockTransfer";
        }else if(req.body.log === "R"){
            collection = "StockReceipt";
        }else{
            res.send(`{"status":"Invalid Data"}`);
        }
        //Getting the log record from appropriate collection in datastore. 
        db[collection].findOne({'_id': req.body.id}).exec(function (err, result) {
            result = JSON.stringify(result);
            result = JSON.parse(result); // To enable use of arrays in the JSON Object.
            // checking status of the consignmnent
            if(result === null){
                res.send(`{"status":"Not Found"}`);
            }else if(result.status.includes("Delivered")){
                res.send(`{"status":"Already Scanned"}`);
            // If the scan destination is correct, update the inventory record.
            }else if(req.body.scanLocationId === result.destinationId || req.body.scanLocationId === result.originId){
                // Updating log status
                db[collection].updateOne({'_id': req.body.id}, { status: `🡮 Delivered on ${Date()}` }).exec(function(err,updateData){
                    //getting inventory record for product at destination and adding quantity, batches & batchQuantitiy 
                    db.Inventory.findOne({productId: result.productId, locationId: req.body.scanLocationId}).exec(function (err, currentInventory) {
                        if(currentInventory != null){
                            let count = 0;

                            while(count < currentInventory.batches.length){
                                
                                let index = result.batches.indexOf(currentInventory.batches[count]);

                                if(index != -1){
                                    currentInventory.batchQuantity[count] += result.batchQuantity[index];

                                    result.batches.splice(index, 1);
                                    result.batchQuantity.splice(index, 1);
                                }
                                count += 1;
                            }

                            currentInventory.batches = currentInventory.batches.concat(result.batches);
                            currentInventory.batchQuantity = currentInventory.batchQuantity.concat(result.batchQuantity);
                            currentInventory.quantity += result.quantity;
                            //If scanned at origin, delete the transfer log. Quntitiy,bateches & batchQuantity is added back.
                            db.Inventory.findOneAndUpdate({productId: result.productId, locationId: req.body.scanLocationId}, currentInventory).exec(function (err, currentInventory) {
                                if(req.body.scanLocationId === result.originId){
                                    db[collection].deleteOne({'_id': req.body.id}).exec(function(err,result){
                                        res.send(`{"status":"Cancelled"}`);
                                    });
                                }else{
                                    res.send(`{"status":"Success", "product":"${result.productName}", "quantity": ${result.quantity}}`);
                                }
                            });

                            
                        }else{
                            var newRecord = new db.Inventory({
                                productName: result.productName, 
                                productId: result.productId,
                                locationId: result.locationId,
                                quantity: result.quantity,
                                batches: result.batches,
                                batchQuantity: result.batchQuantity,
                            });

                            newRecord.save(function (err) {
                                if(req.body.scanLocationId === result.originId){
                                    db[collection].deleteOne({'_id': req.body.id}).exec(function(err,result){
                                        res.send(`{"status":"Cancelled"}`);
                                    });
                                }else{
                                    res.send(`{"status":"Success", "product":"${result.productName}", "quantity": ${result.quantity}}`);
                                }
                            });
                        }
                    });
                });

            } else{
                res.send(`{"status":"Rejected"}`);
            }
        });
    });
    
});
// API to create a transfer out consignment
router.post("/send" , function(req, res){
    // Validator function check if the request is comming from an authenticated client. 
    validator.permissions('null', res, req, "verifiy-loc").then(function(validation){
        res.set('Content-Type', 'application/json'); //setting response type to JSON
        //Getting destination record
        db.StockLocations.findOne({'_id': req.body.destinationId}).exec(function (err, result) {
            if(result != null){
                let totalQuantity = 0;
                let count = 0;

                while(count < req.body.batchQuantity.length){
                    //Calculating total quantity being transferred.
                    totalQuantity += parseInt(req.body.batchQuantity[count]);
                    count += 1;
                }
                // Getting product inventory record at origin.
                db.Inventory.findOne({productId: req.body.productId, locationId: req.body.originId}).exec(function (err, result) {
                    result = JSON.parse(JSON.stringify(result)); // Done to overcome a bug in the MongoDB Driver being used.
                    count = 0;
                    //Updating total quantitiy, batches & batchQuantity for inventory record at origin.
                    result.quantity -= totalQuantity;
                    while(count < req.body.batches.length){
                        let index = result.batches.indexOf(parseInt(req.body.batches[count]));
                        if(index != -1){
                            result.batchQuantity[index] = parseInt(result.batchQuantity[index]) - parseInt(req.body.batchQuantity[count]);
                            if (result.batchQuantity[index] === 0){
                                result.batchQuantity.splice(index,1);
                                result.batches.splice(index,1);
                            }
                        }

                        count +=1;
                    }

                    db.Inventory.updateOne({'_id': result._id}, { quantity: result.quantity, batches: result.batches, batchQuantity: result.batchQuantity }).exec(function (err, updatedInventory) {
                    
                        let newRecord = new db.StockTransfer({
                            timestamp: Date(),
                            productName: result.productName, 
                            productId: result.productId,
                            originId: req.body.originId,
                            destinationId: req.body.destinationId,
                            quantity: totalQuantity,
                            batches: req.body.batches,
                            batchQuantity: req.body.batchQuantity,
                            status: `🡭 Dispatched on ${Date()}`
                        });

                        newRecord.save(function (err) {
                            res.send(`{"status":"Success", "code":"${newRecord._id}"}`);
                        });
                    });


                });

            }else{
                // If the destination does not exist.
                res.send(`{"status":"Invalid Destination"}`);
            }
        });
    });
});

/* API to get pages for a search query on a dataset (handles 'Show More' button on search query).
':dataset' is the name of the dataset, ':skip' is the number of records (starting from index 0) 
to ignore,':limit' is the max number of records to return */
router.post("/:dataset/:skip/:limit" , function(req, res){

    var collection = req.params.dataset;
    /*req contains req.body, which contains the search query. If the request is from an
    authenticated client, 'validator.premissions' will wrap the search query in a database
    query string and return it. This can be used to query the mongodb datastore.*/
    validator.permissions(req.params.dataset, res, req, "post").then(function(queryString){
        res.set('Content-Type', 'application/json');
        if(collection != null){
            //Running query on collection in the datastore.
            db[collection].find(eval('('+queryString+')')).skip(parseInt(req.params.skip))
            .limit(parseInt(req.params.limit)).exec(function (err, result) {

                res.send(result);
            });
        }
    });
});

// API used to create authentication session
router.post("/createSession" , function(req, res){
    //Checking if the request is comming from an allowed source.
    let authServers = JSON.parse(fs.readFileSync(__dirname + `/authServers.json`));
    let isAllowed = authServers.allowed.indexOf(`${req.ip}`);
    if (isAllowed === -1){
        //HTTP 'Forbidden' error sent if NOT allowed.
        res.sendStatus(403);
    }else{

        let sessionAuthKey = uuidv1(); //Creates Auth Key.
        //Creating DB Record.
        let newRecord = new db._sessions({
            currentLocation: req.body.locationId,
            authkey: sessionAuthKey,
            userip: "captureOnFirstAccess",
            useragent: "captureOnFirstAccess"
        });
        //Hashing & Salting Auth Key.
        bcrypt.hash(sessionAuthKey, 10, function(err, hash) {
            newRecord.authkey = hash;
        //Saving Record to Database.
            newRecord.save(function (err) {
                console.log(err);
                console.log(req.headers['user-agent']);
                console.log(req.ip);
                //Sending SessionId & unhashed Auth Key to client.
                res.send(`{"status":"Success", "sessionId":"${newRecord._id}", "authkey":"${sessionAuthKey}"}`);
            });
        });
    }
});
// API Used to delete authenticated sessions
router.post("/deleteSession" , function(req, res){
    // Checking if the request is comming from an allowed source.
    let authServers = JSON.parse(fs.readFileSync(__dirname + `/authServers.json`));
    let isAllowed = authServers.allowed.indexOf(`${req.ip}`);
    // If not allowed send HTTP 'Forbidden' Error.
    if (isAllowed === -1){
        res.sendStatus(403);
    }else{
        // Find and delete session from datastore
        db._sessions.deleteOne({'_id': req.body.sessionId}).exec(function(err,result){
            if(err === null){
                res.send(`{"status":"success"}`);
            }else{
                //Send error message if the session does not exisit.
                res.send(`{"status":"error", "data": "${err}"}`);
            }
        });
    }
});
module.exports = router;