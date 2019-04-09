
const fs = require('fs');
var path = require("path");
var cd_mysql = require('./cd_mysql');
var mdb = require('./mongodb_pool');
var sess = require('../sys/modules/user/session');
var g_ret = {"app_state": {"success": 1, "error": {"message": "", "error_code": "1"}}, "data": false};
var req_dat;

module.exports = {
    init: function (req, res) {
        init(req, res);
    },
    anon_falback: async function(req, res) {
        let ret = await anon_fallback(req, res);
        console.log("anon_fallback:public/ret>>");
        console.log(JSON.stringify(ret));
        return ret;
    },
    get_req_dat: function () {
        return req_dat;
    },
    controller_create: async function (req, res) {
        console.log("you are at base::controller_create()");
        //let valid_session = await sess.validate_session(req, res);
        let ret_session = await sess.create_session(req, res);
        console.log("b::controller_create::ret_session>>");
        console.dir(ret_session);
//        ret_session.each(function (err, doc) {
//            console.log(doc);
//        });
//        if (valid_session) {
//            let c_fields = await controller_fields(req, res);
//            let valid_fields = await validate_fields(req, res);
//            if (valid_fields) {
//                let ret = await create_iterator(req, res);
//            }
//        } else {
//            //return failure state
//        }
//        g_ret.app_state.success = 1;
//        g_ret.data = ret;
    },
    /*
     * get fields for a given controller
     */
    controller_fields: function (req, res) {
        console.log("starting base::create()");
        res.status(200).json(req.g_ret);
    },
    controller_read: async function (req, res) {
        console.log("you are at base::controller_create()");
        //let valid_session = await sess.validate_session(req, res);
        let ret_session = await sess.create_session(req, res);
        console.log("b::controller_create::ret_session>>");
        //console.dir(ret_session);
        ret_session.each(function (err, doc) {
            console.log(doc);
        });
//        if (valid_session) {
//            let c_fields = await controller_fields(req, res);
//            let valid_fields = await validate_fields(req, res);
//            if (valid_fields) {
//                let ret = await create_iterator(req, res);
//            }
//        } else {
//            //return failure state
//        }
//        g_ret.app_state.success = 1;
//        g_ret.data = ret;
    },
    mysql_read_prom: function (req, res, stmt) {
        console.log("starting base::mysql_read_prom(req,res)");
        return new Promise(function () {
            cd_mysql.read_prom(req, res, stmt)
                    .then(function (result) {
                        //handle results using 'Promise'
                    })
                    .catch(function (err) {
                        console.log("Promise rejection error: " + err.message);
                    });
        });
    },
    mysql_read_await: async function (req, res, o_sql) {
        console.log("starting base::mysql_read_await(req,res,stmt)");
        var result;
        try {
            console.log("o_sql2>>");
            console.log(JSON.stringify(o_sql));
            let result = await cd_mysql.mysql_pool_test(req, res, o_sql);
            console.log("results3>>");
            console.log(JSON.stringify(result));
            return result;
        } catch (err) {
            //throw new Error(err);
            console.log(err.message);
        }
        // Do something with result.
        console.log("results4>>");
        console.log(JSON.stringify(result));
        //return result;
    },
    mysql_create_await: async function (req, res, o_sql) {
        console.log("starting base::mysql_read_await(req,res,stmt)");
        var result;
        try {
            console.log("o_sql2>>");
            console.log(JSON.stringify(o_sql));
            let result = await cd_mysql.mysql_pool_insert(req, res, o_sql);
            console.log("results3>>");
            console.log(JSON.stringify(result));
            return result;
        } catch (err) {
            //throw new Error(err);
            console.log(err.message);
        }
        // Do something with result.
        console.log("results4>>");
        console.log(JSON.stringify(result));
        //return result;
    },
    cd_mdb: function () {
        console.log("starting base/mdb()");
        var x = "";
        this.run = async function (req, res) {
            console.log("starting base/mdb/run(req,res)");
            let ret;
            switch (req.mdb_req.a) {
                case "create":
                    console.log("starting base/mdb/create(req,res)");
                    ret = await create_mdb(req, res);
                    return ret;
                    break;
                case "upsert":
                    console.log("starting base/mdb/create(req,res)");
                    ret = await upsert_mdb(req, res);
                    return ret;
                    break;
                case "save":
                    console.log("starting base/mdb/create(req,res)");
                    ret = await save_mdb(req, res);
                    return ret;
                    break;
                case "read":
                    console.log("starting base/mdb/read(req,res)");
                    console.log("req.mdb_req>>");
                    console.log(req.mdb_req);
                    ret = await read_mdb(req, res);
                    return ret;
                    break;
                case "update":
                    console.log("starting base/mdb/update(req,res)");
                    ret = await update_mdb(req, res);
                    return ret;
                    break;
                case "remove":
                    console.log("starting base/mdb/remove(req,res)");
                    ret = await remove_mdb(req, res);
                    return ret;
                    break;
            }
            return ret;
        };
        this.create = async function (req, res) {
            console.log("starting base/mdb/create(req,res)");
            let ret = await create_mdb(req, res);
            return ret;
        };
        this.read = async function (req, res) {
            console.log("starting base/mdb/read(req,res)");
            //console.log("req.post>>");
            //console.log(req.post);
            let ret = await read_mdb(req, res);
            return ret;
        };
        this.update = async function (req, res) {
            console.log("starting base/mdb/update(req,res)");
            let ret = await update_mdb(req, res);
            return ret;
        };
        this.remove = async function (req, res) {
            console.log("starting base/mdb/remove(req,res)");
            let ret = await remove_mdb(req, res);
            return ret;
        };

        ///START MDB CRUD/////////////////////////////
        async function create_mdb(req, res) {
            console.log("starting base::create_mdb(req,res)");
            req.mdb_ctx = "local";
            try {
//                var t_name = "session";
//                sess_obj = {
//                    "cookie": {
//                        "originalMaxAge": 86387544,
//                        "expires": "2018-12-05T17:58:14.396Z",
//                        "httpOnly": true,
//                        "domain": "localhost",
//                        "path": "/",
//                        "sameSite": true
//                    },
//                    "views": 2,
//                    "p_sid": "mha0efc9snj17gdseqpu0d5ejf",
//                    "token": "B4449FD2-5B45-17B1-A4DE-F1175DA78E39",
//                    "acc_time_int": "1543946306672",
//                    "acc_time_h": "Tue Dec 04 2018 20:58:26 GMT+0300 (EAT)",
//                    "ttl": 600000,
//                    "exp_time_int": "1543946906672",
//                    "exp_time_h": "Tue Dec 04 2018 21:08:26 GMT+0300 (EAT)",
//                    "valid": 1,
//                    "ip": ""
//                };
                //var db_req = {t_name: t_name, insert_data: sess_obj};
                let result = await mdb.create(req, res);
                req.mdb_ctx = "";
                return result;
            } catch (e) {
                return e;
            }
        }
        
        async function save_mdb(req, res) {
            console.log("starting base::create_mdb(req,res)");
            req.mdb_ctx = "local";
            try {
//                var t_name = "session";
//                sess_obj = {
//                    "cookie": {
//                        "originalMaxAge": 86387544,
//                        "expires": "2018-12-05T17:58:14.396Z",
//                        "httpOnly": true,
//                        "domain": "localhost",
//                        "path": "/",
//                        "sameSite": true
//                    },
//                    "views": 2,
//                    "p_sid": "mha0efc9snj17gdseqpu0d5ejf",
//                    "token": "B4449FD2-5B45-17B1-A4DE-F1175DA78E39",
//                    "acc_time_int": "1543946306672",
//                    "acc_time_h": "Tue Dec 04 2018 20:58:26 GMT+0300 (EAT)",
//                    "ttl": 600000,
//                    "exp_time_int": "1543946906672",
//                    "exp_time_h": "Tue Dec 04 2018 21:08:26 GMT+0300 (EAT)",
//                    "valid": 1,
//                    "ip": ""
//                };
                //var db_req = {t_name: t_name, insert_data: sess_obj};
                let result = await mdb.save(req, res);
                req.mdb_ctx = "";
                return result;
            } catch (e) {
                return e;
            }
        }
        
        async function upsert_mdb(req, res) {
            console.log("starting base::upsert_mdb(req,res)");
            req.mdb_ctx = "local";
            try {
//                var t_name = "session";
//                sess_obj = {
//                    "cookie": {
//                        "originalMaxAge": 86387544,
//                        "expires": "2018-12-05T17:58:14.396Z",
//                        "httpOnly": true,
//                        "domain": "localhost",
//                        "path": "/",
//                        "sameSite": true
//                    },
//                    "views": 2,
//                    "p_sid": "mha0efc9snj17gdseqpu0d5ejf",
//                    "token": "B4449FD2-5B45-17B1-A4DE-F1175DA78E39",
//                    "acc_time_int": "1543946306672",
//                    "acc_time_h": "Tue Dec 04 2018 20:58:26 GMT+0300 (EAT)",
//                    "ttl": 600000,
//                    "exp_time_int": "1543946906672",
//                    "exp_time_h": "Tue Dec 04 2018 21:08:26 GMT+0300 (EAT)",
//                    "valid": 1,
//                    "ip": ""
//                };
                //var db_req = {t_name: t_name, insert_data: sess_obj};
                let result = await mdb.upsert(req, res);
                req.mdb_ctx = "";
                return result;
            } catch (e) {
                return e;
            }
        }

//async function create_old(req, res, o_sql) {
//    console.log("starting base::create(req,res)");
//    //var result;
//    try {
//        console.log("o_sql>>");
//        console.log(JSON.stringify(o_sql));
//        //let result = await b.mysql_create_await(req, res, o_sql);
//        result = {test_cd_cache: "testing cd_cache"};
//        console.log("results3>>");
//        console.log(JSON.stringify(result));
//        g_ret.app_state.success = 1;
//        g_ret.data = result;
//        res.status(200).json(g_ret);
//    } catch (err) {
//        //throw new Error(err);
//        console.log(err.message);
//    }
//}

        /*
         * check if entry with content id and user_id exists
         */
        async function multi_entry_mdb(req, res) {
            console.log("starting async base::multi_entry_mdb(req,res)");
            //var is_multi_entry = false;
            //var result;
            try {
                var query_data = {
                    "t_name": req.post.c,
                    "filter": {"token": req.post.dat.token, "content_id": req.post.dat.f_vals[0].content_id},
                    "fields": ["content_id", "token"]
                };

                console.log("query_data>>");
                console.log(JSON.stringify(query_data));
                let result = await mdb.select_i(req, res, query_data);
                console.log("base::multi_entry::results>>");
                console.dir(result);
                console.log("base::multi_entry::results.count>>");
                console.dir(result.length);
                if (result.length > 0) {
                    return true;
                } else {
                    return false;
                }
                //return result.length;
            } catch (e) {
                req.g_ret.app_state.success = 0;
                req.g_ret.app_state.error = e.message;
                req.g_ret.data = {};
                res.status(200).json(req.g_ret);
            }
            //return result;
        }

        /*
         * check if entry with content id and user_id exists
         */
        async function validate_create_mdb(req, res) {

            console.log("starting async base::validate_create(req,res)");
            var validated = true;

            return validated;
        }

        async function read_mdb(req, res) {
            console.log("starting async base::read_mdb(req,res)");
            //console.log("req.post>>");
            //console.log(req.post);
            //var result;
            try {
//        var t_name = req.post.c;
//        var read_query = req.post.dat;
//        var db_req = {t_name: t_name, read_query: read_query};
                if (validate_read_mdb(req, res)) {
                    let result = await mdb.read(req, res);
                    console.log("...validated...base::read_mdb::results>>");
                    console.dir(result);
                    console.log("...validated...base::read_mdb::req.app_state1>>");
                    console.dir(req.g_ret);
                    //sync req.g_ret
                    //req.g_ret.app_state.success = 1;
                    //console.log("...validated...base::read::req.app_state2>>");
                    //console.dir(req.g_ret);
                    req.g_ret.app_state.success = 1;
                    if (result.length > 0) {
                        if ('content' in result[0]) {
                            req.g_ret.data = result[0].content;
                        }
                        else{
                            req.g_ret.data = result;
                        }
                    } else {
                        req.g_ret.data = result;
                    }

//            if(typeof resp.data === 'string' || resp.data instanceof String){
//                resp.data = JSON.parse(resp.data);
//            }
//            else{
//                if('ok' in resp.data){
//                    resp.app_state.str_state = resp.data;//the resp.data is not cached data but app_state
//                    resp.data = [];
//                } 
//            } 
                    //let ret = await set_g_ret(req,g_ret);
                    //res.status(200).json(g_ret);
                    return req.g_ret;

                } else {
                    let result = await mdb.update(req, res);
                    req.g_ret.app_state.success = 1;
                    req.g_ret.data = {};
                    //res.status(200).json(g_ret);
                    return req.g_ret;
                }
            } catch (e) {
                req.g_ret.app_state.success = 0;
                req.g_ret.app_state.error = e.message;
                req.g_ret.data = {};
                //res.status(200).json(g_ret);
                return req.g_ret;
            }
        }

        function validate_read_mdb(req, res) {
            console.log("starting base::validate_read(req,res)");
            /*
             * if request is based on login resonse,
             * ie content_id: 'moduleman_ModulesController_GetModuleUserData_*',
             * 1. get user expired token
             * 2. use valid token to replace all data with expired token
             */
            return true;
        }

        async function set_g_ret_mdb(req, g_ret) {
            console.log("starting set_g_ret(req,g_ret");
            console.log("set_g_ret::g_ret>>");
            console.dir(g_ret);
            var str_obj = "[";
            let ret = [];
            var i = 0;
            for (var k in g_ret.data) {
                var key = Object.keys(g_ret.data)[i];
                console.log("key=" + key);
                console.log("k=" + k);
                if (i == 0) {
                    str_obj += '{"' + k + '":' + JSON.stringify(g_ret.data[k]) + '}';
                } else {
                    str_obj += ',{"' + k + '":' + JSON.stringify(g_ret.data[k]) + '}';
                }
                //var item = JSON.parse(str_item);
                //ret.push(item);
                i++;
            }
            str_obj += ']';
            ret = JSON.parse(str_obj);
            g_ret.data = ret;
            return g_ret;
        }

        /*
         * update_token(req, res)
         * - get existing token
         * - if existing_token==current_token, no action
         * else update_token()
         * Data to update
         * - moduleman_ModulesController_GetModuleUserData_156_1010
         * - user_user_profile_type_controller__read_156
         * - cd_social_cd_social_post_controller_GetPosts_156
         * - user_usercontroller_Contacts_156
         * - cd_setting_company_controller__read_company_id_company_name_156
         * - cd_social_cd_social_post_type_controller__read_156
         */
        async function update_token_mdb(req, res) {
            console.log("starting base::update(req,res)");
            try {
                var update_data = {
                    "t_name": req.post.c,
                    "filter": {"content_id": req.post.dat.f_vals[0].content_id},
                    "update": {"token": req.post.dat.f_vals[0].content}
                };
                let result = await mdb.update_i(req, res, update_data);
                console.log("base::update::results>>");
                console.log(JSON.stringify(result));
                req.g_ret.app_state.success = 1;
                req.g_ret.data = result.result;
                //res.status(200).json(g_ret);
                return req.g_ret;

            } catch (e) {
                console.log("base::update...1.");
                console.log("Erorr>>");
                console.log(JSON.stringify(e.message));
                req.g_ret.app_state.success = 0;
                req.g_ret.app_state.error = e.message;
                req.g_ret.data = false;
                //res.status(200).json(g_ret);
                return req.g_ret;
            }
        }

        async function update_mdb(req, res) {
            console.log("starting base::update_mdb(req,res)");
            console.log("req.mdb_ctx=" + req.mdb_ctx);
            console.log("req.mdb_req>>");
            console.log(JSON.stringify(req.mdb_req));
            var update_data;
            try {
                if(req.mdb_ctx=="local"){
                    update_data = {
                        "t_name": req.mdb_req.c,
                        "filter": req.mdb_req.dat.filter,
                        "update": req.mdb_req.dat.update
                    };
                }
                else{
                    update_data = {
                        "t_name": req.post.dat.c,
                        "filter": req.post.dat.filter,
                        "update": req.post.dat.update
                    };
                }
                
                let result = await mdb.update_i(req, res, update_data);
                console.log("base::update::results>>");
                console.log(JSON.stringify(result));
                req.g_ret.app_state.success = 1;
                req.g_ret.data = result.result;
                //res.status(200).json(g_ret);
                return req.g_ret;

            } catch (e) {
                console.log("base::update...1.");
                console.log("Erorr>>");
                console.log(JSON.stringify(e.message));
                req.g_ret.app_state.success = 0;
                req.g_ret.app_state.error = e.message;
                req.g_ret.data = false;
                //res.status(200).json(g_ret);
                return req.g_ret;
            }
        }

        async function remove_mdb(req, res) {
            console.log("starting base::remove(req,res)");
            //var result;
            try {
                var remove_data;
                if(req.mdb_ctx=="local"){
                    remove_data = {
                        "t_name": req.mdb_req.c,
                        "filter": req.mdb_req.dat.filter
                    };
                }
                else{
                    remove_data = {
                        "t_name": req.post.c,
                        "filter": req.post.dat.filter
                    };
                }
                let result = await mdb.remove_i(req, res, remove_data);
                console.log("base::remove::results>>");
                console.log(JSON.stringify(result));
                req.g_ret.app_state.success = 1;
                req.g_ret.data = result.result;
                //res.status(200).json(g_ret);
                return req.g_ret;
            } catch (e) {
                console.log("base::remove...1.");
                console.log("Erorr>>");
                console.log(JSON.stringify(e.message));
                req.g_ret.app_state.success = 0;
                req.g_ret.app_state.error = e.message;
                req.g_ret.data = false;
                //res.status(200).json(g_ret);
                return req.g_ret;
            }
        }
        ///END MDB CRUD ///////////////////////////////
    },
    time: function () {
        console.log("starting base/time()");
        var d = new Date();
        this.now_int = function () {
            console.log("starting now_int()...public");
            return now_int(d);
        };
        this.now_human = function () {
            return now_human(d);
        };
        this.t_sum_int = function (opts) {
            return t_sum_int(d, opts);
        };
        this.t_sum_human = function (opts) {
            return t_sum_human(d, opts);
        };
        this.t_diff_int = function (opts) {
            return t_diff_int(opts);
        };

        this.t_diff_human = function (opts) {
            return t_add(opts);
        };

        this.int_to_human = function (t_int) {
            return int_to_human(t_int);
        };

        this.human_to_int = function (t_human) {
            return human_to_int(t_human);
        };

        ///START TIME FUNCTIONS//////////
        function now_int(d) {
            console.log("starting now_int()...private");
            return d.getTime();
        }
        ;

        function now_human(d) {
            console.log("starting now_human()...private");
            var timestamp = now_int(d);
            //return new Date(timestamp*1000 + d.getTimezoneOffset() * 60000);
            return new Date(timestamp);
        }
        ;

        function t_sum_int(d, opts) {
            console.log("starting t_add(d,opts)...private");
            var t1 = opts.t1;
            var t2 = opts.t2;
            return t1 + t2;
        }
        ;

        function t_sum_human(d, opts) {
            console.log("starting t_add(d,opts)...private");
            var t1 = opts.t1;
            var t2 = opts.t2;
            return new Date(t1 + t2);
        }
        ;

        function t_diff_int(d, opts) {
            console.log("starting t_diff(d,opts)...private");
            var t1 = opts.t1;
            var t2 = opts.t2;
            return t2 - t1;
        }
        ;

        function t_diff_human(opts) {
            console.log("starting t_diff(d,opts)...private");
            var t1 = opts.t1;
            var t2 = opts.t2;
            return new Date(t2 - t1);
        }
        ;

        function int_to_human(t_int) {
            return new Date(t_int);
        }

        function human_to_int(t_human) {
            var d = Date(t_human);
            return d.getTime();
        }

///END TIME FUNCTIONS////////////////////////////////////////
    }
};

