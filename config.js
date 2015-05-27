module.exports = {

	//WEBSERVER
	host: process.env.HOST || "localhost",
	port: process.env.PORT || 3000,
	
	//DATABASE
	database: process.env.MONGODB_URL || 'mongodb://localhost/',

	//PAYMENT GATEWAYS
	payment_gateways: {
		paypal: {
			host: 'api.sandbox.paypal.com',
			mode: 'sandbox',
			client_id: 'Abo21KWt6cOhkD4Clejcxo7ppG__3qGweFUa8kIIja0BkivQYHc1Qr-uSYLuGtGcycUb12HQ_yOOHt6d',
			client_secret: 'EDMXU4-MFlw93z60hmUsgsmm1zN6NA-ah8P8NKfUgMdoGNbZjppToBIdcQ4_Y8soBgPpj93okW3aqI0G'
		},
		braintree: {
	        environment: "Sandbox",
	        merchantId: "83q7ncvc6vv3sv9d",
	        publicKey: "th849wg6wr77cwyc",
	        privateKey: "1e0f1c31603a19b30ccfde264885071d"
		}
	}
}