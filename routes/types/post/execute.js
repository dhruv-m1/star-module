//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const db = require('../../../app-data/db-settings');
const validator = require('../validate');

//POST Requests

router.post("/:dataset/:skip/:limit" , function(req, res){
    var collection = validator.premissions(req.params.dataset, res, "post");
    res.set('Content-Type', 'application/json');
    if(collection != null){
        db[collection].find(req.body).count(function (err, count) {

            db[collection].find(req.body).skip(parseInt(req.params.skip))
            .limit(parseInt(req.params.limit)).exec(function (err, result) {
                result = `{"count":${count},"results":${JSON.stringify(result)}}`;
                res.send(result);
            });
        });
    }
});

router.post("/:dataset/" , function(req, res){
    var collection = validator.premissions(req.params.dataset, res, "post");
    res.set('Content-Type', 'application/json');
    if(collection != null){
        var validationResult = validator.schemaValidate(collection, req.body);

        if(validationResult === true){
            var Record = new db[collection](req.body);
            Record.save(function (err) {
                res.send(`{"status":"successful"}`);
            });
        }
        else {
            res.send(validationResult);
        }

    }
});

router.post("/receive" , function(req, res){
    var collection = validator.premissions(req.params.dataset, res, "post");
    res.set('Content-Type', 'application/json');
    if(collection != null){
        var validationResult = validator.schemaValidate(collection, req.body);

        if(validationResult === true){
            var Record = new db[collection](req.body);
            Record.save(function (err) {
                res.send(`{"status":"successful"}`);
            });
        }
        else {
            res.send(validationResult);
        }

    }
});
module.exports = router;