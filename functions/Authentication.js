
const { request, response } = require('express');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {function} next 
 */
function Authentication(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = Authentication;