//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const fs = require('fs');
const mongoose = require('mongoose');
const db = require('../../../app-data/db-settings');

//POST Requests

function validate(dataset, res){
    var premissions = JSON.parse(fs.readFileSync(__dirname + '/premissions.json'));

    if (premissions[dataset].allow === true){
        return premissions[dataset].collection;
    }
    else {
        res.send(401);
    }
}

router.post("/:dataset/:skip/:limit" , function(req, res){
    var collection = validate(req.params.dataset, res);
    if(collection != null){
        db[collection].find(req.body).count(function (err, count) {

            db[collection].find(req.body).skip(parseInt(req.params.skip))
            .limit(parseInt(req.params.limit)).exec(function (err, result) {
                result = `{"count":${count},"results":${result}}`;
                res.send(result);
            });
        });
    }
});

router.post("/:dataset/" , function(req, res){
    var collection = validate(req.params.dataset, res);
    if(collection != null){
        var newRecord = new db[collection](req.body);
        newRecord.save(function (err) {
            res.send(`"status":"successful"`);
        });
    }
});


module.exports = router;