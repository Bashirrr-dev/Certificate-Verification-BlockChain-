require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache default RPC
      accounts: [
        "1d2ced980bc5d36b9230f438e6b99d7f6e68c3cf709f06aec093860ed90efae0",
      ],
    },
  },
};
