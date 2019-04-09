var http = require('http');
var querystring = require('querystring');
var qs = require('qs');

module.exports = {
    proc_post: function (req, res,callback) {
        processPost(req, res, callback);
    }
}

function processPost(req, resp, callback) {
    var queryData = "";
    var content_type;
    var j_queryData;
    if(typeof callback !== 'function') return null;

    if(req.method == 'POST') {
        //console.log("processPost/req>>");
        //console.dir(req);
        console.log("processPost/req.headers[content-type]>>");
        console.dir(req.headers["content-type"]);
        content_type = req.headers["content-type"];
        
        
        req.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                resp.writeHead(413, {'Content-Type': 'text/plain'}).end();
                req.connection.destroy();
            }
        });

        req.on('end', function() {
            console.log("processPost/queryData2>>");
            console.log(queryData);
            var d_type = typeof(queryData);
            console.log("d_type=" + d_type);
            if(d_type=='string' && req.headers["content-type"]=='application/json'){//esp when testing with curl to post in json
                console.log("processPost/queryData1>>");
                console.log(queryData);
                j_queryData = JSON.parse(queryData);
                req.post = j_queryData;
            }
            else{
                req.post = qs.parse(queryData);
            }
            
            callback();
        });

    } else {
        resp.writeHead(405, {'Content-Type': 'text/plain'});
        resp.end();
    }
}


