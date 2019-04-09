/*
////test url http://localhost:3000/?name=barry
// dependencies
const app = require('express')();
const pino = require('pino')();
//var http = require('http');
//var querystring = require('querystring');
const cd_post = require('./cd-api/base/cd_post.js');
const cd_api = require('./cd-api');
const PORT = process.env.PORT || 3000;
var cors = require('cors');

//function processPost(req, resp, callback) {
//    var queryData = "";
//    if(typeof callback !== 'function') return null;
//
//    if(req.method == 'POST') {
//        req.on('data', function(data) {
//            queryData += data;
//            if(queryData.length > 1e6) {
//                queryData = "";
//                resp.writeHead(413, {'Content-Type': 'text/plain'}).end();
//                req.connection.destroy();
//            }
//        });
//
//        req.on('end', function() {
//            req.post = querystring.parse(queryData);
//            callback();
//        });
//
//    } else {
//        resp.writeHead(405, {'Content-Type': 'text/plain'});
//        resp.end();
//    }
//}
app.use(cors());
//  Connect all our routes to our application
//app.use('/', cd_api,function(req,res){
//    if(req.method == 'POST') {
//        processPost(req, res, function() {
//            console.log(req.post);
//            // Use request.post here
//
//            res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
//            res.end();
//        });
//    } else {
//        res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
//        res.end();
//    }
//});

app.post('/', cd_api,function(req,res){
    console.log("...app.post('/', cd_api,function(req,res)");
    if(req.method == 'POST') {
        console.log("req.post>>");
        console.dir(req.post);
        cd_post.proc_post(req, res, function() {
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

// Turn on that server!
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
*/

//////////////////////////////////////////////////////////
var port = 3001;
var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
var cd_post = require('./cd-api/base/cd_post');
app.use(function (req, res, next) {
    console.log("Request IP: " + req.url);
    console.log("Request date: " + new Date());
    next();
});
app.use(async function (req, res, next) {
    if (req.method == 'POST') {
        console.log("req.query>>");
        console.dir(req.query);
        console.log("req.url>>");
        console.log(req.url);
        var filePath = path.join(__dirname, "cd_api", req.url);
        console.log("file_path:" + filePath);
        
        cd_post.proc_post(req, res, async function () {
            console.log("req.post1>>");
            console.log(req.post);
            var req_data = req.post;
            console.log("include " + filePath + "/modules/" + req_data.m + "/" + req_data.c + ".js");
            // Use request.post here
            //var filePath = path.join(__dirname, "cd_api", "sys/");
            //console.log("file_path:" + filePath);
            //var cntrl = require('./cd_api/sys');
            //var cntrl = require(filePath);
            //cntrl.tst(req, res);
            var s_ok = auth_session(req,res);//check session
            let ret = await m_exec(req,res, s_ok);//module execution
            res.status(200).json(ret);
            //res.send(ret);
            //res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            //res.end();
        });
    } else {
        res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        res.end();
    }
    //next();
    //return;
    //res.end();
});

app.use(function (req, res) {
    res.status(404);
    res.send("File not found!");
});
app.listen(port, function () {
    console.log("App started on port " + port);
});

/*
 * check session policy
 * - time-out
 * - is this multi-session, is multi-session allowed etc
 */
function auth_session(req,res) {
    console.log("...starting auth_session(req.query)");
    //var s = require('user::session')
    var s_ok;//session ok
    s_ok = {success: true};
    return s_ok;
}

/*
 * module execution
 */
async function m_exec(req,res,s_ok) {
    console.log("...starting m_exec(req,res,s_ok)");
    let ret;
    var req_data = req.post;
    if (s_ok.success) {
        console.log("...s_ok=success");
        var filePath = path.join(__dirname, "cd-api", req.url);
        console.log("file_path:" + filePath);
        console.log("include " + filePath + "/modules/" + req_data.m + "/" + req_data.c + ".js");
        controller = require( filePath + "/modules/" + req_data.m + "/" + req_data.c);
        ret = await controller[req_data.a](req,res);
        console.log(JSON.stringify(ret));
        //respond to client with the module data
        return ret;
    } else {
        //respond with err
        console.log("...s_ok=failure");
        console.log("invalid session");
        ret = {"app_state": {"success": 0, "error": {"message": "", "error_code": "1"}}, "data": false};
    }
    return ret;
}

