require('babel-register')
module.exports = {
  networks: {
    ganache: {
      host: '10.10.12.189',
      port: 7545,
      network_id: '5777',
      gas: 4700000
    }
  },
  compilers: {
    solc: {
      version: "0.4.25",
    }
  }
}
