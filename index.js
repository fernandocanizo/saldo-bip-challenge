// Creation Date: 2015.03.07
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";

var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var handlebars = require('express-handlebars');


var app = express();

////////////////////////////////////////////////////////////////////////////////
// configuration
////////////////////////////////////////////////////////////////////////////////

app.set('port', process.env.PORT || 60242);

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


////////////////////////////////////////////////////////////////////////////////
// routes
////////////////////////////////////////////////////////////////////////////////

// static assets
app.use(express.static(__dirname + '/public'));

app.get('(/|/saldo)', function (req, res) {
	// home page
	res.render('home');
});


app.get('/saldo/:cardId', function scrapSaldo (req, res, next) {
	var dataToSend = {};

	// invalid card number
	// Note: not sure about the exact rules for valid cars, but the POCAE form has a maxlenght="10"
	// and I've only seen numeric BIP card numbers so far.
	if(req.cardId.length > 10 || null === req.cardId.match(/^\d+$/)) {
		dataToSend.status = false;
		dataToSend.statusMessage = "Número de tarjeta inválido: '" + req.cardId + "'.";
		res.json(dataToSend);
		return;
	}


	var result = {};

	var requestOptions = {
		'url': 'http://pocae.tstgo.cl/PortalCAE-WAR-MODULE/SesionPortalServlet',
		'method': 'POST',
		'headers': {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
			'Referer': 'http://pocae.tstgo.cl/PortalCAE-WAR-MODULE/'
		},
		'form': {
			// content-type application/x-www-form-urlencoded
			// 'accion=6&NumDistribuidor=99&NomUsuario=usuInternet&NomHost=AFT&NomDominio=aft.cl&Trx=&RutUsuario=0&NumTarjeta=12950403&bloqueable='
			'accion': 6,
			'NumDistribuidor': 99,
			'NomUsuario': 'usuInternet',
			'NomHost': 'AFT',
			'NomDominio': 'aft.cl',
			'Trx': '',
			'RutUsuario': 0,
			'NumTarjeta': req.cardId,
			'bloqueable': ''
		}
	};


	request(requestOptions, function(error, httpResponse, body) {
		if(error) {
			throw error;
		}

		var $ = cheerio.load(body);
		var fields = $('tr td [class="verdanabold-ckc"]');
		// depending on the card number we can get 2, 4 or 6 fields, some are special cards
		// since I don't have the specification of all the possible results,
		// and I don't wanna go a reverse engineering process for this exercise,
		// I'll just target fields for normal cards:

		try {
			result.cardNumber = fields[1].children[0].data;
			result.credit = fields[5].children[0].data;
			result.date = fields[7].children[0].data;

		} catch(TypeError) {
			// Note: I'm marking as invalid cards that seem to exist and be special

			dataToSend.status = false;
			dataToSend.statusMessage = "Número de tarjeta inválido: '" + req.cardId + "'.";
			res.json(dataToSend);
			return;
		}

		dataToSend.status = true;
		dataToSend.statusMessage = "Tarjeta válida.";
		dataToSend.result = result;
		res.json(dataToSend);
	});
});


////////////////////////////////////////////////////////////////////////////////
// 404, 500 and other special pages
////////////////////////////////////////////////////////////////////////////////
app.use(function (req, res) {
	// custom 404 page
	res.status(404);
	res.send("404 - Page not found");
});

app.use(function (req, res) {
	// custom 500 page
	res.status(500);
	res.send("500 - Internal server error");
});


////////////////////////////////////////////////////////////////////////////////
// get query parameters
////////////////////////////////////////////////////////////////////////////////
app.param('cardId', function (req, res, next, id) {
	req.cardId = id;
	next();
});


app.listen(app.get('port'), function () {
	console.log("App started at http://localhost:" + app.get('port'));
});
