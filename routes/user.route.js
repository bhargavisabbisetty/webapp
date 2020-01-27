module.exports = (app) => {
    const userController = require('../controllers/user.controller');

    app.route('/v1/user/self').get(userController.get); //this route helps to get an user information
    app.route('/v1/user/self').put(userController.put); //this route helps to update an user details
    app.route('/v1/user').post(userController.post); //this route helps to create a new user
};