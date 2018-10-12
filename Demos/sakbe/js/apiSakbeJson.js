function ApiSakbeJson(valor) {
	if (valor.length > 3) {
		var urlApiBusqueda = "http://gaia.inegi.org.mx/sakbe/wservice?make=SD&buscar=#buscar&key=#token&type=json";
		var token = 'rZMkTZuI-ugbU-t1Y5-zCHg-0ZOETYT3r0HG';
		var urlApiBusquedaTmp = urlApiBusqueda.replace('#buscar', valor);
		urlApiBusquedaTmp = urlApiBusquedaTmp.replace('#token', token);
		$.getJSON(urlApiBusquedaTmp, function (json) {
			var codHtml = '<table>';
			for (var i = 0; i < json.length; i++) {
				codHtml += '<tr><td style="width:60px">' + json[i].id_dest + '</td><td>' + json[i].nombre + '</td><tr>';
			}
			document.getElementById("lista").innerHTML = codHtml;
		});
	}
}