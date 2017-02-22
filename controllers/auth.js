var https = require('https')
	, querystring = require('querystring')
	, jwt = require('jsonwebtoken')
	;

module.exports = {
	resetToken: function (req, res) {

		var post_data = querystring.stringify({
			'grant_type' : 'refresh_token',
			'client_id': 'app_23191556_1487781137152',
			'client_secret': 'fe10c459be75c32eaaab7d881375703763e78fa121662db2e73d4ee0350ace02f464141ef756a7de8f113a8750714685393e2cd53711624b00b2776c7b6a2b049412adb1dcf632aebe63574ee029ddf121ea7ea35f9cdc1eba8e70708b5896e5a6e82ab224e3201297d4c78b513302669638f367a9bdb8388f938eb308a1f3a',
			'refresh_token' : req.user.oauthConnections.refreshToken
		});

		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/manage/oauth2/token',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/x-www-form-urlencoded'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = https.request(options, function(respuesta) {
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			var parsed = JSON.parse(body);

		  			req.user.oauthConnections = {
		                accessToken: parsed.accessToken,
		                refreshToken: parsed.refreshToken,
		                params: {
		                	'issued_on': parsed.issued_on,
		                	'expires_in': parsed.expires_in,
		                	'token_type': parsed.token_type
		                }
		            };

		            var token = jwt.sign(profile, 'IBMConnectionsCloud.01012016', {
		                expiresIn: '12h' // expires in 2 hours
		            });

		            var user = {
		                displayName : req.user.displayName,
		                email: req.user.emails[0].value,
		                token: token
		            };
		  			
			        res.status(200).json(user);
			        return;
		  		} else {
		  			console.log('status message', respuesta.statusMessage);
		  			res.status(respuesta.statusCode).send(body);
		  		}
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error getting the information, please try again."
	        });
		});

	}
	, getToken: function (req, res) {

		var post_data = querystring.stringify({
			'code' : req.body.code,
			'grant_type': 'authorization_code',
			'client_id': 'Error getting the information, please try again.',
			'client_secret': 'fe10c459be75c32eaaab7d881375703763e78fa121662db2e73d4ee0350ace02f464141ef756a7de8f113a8750714685393e2cd53711624b00b2776c7b6a2b049412adb1dcf632aebe63574ee029ddf121ea7ea35f9cdc1eba8e70708b5896e5a6e82ab224e3201297d4c78b513302669638f367a9bdb8388f938eb308a1f3a',
			'callback_uri' : 'https://connect2017watson.mybluemix.net/#/auth/ibm-connections-cloud/callback'
		});

		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/manage/oauth2/token',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/x-www-form-urlencoded'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = https.request(options, function(respuesta) {
			
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			
		  			var partido = body.split("&");

		  			console.log("BODY::::",body);

		  			req.oauthConnections = {
		                accessToken: partido[0].split("=")[1],
		                refreshToken: partido[1].split("=")[1],
		                params: {
		                	'issued_on': partido[2].split("=")[1],
		                	'expires_in': partido[3].split("=")[1],
		                	'token_type': partido[4].split("=")[1]
		                }
		            };
		            //
		            var token = jwt.sign(req.oauthConnections, 'IBMConnectionsCloud.01012016', {
		                expiresIn: '2h' // expires in 2 hours
		            });

			        res.status(200).json(token);
			        return;
		  		} else {
		  			console.log('status message', respuesta.statusMessage);
		  			res.status(respuesta.statusCode).send(body);
		  		}
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error getting the information, please try again."
	        });
		});

	}
}