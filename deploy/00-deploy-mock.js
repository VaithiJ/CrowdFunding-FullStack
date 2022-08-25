const { network } = require("hardhat");
const {
  developmentChains,
  decimals,
  initial_answer,
} = require("../helper-hardhat-config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
    log("local network detected");
    log("deploying mocks");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [decimals, initial_answer],
    });
    log("Mocks deployed");
    log(
      "---------------------------------------------------------------------"
    );
  }
};
module.exports.tags = ["all", "mocks"];
