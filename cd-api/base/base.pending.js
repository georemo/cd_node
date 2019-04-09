const models = require('express').Router();
var mysql = require('./mysql');
//var config = require('../sys/config');
var g_ret = {"app_state": {"success": 1, "error": {"message": "", "error_code": "1"}}, "data": false};

module.exports = {
    create: function (req, res) {
        console.log("starting base::create()");
    },
    read: function (req, res) {
        console.log("starting base::read()");
    },
    mysql_read_prom: function (req, res, stmt) {
        console.log("starting base::mysql_read_prom(req,res)");
//        mysql.read_prom(req, res, stmt)
//                .then(function (result) {
//                    console.log("Result: " + JSON.stringify(result));
//                    g_ret.app_state.success = 1;
//                    g_ret.data = result;
//                    //res.send(g_ret);
//                    res.status(200).json(g_ret);
//                })
//                .catch(function (err) {
//                    console.log("Promise rejection error: " + err);
//                });
    },
    mysql_exec: function (req, res, stmt) {
//        var db = "cd1211";
//        var con = mysql.createConnection({
//            host: "localhost",
//            user: "goremo",
//            password: "oremolaptop01"
//        });
//
//        con.connect(function (err) {
//            if (err)
//                throw err;
//            console.log("Connected!");
//
//            //var stmt = "select * from " + db + "." + req.query.m + "_" + req.query.c;
//            console.log("stmt=" + stmt);
//            con.query(stmt, function (err, result) {
//                if (err)
//                    throw err;
//                console.log("Result: " + JSON.stringify(result));
//                g_ret.app_state.success = 1;
//                g_ret.data = result;
//                //res.send(g_ret);
//                res.status(200).json(g_ret);
//            });
//        });
        //return g_ret;
    }
};

module.exports = models;
