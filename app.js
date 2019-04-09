//Testing API using curl:
///*
// * C0MMAND: curl -k -X POST -H 'Content-Type: application/json' -H 'anon:0' -H 'p_sid:goqes5rof9i8tcvrv341krjld8' -H 'sess_ttl:10' -H 'token:2DC1B60A-4361-A274-ACB5-622C842B545C' -d '{"m":"moduleman","c":"cd_cache","a":"read","dat":{"fields":["content_id","user_id","content"],"filter":{"content_id":"moduleman_ModulesController_GetModuleUserData_156_1000","user_id":"1000"},"token":""},"args":{"doc_from":"","doc_to":"","subject":"read cd_accts_bank","doctyp_id":""}}' https://corpdesk.net:3004/sys -v
// 
// * EXPECTED RESPONSE FORMAT: {"app_state":{"success":1,"str_state":"","error":{"message":"","error_code":"1"}},"data":{}}
// * 
// * valid user querying for user_data after login:
// * curl -k -X POST -H 'Content-Type: application/json' -H 'anon:0' -H 'p_sid:goqes5rof9i8tcvrv341krjld8' -H 'sess_ttl:10' -H 'token:2DC1B60A-4361-A274-ACB5-622C842B545C' -d '{"m":"moduleman","c":"cd_cache","a":"read","dat":{"fields":["content_id","user_id","content"],"filter":{"content_id":"moduleman_ModulesController_GetModuleUserData_156_1010","user_id":"1010"},"token":"CADFE0DB-342F-C8DB-6EAA-7CDDE9621C52","p_sid":"s3n39am5n3l18lskvast7v5t99","sess_ttl":"10","init_ctx":"login"},"args":{"doc_from":"","doc_to":"","subject":"read cd_accts_bank","doctyp_id":""}}' https://corpdesk.net:3004/sys -v
// * 
// * test data insert
// * curl -k -X POST -H 'Content-Type: application/json' -H 'anon:0' -H 'p_sid:goqes5rof9i8tcvrv341krjld8' -H 'sess_ttl:10' -H 'token:2DC1B60A-4361-A274-ACB5-622C842B545C' -d '{"m":"moduleman","c":"cd_cache","a":"create","dat":{"f_vals":[{"date":"xxx"}],"token":""},"args":{"doc_from":"","doc_to":"","subject":"read cd_accts_bank","doctyp_id":""}}' http://localhost:3003/sys -v
// * expected response:
// * 
// * START RESPONSE:
// * Note: Unnecessary use of -X or --request, POST is already inferred.
//*   Trying ::1...
//* TCP_NODELAY set
//* Connected to localhost (::1) port 3003 (#0)
//> POST /sys HTTP/1.1
//> Host: localhost:3003
//> User-Agent: curl/7.54.0
//> Accept: */*
//> Content-Type: application/json
//> anon:0
//> p_sid:goqes5rof9i8tcvrv341krjld8
//> sess_ttl:10
//> token:2DC1B60A-4361-A274-ACB5-622C842B545C
//> Content-Length: 171
//> 
//* upload completely sent off: 171 out of 171 bytes
//< HTTP/1.1 200 OK
//< X-Powered-By: Express
//< Access-Control-Allow-Origin: *
//< Content-Type: application/json; charset=utf-8
//< Content-Length: 104
//< ETag: W/"68-lZjJPigAzb130iWwa9K+EOVCzM4"
//< set-cookie: server-session-cookie-id=s%3Agoqes5rof9i8tcvrv341krjld8.PHhxRHKP9JU%2BxXul3IK3nEozRXVI2%2BLrHPOWvjmqQXQ; Domain=localhost; Path=/; Expires=Wed, 10 Apr 2019 10:17:51 GMT; HttpOnly; SameSite=Strict
//< Date: Tue, 09 Apr 2019 10:18:11 GMT
//< Connection: keep-alive
//< 
//* Connection #0 to host localhost left intact
//{"app_state":{"success":1,"str_state":"","error":{"message":"","error_code":"1"}},"data":{"ok":1,"n":1}}
//
// END RESPONSE


// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
var express = require("express");
const uuid = require('uuid/v4');
const session = require('express-session');
var config = require('./cd-api/sys/config');
var mongo_config = config.get('mongodb');
var STORE_URI = mongo_config[1].conn_str;
const MongoStore = require('connect-mongo')(session);
var csrf = require('csurf');

var app = express();
var cors = require('cors');
var path = require("path");
var cd_post = require('./cd-api/base/cd_post');
var init = require('./cd-api/base/init');
var cd_sess = require('./cd-api/sys/modules/user/session');
var cs = new cd_sess.store();
var b = require('./cd-api/base/b');
var port = 3003;

app.use(cors()); //normal CORS
app.options('*:*', cors()); //preflight

app.use(require('morgan')('dev'));


// Certificate
const privateKey = fs.readFileSync('./sec/corpdesk_net_pk_01.key', 'utf8');
const certificate = fs.readFileSync('./sec/corpdesk_net.crt', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate
};

