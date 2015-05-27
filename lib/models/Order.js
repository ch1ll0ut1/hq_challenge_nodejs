var db = require("../database");

db.createModel('Order', {
	price: {
		type: String,
		required: true
	},
	currency: {
		type: String,
		required: true
	},
	customer_firstname: {
		type: String,
		required: true
	},
	customer_lastname: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	payment_gateway: String,
	external_order_id: String,
	date_created: Date,
	date_updated: Date
});

db.schemes.Order.pre('save', function(next){
  
  now = new Date();
  
  this.date_updated = now;

  if(!this.date_created)
  {
    this.date_created = now;
  }
  
  next();

});