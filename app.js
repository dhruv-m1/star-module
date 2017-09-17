//STAR Module - Written by Dhruv Malik
const express = require('express');
const app = express();

const routes = require('./routes/core');
app.listen(process.env.port || 3030);

app.use('/api', routes);
app.use('/static', express.static('static'));
app.set('view engine', 'ejs');
const db = require('./app-data/db-settings');
//Renders for Demo Application

app.get('/demo', function(req, res){
    res.render('demo/index');
})

app.get('/demo/directory', function(req, res){
    res.render('demo/directory');
})
app.get('/demo/logs', function(req, res){
    res.render('demo/logs');
})
app.get('/demo/transfers', function(req, res){
    res.render('demo/transfers');
})
app.get('/demo/transfers/register', function(req, res){
    db['Inventory'].findOne({"productId": `${req.query.productid}`, "locationId": req.query.origin}).exec(function (err, result) {
        res.render('demo/transfers-register', {data: result});
    });
})
app.get('/demo/inventory', function(req, res){
    res.render('demo/inventory');
})
app.get('/demo/scan', function(req, res){
    res.render('demo/scan');
})