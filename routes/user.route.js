module.exports = (app,version) => {
    const userController = require('../controllers/user.controller');

    app.route('/'+version+'/user/self').get(userController.get); //this route helps to get an user information
    app.route('/'+version+'/user/self').put(userController.put); //this route helps to update an user details
    app.route('/'+version+'/user').post(userController.post); //this route helps to create a new user
};