const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Nft Marketplace Test", function () {
      let nftMarketPlace, basicNft, deployer, player;

      const PRICE = ethers.utils.parseEther("0.1");
      const TOKEN_ID = 0;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;

        // player = await getNamedAccounts().player;
        const accounts = await ethers.getSigners();

        player = accounts[1];

        await deployments.fixture(["all"]);

        nftMarketPlace = await ethers.getContract("NftMarketplace");
        basicNft = await ethers.getContract("BasicNFT");
        await basicNft.mintNft();
        await basicNft.approve(nftMarketPlace.address, TOKEN_ID);
      });

      it("lists and can be bought", async function () {
        await nftMarketPlace.listItem(basicNft.address, TOKEN_ID, PRICE);

        const playerConnectedNftMarketPlace = nftMarketPlace.connect(player);

        await playerConnectedNftMarketPlace.buyItem(
          basicNft.address,
          TOKEN_ID,
          { value: PRICE }
        );

        const newOwner = await basicNft.ownerOf(TOKEN_ID);

        const deployerProceeds = await nftMarketPlace.getProceeds(deployer);

        assert(newOwner.toString() == player.address);
        assert(deployerProceeds.toString() == PRICE.toString());
      });
    });
