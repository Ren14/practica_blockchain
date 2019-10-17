module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
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
