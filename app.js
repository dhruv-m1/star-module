//STAR Module - Written by Dhruv Malik
const express = require('express');
const app = express();

const gateway = require('./gateway');
const routes = require('./routes/core');
app.listen(process.env.port || 3030);

app.use('/api', routes);