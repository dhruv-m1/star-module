//STAR Module - Written by Dhruv Malik
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const routes = require('./routes/core');
const gateway = require('./gateway');
const assert = require('assert')
app.listen(process.env.port || 3030);

app.use('/api', routes);
app.use('/static', express.static('static'));
app.set('view engine', 'ejs');
const db = require('./app-data/db-settings');
app.use(cookieParser());

//Renders for Demo Application
let loc;
app.use(function (req, res, next) {
    try {
        assert(req.cookies.sessionId != undefined);
        gateway.setConnection(res, req.cookies.sessionId).then(function(result){
            loc = result;
            next();
        });
    } catch (error) {
        res.send(401);
    }
});

app.get('/demo/', function(req, res){
    gateway.getLocStats(req.cookies.sessionLocation).then(function(result){
        res.render('demo/index', {result: result, loc: loc});
    });
})

app.get('/demo/directory', function(req, res){
    gateway.getFirstPage('plants', loc._id).then(function(plants){
        gateway.getFirstPage('StockLocations', loc._id).then(function(warehouses){
            res.render('demo/directory', {loc: loc, plants: plants, warehouses: warehouses});
            
        });
    });
})
app.get('/demo/logs', function(req, res){
    gateway.getFirstPage('StockTransfer', loc._id).then(function(transfers){
        gateway.getFirstPage('StockReceipt', loc._id).then(function(receipts){
            res.render('demo/logs', {loc: loc, transfers: transfers, receipts: receipts});
        });
    });
})
app.get('/demo/transfers', function(req, res){
    res.render('demo/transfers', {loc: loc});
})
app.get('/demo/transfers/register', function(req, res){
    gateway.getTransferData(req.query.origin, req.query.productid).then(function(result){
        res.render('demo/transfers-register', {data: result, loc: loc});
    });
})
app.get('/demo/transfers/print/packingslip/:logid', function(req, res){
    gateway.getTransferConfirmation(req.params.logid).then(function(result){
        res.render('demo/transfers-package-slip', {image: `{"id":"${req.params.logid}", "log": "T"}`, data: result[0], location: result[1]});
    });
})
app.get('/demo/inventory', function(req, res){
    gateway.getFirstPage('Inventory', loc._id).then(function(result){
        res.render('demo/inventory', {loc: loc, resultCount: result.count, results: result.data});
    });
})
app.get('/demo/scan', function(req, res){
    res.render('demo/scan', {loc: loc});
})