# EJEMPLO VOTACIONES

### Descripción
Este ejemplo pretende demostrar la interacción de una dapp ejecutada con una blockchain real (ejecutada en modo localhost)
Se toma como base el siguiente post https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-2-30b3d335aa1f con algunas variantes y agregados. 

En el post se explica el desarrollo del ejemplo utilizando la red de testing de Ethereum, Rinkeby. Pero nosotros explicaremos la interación utilizando el generador de blockchain local ganache-cli

En este otro post tambíen se explica (con vídeo incluido) el mismo ejemplo. http://www.dappuniversity.com/articles/the-ultimate-ethereum-dapp-tutorial

### Requisitos previos
- ganache-cli // Install -> https://github.com/trufflesuite/ganache-cli
- Metamask
    
### Setup
- Los pasos explicados a continuación son tomados del post mencionado anteriormente. Agrego algunas consideraciones que no fueron explicadas en el post.

0. npm install -g truffle // Instalar el framework Truffle https://truffleframework.com/truffle
1. mkdir voting // Creo el proyecto
2. cd voting
3. npm install -g webpack // https://truffleframework.com/tutorials/bundling-with-webpack
4. sudo truffle unbox webpack // Inicio el proyecto truffle utlizando unbox webpack
5. sudo rm contracts/ConvertLib.sol // Elimino contratos de ejemplo
6. sudo rm contracts/MetaCoin.sol // Elimino contratos de ejemplo
7. sudo nano contracts/Voting.sol // Creo el contrato
8. Copio y pego el siguiente código https://gist.githubusercontent.com/maheshmurthy/3da385a42678c3e36a8328cbe47cae5b/raw/1acac22fe51f6ce64efa5aebe8ab038f0909d895/Voting.sol
9. sudo nano migrations/2_deploy_contracts.js
10. Reemplazo el código por el siguiente:
    var Voting = artifacts.require("./Voting.sol");
    module.exports = function(deployer) {
      deployer.deploy(Voting, ['0x11', '0x22', '0x33'], {gas: 6700000});
    };
Nota: La lista de candidatos contiene los nombres en formato byte32.
11. sudo nano truffle-config.js
12. Reemplazo el código por el siguiente:
    require('babel-register')
    module.exports = {
      networks: {
        ganache: {
          host: 'localhost',
          port: 8545, //Obtengo el puerto de la blockchain generada con ganache
          network_id: '1548851882729', //Obtengo el network_id de la blockchain generada con ganache
          gas: 4700000
        }
      },
      compilers: {
        solc: {
          version: "0.4.25", //Coloco la versión del pragma especificado en el contrato 
        }
      }
    }
13. sudo rm -R app/src
14. sudo mkdir app/javascripts
15. sudo mkdir app/stylesheets
16. sudo nano app/javascripts/app.js
17. Copio y pego el siguiente código https://gist.githubusercontent.com/maheshmurthy/eb639480fa838f4eed1c8a07fdd3efa9/raw/98e78b4dc7b117eac22ebe33b4572247826ad124/app.js
Nota: Reemplazar en la variable candidates, los nombres de los candidatos por los strings especificados en el punto 10
18. sudo nano app/stylesheets/app.css
19. Copio y pego el siguiente código https://raw.githubusercontent.com/maheshmurthy/ethereum_voting_dapp/master/chapter2/app/stylesheets/app.css
20. sudo nano app/index.html
21. Copio y pego el siguiente código https://gist.githubusercontent.com/maheshmurthy/dbde98f36eee345c6cb23bb375e7e3cf/raw/647ac74acd2b1a401add412fb1dab56f7a717c00/index.html
22. sudo nano package.json
23. Copio y pego el siguiente código
    {
      "name": "truffle-init-webpack",
      "version": "0.0.1",
      "description": "Frontend example using truffle v3",
      "scripts": {
        "lint": "eslint ./",
        "build": "webpack",
        "dev": "webpack-dev-server"
      },
      "author": "Douglas von Kohorn",
      "license": "MIT",
      "devDependencies": {
        "babel-cli": "^6.22.2",
        "babel-core": "^6.22.1",
        "babel-eslint": "^6.1.2",
        "babel-loader": "^6.2.10",
        "babel-plugin-transform-runtime": "^6.22.0",
        "babel-preset-env": "^1.1.8",
        "babel-preset-es2015": "^6.22.0",
        "babel-register": "^6.22.0",
        "copy-webpack-plugin": "^4.0.1",
        "css-loader": "^0.26.1",
        "eslint": "^3.14.0",
        "eslint-config-standard": "^6.0.0",
        "eslint-plugin-babel": "^4.0.0",
        "eslint-plugin-mocha": "^4.8.0",
        "eslint-plugin-promise": "^3.0.0",
        "eslint-plugin-standard": "^2.0.0",
        "html-webpack-plugin": "^2.28.0",
        "json-loader": "^0.5.4",
        "style-loader": "^0.13.1",
        "truffle-contract": "^1.1.6",
        "web3": "^0.18.2",
        "webpack": "^2.2.1",
        "webpack-dev-server": "^2.3.0"
      }
    }
