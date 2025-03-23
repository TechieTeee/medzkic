// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedZKic {
    mapping(address => bytes32) public patientDataHashes; // IPFS hash
    mapping(address => bytes) public zkProofs; // ZK proof storage

    function storeData(address patient, bytes32 dataHash, bytes calldata zkProof) external {
        patientDataHashes[patient] = dataHash;
        zkProofs[patient] = zkProof;
    }

    function getAllergy(address patient, bytes calldata responderProof) external view returns (string memory) {
        // Placeholder
        if (zkProofs[patient].length > 0) {
            return "Penicillin: Yes"; // Hardcoded for MVP
        }
        return "No data";
    }
}