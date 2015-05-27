var Hapi = require('hapi');
var Boom = require('Boom');
var Joi = require('joi');
var GatewayManager = require("../../payment/GatewayManager");
var db = require("../../database");

module.exports = {
    handler: function(request, reply) {

    	var payment = request.payload;
    	console.log('submit', request.payload);

    	if(!isValidCreditCardExpirationDate(payment.creditcard_expiration_month, payment.creditcard_expiration_year))
    	{
    		return reply(Boom.badRequest("Credit Card Expired!"));
    	}

        //create new order
        var order = db.save("Order", {
            price: payment.price,
            currency: payment.currency,
            customer_firstname: payment.customer_firstname,
            customer_lastname: payment.customer_lastname,
            status: "created"
        }, function(err, order){

            if(err) return reply(Boom.badRequest(err));

            //proceed payment
            GatewayManager.executePayment(payment, function(err, res){

                console.log('payment response', err, res);

                if(!res)
                {
                    order.status = 'canceled';
                }
                else
                {
                    order.status = res.status;
                    order.external_order_id = res.external_order_id;
                }

                order.payment_gateway = payment.payment_gateway;
                order.creditcard_type = payment.creditcard_type;
                
                //update order in database
                order.save(function(err){
                    if(err) console.error(err);
                });

                if(err)
                {
                    reply(Boom.badRequest(err));
                }
                else
                {
                    //response
                    reply(res);
                }
                
            });

        });
    },
    validate: {
        payload: {
            price: Joi.number().positive().precision(2).required().example(12.43),
            currency: Joi.any().valid(['USD', 'EUR', 'THB', 'HKD', 'SGD', 'AUD']),
            customer_firstname: Joi.string().required().example('John').min(3).max(64),
            customer_lastname: Joi.string().required().example('Smith').min(3).max(64),
            creditcard_firstname: Joi.string().required().example('John').min(3).max(64),
            creditcard_lastname: Joi.string().required().example('Smith').min(3).max(64),
            creditcard_number: Joi.string().creditCard().required(),
            creditcard_expiration_year: Joi.number().integer().min(2015).max(2050).required().example('2016'),
            creditcard_expiration_month: Joi.number().integer().min(1).max(12).required().example('8'),
            creditcard_ccv: Joi.number().required().min(1).max(999).example('123')
        }
    }
}

function isValidCreditCardExpirationDate(month, year)
{
	var today = new Date();
	var expiration = new Date();

	expiration.setFullYear(year, month, 1);

	if (expiration < today)
	{
	   return false;
	}

	return true;
}