24. sudo nano webpack.config.js
25. Copio y pego el siguiente código
    const path = require('path');
    const CopyWebpackPlugin = require('copy-webpack-plugin');

    module.exports = {
      entry: './app/javascripts/app.js',
      output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js'
      },
      plugins: [
        // Copy our app's index.html to the build folder.
        new CopyWebpackPlugin([
          { from: './app/index.html', to: "index.html" }
        ])
      ],
      module: {
        rules: [
          {
           test: /\.css$/,
           use: [ 'style-loader', 'css-loader' ]
          }
        ],
        loaders: [
          { test: /\.json$/, use: 'json-loader' },
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015'],
              plugins: ['transform-runtime']
            }
          }
        ]
      }
    }
26. sudo npm install // Instalo todas las dependencias necesarias para el frontend. Si hay errores al instalar probar con sudo npm install

27. ganache-cli //Ejecuto la blockchain local. No cerrar la ventana
28. Abro una nueva terminal y me dirijo a la raiz del proyecto. 

Nota: En este punto es recomendable dar permisos 777 al proyecto y además al directorio /usr/local/lib/node_modules/

29. truffle compile --network [nombre de la red especificada en el paso 12]. //Para este ejemplo el nombre es ganache. Compilo el contrato
30. truffle migrate --network ganache // Migro el contrato desde Truffle a la blockchain local

Nota: Si figura un error The network id specified in the truffle config (1548851882729) does not match the one returned by the network (1548863961875), se debe reemplazar en el archivo truffle-config.js el network_id por el último de la oración. Luego probar nuevamente el comando.

En este punto se deben haber procesado dos transacciones, una del contrato Migrations.sol y otra del contrato Voting.sol

31. truffle console --network ganache //Interactúo con la blockchain
32. truffle(ganache)> Voting.deployed().then(function(contractInstance) {contractInstance.voteForCandidate('0x11').then(function(v) {console.log(v)})})
33. truffle(ganache)> Voting.deployed().then(function(contractInstance) {contractInstance.totalVotesFor.call('0x11').then(function(v) {console.log(v)})})

Nota: Si hasta acá no hubo ningún error, podemos continuar para el frontend.

34. Abrir un navegador
35. Abrir Metamask
36. Importar cuenta
37. Obtener alguna clave privada de la consola que está ejecutando ganache-cli y pegarla en el input del metamask.
38. Configurar una red RPC Personalizado con la URL que está ejecutando ganache-cli. Por lo general es HTTP://127.0.0.1:8545
39. npm run dev
40. F5 
Nota: Si al ejecutar F5 vemos la cantidad de votos en 0 es por que la dapp está funcionando bien.
41. Votar por, ejemplo, 0x11. Se deberá abrir metamask para confirmar la transacción.