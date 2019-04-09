Corpdesk is a platform for ERP applications.
# node.js corpdesk-api
    ToDo:
    - cd_cache::start_session();
        - pass p_sid through header
        - pass token through header
        - initial session validation function
            - 1. if p_sid is set, and there is an existing session data with same sid, varify if session is valid
            - note that on initial load p_sid may not be set, so when p_sid is not set
        - on login, update token at gui
        - on login, update token at nodejs
        - on login, update session timeout at gui
        - on login, update session timeout at nodejs
        - on login, start_session(), get_sess_timeout()
        - save timeout time
    - cd_cache::renew_session();
        - check if curr_time > timeout_time
    - cd_cache::validate_session();
    - cd_cache::get_user_by_token()
    - update token
    - sync cache
    - test socketIO for client server communication including (live updating cache, chat)
    - look for open source cache/db syncing

18th Nov 2018
    - started work on updating token
    ToDo:
    - syncing cache
5th Nov 2018
//SECURITY UPGRADE:
        - SSL
            - set host: corpdesk.net
            - set PKI (public key infrastructure)
            - get and set cert
            - Apache: set virtual host (https://corpdesk.net)
            - php redirect to gui index
            - set nodejs for https
            - set cors
        - php bcrypt passwords for mysql storage
            - register
            - auth
            - set change password (back-end)
            - update php test files for ssl
            - update cd:helpers:http for ssl
//TODO:
    - forgot password
/////////////////////////////////////////
ISSUES:
- issue: firefox still failing cors issue(connection from javascript gui to nodejs api or php api), but working in chrome
- chrome does not allow localhost while firefox only works when host is set to localhost
- cors issue sorted with cors middleware
- issue: cors
- implemented https
Progress:
//Pushed:1/10/2018
Setting up cd-api in node.js based on existing cd php versionPushed: 
    - mysql connection pool
    - object queries for mysql
        - insert
        - select
        - update
        - delete
    - async-await for mysql
    - register user
        - module=user&controller=usercontroller&action=WebRegister&dat%5Bcontroller_config%5D%5Bdissallow_duplicate%5D%5B%5D=username&dat%5Bcontroller_config%5D%5Bdissallow_duplicate%5D%5B%5D=email&dat%5Bcontroller_config%5D%5Bdissallow_empty%5D%5B%5D=username&dat%5Bcontroller_config%5D%5Bdissallow_empty%5D%5B%5D=password&dat%5Bfields%5D=&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Busername%5D=&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Bpassword%5D=node.js&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Bemail%5D=node.js%40empservices.co.ke&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Bfname%5D=nodejs&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Blname%5D=client&dat%5Btoken%5D=
        - http://localhost/corp-deskv1.2.1.1/system/sys.php
        - http://localhost:3000/sys?m=user&c=user&a=WebRegister&dat%5Bcontroller_config%5D%5Bdissallow_duplicate%5D%5B%5D=username&dat%5Bcontroller_config%5D%5Bdissallow_duplicate%5D%5B%5D=email&dat%5Bcontroller_config%5D%5Bdissallow_empty%5D%5B%5D=username&dat%5Bcontroller_config%5D%5Bdissallow_empty%5D%5B%5D=password&dat%5Bfields%5D=&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Busername%5D=&d%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Bpassword%5D=node.js&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Bemail%5D=node.js%40empservices.co.ke&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Bfname%5D=nodejs&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Blname%5D=client&dat%5Btoken%5D=
        - successfull: live test connection from guig: http://localhost:3000/sys?m=moduleman&c=cd_cache&a=create&dat%5Bfields%5D=&dat%5Bf_vals%5D%5B0%5D%5Bcontent_id%5D=cd_accts_bank_156_DEF3199F-470D-908F-5637-F31949658B84&dat%5Bf_vals%5D%5B0%5D%5Buser_id%5D=1010&dat%5Bf_vals%5D%5B0%5D%5Bcontent%5D%5Bxx%5D=yy&dat%5Btoken%5D=DEF3199F-470D-908F-5637-F31949658B84&args%5Bdoc_from%5D=&args%5Bdoc_to%5D=&args%5Bsubject%5D=read+cd_accts_bank&args%5Bdoctyp_id%5D=
        - request to json:

            {
                "m": "user",
                "c": "user",
                "a": "WebRegister",
                "dat": {
                    "controller_config": {
                        "dissallow_duplicate": ["username", "email"],
                        "dissallow_empty": ["username", "password"]
                    },
                    "fields": "",
                    "f_vals": [{
                        "data": {
                            "username": "",
                            "email": "node.js@empservices.co.ke",
                            "fname": "nodejs",
                            "lname": "client"
                        }
                    }],
                    "token": ""
                },
                "d": {
                    "f_vals": [{
                        "data": {
                            "password": "node.js"
                        }
                    }]
                }
            }

            - cd_cache
            - http://localhost:3000/sys?m=moduleman&c=cd_cache&a=create&dat%5Bcontroller_config%5D%5Bdissallow_duplicate%5D%5B%5D=username&dat%5Bcontroller_config%5D%5Bdissallow_duplicate%5D%5B%5D=email&dat%5Bcontroller_config%5D%5Bdissallow_empty%5D%5B%5D=username&dat%5Bcontroller_config%5D%5Bdissallow_empty%5D%5B%5D=password&dat%5Bfields%5D=&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Busername%5D=&d%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Bpassword%5D=node.js&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Bemail%5D=node.js%40empservices.co.ke&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Bfname%5D=nodejs&dat%5Bf_vals%5D%5B0%5D%5Bdata%5D%5Blname%5D=client&dat%5Btoken%5D=
            - save data to mongodb from guig...DONE
            - read based on filter...DONE
            - validate create
            - get count from the result
            - add date field to chached data
            - develop crud api for mongoose`
            - read specific fields
            - update
            - clean up retrieved data from cache
            - convert data to cache into string otherwise it get distorted

        ///////////////////////////////////////////////////////////////
        //CREATE///////////////////////////////////
        var ctx = {
            "storage_type": {
                "localStorage": false,
                "sessionStorage": false,
                "mongodb": true,
                "redis": false
            },
            "action": "create",
            "data": {
                "m": "moduleman",
                "c": "cd_cache",
                "a": "create",
                "dat": {
                    "fields": "",
                    "filter":"",
                    "f_vals": [{
                        "content_id": content_id,
                        "user_id": user_id,
                        "content":"thjigd_3"
                    }],
                    "token": token
                },
                "doc_proc_data": {
                    "doc_from": "",
                    "doc_to": "",
                    "subject": "read cd_accts_bank",
                    "doctyp_id": ""
                },
                "request_id": content_id,
                "ctx": "node_sys",
                "storage_type": {
                    "localStorage": false,
                    "sessionStorage": false,
                    "mongodb": true,
                    "redis": false
                },
                "debug": true,
                "fx_client": "lnk_create",
                "cache": true
            }

        };
        proc_server(ctx.data);
        
        //DELETE///////////////////////////////////
        ctx = {
            "storage_type": {
                "localStorage": false,
                "sessionStorage": false,
                "mongodb": true,
                "redis": false
            },
            "action": "create",
            "data": {
                "m": "moduleman",
                "c": "cd_cache",
                "a": "remove",
                "dat": {
                    "fields": "",
                    "filter":{"content_id":"cd_accts_bank_156_60D96C26-4BBD-C3C6-6678-C8C48A0908A5"},
                    "f_vals": [],
                    "token": token
                },
                "doc_proc_data": {
                    "doc_from": "",
                    "doc_to": "",
                    "subject": "read cd_accts_bank",
                    "doctyp_id": ""
                },
                "request_id": content_id,
                "ctx": "node_sys",
                "storage_type": {
                    "localStorage": false,
                    "sessionStorage": false,
                    "mongodb": true,
                    "redis": false
                },
                "debug": true,
                "fx_client": "lnk_create",
                "cache": true
            }

        };
        proc_server(ctx.data);
        
        //READ///////////////////////////////////
        ctx = {
            "storage_type": {
                "localStorage": false,
                "sessionStorage": false,
                "mongodb": true,
                "redis": false
            },
            "action": "read",
            "data": {
                "m": "moduleman",
                "c": "cd_cache",
                "a": "read",
                "dat": {
                    "fields": ["content_id","user_id"],
                    "filter":{"content_id": content_id,"user_id": user_id},
                    /*
                    "f_vals": [{
                        "content_id": content_id,
                        "user_id": user_id
                    }],*/
                    "token": token
                },
                "doc_proc_data": {
                    "doc_from": "",
                    "doc_to": "",
                    "subject": "read cd_accts_bank",
                    "doctyp_id": ""
                },
                "request_id": content_id,
                "ctx": "node_sys",
                "storage_type": {
                    "localStorage": false,
                    "sessionStorage": false,
                    "mongodb": true,
                    "redis": false
                },
                "debug": true,
                "fx_client": "lnk_create",
                "cache": true
            }

        };

        proc_server(ctx.data);
        /////////////////////////////////////////
        
        async function proc_server(req_data) {
            console.log("starting test_async(req_data)");
            let result = await wb.cd_conn(req_data);
            console.log("test_async::result>>");
            console.log(JSON.stringify(result));
            var jdata,jqxhr, textStatus, error,context;
            result.test_async="ok";
            wb.server_response(jdata, result, jqxhr, textStatus, error, context);
            wb.cd_accts_set_widget(req_data, result);
        }


            - log server activities
            - log user_ip
            - on successfull authentication, get cached user data
                - menu items
                - last page visited
            - node.js to be informed of change in cache data then node.js to update cache
            - node.js to use socket.io to 'push' changes to cache
            - chat based on node.js/socket.io/mongodb
    - send notification mail
    - mongodb:
        - sessions
        - cache: user session data
        - cache: user_data
        - cache: module statistics
    - modify /base/b to /base by changing /base/b.js to /base/index.js
    - secure login
    - session management
    - mysql return eg {state:1,data:null}
    - set https
    - debugging 
        - var path = require('path');
        - var scriptName = path.basename(__filename);
    - logger integreted with sessions
    - set auth
    - set secure auth
    - set secure traffic
    - set session
    - set docproc 
    - set transaction interface
    - on successfull login, get user data
    - set cd objects
    - filter authorized menu
    - harmonize error handling
    - send sms
    - calendar scheduler
    - send notifications
    - display notifications
    - automated tests
    
    Done 10/09/2018:
    - accept input of a url eg http://localhost:3000/?m=module&c=controller&a=action&d=data
    - consume query string as json
    - reserved route for app and sys routes 
    - dispatch logic for relaying to the relevant data to /module/controller/action
    - connect and transact with mysql
    - do http response with cd response structure
    - clean up from sample codes
    - isolate mysql file
    - isolate config file
    - set up base class for common methods
    - handle async methods to get sql results from mysql -> base -> controller file -> return cd formatted result
    
    
