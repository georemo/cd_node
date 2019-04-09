const route = require('express').Router();
var controller;
var s_ok;

//cars.use('/modules',modules);

console.log("...arrived at root'./cd/cd-api/app/index.js'");
route.all('/', (req,res) => {

    console.log("...arrived at '/app/modules'");
    console.log("req.query=" + JSON.stringify(req.query));
    s_ok = auth_session(req,res);//check session
    m_exec(req,res, s_ok);//module execution
    //res.status(200).json(ret);
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
function m_exec(req,res,s_ok) {
    console.log("...starting m_exec(req,res,s_ok)");
    var ret;
    var req_data = req.query;
    if (s_ok.success) {
        console.log("...s_ok=success");
        console.log("include ./modules/" + req_data.m + "/" + req_data.c + ".js");
        controller = require("./modules/" + req_data.m + "/" + req_data.c);
        ret = controller[req_data.a](req,res);
        console.log(JSON.stringify(ret));
        //respond to client with the module data
    } else {
        //respond with err
        console.log("...s_ok=failure");
        console.log("invalid session");
        ret = {"app_state": {"success": 0, "error": {"message": "", "error_code": "1"}}, "data": false};
    }
    return ret;
}

module.exports = route;
