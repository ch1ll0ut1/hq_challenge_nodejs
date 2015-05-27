var _ = require("underscore");


function GatewayManager()
{
	this.initilized = false;
	this.gateways = {};
}

GatewayManager.prototype.init = function init(config)
{
	var self = this;

	this.initilized = true;
	this.config = config.payment_gateways;

	Object.keys(this.config).forEach(function(gateway_name, index){
		console.log('initilizing payment gateway '+gateway_name+' ...');

		var Gateway = require('./gateway/'+gateway_name);

	    self.gateways[gateway_name] = new Gateway(self.config[gateway_name]);
	});
}

GatewayManager.prototype.executePayment = function executePayment(payment, callback)
{
	payment.gateway = 'braintree';

	payment.creditcard_type = this.getCreditCardType(payment.creditcard_number);

	//proceed amex through paypal
	if(payment.creditcard_type == 'American Express')
	{
		payment.gateway = 'paypal';

		if(payment.currency != 'USD')
		{
			return callback('AMEX is possible to use only for USD');
		}
	}
	
	//check if can proceed currency through paypal
	//   todo: solve case when paypal doesnt exist, can braintree replace that case?
	else if(this.gateways['paypal'].hasCurrency(payment.currency))
	{
		payment.gateway = 'paypal';
	}

	//check if gateway is available
	if(!this.gateways[payment.gateway])
	{
		//todo: send error to dev email
		console.error('gateway missing', payment.gateway, payment.currency, payment.creditcard_type);
		return callback('The payment is currently not possible with your selected creditcard and currency');
	}

	if(!this.gateways[payment.gateway].validatePayment(payment))
	{
		return callback('The payment is currently not possible with your selected creditcard and currency');
	}
	
	//proceed payment
	this.gateways[payment.gateway].executePayment(payment, callback);
}

GatewayManager.prototype.getCreditCardType = function getCreditCardType(number)
{
  	number = (''+number).replace(/\D/g, '');

	if(/^(5610|560221|560222|560223|560224|560225)/.test(number))
	{
	    return 'Australian Bank Card';
	}
	else if(/^(2014|2149)/.test(number))
	{
	    return 'Diner\'s Club';
	}
	else if(/^36/.test(number))
	{
	    return 'Diner\'s Club International';
	}
	else if(/^35(2[89]|[3-8][0-9])/.test(number))
	{
	    return 'Japanese Credit Bureau';
	}
	else if(/^(5018|5020|5038|6304|6759|676[1-3])/.test(number))
	{
	    return 'Maestro';
	}
	else if(/^(6304|670[69]|6771)/.test(number))
	{
	    return 'laser';
	}
	else if(/^(6334|6767)/.test(number))
	{
	    return 'Solo (Paymentech)';
	}
	else if(/^5[1-5]/.test(number))
	{
	    return 'MasterCard';
	}
	else if(/^(6011|622|64|65)/.test(number))
	{
	    return 'Discover';
	}
	else if(/^3[47]/.test(number))
	{
	    return 'American Express';
	}
	else if(/^(30[0-5]|36|38|54|55|2014|2149)/.test(number))
	{
	    return 'Diner\'s Club / Carte Blanche';
	}
	else if(/^(4026|417500|4508|4844|491(3|7))/.test(number))
	{
	    return 'Visa Electron';
	}
	else if(/^(4)/.test(number))
	{
	    return 'Visa';
	}

	//todo: send error to dev email
	console.error('creditcard type is undefined', number);

	return undefined;
}


module.exports = new GatewayManager();