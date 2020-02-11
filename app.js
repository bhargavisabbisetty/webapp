module.exports = function (app) {
    //providing routes context for our application
    let userRoutes = require('./routes/user.route');
    userRoutes(app);

    let billRoutes = require('./routes/bill.route');
    billRoutes(app);

    let fileRoutes = require('./routes/file.route');
    fileRoutes(app);
}