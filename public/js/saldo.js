// Creation Date: 2015.03.09
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";


function showSaldo(data) {
	console.log(data);

	if(data.status) {
		$('#statusMessage').text(data.statusMessage)
			.removeClass('text-danger')
			.addClass('text-success');

		$('#cardNumber').text(data.result.cardNumber);
		$('#credit').text(data.result.credit);
		$('#date').text(data.result.date);

	} else {
		$('#statusMessage').text(data.statusMessage)
			.removeClass('text-succes')
			.addClass('text-danger');

		$('#cardNumber').text('');
		$('#credit').text('');
		$('#date').text('');
	}

	// hide spinner
	$('#spinner').addClass('hidden');

	$('#result').removeClass('hidden');

	// restore UI
	$('#cardId').attr('disabled', false)
		.focus();
}


function showError(xmlHttpRequest, textStatus, message) {
	console.error("AJAX call error: " + textStatus + "\nMessage: " + message);

	if('timeout' === message) {
		$('#statusMessage').text("Tiempo de espera agotado para la consulta. Intente más tarde.")
			.removeClass('text-succes')
			.addClass('text-danger');

	} else { // other kind of error
		$('#statusMessage').text("Error al consultar su tarjeta.")
			.removeClass('text-succes')
			.addClass('text-danger');
	}

	// no results, so no data
	$('#cardNumber').text('');
	$('#credit').text('');
	$('#date').text('');

	// hide spinner
	$('#spinner').addClass('hidden');

	$('#result').removeClass('hidden');

	// restore UI
	$('#cardId').attr('disabled', false)
		.focus();

}


$(document).ready(function () {
	$('form').on('submit', function (e) {
		e.preventDefault();

		// disable UI while making AJAX call
		$('#cardId').attr('disabled', true);

		// activate spinner
		$('#spinner').removeClass('hidden');

		$.ajax({
			type: 'GET',
			url: '/saldo/' + $('#cardId').val(),
			dataType: "json",
			contentType: "application/json",
			data: "",
			timeout: 10000,
			success: showSaldo,
			error: showError
		});
	});
});
