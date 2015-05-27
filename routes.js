module.exports = function(server)
{
	//index page
	server.route({
		method: ['GET'],
		path: '/',
		config: require("./lib/controller/index/index")
	});

	server.route({
		method: ['POST'],
		path: '/',
		config: require("./lib/controller/index/submit")
	});

	// Serve static files
	server.route({
	    method: 'GET',
	    path: '/{param*}',
	    handler: {
	        directory: {
	            path: './public',
	            listing: false,
            	index: true
	        }
	    }
	});
}