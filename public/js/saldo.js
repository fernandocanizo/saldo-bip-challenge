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

	$('#result').removeClass('hidden');
}


$(document).ready(function () {
	$('form').on('submit', function (e) {
		e.preventDefault();

		$.ajax({
			type: 'GET',
			url: '/saldo/' + $('#cardId').val(),
			dataType: "json",
			contentType: "application/json",
			data: "",
			timeout: 3000,
			success: showSaldo
		});
	});
});