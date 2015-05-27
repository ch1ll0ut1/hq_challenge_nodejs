
//load config
var config = require("./config");

//init database
require("./lib/database").init(config);

//load models
require("./lib/models/Order");

//load classes
var Path = require('path');
var Hapi = require('hapi');
var Poop = require('poop');

//init web server
var server = new Hapi.Server();

server.connection({
	port: config.port,
	host: config.host
});

//setup routes & controllers
require("./routes")(server);

//setup view engine
server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'lib/views')
});

//setup error logging
// server.register({
//     register: Poop,
//     options: {
//         logPath: Path.join(__dirname, 'error.log')
//     }
// }, function(){});

//setup payment gateway manager
require("./lib/payment/GatewayManager").init(config);

//start webserver
server.start(function () {
    console.log('Server running at:', server.info.uri);
});

