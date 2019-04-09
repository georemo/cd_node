/*
 * User Controller:
 * Facilities:
 * 1. construct menu for the module
 */
const cd_api = require('express').Router();
var mysql = require('mysql');
var b = require('../../../base/b');
var mdb = require('../../../base/mongodb_pool');
var req_dat;
var g_ret = {"app_state": {"success": 1, str_state: "", "error": {"message": "", "error_code": "1"}}, "data": false};

console.log("...arrived at root'./cd/cd-api/sys/modules/moduleman/cd_cache.js'");

module.exports = {
    init: function (req, res) {
        init(req, res);
    },
    create: async function (req, res) {
        console.log("starting cd_cache::exports->create(req,res)");
        let ret = await create(req, res);
        return ret;
    },
    read: async function (req, res) {
        console.log("starting cd_cache::read(req,res)");
        console.log("req.post>>");
        console.log(req.post);
        let ret = await read(req, res);
        return ret;
    },
    update: async function (req, res) {
        console.log("starting cd_cache::exports->update(req,res)");
        let ret = await update(req, res);
        return ret;
    },
    remove: async function (req, res) {
        console.log("starting cd_cache::exports->update(req,res)");
        let ret = await remove(req, res);
        return ret;
    }
};

function init(req, res) {
    b.init(req, res);
    req_dat = b.get_req_dat(req, res);
}



/*
 * Request:
 * {
 "m": "moduleman",
 "c": "cd_cache",
 "a": "create",
 "dat": {
 "fields": "",
 "f_vals": [{
 "content_id": "cd_accts_bank_156_DEF3199F-470D-908F-5637-F31949658B84",
 "user_id": "1010",
 "content": {
 "xx": "yy"
 }
 }],
 "token": "DEF3199F-470D-908F-5637-F31949658B84"
 },
 "args": {
 "doc_from": "",
 "doc_to": "",
 "subject": "read cd_accts_bank",
 "doctyp_id": ""
 }
 }
 */
async function create(req, res) {
    console.log("starting cd_cache::create(req,res)");
    var m_entry;
    var result;
    try {
        //add date field and fill with current datetime
        req.post.dat.f_vals[0].date = new Date();
        console.log("cd_cache::create...1.");
        let m_entry = await multi_entry(req, res);
        console.log("m_entry=" + m_entry);
        console.log("cd_cache::create...2.");
        let v_create = await validate_create(req, res);
        console.log("v_create=" + v_create);
        console.log("cd_cache::create...3.");
        if (m_entry == true && v_create == true) {
            console.log("cd_cache::create...4.");
            console.log("multi_entry == true && validate_create == true");
            var update_data = {
                "t_name": req.post.c,
                "filter": {"token": req.post.dat.token, "content_id": req.post.dat.f_vals[0].content_id},
                "update": {"content": req.post.dat.f_vals[0].content}
            };
            let result = await mdb.update_i(req, res, update_data);
            console.log("cd_cache::update::results>>");
            console.log(JSON.stringify(result));
            req.g_ret.app_state.success = 1;
            req.g_ret.data = result.result;
            //res.status(200).json(g_ret);
            return req.g_ret;
        } else if (m_entry == false && v_create == true) {
            console.log("cd_cache::create...5.");
            console.log("multi_entry == false && validate_create == true");
            console.log("cd_cache::create::req>>");
            console.dir(req);
            let result = await mdb.insert(req, res);
            console.log("cd_cache::create::results>>");
            console.log(JSON.stringify(result));
            req.g_ret.app_state.success = 1;
            req.g_ret.data = result.result;
            //res.status(200).json(g_ret);
            return req.g_ret;
        } else if (v_create(req, res) == false) {
            console.log("cd_cache::create...6.");
            console.log("validate_create(req, res) == false");
            req.g_ret.app_state.success = 0;
            req.g_ret.app_state.error = "validation error";
            req.g_ret.data = false;
            //res.status(200).json(g_ret);
            return req.g_ret;
        }
    } catch (e) {
        console.log("cd_cache::create...1.");
        console.log("Erorr>>");
        console.log(JSON.stringify(e.message));
        req.g_ret.app_state.success = 0;
        req.g_ret.app_state.error = e.message;
        req.g_ret.data = false;
        //res.status(200).json(g_ret);
        return req.g_ret;
    }
}

