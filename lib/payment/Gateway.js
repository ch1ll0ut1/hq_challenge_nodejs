var _ = require("underscore");

function Gateway(config)
{
    this.config = config;
    this.internal_creditcard_types = [];
    this.external_creditcard_types = [];
    this.currencies = [];
}

Gateway.prototype.addCreditCardType = function addCreditCardType(internal_name, gateway_name)
{
	this.internal_creditcard_types.push(internal_name);
	this.external_creditcard_types.push(gateway_name);
}

Gateway.prototype.hasCreditCardType = function hasCreditCardType(name)
{
	//if no type is set, accept all
	if(this.internal_creditcard_types.length == 0) return true;

	return _.indexOf(this.internal_creditcard_types, name) > -1;
}

Gateway.prototype.getExternalCreditCardType = function getExternalCreditCardType(name)
{
	var internal_index = _.indexOf(this.internal_creditcard_types, name);

	if(internal_index > -1)
	{
		return this.external_creditcard_types[internal_index];
	}

	return undefined;
}

Gateway.prototype.addCurrency = function addCurrency(name)
{
	this.currencies.push(name);
}

Gateway.prototype.hasCurrency = function hasCurrency(name)
{
	return _.indexOf(this.currencies, name) > -1;
}

Gateway.prototype.validatePayment = function validatePayment(payment)
{
	if(!this.hasCurrency(payment.currency))
	{
		return false;
	}

	if(!this.hasCreditCardType(payment.creditcard_type))
	{
		return false;
	}

	return true;
}

Gateway.prototype.executePayment = function executePayment(payment, callback)
{
	throw new Exception("Gateway.executePayment() is not implemented!");
}

module.exports = Gateway;