//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const fs = require('fs');
const mongoose = require('mongoose');
const db = require('../../../app-data/db-settings');

//GET Requests Only

function validate(dataset, res){
    var premissions = JSON.parse(fs.readFileSync(__dirname + '/premissions.json'));

    if (premissions[dataset].allow === true){
        return premissions[dataset].collection;
    }
    else {
        res.send(401);
    }
}

router.get("/:dataset/count" , function(req, res){
    
    var collection = validate(req.params.dataset, res);
    if(collection != null){
        db[collection].find().count(function (err, result) {
            res.send(`{"count": ${result}}`);
        });
    }
});

router.get("/:dataset/:skip/:limit" , function(req, res){

    var collection = validate(req.params.dataset, res);
    if(collection != null){
        db[collection].find().skip(parseInt(req.params.skip))
        .limit(parseInt(req.params.limit)).exec(function (err, result) {
            res.send(result);
        });
    }
});


module.exports = router;