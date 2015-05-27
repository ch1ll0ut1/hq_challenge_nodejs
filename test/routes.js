var request = require('supertest')

describe('Routes', function () {

  it('should return 200 on /', function (done) {

    request('http://localhost:3000')
	.get('/')
	.expect(200)
	.end(function(err, res){
		if (err) return done(err);
		else done();
	});

  });

  it('should return 400 on post /', function (done) {

    request('http://localhost:3000')
	.post('/')
	.expect(400)
	.end(function(err, res){
		if (err) return done(err);
		else done();
	});

  });

});