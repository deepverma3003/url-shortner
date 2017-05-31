const express = require('express');
const pg = require('pg');
var Regex = require('regex');
var app = express();

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/urls';
const result = [];

	app.get('/new/:query', function(req,res){
		var url = req.params.query;
		var queryResult = [];

		if(validateURL(url)) {
			console.log("URL validated");

			pg.connect( connectionString, function(err, client, done){
				if(err){
					done();
					console.log(err);
				}
				console.log("url:"+url);
				var query = client.query('select * from items where url = ($1)', [url], function(err, output) {
			      console.log(output.rows[0]);
  					if(output.rows[0] == undefined){
						console.log("insert");
						const new_url = Math.random().toString(16).substring(7);
						client.query('insert into items(url, new_url) values($1, $2)', [url, new_url]);
						query = client.query('select * from items where url = ($1)', [url]);
						
					}else{
						query = client.query('select * from items where url = ($1)', [url]);
					}
					query.on('row', function(row) {
						result.push(row);			
					});						
					
					query.on('end', function() {
						done();
						return res.send(result);
					});
					
			    });
			});

		} else {
			res.send("incorrect URL format");
		}

	});


	app.get('/:query', function(req,res){
		var url = req.params.query;
		var queryResult = [];

		pg.connect( connectionString, function(err, client, done){
			if(err){
				done();
				console.log(err);
			}
			console.log("url:"+url);
			var query = client.query('select url from items where new_url = ($1)', [url]);

		    query.on('row', function(row) {
				result.push(row);			
			});						
			
			query.on('end', function() {
				var location = 'https://'+result[0].url;
				done();
				res.redirect(location);
				
			});
		});

	});


	

	function validateURL(url) {
	  	var regex = /(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/g;

	  	return regex.test(url);
	}


  var port = 3000 || 8080;

  app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
  });