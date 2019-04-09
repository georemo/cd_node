const routes = require('express').Router();
const express = require('express');
const cd_post = require('../cd-api/base/cd_post.js');
const app = require('./app');
const sys = require('./sys');
const exp = express();

routes.use('/app', app);
routes.use('/sys', sys);

console.log("...arrived at root'./cd/cd-api/index.js'");
exp.all('/', function (req, res) {

    if (req.method == 'POST') {
        console.log("req.query>>");
        console.dir(req.query);
        cd_post.proc_post(req, res, function () {
            console.log(req.post);
            // Use request.post here

            res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        res.end();
    }
});
module.exports = routes;
