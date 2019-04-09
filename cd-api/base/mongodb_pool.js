//CRUD USAGE 
//CREATE/////////////////////////////////////////////////////////////////////
//            sess_obj = {sid: "1236", user_id: "kk", ip: "10.0.0.1"};
//            var db_req = {t_name:t_name, insert_data:sess_obj};
//            let result = await mdb.insert(req, res, db_req);
/////////////////////////////////////////////////////////////////////////////

//READ///////////////////////////////////////////////////////////////////////
//            filter = {sid: "1235"};
//            fields = ["sid","ip"];
//            var db_req = {
//                            t_name:t_name, 
//                            filter:filter,
//                            fields:fields
//                        };
//            let result = await mdb.select(req, res, db_req);
/////////////////////////////////////////////////////////////////////////////

//UPDATE/////////////////////////////////////////////////////////////////////
//            filter = {sid: "1235"};
//            update_data = {sid: "5321"};
//            var db_req = {
//                            t_name:t_name, 
//                            filter:filter,
//                            update_data:update_data
//                        };
//            let result = await mdb.update(req, res, db_req);
////////////////////////////////////////////////////////////////////////////

//DELETE/////////////////////////////////////////////////////////////////////
//            filter = {sid: "5321"};
//            var db_req = {
//                            t_name:t_name, 
//                            filter:filter
//                        };
//            let result = await mdb.remove(req, res, db_req);
////////////////////////////////////////////////////////////////////////////

//var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var config = require('../sys/config');
var mongo_config = config.get('mongodb');

var SYS_URI = mongo_config[0].conn_str;
var APP_URI = mongo_config[1].conn_str;

//var MongoClient = require('mongodb').MongoClient;
//  var url = "mongodb://mongo:27017/mydb";

// MongoClient.connect(SYS_URI, function (err, db) {
//     if (err) throw err;
//     console.log("Database created!");
//     db.close();
// });

function connect() {
    console.log("starting mongodb_pool::connect");
    return MongoClient.connect(SYS_URI).then(client => client.db());
}

async function _pool() {
    let client;
    try {

        client = await MongoClient.connect(SYS_URI, {
            useNewUrlParser: true
        });
        console.log("connection success");
//        db.collection('Employee').insertOne({
//            Employeeid: 4,
//            EmployeeName: "NewEmployee"
//        });

        //client.close();
    } catch (e) {
        console.log("error encountered while trying to connect");
        console.error(e);
    }
    return client;
}

async function pool() {
    console.log("starting mongodb_pool::pool");
    let databases = await Promise.all([connect(SYS_URI), connect(APP_URI)]);
     return {
         sys: databases[0],
         app: databases[1]
     };  
}

