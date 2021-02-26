async function main() {
  const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory")
  const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair")
  const SushiToken = await ethers.getContractFactory("SushiToken")
  const MasterChef = await ethers.getContractFactory("MasterChef")
  const Migrator = await ethers.getContractFactory("Migrator")

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const factory1 = await UniswapV2Factory.deploy(deployer.address)
  await factory1.deployed()

  const factory2 = await UniswapV2Factory.deploy(deployer.address)
  await factory2.deployed();

  const sushi = await SushiToken.deploy()
  await sushi.deployed()

  const Pair1 = await factory1.createPair('0xe9e7cea3dedca5984780bafc599bd69add087d56', sushi.address)
  const pair1 = await UniswapV2Pair.attach((await Pair1.wait()).events[0].args.pair)

  const Pair2 = await factory1.createPair('0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x23396cf899ca06c4472205fc903bdb4de249d6fc')
  const pair2 = await UniswapV2Pair.attach((await Pair2.wait()).events[0].args.pair)

  const chef = await MasterChef.deploy(sushi.address, deployer.address, "1000", "0", "100000")
  await chef.deployed()

  const migrator = await Migrator.deploy(chef.address, factory1.address, factory2.address, "0")
  await migrator.deployed()

  await sushi.transferOwnership(chef.address)


  console.log("factory1 address:", factory1.address);
  console.log("factory2 address:", factory2.address);
  console.log("sushi address:", sushi.address);
  console.log("chef address:", chef.address);
  console.log("migrator address:", migrator.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });