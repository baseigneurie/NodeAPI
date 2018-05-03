const odb = require('oracledb');

const _CONN = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectString: process.env.DB_CONN
}

const _PTR = { dir: odb.BIND_OUT, type: odb.CURSOR };
const _NBR = { dir: odb.BIND_OUT, type: odb.NUMBER };
const STR_OUT = { type: odb.STRING, dir: odb.BIND_OUT };

// Simple select. Direct results
function select(qry) {
    return new Promise((resolve, reject) => {
        let connection = {};
        odb.getConnection(_CONN).then((c) => {
            connection = c;
            return connection.execute(qry);
        }).then((result) => {
            doRelease(connection);
            resolve(result);
        }).catch((err) => {
            doRelease(connection);
            reject(err);
        });
    });
}

// Call Procedure
// This will return a result set. Need to loop through rows into array for parsing.
function proc(qry, params) {
    return new Promise((resolve, reject) => {
        let connection = {};
        params.ret = _PTR;
        odb.getConnection(_CONN).then((c) => {
            connection = c;
            return connection.execute(qry, params);
        }).then((result) => {
            return result.outBinds.ret.getRows(3000);
        }).then((data) => {
            doRelease(connection);
            resolve(data);
        }).catch((err) => {
            doRelease(connection);
            reject(err);
        });
    });
}

function dir_proc(qry, params) {
    return new Promise((resolve, reject) => {
        let connection = {};
        odb.getConnection(_CONN).then((c) => {
            connection = c;
            return connection.execute(qry, params);
        }).then((result) => {
            doRelease(connection);
            resolve(result);
        }).catch((err) => {
            doRelease(connection);
            reject(err);
        });
    });
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
    dir_proc: dir_proc,
    PTR: _PTR,
    STR_OUT: STR_OUT
}