module.exports = {
    create: async function (req, res) {
        console.log("starting mongodb_pool::create");
        let result;
        try {
            if (req.mdb_ctx == "local") {
                console.log("starting req.mdb_ctx == local");
                var t_name = req.mdb_req.c;
                var insert_data = req.mdb_req.dat.f_vals[0];
                //insert_data.token = req.mdb_req.dat.token;
                var db_req = {
                    t_name: t_name,
                    insert_data: insert_data
                };
                var dbs = await pool();
                var collection = dbs.sys.collection(db_req.t_name);
                result = await (insert(req, res, collection, db_req));
            } else {
                var t_name = req.post.c;
                var insert_data = req.post.dat.f_vals[0];
                insert_data.token = req.post.dat.token;
                var db_req = {
                    t_name: t_name,
                    insert_data: insert_data
                };
                var dbs = await pool();
                var collection = dbs.sys.collection(db_req.t_name);
                result = await (insert(req, res, collection, db_req));
            }
            return result;
        } catch (e) {
            return e;
        }
    },
    save: async function (req, res) {
        console.log("starting mongodb_pool::save");
        let result;
        try {
            if (req.mdb_ctx = "local") {
                var t_name = req.mdb_req.c;
                var insert_data = req.mdb_req.dat.f_vals[0];
                //insert_data.token = req.mdb_req.dat.token;
                var db_req = {
                    t_name: t_name,
                    insert_data: insert_data
                };
                var dbs = await pool();
                var collection = dbs.sys.collection(db_req.t_name);
                result = await (save(req, res, collection, db_req));
            } else {
                var t_name = req.post.c;
                var insert_data = req.post.dat.f_vals[0];
                insert_data.token = req.post.dat.token;
                var db_req = {
                    t_name: t_name,
                    insert_data: insert_data
                };
                var dbs = await pool();
                var collection = dbs.sys.collection(db_req.t_name);
                result = await (insert(req, res, collection, db_req));
            }

            return result;
        } catch (e) {
            return e;
        }
    },
    upsert: async function (req, res) {
        console.log("starting mongodb_pool::upsert");
        let result;
        try {
            if (req.mdb_ctx = "local") {
                var t_name = req.mdb_req.c;
                var upsert_data = req.mdb_req.dat.f_vals[0];
                //insert_data.token = req.mdb_req.dat.token;
                var db_req = {
                    t_name: t_name,
                    upsert_data: upsert_data
                };
                var dbs = await pool();
                var collection = dbs.sys.collection(db_req.t_name);
                result = await (upsert(req, res, collection, db_req));
            } else {
                var t_name = req.post.c;
                var insert_data = req.post.dat.f_vals[0];
                insert_data.token = req.post.dat.token;
                var db_req = {
                    t_name: t_name,
                    insert_data: insert_data
                };
                var dbs = await pool();
                var collection = dbs.sys.collection(db_req.t_name);
                result = await (insert(req, res, collection, db_req));
            }

            return result;
        } catch (e) {
            return e;
        }
    },
    read: async function (req, res) {
        console.log("starting mongodb_pool::read");
        console.log("req.post>>");
        //console.dir(req);
        //console.dir(req.post);
        try {
            var t_name;
            var query = {};
            if (req.mdb_ctx = "local") {
                t_name = req.mdb_req.c;
                query.t_name = t_name;
                query.filter = req.mdb_req.dat.filter;
                query.fields = req.mdb_req.dat.fields;
            } else {
                t_name = req.post.c;
                query.t_name = t_name;
                query.filter = req.post.dat.filter;
                query.fields = req.post.dat.fields;
            }

            console.log("query>>");
            console.log(JSON.stringify(query));
            //var db_req = {t_name: t_name, insert_data: query};
            var dbs = await pool();
            var collection = dbs.sys.collection(t_name);
            var result = await (select(req, res, collection, query));
            req.mdb_ctx = "";
            console.log("mongodb_pool::read::result>>");
            console.dir(result);
            //            let ret=[];
            //            result.each(async function (err, doc) {
            //                //console.log(doc);
            //                ret.push(doc);
            //            });
            //let arr_ret = await ret;
            return result;
        } catch (e) {
            return e;
        }
    },
    insert: async function (req, res) {
        console.log("starting mongodb_pool::insert");
        let result;
        try {
            if (req.mdb_ctx = "local") {
                console.log("starting mongodb_pool::insert...local_01");
                console.log("starting mongodb_pool::insert...local::req>>");
                console.dir(req);
                var t_name = req.post.c;
                var insert_data = req.post.dat.f_vals[0];
                console.log("starting mongodb_pool::insert...local::insert_data>>");
                console.log(JSON.stringify(insert_data));
                insert_data.token = req.post.dat.token;
                var db_req = {
                    t_name: t_name,
                    insert_data: insert_data
                };
                console.log("starting mongodb_pool::insert...local::db_req>>");
                console.log(JSON.stringify(db_req));
                console.log("starting mongodb_pool::insert...local_02");
                var dbs = await pool();
                console.log("starting mongodb_pool::insert...local_03");
                var collection = dbs.sys.collection(db_req.t_name);
                console.log("starting mongodb_pool::insert...local_04");
                result = await insert2(req, res, collection, db_req);
            } else {
                console.log("starting mongodb_pool::insert...NOT local");
                var t_name = req.post.c;
                var insert_data = req.post.dat.f_vals[0];
                insert_data.token = req.post.dat.token;
                var db_req = {
                    t_name: t_name,
                    insert_data: insert_data
                };
                var dbs = await pool();
                var collection = dbs.sys.collection(db_req.t_name);
                result = await (insert(req, res, collection, db_req));
            }

            return result;
        } catch (e) {
            return e;
        }
    },
    select: async function (req, res) {
        console.log("starting mongodb_pool::select");
        console.log("req.post>>");
        console.log(req.post);
        try {
            var t_name = req.post.c;
            var query = {};
            query.t_name = t_name;
            query.filter = req.post.dat.filter;
            query.fields = req.post.dat.fields;
            console.log("query>>");
            console.log(JSON.stringify(query));
            //var db_req = {t_name: t_name, insert_data: query};
            var dbs = await pool();
            var collection = dbs.sys.collection(t_name);
            var result = await (select(req, res, collection, query));
            console.log("mongodb_pool::select::result>>");
            console.dir(result);
            //            let ret=[];
            //            result.each(async function (err, doc) {
            //                //console.log(doc);
            //                ret.push(doc);
            //            });
            //let arr_ret = await ret;
            return result;
        } catch (e) {
            return e;
        }
    },
    select_i: async function (req, res, query_data) {
        console.log("starting mongodb_pool::select_i");
        try {
            var t_name = query_data.t_name;
            //query_data.filter = req.post.dat.filter;
            //query_data.fields = req.post.dat.fields;
            console.log("select_i::query_data>>");
            console.log(JSON.stringify(query_data));
            //var db_req = {t_name: t_name, insert_data: query};
            var dbs = await pool();
            var collection = dbs.sys.collection(t_name);
            var result = await (select(req, res, collection, query_data));
            console.log("mongodb_pool::select_i::result>>");
            console.dir(result);
            console.log("mongodb_pool::select_i::result.count>>");
            console.log(result.length);
            //            let ret=[];
            //            result.each(async function (err, doc) {
            //                //console.log(doc);
            //                ret.push(doc);
            //            });
            //let arr_ret = await ret;
            return result;
        } catch (e) {
            return e;
        }
    },
    update_i: async function (req, res, update_data) {
        console.log("starting mongodb_pool::update");
        console.log("mongodb_pool::update->update_data>>");
        console.log(JSON.stringify(update_data));
        try {
            var dbs = await pool();
            var collection = dbs.sys.collection(update_data.t_name);
            var result = await (update(req, res, collection, update_data));
            console.log("mongodb_pool::update::result>>");
            console.dir(result.result);
            return result;
        } catch (e) {
            return e;
        }
    },
    remove_i: async function (req, res, remove_data) {
        console.log("starting mongodb_pool::remove");
        try {
            var dbs = await pool();
            var collection = dbs.sys.collection(remove_data.t_name);
            var result = await (remove(req, res, collection, remove_data));
            return result;
        } catch (e) {
            return e;
        }
    }
}

