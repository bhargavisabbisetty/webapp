var bcrypt = require('bcrypt');
const saltRounds = 10
const aws = require('aws-sdk');
const server = require('./../server')
const uuid = require('uuid/v4')
const Validator = require('./../services/validator')
const validatorObj = new Validator()
var billService = ''
var fileService = ''
var fs = require('fs')
if (process.env.NODE_ENV == 'production') {
    fileService = require('./../services/file.service.mock')
} else {
    fileService = require('./../services/file.service');
}
if (process.env.NODE_ENV == 'production') {
    billService = require('./../services/bill.service.mock')
} else {
    billService = require('./../services/bill.service');
}

var PaymentStatusEnum = {
    paid: 0,
    due: 1,
    past_due: 2,
    no_payment_required: 3
}
Object.freeze(PaymentStatusEnum);

/**
 * 
 * This method is used to make a post request. It is a public endpoint.
 * This method helps to create new bill.
 */

exports.post = (request, response) => {
    let user = request.user;
    const id = uuid();
    const created_ts = new Date();
    const updated_ts = new Date();
    const owner_id = user.id;
    const vendor = request.body.vendor;
    const bill_date = request.body.bill_date;
    const due_date = request.body.due_date;
    const amount_due = request.body.amount_due;
    const categories = request.body.categories;
    const paymentStatus = request.body.paymentStatus;
    if (vendor != null && bill_date != null && due_date != null && amount_due != null && categories != null && paymentStatus != null) {
        if (vendor.length > 0 && bill_date.length > 0 && due_date.length > 0 && categories.length > 0 && paymentStatus.length > 0) {
            if (validatorObj.validateDateFormat(bill_date)) {
                if (validatorObj.validateDateFormat(due_date)) {
                    if (validatorObj.checkDatesValidity(bill_date, due_date)) {
                        if (!isNaN(amount_due)) {
                            if (amount_due >= 0.01) {
                                const categoriesTemp = [...new Set(categories)];
                                const categoriesString = [...categoriesTemp].join(',');
                                if (validatorObj.isValidStatus(paymentStatus, PaymentStatusEnum)) {
                                    const params = {
                                        id: id,
                                        "created_ts": created_ts,
                                        "updated_ts": updated_ts,
                                        "owner_id": owner_id,
                                        "vendor": vendor,
                                        "bill_date": bill_date,
                                        "due_date": due_date,
                                        "amount_due": amount_due,
                                        "categories": categoriesString,
                                        "paymentStatus": PaymentStatusEnum[paymentStatus]
                                    };
                                    billService.insertBill(params, function (msg) {
                                        if (msg == 'success') {
                                            response.status(201).json({
                                                "id": id,
                                                "created_ts": created_ts,
                                                "updated_ts": updated_ts,
                                                "owner_id": owner_id,
                                                "vendor": vendor,
                                                "bill_date": bill_date,
                                                "due_date": due_date,
                                                "amount_due": amount_due,
                                                "categories": categoriesTemp,
                                                "paymentStatus": paymentStatus,
                                                "attachment": {}
                                            });
                                        }
                                    });
                                } else {
                                    console.log("Invalid Payment Status")
                                    response.status(400).json({
                                        message: "Bad Request : Invalid Payment Status"
                                    })
                                }
                            } else {
                                console.log("Amount should be at least 0.01");
                                response.status(400).json({
                                    message: "Bad Request : Amount should be at least 0.01"
                                });
                            }
                        } else {
                            console.log("Invalid input for amount");
                            response.status(400).json({
                                message: "Bad Request : Invalid input for amount"
                            });
                        }
                    } else {
                        console.log("Invalid Dates");
                        response.status(400).json({
                            message: "Bad Request : Invalid Dates"
                        });
                    }
                } else {
                    console.log("Invalid Due Date");
                    response.status(400).json({
                        message: "Bad Request : Invalid Due Date"
                    });
                }
            } else {
                console.log("Invalid Bill Date");
                response.status(400).json({
                    message: "Bad Request : Invalid Bill Date"
                });
            }
        } else {
            console.log("Please enter all details");
            response.status(400).json({
                message: "Bad Request : Please enter all details"
            });
        }
    } else {
        console.log("Please enter valid input");
        response.status(400).json({
            message: "Bad Request : Please enter valid input"
        });
    }

}

