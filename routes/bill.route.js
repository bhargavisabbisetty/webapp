module.exports = (app,version) => {
    const billController = require('../controllers/bill.controller');

    app.route('/'+version+'/bills').get(billController.getAll); //this route helps to get all bills of a specific user
    app.route('/'+version+'/bill/:id').get(billController.getBillById); //this route helps to get bill by specific id
    app.route('/'+version+'/bill/:id').put(billController.put); //this route helps to update a specific bill
    app.route('/'+version+'/bill/').post(billController.post); //this route helps to create a new bill
    app.route('/'+version+'/bill/:id').delete(billController.deleteBillById); //this route helps to delete a specific bill
    app.route('/'+version+'/bills/due/:count').get(billController.sendBillsAsMail); //send bills due as mail to user
};