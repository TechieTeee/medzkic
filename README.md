# MedZKic: Revolutionizing Healthcare Trust with Zero-Knowledge Proofs

## Overview
MedZKic is a groundbreaking healthcare platform that leverages zero-knowledge proofs (ZKPs) and blockchain technology to secure electronic medical records (EMRs). It empowers patients with sovereignty over their data while ensuring privacy, security, and instant access for critical care scenarios.

## Problem Solved
Fragmented, insecure electronic health records (EHRs) delay care, risk patient lives, and contribute to medical errors—the third leading cause of death in the US, costing $20B+ annually (Johns Hopkins, 2016). Inefficiencies waste $760B yearly (JAMA, 2019). MedZKic tackles these by providing a decentralized, tamper-proof system for trusted, real-time data access.

## Background
Traditional EHR systems are centralized, vulnerable to breaches, and inefficient. MedZKic integrates blockchain for immutability, IPFS for decentralized storage, and ZKPs to verify data integrity without revealing sensitive details. Built for a hackathon, it showcases a proof-of-concept that could transform healthcare delivery.

## Why It Matters
- **Impact:** Reduces medical errors by up to 30%, potentially saving $6B+ and countless lives annually (projected from error reduction studies).
- **Patient Privacy:** ZKPs ensure only necessary data is shared, keeping sensitive information confidential.
- **Sovereignty:** Patients control their records via a secure QR code, granting or revoking access as needed—shifting power from institutions to individuals.
- **Urgency:** In emergencies, first responders scan the QR code for instant, verified medical data, speeding up life-saving interventions.

## Tools Used
- **Next.js**: Frontend framework for a sleek, responsive UI.
- **Tailwind CSS v4**: Styling with cinematic effects (glows, glassmorphism).
- **IPFS**: Decentralized storage for EMRs.
- **Ethereum/ZK-Rollup**: Blockchain layer for security and scalability.
- **React-QR-Code**: Generates patient-specific QR codes.
- **Node.js**: Backend API for upload handling.
- **Vercel**: Hosting


## Challenges Overcome
- **Image Consistency:** Unified gallery image heights (256px) using flexbox and `object-cover`.
- **UI Centering:** Fixed impact image alignment with `flex justify-center items-center` and `mx-auto`.
- **Tailwind v4 Migration:** Adapted `globals.css` from v3 directives to v4 imports (`@import "tailwindcss"`) mid-development.
- **ZK Integration:** Designed a circuit for MiMC proofs, balancing privacy and verifiability.

## Zero-Knowledge Focus
MedZKic uses ZKPs (zk-SNARKs with MiMC hashing) to prove EMR validity without exposing contents. Doctors upload records to IPFS, generating a Content ID (CID) verified by a smart contract. ZK-Rollup batches transactions, ensuring scalability while maintaining Ethereum mainnet security. This preserves patient privacy while enabling trustless verification.

## Deployment & Proof Information
- **Contract Deployment Address:** `0x7E3F5A3a40B744CD56A248A93b259789518896fb`
- **MiMC Proof Address:** `0x20b202291658f718b1352b3ed253181d9b349e28bf0f1104a29cbfe256864f0e`
- **How It Works:** The contract stores CIDs and ZKP proofs, verifiable on-chain. Patients access records via QR codes linked to this proof.

## Patient Privacy & Sovereignty
- **Privacy:** ZKPs ensure only the proof—not the data—is shared, protecting sensitive health info.
- **Sovereignty:** Patients own their data, controlling access via QR codes. Unlike traditional EHRs, no centralized entity holds power over records.
- **Innovation:** Combines privacy-first tech with user empowerment, a rare duo in healthcare.

## Why MedZKic Stands Out
- **Innovative Edge:** BlendS ZKPs, IPFS, and QR codes for EMRs, offering a scalable, private, patient-centric solution.

## Getting Started
1. **Clone the Repo:**
   ```bash
   git clone https://github.com/TechieTeee/medzkic
   cd medzkic
   npm install
   npm run dev
