# TsaGUI + Ganache-CLI

### Descripción
TsaGUI es una interfaz gráfica que permite interactuar con un smart contract (incluido en la carpeta lib/ProofOfExistence.sol) deployado sobre el entorno de testing Ganache-CLI.
Este ejemplo propone simular una blockchain ejecutada con Ganache-CLI. Para la compilación y deploy del contrato se utliza node.
Para la interacción del contrato se utiliza el front-end contra Ganache-CLI.
    
### Utilización
- Stamp
    - En la pantalla principal hay un textarea que permite arrastrar un archivo, el cual es convertido a un hash sha256 y luego enviado al smart contract
    - Respuesta:
        -  Debajo del textarea para arrastrar el archivo, aparecerá un recuadro que mostrará un texto con los datos del hash y el recibo temporal digital enviado por el smart contract
        
    - Ejemplo de la respuesta:
		Nombre del archivo: Comprobante_Baja_Producto60686242.pdf

		Hash del archivo: 65193341f21aec7ef11cc79b712fa4187c56e1ff4df37d7ae50eb7c726800f38

		OTS Temporal: debc965bbf365e00f69c05295737efd91a5caade4e7838cbdbb4031a789819ed
- Verify
    - Debajo del recuadro del stamp, hay un textarea que permite verificar el archivo previamente impactado en el smart contact, indicando el texto devuelo en el stamp y luego haciendo click en el botón "Verify"
    - Ejemplo de la respuesta:
        -   El archivo original y su comprobante temporal son válidos y existen en la blockchain !
    
### Inicialización
- Tomar como guía el siguiente post https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-1-40d2d0d807c2
- Acceder a la terminal y ejecutar $ ganache-cli (No cerrar esta terminal)


- Abrir otra terminal, dirigirse al directorio de tu proyecto EJ: $ cd /var/www/html/tu_proyecto/.
- Ejecutar $ node

- Nota: Previamente debe tener instalada las librerias node de forma local. Debe coinicidir el compilador solc con el que utilizaste para construir el SmartContract
- > Web3 = require('web3'); //Requiere tener instalado la librería web3
- > web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
- > code = fs.readFileSync('lib/ProofOfExistence.sol').toString()
- > solc = require('solc') //Requiere la librería solc
- > compiledCode = solc.compile(code)
- > abiDefinition = JSON.parse(compiledCode.contracts[':Stamper'].interface) // :Stamper se debe reemplazar por el nombre de la clase especificada en el smartContract
- > StamperContract = web3.eth.contract(abiDefinition)
- > byteCode = compiledCode.contracts[':Stamper'].bytecode
- > deployedContract = StamperContract.new({data: byteCode, from: web3.eth.accounts[0], gas: 4700000})
- > deployedContract.address
- > contract = StamperContract.at(deployedContract.address)

- Para probar si funciona bien, podemos ejecutar las siguientes líneas inmediatamente luego de deployar el contrato.
- > contract.stamp('renzo','renzo',{from: web3.eth.accounts[0]}); //Debe retornar un hash de la transacción realizada
- > contract.verify('renzo','renzo',{from: web3.eth.accounts[0]}); //Debe retornar un true

