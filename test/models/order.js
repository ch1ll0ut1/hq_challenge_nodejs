var should = require('should');

//init app
require("./../../app");

//load db
var db = require('./../../lib/database');

describe('Models.Order', function (){

	var order;

	describe('save()', function (){

		it("should correctly save order data without error", function (done){
			
			order = db.save('Order', {
				price: "123456",
				currency: "USD",
				customer_firstname: "ftest",
				customer_lastname: "ltest",
				status: "test"
			}, done);

		});

	});

	describe('find()', function (){

		it("should find previous saved entry in database by id", function (done){
			
			var result = db.models.Order.findOne({_id: order._id}, function(err, result){

				result.price.should.equal("123456");
				result.currency.should.equal("USD");
				result.customer_firstname.should.equal("ftest");
				result.customer_lastname.should.equal("ltest");
				result.status.should.equal("test");

				done();

			});

		});

	});

	describe('delete()', function (){

		it("should delete previous saved entry in database by id", function (done){
			
			var result = db.models.Order.remove({_id: order._id}, function(err, result){

				result.result.ok.should.equal(1);
				result.result.n.should.equal(1);

				done();

			});

		});

	});
});