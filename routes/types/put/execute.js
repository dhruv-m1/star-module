//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const db = require('../../../app-data/db-settings');
const validator = require('../validate');

//PUT Requests


router.put("/:dataset/" , function(req, res){
    var collection = validator.premissions(req.params.dataset, res, "put");
    res.set('Content-Type', 'application/json');

    var validationResult = validator.schemaValidate(collection, req.body);

    if(validationResult === true){
        db[collection].findByIdAndUpdate(req.body._id, req.body).then(function(){
                res.send(`{"status":"successful"}`);
        });
    }
    else {
        res.send(validationResult);
    }
});


module.exports = router;