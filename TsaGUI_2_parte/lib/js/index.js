//CONFIGURACIONES PARA CONECTAR AL SMART CONTRACT
var abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "ots",
                "type": "string"
            },
            {
                "name": "file_hash",
                "type": "string"
            }
        ],
        "name": "stamp",
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
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "hash",
                "type": "string"
            },
            {
                "indexed": true,
                "name": "ots",
                "type": "string"
            }
        ],
        "name": "Stamped",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            }
        ],
        "name": "Deploy",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            }
        ],
        "name": "SelfDestroy",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "ots",
                "type": "string"
            }
        ],
        "name": "getBlockNumber",
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
                "name": "ots",
                "type": "string"
            }
        ],
        "name": "getHash",
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
        "inputs": [
            {
                "name": "ots",
                "type": "string"
            },
            {
                "name": "file_hash",
                "type": "string"
            }
        ],
        "name": "verify",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
var addressContrato = "0xe620088245716b67247d1e637ca1cd8bb797d88a";
var contrato = web3.eth.contract(abi);
var funciones = contrato.at(addressContrato);

// VARIABLES DEL PROYECTO
var tsa_api = 'https://tsaapi.bfa.ar/api/tsa/';
var loader_gif = 'lib/images/loader.svg';
var ots_api = '';
var deadline_date = new Date('2018-09-03 00:00:00');
var current_date = new Date();
var whash = window.location.hash;
var currentTab = whash.substring(5, 6);

// FUNCIONES DEL ONLOAD
$(function () {
    // CONECTO CON EL SMARTCONTRACT
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));
    }

    // INICIALIZO LAS PESTAÑAS
    whash && $('ul.nav a[href="' + whash + '"]').tab('show');
    $('.nav-tabs a').click(function (e) {
        $(this).tab('show');
        var scrollmem = $('body').scrollTop() || $('html').scrollTop();
        whash = this.hash;
        currentTab = whash.substring(5, 6);
        window.location.hash = whash;
        $('html,body').scrollTop(scrollmem);
    });

    //DETECTO QUE ARCHIVO ESTÁ SUBIENDO
    for (let i = 1; i < 4; i++) {
        $('#selectOriginal_' + i+', #selectOriginalArea_' + i).on('click', function () {
            $('#fileUploadOriginal_' + i).click();
            return false;
        });
        if (i == 1) {
            $('#fileUploadOriginal_' + i).change(
                function () {
                    var file = $(this).prop('files')[0];
                    hash_file(file);
                }
            );
        } else {
            $('#fileUploadOriginal_' + i).change(
                function () {
                    var file = $(this).prop('files')[0];
                    original_file_check(file);
                }
            );
            $('#selectRecibo_' + i+', #selectReciboArea_' + i).on('click', function () {
                $('#fileUploadRecibo_' + i).click();
                return false;
            });
            $('#fileUploadRecibo_' + i).change(
                function () {
                    var file = $(this).prop('files')[0];
                    ots_check(file);
                }
            );
        }
    }

});

// FUNCIONES
function allowDrop(e) {
    e.preventDefault();
}

function dropStamp(e) {
    e.preventDefault();
    var file = e.dataTransfer.items[0].getAsFile();
    hash_file(file);
}

function hash_file(_file) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(_file, "UTF-8");

    reader.onload = function (evt) {
        var file_contents = evt.target.result;

        var hash = sha256.create();
        hash.update(file_contents);
        var file_hash = hash.hex();        

        $('#originalInfo_1').html('<p>Nombre del archivo: <b>' + _file.name + '</b></p><p>Hash del archivo: <b><span class="hash">' + file_hash + '</span></b></p>');
        $('#selectOriginal_1').html('Seleccioná otro archivo <span class="sr-only">para marcar</span>');
        
        // Obtengo el ots temporal
        var ots = get_ots(file_hash);
        $('#ots_temporal').html('<p>OTS Temporal: <b>' + ots + '</b></p>');
        
        // Llamo para realizar el sellado del archivo
        stamp(file_hash, ots, _file.name);
    }
}

// GENERA UN HASH TEMPORAL CON EL HASH DEL ARCHIVO MÁS LA FECHA ACTUAL
function get_ots(_file_hash){
    var hash = sha256.create();
    hash.update(_file_hash + current_date);    
    return hash.hex();
}

function get_ots_final(_ots) {
    // Mejorar esta función. Se debe realizar similar a la que está implementada en la TSA API.
    return _ots;
}


