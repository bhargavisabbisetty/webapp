module.exports = (app) => {
    const billController = require('../controllers/bill.controller');

    app.route('/v1/bills').get(billController.getAll); //this route helps to get all bills of a specific user
    app.route('/v1/bill/:id').get(billController.getBillById); //this route helps to get bill by specific id
    app.route('/v1/bill/:id').put(billController.put); //this route helps to update a specific bill
    app.route('/v1/bill/').post(billController.post); //this route helps to create a new bill
    app.route('/v1/bill/:id').delete(billController.deleteBillById); //this route helps to delete a specific bill
};