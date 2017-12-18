//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const validator = require('../validate');
const mongoose = require('mongoose');
const db = require('../../../app-data/db-settings');

//GET Requests Only
/*API to get pages for a dataset (handles 'Show More' button). ':dataset' is the name
of the dataset, ':skip' is the number of records (starting from index 0) to ignore,
':limit' is the max number of records to return*/
router.get("/:dataset/:skip/:limit/" , function(req, res){
    validator.permissions(req.params.dataset, res, req, "get").then(function(queryString){
        let collection = req.params.dataset;
        res.set('Content-Type', 'application/json');
        if(collection != null){
            db[collection].find(eval('('+queryString+')')).skip(parseInt(req.params.skip))
            .limit(parseInt(req.params.limit)).exec(function (err, result) {
                
                res.send(result);
            });
        }
    });
});


module.exports = router;