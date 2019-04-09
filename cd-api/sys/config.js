const mongo_host = "mongo";
const mongo_port = "27017";
var config = {};
var mysql_params = [{
    host: "mysql",
    user: "goremo",
    password: "oremolaptop",
    database:"cd1211"
}];

var mongodb_params = [
                        {"conn_str": "mongodb://" + mongo_host + ":" + mongo_port + "/cd"},
                        {"conn_str": "mongodb://" + mongo_host + ":" + mongo_port + "/test"},
                        {"conn_str": "mongodb://" + mongo_host + ":" + mongo_port + "/test-app"}
                    ];

config.mysql = [];
config.mongodb = mongodb_params;
config.mysql.push(mysql_params);

module.exports = {
    set: function (name,data) {
        config[name]=data;
    },
    get: function (name) {
        console.log("starting config::get()");
        return config[name];
    }
};



