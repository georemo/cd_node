/*
 * Facilities:
 * 1. construct menu for the module
 */
const cd_api = require('express').Router();
const all = require('./all');
const single = require('./single');
const findObject = require('../../utils/findObject');

console.log("...arrived at root'./cd/cd-api/sys/modules/user/app.js'");
cd_api.get('/sys', (req, res) =>{
    //console.log("...arrived at root'/app/modules/cd_hrm'");
    console.log("starting app::cd_api.get('/sys', (req, res)");
    console.log("req.query=" + JSON.stringify(req.query));
});
module.exports = cd_api;