var insert = (req, res, collection, obj) => {
    console.log("starting mongodb_pool:insert(req, res, collection, obj)");
    var insert_data = obj.insert_data;
    return new Promise((resolve, reject) => {
        collection.insert(insert_data, async function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};

async function insert2(req,res,collection,obj){
    console.log("starting mongodb_pool:insert2(req, res, collection, obj)");
    var insert_data = obj.insert_data;
    let r = await collection.insert(insert_data);
    return r;
}

var save = (req, res, collection, obj) => {
    console.log("starting mongodb_pool:insert(req, res, collection, obj)");
    var insert_data = obj.insert_data;
    return new Promise((resolve, reject) => {
        collection.save(insert_data, async function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};

var upsert = (req, res, collection, obj) => {
    console.log("starting mongodb_pool:save(req, res, collection, obj)");
    var id = req.headers.p_sid;
    var upsert_data = obj.upsert_data;
    return new Promise((resolve, reject) => {
        collection.updateOne({
            _id: id
        }, {
            $set: upsert_data
        }, {
            upsert: true
        }, async function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};

/*
 * db.collection("test").find({}, {'name': true}).toArray(function(err, results) {
 console.dir(results);
 });
 */
var select = (req, res, collection, query) => {
    console.log("starting mongodb_pool::select/select");
    return new Promise((resolve, reject) => {
        var filter = query.filter;
        if (filter == "") {
            filter = {};
        }
        console.log("query>>");
        console.log(JSON.stringify(query));
        var fields;
        if ('fields' in query) {
            fields = get_projection(query.fields);
        } else {
            fields = null;
        }

        console.log("query.filter>>");
        console.log(JSON.stringify(query.filter));
        console.log("fields.projection>>");
        console.log(JSON.stringify(fields.projection));
        //        collection.find(filter,projection, async function (err, result) {
        //            console.log("select::results>>");
        //            if (err)
        //                reject(err);
        //            resolve(result);
        //        });


        collection.find(query.filter).project(fields.projection).toArray(function (err, result) {
            console.log("select::results>>");
            console.dir(result);
            if (err)
                reject(err);
            resolve(result);
        });
    });
};

function get_projection(fields) {
    console.log("starting get_projection(fields)");
    console.log("fields>>");
    console.dir(fields);
    var proj = {
        projection: {}
    };
    if (fields == "*") {
        proj = null;
    }
    if (fields == "") {
        proj = {};
    } else {
        fields.forEach(function (field, i) {
            proj.projection[fields[i]] = true;
        });
    }
    console.log("projection>>");
    console.log(JSON.stringify(proj));
    return proj;
}

/*
 * db.names.update( { "_id" : thisDoc._id }, { "name": "Dick Whitman" } );
 * 
 * var myquery = { address: "Valley 345" };
 var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
 dbo.collection("customers").updateOne(myquery, newvalues, function(err, res)
 * 
 * 
 * var myquery = { address: "Valley 345" };
 var newvalues = { $set: { address: "Canyon 123" } };
 dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
 */
var update = (req, res, collection, update_data) => {
    console.log("starting update = (req, res, collection, obj)");
    console.log("db_req>> " + JSON.stringify(update_data));
    var filter = update_data.filter;
    var update_data = {
        $set: update_data.update
    };
    return new Promise((resolve, reject) => {
        collection.updateMany(filter, update_data, function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};

var remove = (req, res, collection, remove_data) => {
    console.log("starting remove = (req, res, collection, remove_data)");
    console.log("db_req>> " + JSON.stringify(remove_data));
    var filter = remove_data.filter;
    return new Promise((resolve, reject) => {
        collection.remove(filter, function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};

/////////////////////////////////
//JOIN
/*
 * MongoClient.connect(url, function(err, db) {
 if (err) throw err;
 var dbo = db.db("mydb");
 dbo.collection('orders').aggregate([
 { $lookup:
 {
 from: 'products',
 localField: 'product_id',
 foreignField: '_id',
 as: 'orderdetails'
 }
 }
 ]).toArray(function(err, res) {
 if (err) throw err;
 console.log(JSON.stringify(res));
 db.close();
 });
 }); 
 */