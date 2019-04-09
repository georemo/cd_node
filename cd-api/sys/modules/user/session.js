
/*
 * Notes:
 * 1. session should include base but should not be dependent on base..to avoid circular dependency
 * 2. session data should preferrabley saved in no_sql db 
 */
const cd_api = require('express').Router();
var mdb = require('../../../base/mongodb_pool');
var g_ret = {"app_state": {"success": 1, "error": {"message": "", "error_code": "1"}}, "data": false};

console.log("...arrived at root'./cd/cd-api/sys/modules/user/session.js'");

module.exports = {
    is_valid: async function (req, resp) {
        let ret = await is_valid(req, resp);
        return ret;
    },
    actionUpdate: function (req, res) {
        console.log("check test_db()" + test_db());
        return {msg: "starting create", req_data: req.query};
    },
    actionsession_data: function (req, res) {
        return test_mysql(req, res);
    },
    create_session: async function (req, res) {
        console.log("starting session::create()");
        var cd_mdb = new b.cd_mdb();
        try {
            var t_name = "session";
            sess_obj = {
                "cookie": {
                    "originalMaxAge": 86387544,
                    "expires": "2018-12-05T17:58:14.396Z",
                    "httpOnly": true,
                    "domain": "localhost",
                    "path": "/",
                    "sameSite": true
                },
                "views": 2,
                "p_sid": "mha0efc9snj17gdseqpu0d5ejf",
                "token": "B4449FD2-5B45-17B1-A4DE-F1175DA78E39",
                "acc_time_int": "1543946306672",
                "acc_time_h": "Tue Dec 04 2018 20:58:26 GMT+0300 (EAT)",
                "ttl": 600000,
                "exp_time_int": "1543946906672",
                "exp_time_h": "Tue Dec 04 2018 21:08:26 GMT+0300 (EAT)",
                "valid": 1,
                "ip": ""
            };
            var db_req = {t_name: t_name, insert_data: sess_obj};
            let result = await mdb.insert(req, res, db_req);
            return result;
        } catch (e) {
            return e;
        }
    },
    get_session: async function (req, res, sid) {
        console.log("starting session::create()");
        try {
            var collection = "session";
            var sess_obj = {sid: sid};
            let result = await mdb.read(req, res, collection, sess_obj);
            console.log("session::create_session::result>>");
            return result;
        } catch (e) {
            return e;
        }
        //return result;
    },
    deactivate_session_by_token: function (req, res) {
        return test_mysql(req, res);
    },
    deactivate_session_by_uid: function (req, res) {
        return test_mysql(req, res);
    },
    renew_session: function (req, res) {
        return test_mysql(req, res);
    },
    getCurrentUserID: function (req, res) {
        return test_mysql(req, res);
    },
    validate_session: function (req, res) {
        return validate_session(req, res);
    },
    store: function () {
        console.log("starting session/store()");
        var b = require('../../../base/b');
        var mdb = require('../../../base/mongodb_pool');
        var cd_mdb = new b.cd_mdb();
        var cd_t = new b.time(null);

        this.is_valid = async function (req, res) {
            let validated = await is_valid(req, res);
            return validated;
        }
        this.create = async function (req, res) {
            let ret;
            ret = await create(req, res);
            console.log("test_cd_sess/ret1>>");
            console.dir(ret);
        }
        this.read = async function (req, res) {

        }
        this.update = async function (req, res) {

        }
        this.remove = async function (req, res) {

        }



        /*
         * 1. set session from headers
         * 2. if login process, create new session
         */
        async function init(req, res) {
            console.log("...starting session_store/init(req, res)");
            console.log("req.headers[p_sid]=" + req.headers["p_sid"]);
            console.log("req.headers[token]=" + req.headers["token"]);
            console.log("req.headers[anon]=" + req.headers["anon"]);
            console.log("req.headers[init_ctx]=" + req.headers["init_ctx"]);
            //var req_data = req.post;
            //req.session.p_sid = req_data.dat["p_sid"];//php session id
            //req.session.token = req_data.dat["token"];// cd token
            req.g_ret = {"app_state": {"success": 1, "error": {"message": "", "error_code": "1"}}, "data": false};
            req.mdb_ctx = "local";
            var session = {cookie: {}};
            session.p_sid = req.headers["p_sid"];
            session.token = req.headers["token"];
            session.anon = req.headers["anon"];
            session.init_ctx = req.headers["init_ctx"];
            var ttl, times;
            ttl = get_ttl(req, res);
            times = get_times(req, res);
            
            session.ttl = ttl;//time to live
            session.acc_time_int = times.acc_time_int;//access time int
            session.acc_time_h = times.acc_time_h;//access time human
            session.exp_time_int = times.exp_time_int;
            session.exp_time_h = times.exp_time_h;
            
            return session;
        }

        function get_times(req, res) {
            var times = {};
            //var cd_t = new b.time(null);
            var now_int = cd_t.now_int();
            console.log("now_int=" + now_int);
            var now_human = cd_t.now_human();
            console.log("now_human=" + now_human);
            var opts = {"t1": now_int, "t2": get_ttl(req, res)};
            var exp_time_int = cd_t.t_sum_int(opts);
            var exp_time_h = cd_t.int_to_human(exp_time_int);
            console.log("exp_time_int=" + exp_time_int);
            console.log("exp_time_h=" + exp_time_h);
            times.acc_time_int = now_int.toString();//access time int
            times.acc_time_h = now_human.toString();//access time human
            times.exp_time_int = exp_time_int.toString();//expire time int
            times.exp_time_h = exp_time_h.toString();//expire time human
            return times;
        }

        function get_ttl(req, res) {
            var sess_ttl, ttl;
            if ("sess_ttl" in req.headers) {
                sess_ttl = req.headers["sess_ttl"];//php cd_session_timeout in mins
                ttl = sess_ttl * 60 * 1000;//time to live (timeout) in milliseconds
            }
            return ttl;
        }

        async function create(req, res) {
            console.log("starting session_store/create(req,res)");
            req.mdb_req = {
                "m": "cd", //db name
                "c": "session", //table name
                "a": "save", //crud action
                "dat": {
                    "fields": [],
                    "filter": {},
                    "update": {},
                    "f_vals": [req.cd_sess]
                },
                "args": {
                    "doc_from": "",
                    "doc_to": "",
                    "subject": "",
                    "doctyp_id": ""
                }
            };
            req.mdb_ctx = "local";
            let ret;
            ret = await cd_mdb.run(req, res);
            console.log("session/store/create/ret>>");
            console.dir(ret);
            return ret;
        }

        async function is_valid(req, res) {
            console.log("...starting session_store/is_valid(req, res)");
            let session;
            session = await init(req, res);
            req.cd_sess = session;

            let ret;
            if (req.headers.init_ctx == "login") {
                console.log("session_store/is_valid/is_login...010");
                //times = get_times(req, res);
                req.cd_sess.valid = 1;
                req.cd_sess.start_time_int = session.acc_time_int;//session start time int
                req.cd_sess.start_h = session.acc_time_h;//session start time human readable
                return true;//if login, do not do any validation, we have a new session
            } else {
                let validated;
                console.log("session_store/is_valid...0011");
                if (req.cd_sess.anon == "1") {
                    console.log("is_valid...002");
                    validated = false;
                } else {
                    console.log("session_store/is_valid...003");
                    //let ttl = await sess_ttl(req, res);
                    let s_age = await session_age(req, res);
                    console.log("session_store/is_validttl=" + req.cd_sess.ttl);
                    console.log("session_store/is_valids_age=" + s_age);
                    console.log("session_store/is_valid...004");
                    if (s_age == false) {
                        console.log("session_store/is_valid...005");
                        console.log("req.headers.init_ctx=" + req.headers.init_ctx);
                        validated = false;
                        if (req.headers.init_ctx == "login") {//exception for login
                            validated = true;
                        }
                    } else {
                        console.log("session_store/is_valid...006");
                        if (s_age > req.cd_sess.ttl) {
                            console.log("session_store/is_valid...007");
                            if (typeof (req.cd_sess) == "undefined") {
                                console.log("session_store/is_valid...008");
                            } else {
                                console.log("session_store/is_valid...009");
                                req.cd_sess.valid = 0;//invalidate session
                            }
                            console.log("session_store/is_valid...010");
                            validated = false;
                        } else {
                            console.log("session_store/is_valid...011");
                            if (typeof (req.cd_sess) == "undefined") {
                                console.log("session_store/is_valid...012");
                            } else {
                                console.log("session_store/is_valid...013");
                                //req.session.valid = 1;//do not enable this...can reverse already declared invalid session
                            }
                            console.log("session_store/is_valid...014");
                            validated = true;
                        }
                    }
                }

                //once validity is determined...renew or kill session
                if (validated == true) {
                    console.log("session_store/is_valid...015");
                    ret = await renew(req, res);
                    console.log("init/renew() ret>>");
                    console.dir(ret);
                } else {
                    console.log("session_store/is_valid...016");
                    //invalidate the session so all subsequent attempts with same sid will fail
                    ret = await kill(req, res);
                    console.log("init/kill() ret>>");
                    console.dir(ret);
                }
                console.log("session_store/is_valid...020");
                console.log("session_store/is_valid/req.cd_sess>>");
                console.log(JSON.stringify(req.cd_sess));
                console.log("session_store/is_valid/validated=" + validated);
                return validated;
            }
        }

        /*
         * renew by setting latest access time
         */
        async function renew(req, res) {
            console.log("starting renew(req,res)");
            req.mdb_ctx = "local";
            var times = get_times(req, res);
            var update_data = {};
            update_data.acc_time_int = times.acc_time_int;//access time int
            update_data.acc_time_h = times.acc_time_h;//access time human readable
            update_data.exp_time_int = times.exp_time_int;//expire time int
            update_data.exp_time_h = times.exp_time_h;//expire time human readable
            update_data.ttl = get_ttl(req, res);
            req.mdb_req = {
                "m": "cd", //db name
                "c": "session", //table name
                "a": "update", //crud action
                "dat": {
                    "filter": {"_id": req.cd_sess.token},
                    "update": update_data
                },
                "args": {
                    "doc_from": "",
                    "doc_to": "",
                    "subject": "",
                    "doctyp_id": ""
                }
            };
            ret = await cd_mdb.run(req, res);
            console.log("session/renew/ret>>");
            console.dir(ret);
            return ret;
        }

        async function kill(req, res) {
            console.log("starting kill(req,res)");
            req.mdb_ctx = "local";
            req.mdb_req = {
                "m": "cd", //db name
                "c": "session", //table name
                "a": "update", //crud action
                "dat": {
                    "filter": {"_id": req.cd_sess.token},
                    "update": {"valid": 0}
                },
                "args": {
                    "doc_from": "",
                    "doc_to": "",
                    "subject": "",
                    "doctyp_id": ""
                }
            };
            ret = await cd_mdb.run(req, res);
            console.log("session/kill/ret>>");
            console.dir(ret);
            return ret;
        }

        //get session age
        async function session_age(req, res) {
            console.log("...starting session_store/session_age(req,res)");
            //var cd_t = new b.time(null);
            var now_int = req.cd_sess.acc_time_int;//before this function was called, we set acc_time_int using now_int
            let last_acc_time = await acc_time_int(req, res);//time when session was last accessed from mdb
            if (last_acc_time) {
                console.log("session_age/now_int>>");
                console.log(now_int);
                console.log("session_age/acc_time>>");
                console.log(last_acc_time);
                var s_age = now_int - last_acc_time;
                console.log("session_age/s_age=" + s_age);
                if(s_age==0){
                    s_age=1;//avoid confusion with 0 for false during login
                }
                return s_age;
            } else {
                return false;
            }
        }

        /*
         * get last access time from session store
         */
        async function acc_time_int(req, res) {
            console.log("...starting session_store/acc_time_int(req_data)");
            let ret = await get_sess_data(req, res);
            var sess_data;
            if (ret.data.length > 0) {
                sess_data = ret.data[0];
            } else {
                sess_data = {};
            }
            console.log("acc_time_int/sess_data>>");
            console.log(JSON.stringify(sess_data));
            if (typeof (sess_data) == "undefined") {
                console.log("acc_time_int/sess_data is undefined >>");
                return 0;
            } else {
                console.log("acc_time_int/sess_data>>");
                console.log(JSON.stringify(sess_data));
                console.log("acc_time_int/sess_data.cookie>>");
                console.log(JSON.stringify(sess_data.cookie));
                console.log("acc_time_int/sess_data.acc_time_int>>");
                console.log(sess_data.acc_time_int);
                console.log("acc_time_int/sess_data.valid>>");
                console.log(sess_data.valid);
                if (sess_data.valid == 0) {
                    sess_data.acc_time_int = 0; //if session had earlier been invalidated(by setting valid=0), any further request for the given session will be failed
                    //  unless a new one is created by logging in
                }
                return sess_data.acc_time_int;
            }
        }

        /*
         * get last access time from session store
         */
        async function start_time_int(req, res) {
            console.log("...starting session_store/start_time_int(req, res)");
            let ret = await get_sess_data(req, res);
            console.log("start_time_int/ret>>");
            console.log(JSON.stringify(ret));

            var sess_data;
            if (ret.data.length > 0) {
                sess_data = ret.data[0];
            } else {
                sess_data = {};
            }
            console.log("start_time_int/sess_data>>");
            console.log(JSON.stringify(sess_data));
            if (typeof (sess_data) == "undefined") {
                console.log("start_time_int/sess_data is undefined >>");
                return 0;
            } else {
                console.log("start_time_int/sess_data>>");
                console.log(JSON.stringify(sess_data));
                console.log("start_time_int/sess_data.cookie>>");
                console.log(JSON.stringify(sess_data.cookie));
                console.log("start_time_int/sess_data.start_time_int>>");
                console.log(sess_data.start_time_int);
                console.log("start_time_int/sess_data.valid>>");
                console.log(sess_data.valid);
                if (sess_data.valid == 0) {
                    sess_data.start_time_int = 0; //if session had earlier been invalidated(by setting valid=0), any further request for the given session will be failed
                    //  unless a new one is created by logging in
                }
                return sess_data.start_time_int;
            }
        }

        async function get_sess_data(req, res) {
            console.log("...starting session_store/get_sess_data(req_data)");
            req.mdb_req = {
                "m": "cd", //db name
                "c": "session", //table name
                "a": "read", //crud action
                "dat": {
                    "fields": "",
                    "filter": {"token": req.cd_sess.token}
                },
                "args": {
                    "doc_from": "",
                    "doc_to": "",
                    "subject": "",
                    "doctyp_id": ""
                }
            };
            req.g_ret = {"app_state": {"success": 1, "error": {"message": "", "error_code": "1"}}, "data": false};
            ret = await cd_mdb.run(req, res);
            console.log("session_store/get_sess_data/ret>>");
            console.dir(ret);
            return ret;
        }
    }
};

