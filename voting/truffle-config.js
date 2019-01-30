require('babel-register')
module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: '1548867860602',
      gas: 4700000
    }
  },
  compilers: {
    solc: {
      version: "0.4.25",
    }
  }
}
