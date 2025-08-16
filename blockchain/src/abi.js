// abi.js
export const abi = [
  {
    inputs: [{ internalType: "string", name: "", type: "string" }],
    name: "certificates",
    outputs: [
      { internalType: "string", name: "studentName", type: "string" },
      { internalType: "string", name: "course", type: "string" },
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "uint256", name: "issueDate", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "certId", type: "string" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "course", type: "string" },
      { internalType: "string", name: "ipfsHash", type: "string" },
    ],
    name: "issueCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "certId", type: "string" }],
    name: "verifyCertificate",
    outputs: [
      {
        components: [
          { internalType: "string", name: "studentName", type: "string" },
          { internalType: "string", name: "course", type: "string" },
          { internalType: "string", name: "ipfsHash", type: "string" },
          { internalType: "uint256", name: "issueDate", type: "uint256" },
        ],
        internalType: "struct CertificateRegistry.Certificate",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