function init(req, res) {
    set_req_dat(req.query.dat.f_vals[0].data);
}

function set_req_dat(val) {
    req_dat = val;
}

async function create(req, res, o_sql) {
    console.log("starting base::mysql_read_await(req,res,stmt)");
    var result;
    try {
        console.log("o_sql2>>");
        console.log(JSON.stringify(o_sql));
        let result = await cd_mysql.mysql_pool_insert(req, res, o_sql);
        console.log("results3>>");
        console.log(JSON.stringify(result));
        return result;
    } catch (err) {
        //throw new Error(err);
        console.log(err.message);
    }
    // Do something with result.
    console.log("results4>>");
    console.log(JSON.stringify(result));
    //return result;
}
/*
 * fetch fields for a given controller
 */
async function controller_fields(req, res) {
    console.log("starting designation::controller_fields(req,res)");
    //var j_sql = require('json-sql')();
    //var db = "cd1211";
    //var stmt = "select * from " + db + "." + req.query.m + "_" + req.query.c;
    //console.log("starting base::mysql_read_await(req,res,stmt)");
    var result;
    var o_sql = {
        q_type: 'select',
        t_name: 'user',
        fields: ['username', 'fname', 'lname'],
        filter: "username='karl'",
        tail: ""
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
        req.g_ret.app_state.success = 1;
        req.g_ret.data = result;
        return result;
        //res.status(200).json(g_ret);
    } catch (err) {
        //throw new Error(err);
        console.log(err.message);
    }
}

