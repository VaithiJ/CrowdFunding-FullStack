const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Processinggggg......");
  const transactionResponse = await fundMe.fund({
    value: ethers.utils.parseEther("1"),
  });
  const transactionReceipt = await transactionResponse.wait(1);

  console.log("Funded");
}
main();
