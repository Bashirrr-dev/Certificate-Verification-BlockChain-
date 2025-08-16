// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string course;
        string ipfsHash;
        uint256 issueDate;
    }

    mapping(string => Certificate) public certificates;

    function issueCertificate(
        string memory certId,
        string memory name,
        string memory course,
        string memory ipfsHash
    ) public {
        certificates[certId] = Certificate(name, course, ipfsHash, block.timestamp);
    }

    function verifyCertificate(string memory certId)
        public
        view
        returns (Certificate memory)
    {
        return certificates[certId];
    }
}
