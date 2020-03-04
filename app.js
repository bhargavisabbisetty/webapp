module.exports = function (app) {
    //providing routes context for our application
    let userRoutes = require('./routes/user.route');
    userRoutes(app,'v1');

    let billRoutes = require('./routes/bill.route');
    billRoutes(app,'v1');

    let fileRoutes = require('./routes/file.route');
    fileRoutes(app,'v1');
}