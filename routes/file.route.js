module.exports = (app,version) => {
    const fileController = require('../controllers/file.controller');

    app.route('/'+version+'/bill/:billId/file/:fileId').get(fileController.getBillAttachment); //this route helps to get attachment of a specific bill
    app.route('/'+version+'/bill/:id/file').post(fileController.post); //this route helps to create a new file for a bill
    app.route('/'+version+'/bill/:billId/file/:fileId').delete(fileController.deleteFileOfBill); //this route helps to delete a specific file
};