exports.getAll = (request, response) => {
    let user = request.user
    billService.getBillsWithAttachmentsBasedOnUserId([user.id],function callback(results) {
      console.log('hi')
        if (results.length == 0) {
            console.log("No bills are available");
            response.status(200).json({
                message: "No bills are available",
                results
            });
        } 
        else{    
            let resultArray = [];    
        for (i in results){
            let bill = results[i];
           let billObj = {};
           billObj.id = bill.id;
           billObj.created_ts = bill.created_ts;
           billObj.updated_ts = bill.updated_ts;
           billObj.owner_id = bill.owner_id;
           billObj.vendor = bill.vendor;
           billObj.bill_date = bill.bill_date;
           billObj.due_date = bill.due_date;
           billObj.amount_due = bill.amount_due;
           billObj.categories = bill.categories.split(",")
           for (var status in PaymentStatusEnum) {
               if (PaymentStatusEnum[status] == bill.paymentStatus) {
                   billObj.paymentStatus = status
                   break
               }
           }
           if(bill.file_id == null)
           {
               billObj.attachment = {}
           }
           else
           {
            billObj.attachment = {
                filename: bill.file_name,
                id: bill.file_id,
                url: bill.url,
                upload_date: formatDate(bill.upload_date)
            }   
           }
           resultArray.push(billObj);

        }
        response.status(200).json(resultArray)
            }},function errorHandler(error){
                console.log(error)
                response.status(500).json(error);
            });
        
    }

exports.getBillById = (request, response) => {
    let user = request.user
    let billId = request.params.id

    billService.getBillById(billId, function callback(results) {
        if (results.length == 0) {
            console.log("No bill found with this id");
            response.status(404).json({
                message: "No bill found with this id"
            });
        } else {
            let bill = results[0]
            if (bill.owner_id != user.id) {
                console.log("Unauthorized access of bill");
                response.status(401).json({
                    message: "Unauthorized access of bill"
                });
            } else {
                bill.categories = bill.categories.split(",")
                for (var status in PaymentStatusEnum) {
                    if (PaymentStatusEnum[status] == bill.paymentStatus) {
                        bill.paymentStatus = status
                        break
                    }
                }
                fileService.getFileByBillId(bill.id, function callback(results) {
                    if (results.length == 0) {
                        bill.attachment = {}
                    } else {
                        bill.attachment = {
                            filename: results[0].file_name,
                            id: results[0].id,
                            url: results[0].url,
                            upload_date: formatDate(results[0].upload_date)
                        }
                    }
                    response.status(200).json(bill);
                })

            }

        }
    });
}

