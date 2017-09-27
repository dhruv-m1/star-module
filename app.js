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
    res.render('demo/directory', {loc: loc});
})
app.get('/demo/logs', function(req, res){
    res.render('demo/logs', {loc: loc});
})
app.get('/demo/transfers', function(req, res){
    res.render('demo/transfers', {loc: loc});
})
app.get('/demo/transfers/register', function(req, res){
    gateway.getTransferData(req.query.origin, '').then(function(result){
        console.log(result);
        res.render('demo/transfers-register', {data: result, loc: loc});
    });
})
app.get('/demo/inventory', function(req, res){
    res.render('demo/inventory', {loc: loc});
})
app.get('/demo/scan', function(req, res){
    res.render('demo/scan', {loc: loc});
})