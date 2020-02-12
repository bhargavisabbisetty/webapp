const bcrypt = require('bcrypt')
const server = require('./../server')

module.exports = {
    insertBill,
    updateBill,
    getAll,
    getBillById,
    deleteBillById,
    getBillsWithAttachmentsBasedOnUserId
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
    server.connection.query("UPDATE billdetails SET updated_ts = ?,vendor = ?, bill_date = ?, due_date = ?, amount_due = ?, categories = ?, paymentStatus = ? WHERE id = ? and owner_id = ?",
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
        if (error) {
            errorHandler(error)
        } else {
            callback(results)
        }
    });
}

function getBillsWithAttachmentsBasedOnUserId(params, callback, errorHandler) {
    server.connection.query('select b.id,b.created_ts,b.updated_ts,b.owner_id,' +
        'b.vendor,b.bill_date,b.due_date,b.amount_due,b.categories,b.paymentStatus,' +
        'f.file_name,f.id as file_id,f.url,f.upload_date from billdetails as b left join ' +
        'filedetails as f on b.id=f.bill_id where b.owner_id=?',params ,
        function (error, results, fields) {
            console.log(results)
            if (!error) {
                callback(results)
            } else {
                errorHandler(error)
            }
        });
}

