var bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
const saltRounds = 10
const server = require('./../server')
const uuid = require('uuid/v4')
const Validator = require('./../services/validator')
const logger = require('../config/winston')
const sdc = require('../config/statsd-client')
const validatorObj = new Validator()
const aws = require('aws-sdk');
var fs = require('fs')
var billService = ''
var fileService = ''
let s3 = new aws.S3();
aws.config.update({
    region: 'us-east-1'
});
const bucket = process.env.S3_BUCKET_ADDR;
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
    sdc.increment('filePost.counter');
    var timer = new Date()
    let billId = request.params.id
    let user = request.user;
    const id = uuid();
    // const upload_date = (new Date()).toLocaleDateString();
    const upload_date = formatDate(new Date())
    const owner_id = user.id;
    var url = ''

    billService.getBillById(billId, function callback(results) {
        if (results.length == 0) {
            logger.info("No bill found with this id");
            response.status(404).json({
                message: "No bill found with this id"
            });
        } else {
            let bill = results[0]
            if (bill.owner_id != user.id) {
                logger.info("Unauthorized access of bill");
                response.status(401).json({
                    message: "Unauthorized access of bill"
                });
            } else {
                if (!request.files) {
                    logger.info("Please attach a file");
                    response.status(400).json({
                        message: "Please attach a file"
                    });
                } else {
                    let file = request.files.file;
                    if (file != undefined) {
                        var fileFormat = (file.name).split(".");
                        url = fileFormat[0] + '_' + user.id.substring(1, 8) + '_' + billId.substring(1, 8) + '_' + Date.now() + '.' + fileFormat[fileFormat.length - 1]
                        var ext = fileFormat[fileFormat.length - 1]
                        if (ext != 'pdf' && ext != 'jpeg' && ext != 'jpg' && ext != 'png') {
                            logger.info("Please attach a file with the following formats: jpg, png, jpeg, pdf")
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
                                        "url": url,
                                        "key_name": url
                                    };
                                    var DBtimer = new Date()
                                    fileService.insertFile(params, function (msg) {
                                        if (msg == 'success') {
                                            sdc.timing('DBfilePost.timer', DBtimer)
                                            // let s3Bucket = new AWS.S3({Bucket: process.env.S3_BUCKET_ADDR});
                                            var params = {
                                                Bucket: process.env.S3_BUCKET_ADDR,
                                                Key: url,
                                                Body: file.data
                                            }
                                            var S3timer = new Date()
                                            s3.upload(params, function (err, data) {
                                                if (err) {
                                                    logger.error(err);
                                                    const params = [id, owner_id, billId]
                                                    fileService.deleteFileById(params, function callback(results) {
                                                        logger.info(`Deleted ${results.affectedRows} row(s)`);
                                                        response.status(500).send(err);
                                                    }, function handleError(error) {
                                                        logger.error(error)
                                                        return response.status(500).send(error);
                                                    })


                                                } else {
                                                    sdc.timing('S3filePost.timer', S3timer)
                                                    // console.log(data);
                                                    const params = [data.Location, data.key, id, owner_id, billId]
                                                    fileService.updateFile(params, function (msg) {
                                                        if (msg == 'success') {
                                                            logger.info("updated file")
                                                            response.status(201).json({
                                                                "file_name": file.name,
                                                                "id": id,
                                                                "url": data.Location,
                                                                "upload_date": upload_date
                                                            });
                                                        } else {
                                                            const params = [id, owner_id, billId]
                                                            fileService.deleteFileById(params, function callback(results) {
                                                                logger.info(`Deleted ${results.affectedRows} row(s)`);
                                                                logger.error(err)
                                                                response.status(500).send(err);
                                                            }, function handleError(error) {
                                                                logger.error(error)
                                                                return response.status(500).send(error);
                                                            })
                                                        }

                                                    })
                                                }
                                            })


                                        } else {
                                            logger.error(msg)
                                            response.status(500).json(msg)
                                        }
                                    });
                                } else {
                                    logger.info("There is already a file attached to bill. Please delete it to attach new one")
                                    response.status(400).json({
                                        message: "There is already a file attached to bill. Please delete it to attach new one"
                                    });

                                }
                            });
                        }
                    } else {
                        logger.info("Bad request")
                        response.status(400).json({
                            message: "Bad request"
                        });
                    }
                }
            }
        }
    });
    sdc.timing('filePost.timer', timer)
}

exports.getBillAttachment = (request, response) => {
    sdc.increment('fileGet.counter');
    var timer = new Date()
    let user = request.user
    let billId = request.params.billId
    let fileId = request.params.fileId

    billService.getBillById(billId, function callback(results) {
        if (results.length == 0) {
            logger.info("No bill found with this id");
            response.status(404).json({
                message: "No bill found with this id"
            });
        } else {
            let bill = results[0];
            if (bill.owner_id != user.id) {
                logger.info("Unauthorized access of bill");
                response.status(401).json({
                    message: "Unauthorized access of bill"
                });
            } else {
                var DBtimer = new Date()
                fileService.getFileByBillId(billId, function callback(results) {
                    if (results.length == 0) {
                        logger.info("No file found with this id");
                        response.status(404).json({
                            message: "No file found with this id"
                        });
                    } else {
                        let file = results[0];
                        if (file.id != fileId) {
                            logger.info("No file found with this id")
                            response.status(404).json({
                                message: 'No file found with this id'
                            })
                        } else {
                            logger.info("Successfully retrieved the file")
                            sdc.timing('DBfileGet.timer', DBtimer)
                            response.status(200).json({
                                "file_name": file.file_name,
                                "id": file.id,
                                "url": file.url,
                                "upload_date": formatDate(file.upload_date)
                            });
                        }
                    }
                });
            }
        }
    });
    sdc.timing('fileGet.timer', timer)
}

exports.deleteFileOfBill = (request, response) => {
    sdc.increment('fileDelete.counter');
    var timer = new Date()
    let user = request.user
    let billId = request.params.billId
    let fileId = request.params.fileId

    billService.getBillById(billId, function callback(results) {
        if (results.length == 0) {
            logger.info("No bill found with this id");
            response.status(404).json({
                message: "No bill found with this id"
            });
        } else {
            let bill = results[0];
            if (bill.owner_id != user.id) {
                logger.info("Unauthorized access of bill");
                response.status(401).json({
                    message: "Unauthorized access of bill"
                });
            } else {
                fileService.getFileByBillId(billId, function callback(results) {
                    if (results.length == 0) {
                        logger.info("No file found with this id");
                        response.status(404).json({
                            message: "No file found with this id"
                        });
                    } else {
                        let file = results[0];
                        if (file.id != fileId) {
                            logger.info("File id for given bill id is not matching")
                            response.status(400).json({
                                message: 'File id for given bill id is not matching'
                            })
                        } else {
                            var params = {
                                Bucket: process.env.S3_BUCKET_ADDR,
                                Key: file.key_name
                            };
                            var S3timer = new Date()
                            s3.deleteObject(params, function (err, data) {
                                if (err) {
                                    logger.error(err)
                                    response.status(400).send(err);
                                } else {
                                    sdc.timing('S3fileDelete.timer', S3timer)
                                    const params = [fileId, user.id, billId]
                                    var DBtimer = new Date()
                                    fileService.deleteFileById(params, function callback(results) {
                                        logger.info(`Deleted ${results.affectedRows} row(s)`);
                                        sdc.timing('DBfileDelete.timer', DBtimer)
                                        response.status(204).send();
                                    }, function handleError(error) {
                                        logger.error(err)
                                        response.status(400).send(err);
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    sdc.timing('fileDelete.timer', timer)
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