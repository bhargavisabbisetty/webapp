module.exports = function (app) {
    //providing routes context for our application
    let userRoutes = require('./routes/user.route');
    userRoutes(app);
}