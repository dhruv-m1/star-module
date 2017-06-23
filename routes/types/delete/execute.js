//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const validator = require('../validate');
const mongoose = require('mongoose');
const db = require('../../../app-data/db-settings');

//PUT Requests

router.delete("/:dataset/:id" , function(req, res){
    var collection = validator.premissions(req.params.dataset, res, "delete");
    if(collection != null){
        db[collection].findByIdAndRemove(req.params.id, function (err, data) {

            res.send(`{"status":"successful"}`);
        });
    }
});


module.exports = router;