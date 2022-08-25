const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait(1);
  console.log("recieved the fund");
}

main();
