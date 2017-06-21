//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const fs = require('fs');
const mongoose = require('mongoose');
const db = require('../../../app-data/db-settings');

//DELETE Requests

function validate(dataset, res){
    var premissions = JSON.parse(fs.readFileSync(__dirname + '/premissions.json'));

    if (premissions[dataset].allow === true){
        return premissions[dataset].collection;
    }
    else {
        res.send(401);
    }
}

router.delete("/" , function(req, res){});


module.exports = router;