// Creation Date: 2015.03.07
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";

var request = require('request');
var cheerio = require('cheerio');

var requestOptions = {
	'url': 'http://pocae.tstgo.cl/PortalCAE-WAR-MODULE/SesionPortalServlet',
	'method': 'POST',
    'headers': {
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
		'Referer': 'http://pocae.tstgo.cl/PortalCAE-WAR-MODULE/'
	},
	'form': {
		// 'accion=6&NumDistribuidor=99&NomUsuario=usuInternet&NomHost=AFT&NomDominio=aft.cl&Trx=&RutUsuario=0&NumTarjeta=12950403&bloqueable='
		'accion': 6,
		'NumDistribuidor': 99,
		'NomUsuario': 'usuInternet',
		'NomHost': 'AFT',
		'NomDominio': 'aft.cl',
		'Trx': '',
		'RutUsuario': 0,
		'NumTarjeta': 12950403,
		'bloqueable': ''
	}
};


request(requestOptions, function(error, httpResponse, body) {
	if(error) {
		throw error;
	}

	var $ = cheerio.load(body);
	var fields = $('tr td [class="verdanabold-ckc"]');
	console.log(fields[1].children[0].data);
	console.log(fields[5].children[0].data);
	console.log(fields[7].children[0].data);
});
