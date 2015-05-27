var mongoose = require('mongoose');

module.exports = {

	connected: false,

	schemes: {},

	models: {},

	init: function(config){

		var self = this;

		mongoose.connect(config.database);

		var db = mongoose.connection;

		db.on('error', console.error.bind(console, 'connection error:'));

		db.once('open', function (callback) {
			console.log("mongodb connection opened!");

			self.connected = true;
		});

		return this;
	},

	createModel: function(name, scheme){

		this.schemes[name] = mongoose.Schema(scheme);

		this.models[name] = mongoose.model(name, this.schemes[name]);
	},

	save: function(name, data, callback){
		var model = new this.models[name](data);

		model.save(function (err, doc) {
		  if (err) console.error('error saving model', name, data, err);

		  if(callback) callback(err, doc);
		});

		return model;
	}
};