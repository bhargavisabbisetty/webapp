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
    callback('success')

}

function getAll(user, callback) {
    const results = [{
            id: 'a8d787d2-6bc7-4d09-9a9f-7d35187a24f2',
            created_ts: "2020-01-29T16:27:47.000Z",
            updated_ts: "2020-01-29T16:27:47.000Z",
            owner_id: 'c6a7ea2a-34b3-4ac2-a014-e7acac7e8963',
            vendor: 'Northeastern University',
            bill_date: "2020-01-06T05:00:00.000Z",
            due_date: "2020-01-06T05:00:00.000Z",
            amount_due: 1,
            categories: 'college,tuition,spring2020',
            paymentStatus: 0
        },
        {
            id: 'cd1bbd2f-43bc-4699-9614-4b5bee40037b',
            created_ts: "2020-01-29T16:25:46.000Z",
            updated_ts: "2020-01-29T16:25:46.000Z",
            owner_id: 'c6a7ea2a-34b3-4ac2-a014-e7acac7e8963',
            vendor: 'Northeastern University',
            bill_date: "2020-01-06T05:00:00.000Z",
            due_date: "2020-01-06T05:00:00.000Z",
            amount_due: 7000.51,
            categories: 'college,tuition,spring2020',
            paymentStatus: 0
        }
    ]
    callback(results)
}

function getBillById(billId, callback) {
    if (billId == 'cd1bbd2f-43bc-4699-9614-4b5bee40037b') {
        callback([{
            id: 'cd1bbd2f-43bc-4699-9614-4b5bee40037b',
            created_ts: "2020-01-29T16:25:46.000Z",
            updated_ts: "2020-01-29T16:25:46.000Z",
            owner_id: 'c6a7ea2a-34b3-4ac2-a014-e7acac7e8963',
            vendor: 'Northeastern University',
            bill_date: "2020-01-06T05:00:00.000Z",
            due_date: "2020-01-06T05:00:00.000Z",
            amount_due: 7000.51,
            categories: 'college,tuition,spring2020',
            paymentStatus: 0
        }])
    } else if (billId == 'cd1b769f-43bc-4699-9614-4b5be897037b') {
        callback([{
            id: 'cd1b769f-43bc-4699-9614-4b5be897037b',
            created_ts: "2020-01-29T16:25:46.000Z",
            updated_ts: "2020-01-29T16:25:46.000Z",
            owner_id: 'c6a7ea2a-34b3-4a7g-8jv6-e7acac7e8963',
            vendor: 'Northeastern University',
            bill_date: "2020-01-06T05:00:00.000Z",
            due_date: "2020-01-06T05:00:00.000Z",
            amount_due: 7000.51,
            categories: 'college,tuition,spring2020',
            paymentStatus: 0
        }])
    } else {
        callback([])
    }

}

function updateBill(params, callback) {
    callback('success')
}

function deleteBillById(params, callback, errorHandler) {
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

function getBillsWithAttachmentsBasedOnUserId(params, callback, errorHandler) {
    const results = [{
            id: '57864807-61f8-4e35-8f43-41ba22388209',
            created_ts: `2020-02-11T10:42:43.000Z`,
            updated_ts: `2020-02-11T10:42:43.000Z`,
            owner_id: '27f650d7-aa8b-435e-a34c-712d209880f5',
            vendor: 'Northeastern University',
            bill_date: `2020-01-06T05:00:00.000Z`,
            due_date: `2020-01-06T05:00:00.000Z`,
            amount_due: 7000.51,
            categories: 'college,tuition,spring2020',
            paymentStatus: 0,
            file_name: 'Resume_Vishnu_Bhargavi_Sabbisetty.pdf',
            file_id: '61b7dd1a-e0f7-4f8a-b0a0-afc100f3388f',
            url: './uploads/Resume_Vishnu_Bhargavi_Sabbisetty-1581503708562.pdf',
            upload_date: new Date()
        },
        {
            id: 'cd1bbd2f-43bc-4699-9614-4b5bee40037b',
            created_ts: `2020-01-29T16:25:46.000Z`,
            updated_ts: `2020-01-29T16:25:46.000Z`,
            owner_id: 'c6a7ea2a-34b3-4ac2-a014-e7acac7e8963',
            vendor: 'Northeastern University',
            bill_date: `2020-01-06T05:00:00.000Z`,
            due_date: `2020-01-06T05:00:00.000Z`,
            amount_due: 7000.51,
            categories: 'college,tuition,spring2020',
            paymentStatus: 0,
            file_name: null,
            file_id: null,
            url: null,
            upload_date: null
        }
    ]
    callback(results)
}