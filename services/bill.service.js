const bcrypt = require('bcrypt')
const server = require('./../server')

module.exports = {
    insertBill,
    updateBill,
    getAll,
    getBillById,
    deleteBillById
};



function insertBill(params, callback) {
    server.connection.query('INSERT INTO billdetails SET ?', params, function (error, results, fields) { 
        if (error) {
            callback('error')
        } else {
            callback('success')
        }
    });
}

function getAll(user, callback) {
    server.connection.query('SELECT * from billdetails where owner_id = ?', user.id, function (error, results, fields) {
        callback(results)
});
}

function getBillById(billId, callback) {
    server.connection.query('SELECT * from billdetails where id = ?', billId, function (error, results, fields) {
        callback(results)
});
}

function updateBill(params, callback) {
    server.connection.query("UPDATE userdetails SET first_name = ?, last_name = ?, password = ?, account_updated = ? WHERE email_address = ? ",
        params,
        function (error, results, fields) {
            if (error) {
                callback(error)
            } else {
                callback('success')
            }
        });
}

function deleteBillById(params, callback, errorHandler) {
    server.connection.query('DELETE from billdetails where id = ? and owner_id = ?', params, function (error, results, fields) {
    if(error){
        errorHandler(error)
    }
    else
    {
        callback(results)
    }
    });
}

