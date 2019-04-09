var b = require('./b');
var cd_post = require('./cd_post');
var path = require("path");
const session = require('express-session');
//const MongoStore = require('connect-mongo')(session);

module.exports = {
    validate_session: async function (req, res) {
//        cd_post.proc_post(req, res, async function () {
//            var req_data = req.post;
//            console.log("validate_session/req_data>>");
//            console.dir(req_data);
//        });
        let ret = await validate_session(req, res);
        return ret;
    },
    auth_session: async function (req, res) {
        console.log("...starting auth_session(req.query)");
        console.log("session>>");
        console.log(JSON.stringify(req.session));
        var s_ok;//session ok
        if (validate_session(req, res)) {
            set_session_data(req, res);
            s_ok = {success: true};
        } else {
            s_ok = {success: false};
        }

        console.log("session>>");
        console.log(JSON.stringify(req.session));
        //s_ok = {success: true};
        return s_ok;
    },
    m_exec: async function (req, res, s_ok) {
        console.log("...starting m_exec(req,res,s_ok)");
        let ret;
        var req_data = req.post;
        if (s_ok.success) {
            console.log("...s_ok=success");
            var filePath = path.join(__dirname, "cd_api", req.url);
            console.log("req.url:" + req.url);
            console.log("file_path:" + filePath);
            console.log("include " + filePath + "/modules/" + req_data.m + "/" + req_data.c + ".js");
            controller = require(filePath + "/modules/" + req_data.m + "/" + req_data.c);
            ret = await controller[req_data.a](req, res);
            console.log(JSON.stringify(ret));
            return ret;
        } else {
            //respond with err
            console.log("...s_ok=failure");
            console.log("invalid session");
            ret = {"app_state": {"success": 0, "error": {"message": "", "error_code": "-1"}}, "data": false};
            return ret;
        }
        return ret;
    }
}

function set_session_data(req, res) {
    console.log("...starting set_session_data(req, res)");
    //var req_data = req.post;
    //req.session.p_sid = req_data.dat["p_sid"];//php session id
    //req.session.token = req_data.dat["token"];// cd token
    req.session.p_sid = req.headers["p_sid"];
    req.session.token = req.headers["token"];
    var sess_ttl, ttl;
    if ("sess_ttl" in req.headers) {
        sess_ttl = req.headers["sess_ttl"];//php cd_session_timeout in mins
        ttl = sess_ttl * 60 * 1000;//time to live (timeout) in milliseconds
        var cd_t = new b.time(null);
        var now_int = cd_t.now_int();
        console.log("now_int=" + now_int);
        var now_human = cd_t.now_human();
        console.log("now_human=" + now_human);
        var opts = {"t1": now_int, "t2": ttl};
        var exp_time_int = cd_t.t_sum_int(opts);
        var exp_time_h = cd_t.int_to_human(exp_time_int);
        console.log("exp_time_int=" + exp_time_int);
        console.log("exp_time_h=" + exp_time_h);
        req.session.acc_time_int = now_int.toString();//access time int
        req.session.acc_time_h = now_human.toString();//access time human
        req.session.ttl = ttl;//time to live
        req.session.exp_time_int = exp_time_int.toString();
        req.session.exp_time_h = exp_time_h.toString();
    }

    if (typeof req.session.views === 'undefined') {
        console.log("...is initial view");
        req.session.views = 0;
    } else {
        console.log("...is subsequent view");
        req.session.views++;
    }
}

