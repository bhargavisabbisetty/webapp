const bcrypt = require('bcrypt')
const server = require('./../server')

module.exports = {
    insertFile,
    getFileByBillId,
    deleteFileById
};



function insertFile(params, callback) {
    callback('success')

}

function getFileByBillId(billId, callback) {
    if (billId == '57864807-61f8-4e35-8f43-41ba22388209') {
        callback(
            [{
                "file_name": "Resume_Vishnu_Bhargavi_Sabbisetty_Feb10_copy.pdf",
                "id": "8ddc6cf2-c1d6-4f41-8f83-01ccf4039130",
                "url": "./uploads/Resume_Vishnu_Bhargavi_Sabbisetty_Feb10_copy-1581417515779.pdf",
                "upload_date": "2020-2-11"
            }]
        )
    }
    else
    {
        callback([])
    }
}

function deleteFileById(params, callback, errorHandler) {
    callback({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        serverStatus: 2,
        warningCount: 0,
        message: '',
        protocol41: true,
        changedRows: 0
    })
}
