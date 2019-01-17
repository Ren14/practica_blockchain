var abi = [
	{
		"constant": false,
		"inputs": [],
		"name": "cambiarEstado",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "numeroEntradasComprar",
				"type": "uint256"
			},
			{
				"name": "dni",
				"type": "string"
			}
		],
		"name": "comprarEntrada",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "monto",
				"type": "uint256"
			}
		],
		"name": "retirarETH",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "contadorEntradas",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "creadorEvento",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "entradas",
		"outputs": [
			{
				"name": "addressComprador",
				"type": "address"
			},
			{
				"name": "dni",
				"type": "string"
			},
			{
				"name": "entradasCompradas",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "nombreEvento",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numeroEntradas",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "valorEntradas",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "verEntrada",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

var addressContrato = "0x4accb00f8d1e182e4ebd31169a5706ed32f905ae";
var contrato = web3.eth.contract(abi);
var funcionesContrato = contrato.at(addressContrato);

$(document).ready(function(){
	if (typeof web3 !== 'undefined') {
		web3 = new Web3(web3.currentProvider);
	} else {
		web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));
	}

	getNumeroEntradas();
	getNombreEvento();
	getCreadorEvento();
	getValorEntradas();
});

function verEntrada() {
	let id_entrada = $('#id_entrada').val();
	funcionesContrato.entradas(id_entrada, function(error, respuesta){
		if(error) throw error; // NO firmó la transacción en Metamask
		var rutEntrada = respuesta[1]; // recibimos hex y lo pasamos a ascii
		//rutEntrada = rutEntrada.match(/[0-9\.\-k]+/)[0] // eliminamos caracteres innecesarios
		var numeroEntradas = respuesta[2].c[0]; // obtenemos el n° de entradas
		$('#info_entrada').html('<div class="alert alert-primary" role="alert">DNI <strong>'+rutEntrada+'</strong> - Entradas <strong>'+numeroEntradas+'</strong></div>');
	});
}

function comprarEntrada() {		
	let cantidad = $('#cantidad_entradas').val();
	let dni = $('#dni').val();
	let wei = $('#wei').val();
	let wei_esperado = cantidad * 100;

	if(wei_esperado > wei){
		alert('Ingrese más WEI');
		return false;
	} else {
		console.log(wei_esperado);
	}

	
	funcionesContrato.comprarEntrada(cantidad, dni, {value: wei}, (err, res) => {
		if(err) throw err; // NO firmó la transacción en Metamask
		alert("Entrada comprada"); // "respuesta" == txhash de la transacción
	});
}

function consultarInformacionEntrada(codigoEntrada) {	
	funcionesContrato.verEntrada(codigoEntrada, function(error, respuesta){
		if(error) throw error; // NO firmó la transacción en Metamask
		var rutEntrada = web3.toAscii(respuesta[0]); // recibimos hex y lo pasamos a ascii
		rutEntrada = rutEntrada.match(/[0-9\.\-k]+/)[0] // eliminamos caracteres innecesarios
		var numeroEntradas = respuesta[1].c[0]; // obtenemos el n° de entradas
		console.log("DNI:" + rutEntrada + " N° entradas:" + numeroEntradas);
	});
}

function getValorEntradas() {
	funcionesContrato.valorEntradas(function (error, respuesta) {
		if(error) throw error;
		var valor_entradas = respuesta.c[0];
		$('#valor_entradas').html(valor_entradas + ' WEI');
	})
}

function getCreadorEvento() {
	funcionesContrato.creadorEvento(function (error, respuesta) {
		if(error) throw error;
		$('#creador_evento').html(respuesta);
	})
}

function getNombreEvento() {
	funcionesContrato.nombreEvento(function(error, respuesta){
		if(error) throw error;
		$('#nombre_evento').html(respuesta);
	});
}


function getNumeroEntradas() {	
	funcionesContrato.numeroEntradas(function(error, respuesta){
		if(error) throw error;
		var entradasDisponibles = respuesta.c[0];
		$('#entradas_disponibles').html(entradasDisponibles);
	});
}