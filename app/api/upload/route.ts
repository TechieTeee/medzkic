import { NextRequest, NextResponse } from "next/server";
import PinataSDK from "@pinata/sdk";
import CryptoJS from "crypto-js";
import { ethers } from "ethers";
import { buildMimcSponge } from "circomlibjs";
import { readFileSync } from "fs";
import path from "path";

// Initialize Pinata
const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY ?? "",
  pinataSecretApiKey: process.env.PINATA_SECRET ?? "",
});

// Set up Ethereum provider and wallet
const provider = new ethers.JsonRpcProvider(
  `https://eth-holesky.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
);
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) throw new Error("PRIVATE_KEY not set");
const wallet = new ethers.Wallet(privateKey, provider);

// Load contract ABI
const contract = new ethers.Contract(
  "0x7E3F5A3a40B744CD56A248A93b259789518896fb",
  JSON.parse(readFileSync(path.join(process.cwd(), "artifacts/contracts/MedZKic.sol/MedZKic.json"), "utf8")).abi,
  wallet
);

// POST handler
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdf = formData.get("pdf") as File;
    const emergencyContact = formData.get("emergencyContact") as string;
    const pcpName = formData.get("pcpName") as string;
    const pcpContact = formData.get("pcpContact") as string;

    if (!pdf || !emergencyContact || !pcpName || !pcpContact) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Encrypt PDF as base64
    const pdfBuffer = Buffer.from(await pdf.arrayBuffer());
    const encryptedPdf = CryptoJS.AES.encrypt(
      pdfBuffer.toString("base64"),
      "secret-key-123"
    ).toString();

    // Upload encrypted content + metadata as JSON
    const ipfsRes = await pinata.pinJSONToIPFS(
      {
        encryptedPdf,
        emergencyContact,
        pcpName,
        pcpContact,
      },
      {
        pinataMetadata: { name: "patient_ehr.json" },
      }
    );

    const ipfsHash = ipfsRes.IpfsHash;

    // Generate ZK Proof
    const allergyHash = BigInt("123456789");
    const secret = BigInt("987654321");
    const mimc = await buildMimcSponge();
    const result = mimc.multiHash([allergyHash, secret]);
    const zkProof = "0x" + BigInt(mimc.F.toString(result)).toString(16);

    // Store on-chain
    const tx = await contract.storeData(
      wallet.address,
      ethers.toUtf8Bytes(ipfsHash.slice(0, 32)),
      zkProof,
      emergencyContact,
      pcpName,
      pcpContact
    );
    await tx.wait();

    // Success
    return NextResponse.json({
      qr: `https://medzkic.vercel.app/verify/${wallet.address}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