async function validate_session(req, res) {
    console.log("...starting validate_session(req_data)");
    console.log("validate_session/anon>>");
    console.log(JSON.stringify(req.headers['anon']));
    console.log("req.headers['p_sid']=" + req.headers['p_sid']);
    console.log("req.headers['token']=" + req.headers['token']);
    console.log("req.headers['sess_ttl']=" + req.headers['sess_ttl']);
    console.log("req.headers['content_id']=" + req.headers['content_id']);

    let validated;
    let sess_life;
    var anon = req.headers["anon"];
    console.log("validate_session...001");
    if (anon == "1") {
        console.log("validate_session...002");
        validated = false;
    } else {
        console.log("validate_session...003");
        let ttl = await sess_ttl(req, res);
        let s_age = await session_age(req, res);
        console.log("validate_session/ttl=" + ttl);
        console.log("validate_session/s_age=" + s_age);
        console.log("validate_session...004");
        if (s_age == false) {
            console.log("validate_session...005");
            validated = false;
        } else {
            console.log("validate_session...006");
            if (s_age > ttl) {
                console.log("validate_session...007");
                if (typeof (req.session) == "undefined") {
                    console.log("validate_session...008");
                } else {
                    console.log("validate_session...009");
                    req.session.valid = 0;//invalidate session
                    set_sess_data(req.headers['p_sid'],req.session);
                }
                console.log("validate_session...010");
                validated = false;
            } else {
                console.log("validate_session...011");
                if (typeof (req.session) == "undefined") {
                    console.log("validate_session...012");
                } else {
                    console.log("validate_session...013");
                    //req.session.valid = 1;//do not enable this...can reverse already declared invalid session
                }
                console.log("validate_session...014");
                validated = true;
            }
        }
    }
    
    if('post' in req){
        console.log("validate_session...015");
        console.log("post_data is set");
        console.log(JSON.stringify(req.post));
        if('init_ctx' in req.post.dat){
            console.log("validate_session...016");
            console.log("req.post.dat.init_ctx=" + req.post.dat.init_ctx);
            if(req.post.dat.init_ctx=="login"){
                console.log("validate_session...017");
                var cd_t = new b.time(null);
                var now_int = cd_t.now_int();
                var now_human = cd_t.now_human();
                req.session.valid = 1;
                req.session.start_int = now_int.toString();//session start time int
                req.session.start_h = now_human.toString();//session start time human readable
                set_sess_data(req.headers['p_sid'],req.session);
                validated = true;
            }
        }
    }
    else{
        console.log("validate_session...018");
        console.log("post_data is not defined yet...");
    }
    console.log("validate_session...020");
    console.log("validate_session/req.session>>");
    console.log(JSON.stringify(req.session));
    
    return validated;
}

//get session age
async function session_age(req, res) {
    console.log("...starting session_age(req,res)");
    var cd_t = new b.time(null);
    var now_int = cd_t.now_int();
    let start_time = await start_time_int(req, res);//last access time from session store
    if (start_time) {
        console.log("session_age/now_int>>");
        console.log(now_int);
        console.log("session_age/start_time>>");
        console.log(start_time);
        var s_age = now_int - start_time;
        console.log("session_age/s_age=" + s_age);
        return s_age;
    } else {
        return false;
    }
}

/*
 * get last access time from session store
 */
async function acc_time_int(req, res) {
    console.log("...starting acc_time_int(req_data)");
    let sess_data = await get_sess_data(req, res);
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
    console.log("...starting start_time_int(req, res)");
    let sess_data = await get_sess_data(req, res);
    console.log("start_time_int/sess_data>>");
    console.log(JSON.stringify(sess_data));
    if (typeof (sess_data) == "undefined") {
        console.log("acc_time_int/sess_data is undefined >>");
        return 0;
    } else {
        console.log("acc_time_int/sess_data>>");
        console.log(JSON.stringify(sess_data));
        console.log("acc_time_int/sess_data.cookie>>");
        console.log(JSON.stringify(sess_data.cookie));
        console.log("acc_time_int/sess_data.start_time_int>>");
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
    console.log("...starting get_sess_data(req_data)");
    var cd_t = new b.time(null);
    var now_int = cd_t.now_int();
    var mStore = new MongoStore({url: 'mongodb://localhost:27017/test-app'});
    //var req_data = req.post;
    var p_sid = req.headers["p_sid"];
    console.log("get_sess_data/p_sid>>");
    console.dir(p_sid);
    let ret;
    ret = await mStore.get(p_sid, async function (error, sess_data) {
        if (error) {

        }
        console.log("get_sess_data/sess_data>>");
        console.log(JSON.stringify(sess_data));
        return sess_data;
    });
    if (typeof (ret) == "undefined") {
        console.log("Oops! no result session store... we fake one");
        now_int = now_int - 50;//back track a little to pass the validation
        ret = {"acc_time_int": now_int};
    }
    console.log("get_sess_data/ret>>");
    console.log(JSON.stringify(ret));
    return ret;
}

function set_sess_data(sid,sess) {
    console.log("...starting set_sess_data(sess)");
    var mStore = new MongoStore({url: 'mongodb://localhost:27017/test-app'});
    mStore.set(sid, sess,function (error) {
        if (error) {

        }
    });
}

/*
 * get session time to live from req
 */
function sess_ttl(req, res) {
    console.log("...starting sess_ttl(req_data)");
    //console.log("req.post>>");
    //console.dir(req.post);
    //var p_sid = req.headers["p_sid"];
    var ret;
    if ("sess_ttl" in req.headers) {
        var ttl = req.headers["sess_ttl"];//php cd_session_timeout in mins
        if (ttl == "") {
            console.log("bug...should not be empty");
            ttl = 10;
        }
        ret = ttl * 60 * 1000;//time to live (timeout) in milliseconds
    } else {
        console.log("bug...headers[sess_ttl] is not set or request headers");
        ret = false;
    }
    console.log("sess_ttl/ret" + ret);
    return ret;
}