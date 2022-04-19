// DEBUG=express:* node ./server/index.js 
// DOCS: https://angular.io/guide/build#proxying-to-a-backend-server

const express     = require('express');
const serveStatic = require('serve-static');
const path        = require('path');

var app = express()
app.use(express.json());
require('./logging')(app);

app.use('/',              serveStatic(path.join(__dirname, '../dist/oracle-eye')))
app.use('/node_modules/', serveStatic(path.join(__dirname, '../node_modules')))
app.use('/api', require('./api'))

app.listen(3000)
