const models = require('express').Router();
var mysql = require('mysql');
var j_sql = require('json-sql')();
var config = require('../sys/config');

var conn;
var g_ret = {"app_state": {"success": 1, "error": {"message": "", "error_code": "1"}}, "data": false};


module.exports = {
    create: function (req, res, data) {
        //config[name] = data;
    },
    read: function (req, res, stmt) {
        conn.connect(function (err) {
            if (err)
                throw err;
            console.log("Connected!");

            //var stmt = "select * from " + db + "." + req.query.m + "_" + req.query.c;
            console.log("stmt=" + stmt);
            con.query(stmt, function (err, result) {
                if (err)
                    throw err;
                console.log("Result: " + JSON.stringify(result));
                g_ret.app_state.success = 1;
                g_ret.data = result;
                //res.send(g_ret);
                res.status(200).json(g_ret);
            });
        });
    },
    read_prom: function (req, res, stmt) {
        console.log("starting mysql::read_prom(req,res)");
        return new Promise(function () {
            init();
            conn.connect(function (err) {
                if (err)
                    throw err;
                console.log("Connected!");
                console.log("stmt=" + stmt);
                conn.query(stmt, function (err, result) {
                    if (err) {
                        //throw err;
                        g_ret.app_state.success = 0;
                        g_ret.app_state.error.message = err.message;
                        g_ret.app_state.error.error_code = err.errorno;
                        g_ret.data = false;
                        res.status(200).json(g_ret);
                    } else {
                        console.log("Result: " + JSON.stringify(result));
                        g_ret.app_state.success = 1;
                        g_ret.data = result;
                        res.status(200).json(g_ret);
                    }
                });
            });
        }
        );
    },
    mysql_pool_test: async function (req, res, o_sql) {
        console.log("starting mysql_pool_test: async function (req, res, stmt)");
        var pool = require('./mysql_pool');
        var j_sql = require('./j_sql');
        console.log("o_sql3>>");
        console.log(JSON.stringify(o_sql));
        var stmt = j_sql.select(req, res,o_sql);
        console.log("stmt:" + stmt);
        var result;
        try {
            let result = await pool.query(stmt);
            console.log("results>>");
            console.log(JSON.stringify(result));
            return result;
        } catch (err) {
            //throw new Error(err);
            console.log(err.message);
        }
        // Do something with result.
        console.log("results2>>");
        console.log(JSON.stringify(result));
        //return result;
    },
    mysql_pool_insert: async function (req, res, o_sql) {
        console.log("starting mysql_pool_insert: async function (req, res, stmt)");
        var pool = require('./mysql_pool');
        var j_sql = require('./j_sql');
        console.log("o_sql3>>");
        console.log(JSON.stringify(o_sql));
        var stmt = j_sql.insert(req, res,o_sql);
        console.log("stmt:" + stmt);
        var result;
        try {
            let result = await pool.query(stmt);
            console.log("results>>");
            console.log(JSON.stringify(result));
            return result;
        } catch (err) {
            //throw new Error(err);
            console.log(err.message);
        }
        // Do something with result.
        console.log("results2>>");
        console.log(JSON.stringify(result));
        //return result;
    },
    update: function (req, res, data) {
        //return config[name];
    },
    remove: function (req, res, data) {
        //return config[name];
    },
    exec: function (req, res, stmt) {
        //return config[name];
    }

};

function init() {
    console.log("starting mysql::init()");
    var mysql_configs = config.get('mysql');
    console.log("mysql_configs[0]>>");
    console.log(JSON.stringify(mysql_configs[0]));
    conn = mysql.createConnection(mysql_configs[0]);
}

function mysql_read_await(req, res, stmt) {
    return new Promise((resolve, reject) => {
        init();
        conn.connect(function (err) {
            if (err)
                throw err;
            console.log("Connected!");
            console.log("stmt=" + stmt);
            conn.query(stmt, function (err, result) {
                if (err) {
                    //throw err;
                    g_ret.app_state.success = 0;
                    g_ret.app_state.error.message = err.message;
                    g_ret.app_state.error.error_code = err.errorno;
                    g_ret.data = false;
                    //res.status(200).json(g_ret);
                } else {
                    console.log("Result: " + JSON.stringify(result));
                    g_ret.app_state.success = 1;
                    g_ret.data = result;
                    //res.status(200).json(g_ret);
                }
            });
        });
    });
}

//async function mysql_pool_test(req, res, stmt) {
//    var pool = require('./mysql_pool');
//    var result;
//    try {
//        result = await pool.query('SELECT * FROM users');
//    } catch (err) {
//        throw new Error(err);
//    }
//    // Do something with result.
//    return result;
//}

//module.exports = mysql_pool_test;

//module.exports = models;