exports.put = (request, response) => {
    let user = request.user
    let billId = request.params.id

    billService.getBillById(billId, function callback(results) {
        if (results.length == 0) {
            console.log("No bill found with this id");
            response.status(404).json({
                message: "No bill found with this id",
                results
            });
        } else {
            let bill = results[0]
            if (bill.owner_id != user.id) {
                console.log("Unauthorized access of bill");
                response.status(401).json({
                    message: "Unauthorized access of bill"
                });
            } else {
                let user = request.user;
                const created_ts = bill.created_ts
                const updated_ts = new Date();
                const vendor = request.body.vendor;
                const bill_date = request.body.bill_date;
                const due_date = request.body.due_date;
                const amount_due = request.body.amount_due;
                const categories = request.body.categories;
                const paymentStatus = request.body.paymentStatus;
                if (vendor != null && bill_date != null && due_date != null && amount_due != null && categories != null && paymentStatus != null) {
                    if (vendor.length > 0 && bill_date.length > 0 && due_date.length > 0 && categories.length > 0 && paymentStatus.length > 0) {
                        if (validatorObj.validateDateFormat(bill_date)) {
                            if (validatorObj.validateDateFormat(due_date)) {
                                if (validatorObj.checkDatesValidity(bill_date, due_date)) {
                                    if (!isNaN(amount_due)) {
                                        if (amount_due >= 0.01) {
                                            const categoriesTemp = [...new Set(categories)];
                                            const categoriesString = [...categoriesTemp].join(',');
                                            if (validatorObj.isValidStatus(paymentStatus, PaymentStatusEnum)) {
                                                const params = [updated_ts, vendor, bill_date, bill_date, amount_due, categoriesString, PaymentStatusEnum[paymentStatus], billId, user.id]
                                                billService.updateBill(params, function callback(msg) {
                                                    if (msg == 'success') {
                                                        fileService.getFileByBillId(bill.id, function callback(results) {
                                                            if (results.length == 0) {
                                                                bill.attachment = {}
                                                            } else {
                                                                bill.attachment = {
                                                                    filename: results[0].file_name,
                                                                    id: results[0].id,
                                                                    url: results[0].url,
                                                                    upload_date: formatDate(results[0].upload_date)
                                                                }
                                                            }
                                                            response.status(200).json({
                                                                "id": billId,
                                                                "created_ts": created_ts,
                                                                "updated_ts": updated_ts,
                                                                "owner_id": user.id,
                                                                "vendor": vendor,
                                                                "bill_date": bill_date,
                                                                "due_date": due_date,
                                                                "amount_due": amount_due,
                                                                "categories": categoriesTemp,
                                                                "paymentStatus": paymentStatus,
                                                                "attachment": bill.attachment
                                                            });
                                                        });
                                                    }
                                                });
                                            } else {
                                                console.log("Invalid Payment Status")
                                                response.status(400).json({
                                                    message: "Bad Request : Invalid Payment Status"
                                                })
                                            }
                                        } else {
                                            console.log("Amount should be at least 0.01");
                                            response.status(400).json({
                                                message: "Bad Request : Amount should be at least 0.01"
                                            });
                                        }
                                    } else {
                                        console.log("Invalid input for amount");
                                        response.status(400).json({
                                            message: "Bad Request : Invalid input for amount"
                                        });
                                    }
                                } else {
                                    console.log("Invalid Dates");
                                    response.status(400).json({
                                        message: "Bad Request : Invalid Dates"
                                    });
                                }
                            } else {
                                console.log("Invalid Due Date");
                                response.status(400).json({
                                    message: "Bad Request : Invalid Due Date"
                                });
                            }
                        } else {
                            console.log("Invalid Bill Date");
                            response.status(400).json({
                                message: "Bad Request : Invalid Bill Date"
                            });
                        }
                    } else {
                        console.log("Please enter all details");
                        response.status(400).json({
                            message: "Bad Request : Please enter all details"
                        });
                    }
                } else {
                    console.log("Please enter valid input");
                    response.status(400).json({
                        message: "Bad Request : Please enter valid input"
                    });
                }
            }

        }
    });
}

exports.deleteBillById = (request, response) => {
    let user = request.user
    let billId = request.params.id

    billService.getBillById(billId, function callback(results) {
        if (results.length == 0) {
            console.log("No bill found with this id");
            response.status(404).json({
                message: "No bill found with this id"
            });
        } else {
            let bill = results[0]
            if (bill.owner_id != user.id) {
                console.log("Unauthorized access of bill");
                response.status(401).json({
                    message: "Unauthorized access of bill"
                });
            } else {
                fileService.getFileByBillId([billId], function callback(results){
                    if(results.length == 0){
                        const params = [billId, user.id];
                        billService.deleteBillById(params, function callback(results) {
                            console.log(`Deleted ${results.affectedRows} row(s)`);
                            response.status(204).send();
                        }, function handleError(error) {
                            response.status(500).send('bill');
                        });
                    }
                    else
                    {
                        let file = results[0];
                        var params = {
                            Bucket: process.env.S3_BUCKET_ADDR,
                            Key: file.key_name 
                        }
                        let s3 = new aws.S3();
                        s3.deleteObject(params, function (err, data) {
                            if (err) {
                                response.status(400).send(err);
                            }
                            else {
                                const params = [file.id, user.id, billId]
                                    fileService.deleteFileById(params, function callback(results) {
                                        billService.deleteBillById([billId,user.id], function callback(results) {
                                            console.log(`Deleted ${results.affectedRows} row(s)`);
                                            response.status(204).send();
                                        }, function handleError(error) {
                                            response.status(500).send('bill');
                                        });
                                    }, function handleError(error) {
                                        throw error
                                    });
                            }
                        });
                    }
                });
            }

        }
    });
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}