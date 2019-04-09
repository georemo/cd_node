/*
 * Designation Controller:
 * Facilities:
 * 1. construct menu for the module
 */
const cd_api = require('express').Router();
const express = require('express');
var j_sql = require('json-sql')();
const app = express();
var b = require('../../../base/b');
//var mysql = require('mysql');
var g_ret = {"app_state": {"success": 1, "error": {"message": "", "error_code": "1"}}, "data": false};

console.log("...arrived at root'./cd/cd-api/app/cd-hrm/modules/cd-hrm/designation.js'");

module.exports = {
    create: function (req, res) {
        console.log("starting designation::create(req,res)");
        var o_sql = {
            q_type: 'insert',
            t_name: 'user',
            fields: ['username', 'fname','lname'],
            data: [{"username":"xx","fname":"yy","lname":"zz"}]
        };
        create(req, res,o_sql);
    },
    read: function (req, res) {
        console.log("starting designation::read(req,res)");
        //test_mysql2(req, res);
        test_mysql3(req, res);
    }
};

function test_db(req, res) {
    console.log("starting designation::test_db(req,res)");
    return "test_db() is ok";
}

function test_mysql(req, res) {
    console.log("starting designation::test_mysql(req,res)");
}

function test_mysql2(req, res) {
    console.log("starting designation::test_mysql2(req,res)");
    var db = "cd1211";
    var stmt = "select * from " + db + "." + req.query.m + "_" + req.query.c;
    //b.mysql_read_prom(req,res,stmt);
    b.mysql_read_prom(req, res, stmt)
            .then(function (result) {
                console.log("Result: " + JSON.stringify(result));
                g_ret.app_state.success = 1;
                g_ret.data = result;
                res.status(200).json(g_ret);
            })
            .catch(function (err) {
                console.log("Promise rejection error: " + err);
                g_ret.app_state.success = 0;
                g_ret.app_state.error.message = err.message;
                g_ret.app_state.error.error_code = err.errorno;
                g_ret.data = false;
                res.status(200).json(g_ret);
            });
    //b.read(req,res);
}

async function test_mysql3(req, res) {
    console.log("starting designation::test_mysql2(req,res)");
    var j_sql = require('json-sql')();
    var db = "cd1211";
    var stmt = "select * from " + db + "." + req.query.m + "_" + req.query.c;
    console.log("starting base::mysql_read_await(req,res,stmt)");
    var result;
    var o_sql = {
            q_type: 'select',
            t_name: 'user',
            fields: ['username', 'fname','lname'],
            filter: "username='karl'",
            tail:""
        };
    //var str_fields = o_sql.fields.join(", ");
    try {
//        var o_sql = j_sql.build({
//            type: 'select',
//            table: 'user',
//            fields: ['username', 'fname','lname'],
//            condition: {username: 'karl'}
//        });
        console.log("o_sql>>");
        console.log(JSON.stringify(o_sql));
        let result = await b.mysql_read_await(req, res, o_sql);
        console.log("results3>>");
        console.log(JSON.stringify(result));
        /////
        console.log("Result: " + JSON.stringify(result));
        g_ret.app_state.success = 1;
        g_ret.data = result;
        res.status(200).json(g_ret);
    } catch (err) {
        //throw new Error(err);
        console.log(err.message);
    }
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




function test_mongodb(req, res) {
    return "test_db() is ok";
}