app.post('/sys', async function valid_session(req, res, next) {
    //test_cd_sess(req, res);
    let validated = await cs.is_valid(req, res);
    let ret;
    //validated = false;
    if (validated) {
        console.log("initial session validation passed");
        //initialize global return data with default values
        req.g_ret = {"app_state": {"success": 1, str_state: "", "error": {"message": "", "error_code": "1"}}, "data": false};
        return next();
    } else {
        console.log("initial session validation failed");
        //initialize global return data, set error code to 5005...expired session
        if (req.headers.init_ctx == "login") {
            req.g_ret = {"app_state": {"success": 1, str_state: "", "error": {"message": "", "error_code": "5006"}}, "data": false};
        } else {
            req.g_ret = {"app_state": {"success": 1, str_state: "", "error": {"message": "", "error_code": "5005"}}, "data": false};
        }
        let ret = await b.anon_falback(req, res);
        res.status(200).json(ret);
    }
});

var _24hrs = 24 * 60 * 60 * 1000;//session ttl

app.use(session({
    genid: (req) => {
        console.log('Inside the session middleware');
        console.log(req.sessionID);
        console.log("init_session/p_sid");
        console.dir(req.headers["p_sid"]);
        if (req.headers["p_sid"] == "undefined" || typeof (req.headers["p_sid"]) == "undefined") {
            return "undifined_" + uuid();
        } else {
            return req.headers["p_sid"];
        }
    },
    name: 'server-session-cookie-id',
    cookie: {
        maxAge: _24hrs,
        expires: new Date(Date.now() + _24hrs),
        sameSite: true,
        domain: 'localhost'},
    store: new MongoStore({url: STORE_URI}),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

var csrfProtection = csrf({
    cookie: {
        key: '_csrf', // cookie name
        sameSite: true, // never send outside with CORS
        httpOnly: true, // do not put this cookie into document.cookie
        domain: 'localhost' // limit cookie to 'my.company.com' and subdomains
    }
});

app.post('/sys', function initViewsCount(req, res, next) {
    if (typeof req.session.views === 'undefined') {
        console.log("first time visit");
        req.session.views = 0;
    }
    return next();
});


//...experimental for visit stats
app.post('/app', function initViewsCount(req, res, next) {
    if (typeof req.session.views === 'undefined') {
        console.log("first time visit");
        req.session.views = 0;
    }
    return next();
});

//...experimental for visit stats
app.post('/sys', function incrementViewsCount(req, res, next) {
    console.log("increamenting view count");
    req.session.views++;
    return next();
});

//...experimental for visit stats
app.post('/app', function incrementViewsCount(req, res, next) {
    console.log("increamenting view count");
    req.session.views++;
    return next();
});

//...experimental for session diagnostics
app.use(function printSession(req, res, next) {
    console.log('req.session', req.session);
    return next();
});

var sess;

app.post("/sys", async function (req, res) {
    console.log("...post sys_entry");

    console.log('Inside the sys callback function');
    console.log(req.sessionID);
    sess = req.session;
    cd_post.proc_post(req, res, async function () {
        var req_data = req.post;
        console.log("cd_post.proc_post/req_data>>");
        console.dir(req_data);
        console.log("req.session>>");
        console.log(JSON.stringify(req.session));
        let ret = await m_exec(req, res);//module execution
        console.log("app2::ret>>");
        console.dir(ret);
        res.status(200).json(ret);
    });
});

app.post("/app", async function (req, res) {
    console.log("...post app_entry");

    console.log('Inside the sys callback function');
    console.log(req.sessionID);
    sess = req.session;
    sess.token = "tok_app_0002";

    cd_post.proc_post(req, res, async function () {
        var req_data = req.post;
        console.log("req_data>>");
        console.dir(req_data);
        let s_ok = await cs.is_valid(req, res);
        let ret = await m_exec(req, res, s_ok);//module execution
        console.log("app2::ret>>");
        console.dir(ret);
        res.send(JSON.stringify(ret));
    });
});

app.use(function (request, response) {
    response.status(404).send("Page not found!");
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(3003, () => {
    console.log('HTTP Server running on port 3003');
});

httpsServer.listen(3004, () => {
    console.log('HTTPS Server running on port 3004');
});

/*
 * module execution
 */
async function m_exec(req, res) {
    console.log("...starting m_exec(req,res)");
    let ret;
    var req_data = req.post;
    console.log("m_exec/req_data>>");
    console.log(JSON.stringify(req_data));
    if (typeof (req_data.m) != "undefined") {
        console.log("req_data.c>>");
        console.log(req_data.c);
        var filePath = path.join(__dirname, "cd-api", req.url);
        console.log("file_path:" + filePath);
        console.log("include " + filePath + "/modules/" + req_data.m + "/" + req_data.c + ".js");
        controller = require(filePath + "/modules/" + req_data.m + "/" + req_data.c);
        ret = await controller[req_data.a](req, res);
        console.log("s_ok is true; m_exec/ret>>");
        console.log(JSON.stringify(ret));
        return ret;
    } else {
        console.log("m_exec/something wrong with request data");
        //change state to anon
        ret = await b.anon_falback(req, res);
        console.log("s_ok is false; m_exec/ret>>");
        console.log(JSON.stringify(ret));
        return ret;
    }
}

