////////////// UpdateTrack ///////////////////////
'use strict';

// Added to handle injection
const vandium = require('vandium');
const mysql   = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : process.env.rds_host,
  user            : process.env.rds_user,
  password        : process.env.rds_password,
  database        : process.env.rds_database,
  port            : process.env.rds_port
});

exports.handler = vandium.generic()
    .handler( (event, context, callback) => {

  pool.getConnection(function (error, connection) {
    
    let sql = "UPDATE items SET ";
    sql = sql + " name = " + connection.escape(event.name);
    sql = sql + " WHERE id = " + connection.escape(event.track_id);

    console.log('Updatetrack SQL: ', sql);
    pool.query(sql, function (error, results, fields) {
      let response = {};
      response['item_id'] = results.item_id;
      response['name'] = results.name;

      console.log('Updatetrack Response: ', response);

      callback( null, response );
    });
  });
})
