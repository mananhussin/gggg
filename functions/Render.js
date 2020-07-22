const { request, response} = require('express')

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {string} template 
 * @param {object<string, any>} data 
 */
function Render(req, res, template, data = {}) {
    const baseData = {
        path: req.path,
        user: req.isAuthenticated() ? req.user : null
    };
    res.render(template, Object.assign(baseData, data));
};

module.exports = Render;