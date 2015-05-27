var braintree = require('braintree');
var util = require('util');


function GatewayBraintree(config)
{
    GatewayBraintree.super_.apply(this, arguments);

    this.api = braintree.connect({
        environment: braintree.Environment[config.environment],
        merchantId: config.merchantId,
        publicKey: config.publicKey,
        privateKey: config.privateKey
    });

    this.addCurrency("THB");
    this.addCurrency("HKD");
    this.addCurrency("SGD");

    this.addCreditCardType("Visa Electron", "Visa");
    this.addCreditCardType("Visa", "Visa");
    this.addCreditCardType("MasterCard", "Mastercard");
    this.addCreditCardType("American Express", "American Express");
    this.addCreditCardType("Discover", "Discover");
    this.addCreditCardType("Japanese Credit Bureau", "JCB");
}

var Gateway = require("../Gateway");
util.inherits(GatewayBraintree, Gateway);

GatewayBraintree.prototype.executePayment = function executePayment(payment, callback)
{
    var self = this;

    var name = payment.creditcard_firstname + ' ' + payment.creditcard_lastname;

    //format month to MM
    if(payment.creditcard_expiration_month.length == 1)
    {
        payment.creditcard_expiration_month = "0" + payment.creditcard_expiration_month;
    }

    //map creditcard type to paypals type
    var mapped_cc_type = this.getExternalCreditCardType(payment.creditcard_type);

    //proceed payment
    this.api.clientToken.generate({
        customerId: "not implemented"
    }, function(err, response){

        self.api.transaction.sale({
            amount: payment.price,
            paymentMethodNonce: response.clientToken,
            creditCard: {
                cardholderName: name,
                cvv: payment.creditcard_ccv,
                expirationMonth: payment.creditcard_expiration_month,
                expirationYear: payment.creditcard_expiration_year,
                number: payment.creditcard_number,
            }
        }, function(err, res){

            if(res.httpStatusCode != 200)
            {
                err = res.message;
                res = {
                    status: 'canceled',
                    payment_gateway: 'braintree',
                    creditcard_type: mapped_cc_type
                }
            }
            else
            {
                res = {
                    status: "payed",
                    external_order_id: res.id,
                    payment_gateway: 'braintree',
                    creditcard_type: mapped_cc_type
                }
            }

            callback(err, res);
        });
    });

}

module.exports = GatewayBraintree;
