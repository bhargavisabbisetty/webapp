var userService = ''
if(process.env.NODE_ENV == 'production'){
userService = require('./../services/user.service.mock')
}
else{
userService = require('./../services/user.service');
}

module.exports = basicAuth;

/**
 * 
 * This method is used for checking authentication for secured end points.
 * The requests to public routes are by passed to next method.
 */
function basicAuth(req, res, next) {
    // make authenticate path public
    // console.log('i am here')
    if (req.path === '/v1/user') {
        return next();
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if(username != '' && password != ''){
    
        userService.authenticate(username, password, callback=>{
        if (callback.message != 'true') {
            res.status(401).json({ message: callback.message });
        }
        else{
            req.user = callback.result
            next();
        }
    });
}else{
    res.status(401).json({
        message:"Please enter all details"
    })
}
}