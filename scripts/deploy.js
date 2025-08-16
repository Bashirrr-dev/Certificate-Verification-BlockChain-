const hre = require("hardhat");

async function main() {
  const CertificateRegistry = await hre.ethers.getContractFactory(
    "CertificateRegistry"
  );
  const registry = await CertificateRegistry.deploy();

  await registry.waitForDeployment();

  console.log("CertificateRegistry deployed to:", registry.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
