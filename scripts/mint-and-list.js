const { ethers } = require("hardhat");

async function mintAndList() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const basicNft = await ethers.getContract("BasicNFT");
  const PRICE = ethers.utils.parseEther("0.1");

  console.log("Minting....");

  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);

  const tokenId = mintTxReceipt.events[0].args.tokenId;

  console.log("Approving NFT.....");

  const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId);

  await approvalTx.wait(1);

  console.log("Listing nft...");

  const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE);

  await tx.wait(1);

  console.log("listed!");
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });