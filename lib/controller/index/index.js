var Hapi = require('hapi');
var Joi = require('joi');

module.exports = {
    handler: function(request, reply) {
        reply.view('index/index');
    }
}