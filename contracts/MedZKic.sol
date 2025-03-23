// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedZKic {
    // Struct to hold patient medical data with a single IPFS record
    struct MedicalData {
        bytes32 ipfsHash;        // Single IPFS hash of encrypted EHR summary
        bytes zkProof;           // ZK proof proving specific facts from the summary
        string emergencyContact; // Phone number (plaintext for MVP, encrypt later)
        string pcpName;          // Primary care physician name
        string pcpContact;       // PCP phone number
    }

    // Mapping of patient address to their medical data
    mapping(address => MedicalData) private patientRecords;

    // Events for logging
    event DataStored(address indexed patient, bytes32 ipfsHash);
    event DataAccessed(address indexed patient, address indexed responder);

    // Store patient data with a single IPFS hash
    function storeData(
        address patient,
        bytes32 ipfsHash,
        bytes calldata zkProof,
        string calldata emergencyContact,
        string calldata pcpName,
        string calldata pcpContact
    ) external {
        patientRecords[patient] = MedicalData({
            ipfsHash: ipfsHash,
            zkProof: zkProof,
            emergencyContact: emergencyContact,
            pcpName: pcpName,
            pcpContact: pcpContact
        });
        emit DataStored(patient, ipfsHash);
    }

    // Verify responder and return patient data from the IPFS summary
    function getPatientData(
        address patient,
        bytes calldata responderProof
    ) external returns (
        string memory allergies,
        string memory conditions,
        string memory medications,
        bool dnrStatus,
        string memory emergencyContact,
        string memory pcpName,
        string memory pcpContact
    ) {
        MedicalData storage record = patientRecords[patient];
        
        // Check if data exists
        require(record.ipfsHash != bytes32(0), "No data for this patient");
        require(responderProof.length > 0, "Invalid responder proof");

        // Placeholder: will later verify zkProof and responderProof with ZK circuits
        // For MVP, hardcode outputs based on zkProof presence
        allergies = (record.zkProof.length > 0) ? "Penicillin: Yes" : "None";
        conditions = (record.zkProof.length > 0) ? "Diabetes: Yes" : "None";
        medications = (record.zkProof.length > 0) ? "Warfarin: Yes" : "None";
        dnrStatus = (record.zkProof.length > 0);

        emergencyContact = record.emergencyContact;
        pcpName = record.pcpName;
        pcpContact = record.pcpContact;

        emit DataAccessed(patient, msg.sender);
        return (allergies, conditions, medications, dnrStatus, emergencyContact, pcpName, pcpContact);
    }

    // Helper function to check if data exists
    function hasData(address patient) external view returns (bool) {
        return patientRecords[patient].ipfsHash != bytes32(0);
    }

    // Get IPFS hash for off-chain retrieval
    function getIpfsHash(address patient) external view returns (bytes32) {
        return patientRecords[patient].ipfsHash;
    }
}