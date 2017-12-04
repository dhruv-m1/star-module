const assert = require('assert');
const db = require('../../app-data/db-settings');
const fs = require('fs');

const gateway = require('../../gateway');

module.exports.permissions = function (dataset, res, req, reqType){
    return new Promise((resolve, reject) => {
        try{
            let permissionsManifest;
            if (reqType != 'verifiy-loc'){
                permissionsManifest = JSON.parse(fs.readFileSync(__dirname + `/${reqType}/premissions.json`));
            }else {
                permissionsManifest = {null:{allow:true}};
            }

            if (permissionsManifest[dataset].allow === true){
                gateway.setConnection(res, req).then(function(result){

                    try {
                        if (result === "err"){
                                throw 401;
                        }else{
                            if (reqType === 'verifiy-loc') {
                                resolve(dataset);
                            } else{

                                let query = permissionsManifest[dataset].query_format;

                                query = query.replace(new RegExp("<loc>", 'g'), `"${result._id}"`);

                                if (reqType === 'post'){
                                    query = query.replace(new RegExp("<field>", 'g'), req.body.field);
                                    query = query.replace(new RegExp("<query>", 'g'), `${new RegExp(".*"+req.body.query+".*", "i")}`);
                                }

                                resolve(query);

                            }
                        }
                    } catch (error) {
                        res.sendStatus(error);
                    }
                });
            }
            else {
                res.sendStatus(403);
            }
        }catch(error){
            res.send(401);
        }
    });
}

module.exports.schemaValidate = function (collection, record) {

    let response = null;

    const preformChecks = function (attribute, specification){
        
        try {
            if(attribute != "_id" && attribute != "__v"){
                var requiredType = specification.instance.toLowerCase();

                if(requiredType === "array") {
                    requiredType = "object";
                }

                assert(typeof record[attribute] === requiredType);
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