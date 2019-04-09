//convert json query to string query
module.exports = {
    insert: function (req, res, o_sql) {
        console.log("starting o_sql::insert()");
        var str_dat = "";
        str_dat += "INSERT INTO `" + o_sql.t_name + "` ";
        str_dat += " (`" + o_sql.fields.join("`, `") + "`) ";
        str_dat += " VALUES ";
        o_sql.data.forEach(function (obj, i) {
            str_dat += "('";
            var arr_items = Object.values(obj);
            str_dat += arr_items.join("', '");
            str_dat += "'";
            if (i < (o_sql.data.length - 1)) {
                str_dat += "),";
            } else {
                str_dat += ")";
            }
        });
        console.log("stmt:" + str_dat);
        return str_dat;
    },
    select: function (req, res, o_sql) {
        console.log("starting base::select()");
        var str_fields = o_sql.fields.join("`, `");
        return "select `" + str_fields + "` from " + o_sql.t_name + " where " + o_sql.filter + o_sql.tail;
    },
    update: function (req, res, o_sql) {
        console.log("starting base::update()");
        //res.status(200).json(g_ret);
    },
    remove: function (req, res, o_sql) {
        console.log("starting base::delete()");
        //res.status(200).json(g_ret);
    }
}


