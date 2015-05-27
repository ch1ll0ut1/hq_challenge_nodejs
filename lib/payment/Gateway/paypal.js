var paypal_api = require('paypal-rest-sdk');
var util = require('util');
var accounting = require('accounting');


function GatewayPaypal(config)
{
    GatewayPaypal.super_.apply(this, arguments);

    this.addCreditCardType("Visa Electron", "visa");
    this.addCreditCardType("Visa", "visa");
    this.addCreditCardType("MasterCard", "mastercard");
    this.addCreditCardType("American Express", "amex");
    this.addCreditCardType("Discover", "discover");

    this.addCurrency("USD");
    this.addCurrency("EUR");
    this.addCurrency("AUD");
}

var Gateway = require("../Gateway");
util.inherits(GatewayPaypal, Gateway);

GatewayPaypal.prototype.validatePayment = function validatePayment(payment, callback)
{
    //validate parent class conditions
    if(!GatewayPaypal.super_.prototype.validatePayment.apply(this, arguments))
    {
        return false;
    }

    return true;
}

GatewayPaypal.prototype.executePayment = function executePayment(payment, callback)
{
    var self = this;

    //map creditcard type to paypals type
    var mapped_cc_type = this.getExternalCreditCardType(payment.creditcard_type);

    //format price
    payment.price = payment.price.toFixed(2);

    var api_command = {
        "intent": "sale",
        "payer": {
            "payment_method": "credit_card",
            "funding_instruments": [{
                "credit_card": {
                    "type": mapped_cc_type,
                    "number": payment.creditcard_number,
                    "expire_month": payment.creditcard_expiration_month,
                    "expire_year": payment.creditcard_expiration_year,
                    "cvv2": payment.creditcard_ccv,
                    "first_name": payment.creditcard_firstname,
                    "last_name": payment.creditcard_lastname
                }
            }]
        },
        "transactions": [{
            "amount": {
                "total": payment.price,
                "currency": payment.currency
            },
            "description": "hq payment"
        }]
    };

    paypal_api.payment.create(api_command, this.config, function(err, res){
        if(err)
        {
            err = err.response;
            res = {
                status: 'canceled',
                payment_gateway: 'paypal',
                creditcard_type: mapped_cc_type
            }
        }
        else
        {
            res = {
                status: self.mapResponseStatus(res.state),
                external_order_id: res.id,
                payment_gateway: 'paypal',
                creditcard_type: mapped_cc_type
            }
        }

        callback(err, res);
    });
}

GatewayPaypal.prototype.mapResponseStatus = function mapResponseStatus(status)
{
    switch(status)
    {
        case "approved": return "payed";

        case "created": 
        case "pending": return "pending";

        default: return "canceled";
    }
}


module.exports = GatewayPaypal;
