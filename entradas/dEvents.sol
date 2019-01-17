pragma solidity ^0.4.18;

/*
Autor: Javier Guajardo J.
Twitter: @EthereumChile
Website: https://ethereumchile.cl
*/

contract dEvents {
    
  // VARIABLES

  address public creadorEvento; // msg.sender u otro
  uint public valorEntradas = 100 wei; // 
  uint public numeroEntradas = 9999; // 9999 entradas disponibles.
  uint public contadorEntradas = 1; // El ID de la primera entrada será el 1
  string public nombreEvento = "Los Redondos"; // nombre del evento
  bool estadoVenta = true; // El contrato se inicia vendiendo entradas

  struct Entrada { // La estructura de cada entrada
    address addressComprador; // cuenta ethereum del comprador
    string dni; // dni comprador
    uint entradasCompradas; // cuantas entradas compró
  }

  mapping(uint => Entrada) public entradas;

  //MODIFICADORES
  
  modifier soloCreador {
    require(msg.sender == creadorEvento);
    _;
  }
  
  
  // CONSTRUCTOR
  function dEvents () public {
  creadorEvento = msg.sender; // el creador del evento es quién publica el contrato. 
  }
  
  // FUNCIONES

  function comprarEntrada(uint numeroEntradasComprar, string dni) public payable {
  require(msg.value == (numeroEntradasComprar * valorEntradas) && numeroEntradas != 0 && numeroEntradas >= numeroEntradasComprar && numeroEntradasComprar != 0 &&  estadoVenta);
  entradas[contadorEntradas].addressComprador = msg.sender; // address;
  entradas[contadorEntradas].entradasCompradas = numeroEntradasComprar; // uint;
  entradas[contadorEntradas].dni = dni; // bytes32;
  numeroEntradas = numeroEntradas - numeroEntradasComprar;
  contadorEntradas++;
  if(numeroEntradas == numeroEntradasComprar)
    estadoVenta = false;    
  }

  function verEntrada(uint id) public constant returns (string, uint) {
  return (entradas[id].dni, entradas[id].entradasCompradas);
  }

  function cambiarEstado() public soloCreador {
  estadoVenta = !estadoVenta;
  }

  function retirarETH(uint monto) public soloCreador {
  creadorEvento.transfer(monto);
  }

}