import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { abi } from "./abi";
import { contractAddress } from "./config";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [issueCertId, setIssueCertId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [verifyCertId, setVerifyCertId] = useState("");
  const [verifiedCert, setVerifiedCert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState("");

  // Replace with your actual Pinata API keys
  const PINATA_API_KEY = "ea0623f146559780f74e";
  const PINATA_SECRET_KEY =
    "4859a5a2455cf437920270bb9a1097c70be0cf3c3a1cf13cdd7ad3e260b55c9f";

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet");
    }
  };

  const uploadToIPFS = async () => {
    try {
      const certData = {
        certId: issueCertId,
        studentName,
        course,
        issuedOn: new Date().toISOString(),
      };

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          pinataContent: certData,
          pinataMetadata: {
            name: `certificate-${issueCertId}.json`,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
        }
      );

      const hash = response.data.IpfsHash;
      setIpfsHash(hash);
      return hash;
    } catch (error) {
      console.error(
        "Pinata upload error:",
        error.response?.data || error.message
      );
      alert(
        `Failed to upload to IPFS: ${
          error.response?.data?.error?.details || error.message
        }`
      );
      return null;
    }
  };

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  };

  const issueCertificate = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!issueCertId || !studentName || !course) {
      alert("Please fill all fields before issuing certificate.");
      return;
    }

    try {
      setLoading(true);
      const ipfsHash = await uploadToIPFS();

      if (!ipfsHash) {
        setLoading(false);
        return;
      }

      const contract = await getContract();
      const tx = await contract.issueCertificate(
        issueCertId,
        studentName,
        course,
        ipfsHash
      );
      await tx.wait();

      alert(`Certificate issued successfully!\nIPFS Hash: ${ipfsHash}`);

      // Reset form
      setIssueCertId("");
      setStudentName("");
      setCourse("");
    } catch (err) {
      console.error("Error in issueCertificate:", err);
      alert(`Error issuing certificate: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyCertificate = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!verifyCertId) {
      alert("Please enter Certificate ID to verify.");
      return;
    }

    try {
      setLoading(true);
      const contract = await getContract();
      const cert = await contract.verifyCertificate(verifyCertId);

      if (!cert || !cert.studentName) {
        alert("Certificate not found.");
        setVerifiedCert(null);
        return;
      }

      setVerifiedCert(cert);
    } catch (err) {
      console.error(err);
      alert("Certificate not found or error fetching certificate.");
      setVerifiedCert(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Blockchain Certificate System</h1>
        <p className="subtitle">
          Issue and verify certificates on the blockchain
        </p>
      </div>

      {!account ? (
        <button className="btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="connected-account">
          Connected Account: <strong>{account}</strong>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">
          <span>📝</span> Issue Certificate
        </h2>
        <div className="input-group">
          <label>Certificate ID</label>
          <input
            type="text"
            placeholder="Enter unique certificate ID"
            value={issueCertId}
            onChange={(e) => setIssueCertId(e.target.value.trim())}
          />
        </div>
        <div className="input-group">
          <label>Student Name</label>
          <input
            type="text"
            placeholder="Enter student name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value.trim())}
          />
        </div>
        <div className="input-group">
          <label>Course</label>
          <input
            type="text"
            placeholder="Enter course name"
            value={course}
            onChange={(e) => setCourse(e.target.value.trim())}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={issueCertificate}
          disabled={loading || !account}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span> Processing...
            </>
          ) : (
            "Issue Certificate"
          )}
        </button>

        {ipfsHash && (
          <div className="cert-details">
            <p>Certificate successfully pinned to IPFS:</p>
            <p>
              <strong>IPFS Hash:</strong> {ipfsHash}
            </p>
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
              className="ipfs-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on IPFS ↗
            </a>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">
          <span>✅</span> Verify Certificate
        </h2>
        <div className="input-group">
          <label>Certificate ID</label>
          <input
            type="text"
            placeholder="Enter certificate ID to verify"
            value={verifyCertId}
            onChange={(e) => setVerifyCertId(e.target.value.trim())}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={verifyCertificate}
          disabled={loading || !account}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span> Verifying...
            </>
          ) : (
            "Verify Certificate"
          )}
        </button>

        {verifiedCert && (
          <div className="cert-details">
            <h3>
              <span>🔍</span> Certificate Details
            </h3>
            <p>
              <strong>Name:</strong> {verifiedCert.studentName}
            </p>
            <p>
              <strong>Course:</strong> {verifiedCert.course}
            </p>
            <p>
              <strong>IPFS Hash:</strong> {verifiedCert.ipfsHash}
            </p>
            <p>
              <strong>Issued On:</strong>{" "}
              {verifiedCert.issueDate
                ? new Date(
                    Number(verifiedCert.issueDate) * 1000
                  ).toLocaleString()
                : "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