async function create_iterator(req, res) {
    let valid_dup = await validate_duplicates(req, res);
    let valid_empt_fld = await validate_empty_field(req, res);
    if (valid_dup && valid_empt_fld) {
        //storage for async results
        var arr_ret = [];
        //iterate through array of inserts
        req.f_vals.forEach(async function (obj, i) {
            let result = await create(req, res);
            arr_ret.push(result);
        });
        return arr_ret;

    } else {
        //return failure state
    }
}




/*
 * used to return anon user data...used to draw page on logged out case
 * The function uses the content id 'moduleman_ModulesController_GetModuleUserData__1000' to fetch data
 * if gui is modified and the content id changes for fetching anon data, then updat content id in this function.
 */
async function anon_fallback(req, res) {
    console.log("starting anon_fallback(req,res)");
    var req_data = {m: 'moduleman',
        c: 'cd_cache',
        a: 'read',
        dat:
                {fields: ['content_id', 'user_id', 'content'],
                    filter:
                            {content_id: 'moduleman_ModulesController_GetModuleUserData__1000',
                                user_id: '1000'},
                    token: ''},
        args:
                {doc_from: '',
                    doc_to: '',
                    subject: 'anon state',
                    doctyp_id: ''}};
    req.post = req_data;
    console.log("...s_ok=failure");
    console.log("invalid session");
    console.log("req.url:" + req.url);
    var ctx = "sys";
    console.log("include " + '../' + ctx + '/modules/' + req_data.m + '/' + req_data.c + '.js');
    var controller = require('../' + ctx + '/modules/' + req_data.m + '/' + req_data.c + '.js');
    ret = await controller[req_data.a](req, res);
    console.log("anon_fallback/ret>>");
    console.log(JSON.stringify(ret));
    //return ret;
    //res.setHeader("Content-Type", "application/json");
    //res.send(JSON.stringify(ret));
    return ret;
}


