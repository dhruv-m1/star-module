//STAR Module - Written by Dhruv Malik
const express = require('express');
const app = express();

const routes = require('./routes/core');
app.listen(process.env.port || 3030);

app.use('/api', routes);
app.use('/static', express.static('static'));
app.set('view engine', 'ejs');

//Renders for Demo Application

app.get('/demo', function(req, res){
    res.render('demo/index');
})