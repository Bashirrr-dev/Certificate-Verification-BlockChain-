import { ethers } from "ethers";

// Replace with your deployed contract address
const contractAddress = "0xYourContractAddressHere";

// Replace with your contract's ABI JSON (from compilation artifacts)
const contractABI = [
  // ... your ABI here ...
];

export async function getContract() {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}
