var https = require('https')
	, removeMd = require('remove-markdown')
	, watson = require('watson-developer-cloud')
	;

module.exports = {
	personalidad: function (req, res) {

		var textoPlano = removeMd(req.body.texto);

		var personality_insights = watson.personality_insights({
			username: '23ef5c9c-12a4-4e08-8b7d-3ed335f3ac2b',
			password: 'CquqdrherTNq',
			version: 'v2'
		});


		personality_insights.profile({
  			text: textoPlano,
  			language: 'es' },
  			function (err, response) {
			    if (err)
			      console.log('error calling Watson Personality Service:', err);
			    else {
			      console.log("Watson Service Result:::", JSON.stringify(response, null, 2));
			      res.status(200).json(JSON.stringify(response, null, 2));
			    }
			}
		);
	}
}