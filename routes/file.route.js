module.exports = (app) => {
    const fileController = require('../controllers/file.controller');

    app.route('/v1/bill/:billId/file/:fileId').get(fileController.getBillAttachment); //this route helps to get attachment of a specific bill
    app.route('/v1/bill/:id/file').post(fileController.post); //this route helps to create a new file for a bill
    app.route('/v1/bill/:billId/file/:fileId').delete(fileController.deleteFileOfBill); //this route helps to delete a specific file
};