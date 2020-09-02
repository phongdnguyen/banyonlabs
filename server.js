'use strict';

const port = process.env.PORT || 5000;

let express = require('express');
let path = require('path');

let app = express();
process.env.PWD = process.cwd();

app.use(express.static(path.join(process.env.PWD, 'public')));
app.listen(port);

module.exports = app;