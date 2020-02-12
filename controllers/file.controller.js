var bcrypt = require('bcrypt');
const saltRounds = 10
const server = require('./../server')
const uuid = require('uuid/v4')
const Validator = require('./../services/validator')
const validatorObj = new Validator()
var fs = require('fs')
var billService = ''
var fileService = ''
if (process.env.NODE_ENV == 'production') {
    billService = require('./../services/bill.service.mock')
} else {
    billService = require('./../services/bill.service');
}

if (process.env.NODE_ENV == 'production') {
    fileService = require('./../services/file.service.mock')
} else {
    fileService = require('./../services/file.service');
}

/**
 * 
 * This method is used to make a post request. It is a public endpoint.
 * This method helps to create new file.
 */

exports.post = (request, response) => {

    let billId = request.params.id
    let user = request.user;
    const id = uuid();
    const upload_date = (new Date()).toLocaleDateString();
    const owner_id = user.id;
    var url = ''

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
                if (!request.files) {
                    response.status(400).json({
                        message: "Please attach a file"
                    });
                } else {
                    let file = request.files.file;
                    if (file != undefined) {
                        var fileFormat = (file.name).split(".");
                        url = './uploads/' + fileFormat[0] + '_'+ user.id + '_' + billId + '_' + Date.now() + '.' + fileFormat[fileFormat.length - 1]
                        var ext = fileFormat[fileFormat.length - 1]
                        if (ext != 'pdf' && ext != 'jpeg' && ext != 'jpg' && ext != 'png') {
                            response.status(400).json({
                                message: "Please attach a file with the following formats: jpg, png, jpeg, pdf"
                            });
                        } else {
                            fileService.getFileByBillId(billId, function callback(results) {
                                if (results.length == 0) {
                                    const params = {
                                        "id": id,
                                        "upload_date": upload_date,
                                        "file_name": file.name,
                                        "file_owner": owner_id,
                                        "bill_id": billId,
                                        "size": file.size,
                                        "md5": file.md5,
                                        "encoding": file.encoding,
                                        "mimetype": file.mimetype,
                                        "url": url
                                    };
                                    fileService.insertFile(params, function (msg) {
                                        if (msg == 'success') {
                                            file.mv(url, function (err) {
                                                if (err) {
                                                    const params = [id, owner_id, billId]
                                                    fileService.deleteFileById(params, function callback(results) {
                                                        console.log(`Deleted ${results.affectedRows} row(s)`);
                                                        response.status(500).send(err);
                                                    }, function handleError(error) {
                                                        return response.status(500).send(error);
                                                    })


                                                } else {
                                                    response.status(201).json({
                                                        "file_name": file.name,
                                                        "id": id,
                                                        "url": url,
                                                        "upload_date": upload_date
                                                    });
                                                }
                                            });

                                        } else {
                                            response.status(500).json(msg)
                                        }
                                    });
                                } else {
                                    response.status(400).json({
                                        message: "There is already a file attached to bill. Please delete it to attach new one"
                                    });

                                }
                            });
                        }
                    }
                    else
                    {
                        response.status(400).json({
                            message: "Bad request"
                        });
                    }
                }
            }
        }
    });

}

exports.getBillAttachment = (request, response) => {

    let user = request.user
    let billId = request.params.billId
    let fileId = request.params.fileId

    billService.getBillById(billId, function callback(results) {
        if (results.length == 0) {
            console.log("No bill found with this id");
            response.status(404).json({
                message: "No bill found with this id"
            });
        } else {
            let bill = results[0];
            if (bill.owner_id != user.id) {
                console.log("Unauthorized access of bill");
                response.status(401).json({
                    message: "Unauthorized access of bill"
                });
            } else {
                fileService.getFileByBillId(billId, function callback(results) {
                    if (results.length == 0) {
                        console.log("No file found with this id");
                        response.status(404).json({
                            message: "No file found with this id"
                        });
                    } else {
                        let file = results[0];
                        if (file.id != fileId) {
                            response.status(400).json({
                                message: 'File id for given bill id is not matching'
                            })
                        } else {
                            response.status(200).json({
                                "file_name": file.file_name,
                                "id": file.id,
                                "url": file.url,
                                "upload_date": file.upload_date.toLocaleDateString()
                            });
                        }
                    }
                });
            }
        }
    });
}

exports.deleteFileOfBill = (request, response) => {
    let user = request.user
    let billId = request.params.billId
    let fileId = request.params.fileId

    billService.getBillById(billId, function callback(results) {
        if (results.length == 0) {
            console.log("No bill found with this id");
            response.status(404).json({
                message: "No bill found with this id"
            });
        } else {
            let bill = results[0];
            if (bill.owner_id != user.id) {
                console.log("Unauthorized access of bill");
                response.status(401).json({
                    message: "Unauthorized access of bill"
                });
            } else {
                fileService.getFileByBillId(billId, function callback(results) {
                    if (results.length == 0) {
                        console.log("No file found with this id");
                        response.status(404).json({
                            message: "No file found with this id"
                        });
                    } else {
                        let file = results[0];
                        if (file.id != fileId) {
                            response.status(400).json({
                                message: 'File id for given bill id is not matching'
                            })
                        } else {
                            fs.unlink(file.url, function (err) {
                                if (err) {
                                    response.status(500).send(err);
                                } else {
                                    const params = [fileId, user.id, billId]
                                    fileService.deleteFileById(params, function callback(results) {
                                        console.log(`Deleted ${results.affectedRows} row(s)`);
                                        response.status(204).send();
                                    }, function handleError(error) {
                                        throw error
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}