/**
Se encarga de comunicarse con el Smart Contract para poder firmar el contrato
*/
function stamp(_file_hash, _ots, _file_name){
    console.log("Ots_Hash: " + _ots);
    console.log("File_Hash: " + _file_hash);

    try{
        funciones.stamp(_ots, _file_hash, function(error, respuesta){

            if(error){
                throw error;
            } else {
                
                console.log(respuesta);    

                var ots = ' {"file_hash": "' + _file_hash + '", "rd": "' + _ots + '"}';
                
                
                var saveData = (function () {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    return function (data, fileName) {
                        var json = JSON.stringify(data),
                            blob = new Blob([json], {
                                type: "octet/stream"
                            }),
                            url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    };
                }());

                var data = _ots;
                
                
                fileName = _file_name + ".rd.temp";

                saveData(data, fileName); // permite guardar el archivo mediante un cuadro de diálogo
            
            }

        });
    } catch(err) {
        
        Swal.fire(
          'Atención !',
          'Debe iniciar sesion en Metamask para aprobar la transaccion enviada al SmartContract.',
          'error'
        )
    }
   
}


function verify_bfa(_ots, _file_hash) {
    _ots = _ots.replace("\"", '');
    _ots = _ots.replace("\"", '');

    console.log("verify_bfa");
    console.log("_ots: " + _ots);
    console.log("_file_hash: " + file_hash);
    var pending = false;
    var message = '';

    $('#response_' + currentTab).removeClass();

    
    funciones.verify(_ots, _file_hash, function(error, respuesta){
         if(error){
            throw error;
        } else {    

            if (respuesta == true) {
                icon = 'glyphicon-ok';
                st = 'alert alert-success';
                response_messages = "El archivo original y su comprobante temporal son válidos y existen en la blockchain !";
            } else {
                icon = 'glyphicon-remove';
                st = 'alert alert-danger';
                response_messages = "No coincide el archivo original y su comprobante original.";
            }

            message = '<span class="glyphicon ' + icon + '" aria-hidden="true"></span> ' + response_messages;


            $('#response_' + currentTab).addClass(st);
            $('#response_' + currentTab).html(message);

            if (respuesta == true) {
                var saveData = (function () {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    return function (data, fileName) {
                        var json = JSON.stringify(data),
                            blob = new Blob([json], {
                                type: "octet/stream"
                            }),
                            url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    };
                }());

                var data = get_ots_final(_ots);
                fileName = $('#hidden_original_file_name_' + currentTab).val() + ".rd";

                if (currentTab == '2') {
                    ms = 'Seleccioná otro archivo <span class="sr-only">.rd.temp</span>';
                } else if (currentTab == '3') {
                    ms = 'Seleccioná otro archivo <span class="sr-only">.rd</span>';
                }

                $('#selectRecibo_' + currentTab).html(ms);
                $('#reciboInstructions_' + currentTab).hide();

                if ($('#reciboInfo_' + currentTab).html().includes('.temp')) {
                    saveData(data, fileName);
                }

            }
        
        }
    });
    
}


function dropOriginalFile(e) {
    e.preventDefault();
    var file = e.dataTransfer.items[0].getAsFile();
    original_file_check(file);
}


function original_file_check(file) {
    $('#response_' + currentTab).html('');
    $('#response_' + currentTab).removeClass();
    $('#reciboInfo_' + currentTab).html('');
    $('#reciboInstructions_' + currentTab).show();
    var reader = new FileReader();
    reader.readAsArrayBuffer(file, "UTF-8")
    reader.onload = function (evt) {
        var file_contents = evt.target.result;

        var hash = sha256.create();
        hash.update(file_contents);
        file_hash = hash.hex();

        $('#hidden_original_file_hash_' + currentTab).val(file_hash);
        $('#hidden_original_file_name_' + currentTab).val(file.name);

        $('#originalInfo_' + currentTab).html('<p>Nombre del archivo: <b>' + file.name + '</b></p><p>Hash del archivo: <b><span class="hash">' + file_hash + '</span></b></p>');
        $('#selectOriginal_' + currentTab).html('Seleccioná otro archivo <span class="sr-only">original</span>');
    };
}

function dropOTSFile(e) {
    e.preventDefault();
    var file = e.dataTransfer.items[0].getAsFile();
    ots_check(file);
}

function ots_check(file) {
    $('#response_' + currentTab).html('');
    $('#response_' + currentTab).removeClass();
    var file_contents = '';
    var file_hash = $('#hidden_original_file_hash_' + currentTab).val();
    if (file_hash == '') {
        $('#response_' + currentTab).html('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Debe ingresar el archivo original');
        $('#response_' + currentTab).addClass('alert alert-danger');
        return;
    }
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8")
    reader.onload = function (evt) {
        file_contents = evt.target.result;
        $('#reciboInstructions_' + currentTab).hide();
        $('#reciboInfo_' + currentTab).html(file.name);       

        verify_bfa(file_contents, file_hash);
    };
}