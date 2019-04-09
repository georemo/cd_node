/*
 * User Controller:
 * Facilities:
 * 1. construct menu for the module
 */
const cd_api = require('express').Router();
var mysql = require('mysql');
var b = require('../../../base/b');
var req_dat;
var g_ret = {"app_state":{"success":1,str_state:"","error":{"message":"","error_code":"1"}},"data":false};

console.log("...arrived at root'./cd/cd-api/sys/modules/user/user.js'");

module.exports = {
    init: function (req, res) {
        init(req,res);
    },
    create: function (req, res) {
        console.log("starting user::create(req,res)");
        var o_sql = {
            q_type: 'insert',
            t_name: 'user',
            fields: ['username', 'fname','lname'],
            data: [{"username":"xx","fname":"yy","lname":"zz"}]
        };
        create(req, res,o_sql);
    },
    read: function (req,res) {
        return test_mysql(req,res);
    },
    WebRegister: function (req,res) {
        init(req,res);
        //var j_req = req.query;
        //console.log("j_req=" + JSON.stringify(j_req));
        //console.log("j_req.dat.f_vals[0].data=" + JSON.stringify(j_req.dat.f_vals[0].data));
        //console.log("req_dat=" + JSON.stringify(req_dat));
        b.controller_create(res,req);
        g_ret.app_state.str_state = "you are at user::webregister";
        g_ret.data = req.query;
        res.status(200).json(g_ret);
    },
    auth: function (req,res) {
        init(req,res);
        //var j_req = req.query;
        //console.log("j_req=" + JSON.stringify(j_req));
        //console.log("j_req.dat.f_vals[0].data=" + JSON.stringify(j_req.dat.f_vals[0].data));
        //console.log("req_dat=" + JSON.stringify(req_dat));
        b.controller_create(res,req);
        g_ret.app_state.str_state = "you are at user::webregister";
        g_ret.data = req.query;
        res.status(200).json(g_ret);
    }
};

function init(req,res){
    b.init(req,res);
    req_dat=b.get_req_dat(req, res);
}

async function create(req, res,o_sql) {
    console.log("starting create::test_mysql_insert(req,res)");
    var result;
    try {
        console.log("o_sql>>");
        console.log(JSON.stringify(o_sql));
        let result = await b.mysql_create_await(req, res, o_sql);
        console.log("results3>>");
        console.log(JSON.stringify(result));
        g_ret.app_state.success = 1;
        g_ret.data = result;
        res.status(200).json(g_ret);
    } catch (err) {
        //throw new Error(err);
        console.log(err.message);
    }
}

function test_db(req,res) {
    return "test_db() is ok";
}

function test_mysql(req,res) {
    var db = "cd1211";
    var con = mysql.createConnection({
        host: "localhost",
        user: "goremo",
        password: "oremolaptop01"
    });

    con.connect(function (err) {
        if (err)
            throw err;
        console.log("Connected!");
        
        var stmt = "select * from " + db + "." + req.query.m + "_" + req.query.c;
        console.log("stmt=" + stmt);
        con.query(stmt, function (err, result) {
            if (err)
                throw err;
            console.log("Result: " + JSON.stringify(result));
            g_ret.app_state.success=1;
            g_ret.data = result;
            //res.send(g_ret);
            res.status(200).json(g_ret);
        });
    });
    //return g_ret;
}

function test_mongodb(req,res) {
    return "test_db() is ok";
}



