var error = require('../models/Error/error');
var oracledb = require('oracledb');

var conn = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectString: process.env.DB_CONN
}

var ptr = { dir: oracledb.BIND_OUT, type: oracledb.CURSOR };

function select(qry, callback) {
    oracledb.getConnection(
        conn,
        (err, connection) => {
            if (err) return callback(err);
            connection.execute(
                qry,
                (err, result) => {
                    if (err) {
                        doRelease(connection);
                        return callback(err);
                    }
                    doRelease(connection);
                    callback(null, result);
                }
            );
        }
    );
}

function proc(qry, params, callback) {
    params.ret = ptr;
    oracledb.getConnection(
        conn,
        (err, connection) => {
            if (err) return callback(err);
            connection.execute(
                qry,
                params,
                (err, result) => {
                    if (err) {
                        doRelease(connection);
                        return callback(err);
                    }
                    fetchRowsFromRS(connection, result.outBinds.ret, 3000, callback);
                }
            );
        }
    );
}

function fetchRowsFromRS(connection, rset, num, callback) {
    rset.getRows(
        num,
        (err, rows) => {
            if (err) {
                doClose(connection, rset);
                callback(err);
            } else if (rows.length > 0) {
                doClose(connection, rset);
                callback(null, rows);
            } else {
                doClose(connection, rset);
                callback(null, null);
            }
        }
    );
}

function doRelease(connection)
{
    connection.close(
    function(err)
    {
      if (err) { console.log(err.message) }
    });
}

function doClose(connection, resultSet)
{
  resultSet.close(
    function(err)
    {
      if (err) { console.log(err.message) }
      doRelease(connection);
    });
}

module.exports = {
    select: select,
    proc: proc,
    PTR: ptr
}
