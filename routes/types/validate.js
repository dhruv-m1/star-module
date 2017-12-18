const assert = require('assert');
const db = require('../../app-data/db-settings');
const fs = require('fs');

const gateway = require('../../gateway');
//Permissions function checks if the client request is allowed to execute.
module.exports.permissions = function (dataset, res, req, reqType){
    return new Promise((resolve, reject) => {
        try{
            let permissionsManifest;
            if (reqType != 'verifiy-loc'){
                //Checking permissions from file
                permissionsManifest = JSON.parse(fs.readFileSync(__dirname + `/${reqType}/permissions.json`));
            }else {
                //if only client authentication need to verified, the file is not downloaded.
                permissionsManifest = {null:{allow:true}};
            }

            if (permissionsManifest[dataset].allow === true){
                //Checking if client is authenticated.
                gateway.setConnection(res, req).then(function(result){

                    try {
                        if (result === "err"){
                                throw 401;
                        }else{
                            if (reqType === 'verifiy-loc') {
                                // If Authenticated, a response is returned to the target function
                                resolve(dataset);
                            } else{
                                //For post reuests, a query string is created here to prevent code injection.
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
/* MongoDB does not automatically validate the schema. Hence, this function
validates the schema before the record is saved.*/
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