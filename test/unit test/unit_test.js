const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", function () {
  let fundMe;
  let deployer;
  let mockV3Aggregator;
  values = ethers.utils.parseEther("1");
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", function () {
    it("sets Aggregator address ", async function () {
      const response = await fundMe.Pricefeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });
  describe("funds", function () {
    it("fails if amount is lesser", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });
    it("updates the funder amount", async function () {
      await fundMe.fund({ value: values });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), values.toString());
    });
    it("adds funders to array", async function () {
      await fundMe.fund({ value: values });
      const funders = await fundMe.funders(0);
      assert.equal(funders, deployer);
    });
  });
  describe("withdraw", function () {
    beforeEach(async function () {
      await fundMe.fund({ value: values });
    });
    it("withdraws all eth", async function () {
      const startingfundingbalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingdeployerbalance = await fundMe.provider.getBalance(
        deployer
      );
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait();
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingfundingbalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingdeployerbalance = await fundMe.provider.getBalance(deployer);

      assert.equal(endingfundingbalance, 0);
      assert.equal(
        startingfundingbalance.add(startingdeployerbalance).toString(),
        endingdeployerbalance.add(gasCost).toString()
      );
    });
    it("lets withdraw eth of multiple funders", async function () {
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[1]);
        await fundMeConnectedContract.fund({ value: values });
      }
      const startingfundingbalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingdeployerbalance = await fundMe.provider.getBalance(
        deployer
      );
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait();
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingfundingbalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingdeployerbalance = await fundMe.provider.getBalance(deployer);

      assert.equal(endingfundingbalance, 0);
      assert.equal(
        startingfundingbalance.add(startingdeployerbalance).toString(),
        endingdeployerbalance.add(gasCost).toString()
      );
      await expect(fundMe.funders(0)).to.be.reverted;
      for (i = 0; i < 6; i++) {
        assert.equal(
          await fundMe.addressToAmountFunded[(accounts[i].address, 0)]
        );
      }
    });
    it("only owner can withdraw", async function () {
      const accounts = await ethers.getSigners();
      const attacker = await accounts[1];
      const attackerConnectedContract = await fundMe.connect(attacker);

      await expect(attackerConnectedContract.withdraw()).to.be.reverted;
    });
  });
});
