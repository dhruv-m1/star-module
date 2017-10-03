//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const validator = require('../validate');
const mongoose = require('mongoose');
const db = require('../../../app-data/db-settings');

//GET Requests Only

router.get("/:dataset/:skip/:limit" , function(req, res){

    var collection = validator.premissions(req.params.dataset, res, "get");
    res.set('Content-Type', 'application/json');
    if(collection != null){
        db[collection].find().skip(parseInt(req.params.skip))
        .limit(parseInt(req.params.limit)).exec(function (err, result) {
            console.log(result);
            res.send(result);
        });
    }
});


module.exports = router;