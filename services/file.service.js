const bcrypt = require('bcrypt')
const server = require('./../server')

module.exports = {
    insertFile,
    getFileByBillId,
    deleteFileById,
    updateFile
};



function insertFile(params, callback) {
    server.connection.query('INSERT INTO filedetails SET ?', params, function (error, results, fields) { 
        if (error) {
            callback(error)
        } else {
            callback('success')
        }
    });
}

function updateFile(params, callback) {
    server.connection.query('UPDATE filedetails SET url=?, key_name=? where id = ? and file_owner = ? and bill_id = ?', params, function (error, results, fields) { 
        if (error) {
            callback(error)
        } else {
            callback('success')
        }
    });
}

function getFileByBillId(billId, callback) {
    server.connection.query('SELECT * from filedetails where bill_id = ?', billId, function (error, results, fields) {
            callback(results)
});
}

function deleteFileById(params, callback, errorHandler) {
    server.connection.query('DELETE from filedetails where id = ? and file_owner = ? and bill_id = ?', params, function (error, results, fields) {
    if(error){
        errorHandler(error)
    }
    else
    {
        callback(results)
    }
    });
}

