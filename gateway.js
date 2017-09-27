// Written by Dhruv M in 2017
const db = require('./app-data/db-settings');


let typicalDBRead = (collection, query, filters, statsOnly) => {

    return new Promise((resolve, reject) => {
        if (statsOnly === true){

            db[collection].find(query,filters).count(function (err, result) {

                if (err != null) {console.log(err)}
                else {resolve(result)};
            });
        }else {
            db[collection].find(query,filters).exec(function (err, result) {
                resolve(result);
            });
        }

    });
}

module.exports.getLocStats = (locid) => {
    return new Promise((resolve, reject) => {
        let count = 0;
        let stats = {
            products: null,
            inventory: null,
            categories: null,
            directory: {
                depots: null,
                factories: null
            },
            logs:{
                in: null,
                out: null,
                receipt: null
            },
            about: null
        };

        let done = () => {
            count++;
            if (count === 9){
                resolve(stats);
            }
        }

        typicalDBRead('ProductList', {}, {}, true).then(function(result){stats.products = result; done();});
        typicalDBRead('CategoryList',{}, {}, true).then(function(result){stats.categories = result; done();});
        typicalDBRead('StockLocations',{}, {}, true).then(function(result){stats.directory.depots = result; done();});
        typicalDBRead('Plants', {}, {}, true).then(function(result){stats.directory.factories = result; done();});

        typicalDBRead('StockTransfer',{'destinationId': locid}, {}, true).then(function(result){stats.logs.in = result; done();});
        typicalDBRead('StockReceipt',{'destinationId': locid}, {}, true).then(function(result){stats.logs.receipt = result; done();});
        typicalDBRead('StockTransfer',{'originId': locid}, {}, true).then(function(result){stats.logs.out = result; done();});

        typicalDBRead('Inventory',{'locationId': locid}, {}, true).then(function(result){stats.inventory = result; done();});

        typicalDBRead('StockLocations',{'_id': locid}, {}, false).then(function(result){stats.about = result[0]; done();});

    });
}

let getLocDetails = (id) => {
    return new Promise((resolve, reject) => {

        typicalDBRead('StockLocations',{'_id': id}, {}, false).then(function(result){
            resolve(result);
        });
        
    });
}

module.exports.setConnection = (res, sessionid) =>{
    return new Promise((resolve, reject) => {
        typicalDBRead('_sessions',{'_id': sessionid}, {}, false).then(function(result){
            res.cookie('sessionLocation', `${result[0].currentLocation}`, { maxAge: 900000, httpOnly: true });
            getLocDetails(result[0].currentLocation).then(function(data){
                resolve(data[0]);
            });
        });
    });
}

module.exports.getTransferData = (location, article) => {
    return new Promise((resolve, reject) => {
        typicalDBRead('Inventory', {'locationId': location}, {}, false).then(function(result){
            console.log(location);
            resolve(result[0]);
        });
    });
}