//async function create_old(req, res, o_sql) {
//    console.log("starting cd_cache::create(req,res)");
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
async function multi_entry(req, res) {
    console.log("starting async cd_cache::multi_entry(req,res)");
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
        console.log("cd_cache::multi_entry::results>>");
        console.dir(result);
        console.log("cd_cache::multi_entry::results.count>>");
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
async function validate_create(req, res) {

    console.log("starting async cd_cache::validate_create(req,res)");
    var validated = true;

    return validated;
}

async function read(req, res) {
    console.log("starting async cd_cache::read(req,res)");
    console.log("req.post>>");
    console.log(req.post);
    //var result;
    try {
//        var t_name = req.post.c;
//        var read_query = req.post.dat;
//        var db_req = {t_name: t_name, read_query: read_query};
        if (validate_read(req, read)) {
            let result = await mdb.select(req, res);
            console.log("...validated...cd_cache::read::results>>");
            console.dir(result);
            console.log("...validated...cd_cache::read::req.app_state1>>");
            console.dir(req.g_ret);
            //sync req.g_ret
            //req.g_ret.app_state.success = 1;
            //console.log("...validated...cd_cache::read::req.app_state2>>");
            //console.dir(req.g_ret);
            req.g_ret.app_state.success = 1;
            if (result.length > 0) {
                if ('content' in result[0]) {
                    req.g_ret.data = result[0].content;
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

function validate_read(req, res) {
    console.log("starting cd_cache::validate_read(req,res)");
    /*
     * if request is based on login resonse,
     * ie content_id: 'moduleman_ModulesController_GetModuleUserData_*',
     * 1. get user expired token
     * 2. use valid token to replace all data with expired token
     */
    return true;
}

async function set_g_ret(req,g_ret){
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
        if(i==0){
            str_obj += '{"' + k + '":' + JSON.stringify(g_ret.data[k]) + '}';
        }
        else{
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
async function update_token(req, res) {
    console.log("starting cd_cache::update(req,res)");
    try {
        var update_data = {
            "t_name": req.post.c,
            "filter": {"content_id": req.post.dat.f_vals[0].content_id},
            "update": {"token": req.post.dat.f_vals[0].content}
        };
        let result = await mdb.update_i(req, res, update_data);
        console.log("cd_cache::update::results>>");
        console.log(JSON.stringify(result));
        req.g_ret.app_state.success = 1;
        req.g_ret.data = result.result;
        //res.status(200).json(g_ret);
        return req.g_ret;

    } catch (e) {
        console.log("cd_cache::update...1.");
        console.log("Erorr>>");
        console.log(JSON.stringify(e.message));
        req.g_ret.app_state.success = 0;
        req.g_ret.app_state.error = e.message;
        req.g_ret.data = false;
        //res.status(200).json(g_ret);
        return req.g_ret;
    }
}

async function update(req, res) {
    console.log("starting cd_cache::update(req,res)");
    try {
        var update_data = {
            "t_name": req.post.c,
            "filter": {"token": req.post.dat.token, "content_id": req.post.dat.f_vals[0].content_id},
            "update": {"content": req.post.dat.f_vals[0].content}
        };
        let result = await mdb.update_i(req, res, update_data);
        console.log("cd_cache::update::results>>");
        console.log(JSON.stringify(result));
        req.g_ret.app_state.success = 1;
        req.g_ret.data = result.result;
        //res.status(200).json(g_ret);
        return req.g_ret;

    } catch (e) {
        console.log("cd_cache::update...1.");
        console.log("Erorr>>");
        console.log(JSON.stringify(e.message));
        req.g_ret.app_state.success = 0;
        req.g_ret.app_state.error = e.message;
        req.g_ret.data = false;
        //res.status(200).json(g_ret);
        return req.g_ret;
    }
}

async function remove(req, res) {
    console.log("starting cd_cache::remove(req,res)");
    //var result;
    try {
        var remove_data = {
            "t_name": req.post.c,
            "filter": req.post.dat.filter
        };
        let result = await mdb.remove_i(req, res, remove_data);
        console.log("cd_cache::remove::results>>");
        console.log(JSON.stringify(result));
        req.g_ret.app_state.success = 1;
        req.g_ret.data = result.result;
        //res.status(200).json(g_ret);
        return req.g_ret;
    } catch (e) {
        console.log("cd_cache::remove...1.");
        console.log("Erorr>>");
        console.log(JSON.stringify(e.message));
        req.g_ret.app_state.success = 0;
        req.g_ret.app_state.error = e.message;
        req.g_ret.data = false;
        //res.status(200).json(g_ret);
        return req.g_ret;
    }
}



