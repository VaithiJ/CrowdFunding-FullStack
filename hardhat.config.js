require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");

RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;
ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
COINBASE_MARKETCAP_KEY = process.env.COINBASE_MARKETCAP_KEY;
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.4" }, { version: "0.6.9" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gasreporter.txt",
    noColors: true,
    currency: "USD",
    token: "ETHER",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
};
