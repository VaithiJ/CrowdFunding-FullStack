const networkConfig = {
  4: {
    name: "rinkeby",
    ethPricefeed: "0x8a753747a1fa494ec906ce90e9f37563a8af630e",
  },
  42: {
    name: "kovan",
    ethPricefeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
  },
};

const decimals = 8;
const initial_answer = 200000000000;

(developmentChains = ["hardhat", "localhost"]),
  (module.exports = {
    networkConfig,
    developmentChains,
    decimals,
    initial_answer,
  });
