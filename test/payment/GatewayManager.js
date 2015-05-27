var should = require('should');
var GatewayManager = require("../../lib/payment/GatewayManager");

//init app
require("./../../app");

var creditcards = {
	amex: "378282246310005",
	discover: "6011111111111117",
	jcb: "3530111333300000",
	mastercard: "5555555555554444",
	visa: "4111111111111111"
}

function testPayment(cc, currency, gateway)
{
	it("should succesfully pay "+currency+" with "+cc, function (done){
		
		GatewayManager.executePayment({
			price: 123,
			currency: currency,
			customer_firstname: "ftest",
			customer_lastname: "ltest",
			creditcard_firstname: "ftest",
			creditcard_lastname: "ltest",
			creditcard_number: creditcards[cc],
			creditcard_expiration_year: "2015",
			creditcard_expiration_month: "12",
			creditcard_ccv: "123"
		}, function(err, result){

			should.not.exist(err);
			result.status.should.equal("payed");
			result.payment_gateway.should.equal(gateway);
			result.creditcard_type.should.equal(cc);

			done();
		});

	});
}

describe('executePayment()', function () {

	this.timeout(300000);

	it("should fail paying aud with amex", function (done){
		
		GatewayManager.executePayment({
			price: 123,
			currency: "AUD",
			customer_firstname: "ftest",
			customer_lastname: "ltest",
			creditcard_firstname: "ftest",
			creditcard_lastname: "ltest",
			creditcard_number: creditcards.amex,
			creditcard_expiration_year: "2015",
			creditcard_expiration_month: "12",
			creditcard_ccv: "123"
		}, function(err, result){

			should.not.exist(result);
			should(err).be.equal('AMEX is possible to use only for USD');

			done();
		});

	});

	testPayment("amex", "USD", "paypal");
	testPayment("visa", "USD", "paypal");
	testPayment("mastercard", "USD", "paypal");

	testPayment("visa", "EUR", "paypal");
	testPayment("mastercard", "EUR", "paypal");
	testPayment("discover", "EUR", "paypal");

	testPayment("visa", "AUD", "paypal");
	testPayment("mastercard", "AUD", "paypal");
	testPayment("discover", "AUD", "paypal");

	testPayment("amex", "THB", "braintree");
	testPayment("visa", "HKD", "braintree");
	testPayment("mastercard", "SGD", "braintree");
	testPayment("discover", "THB", "braintree");

	it("should fail paying usd with jcb", function (done){
		
		GatewayManager.executePayment({
			price: 123,
			currency: "USD",
			customer_firstname: "ftest",
			customer_lastname: "ltest",
			creditcard_firstname: "ftest",
			creditcard_lastname: "ltest",
			creditcard_number: creditcards.jcb,
			creditcard_expiration_year: "2015",
			creditcard_expiration_month: "12",
			creditcard_ccv: "123"
		}, function(err, result){
			console.log(err, result);

			should(err).be.equal("The payment is currently not possible with your selected creditcard and currency");

			done();
		});

	});

});