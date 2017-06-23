//STAR Module - Written by Dhruv Malik
const mongoose = require('mongoose');
const assert = require('assert');

const db = require('../../app-data/db-settings');
const fs = require('fs');

module.exports.premissions = function (dataset, res, reqType){
    var premissions = JSON.parse(fs.readFileSync(__dirname + `/${reqType}/premissions.json`));

    if (premissions[dataset].allow === true){
        return premissions[dataset].collection;
    }
    else {
        res.send(401);
    }
}

module.exports.schemaValidate = function (collection, record) {

    let response = null;

    const preformChecks = function (attribute, specification){
        
        try {
            if(attribute != "_id" && attribute != "__v"){
                assert(typeof record[attribute] === specification.instance.toLowerCase());
            }
            else if(attribute === "__v" && response === null){
                response = true; 
            }
        } catch (error) {
            response = `{
                "err": "${attribute} - expected '${specification.instance}' but got '${typeof record[attribute]}'"
            }`;
        } 
    }
    
    mongoose.model(collection).schema.eachPath(preformChecks);

    return response;

}