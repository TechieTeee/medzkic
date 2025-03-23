import { NextRequest, NextResponse } from "next/server";
import PinataSDK from "@pinata/sdk";
import CryptoJS from "crypto-js";
import { ethers } from "ethers";
import { buildMimcSponge } from "circomlibjs";
import { readFileSync } from "fs";
import path from "path";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY ?? "",
  pinataSecretApiKey: process.env.PINATA_SECRET ?? "",
});

const provider = new ethers.JsonRpcProvider(
  `https://eth-holesky.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`
);
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) throw new Error("PRIVATE_KEY not set");
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(
  "0x7E3F5A3a40B744CD56A248A93b259789518896fb",
  JSON.parse(readFileSync(path.join(process.cwd(), "artifacts/contracts/MedZKic.sol/MedZKic.json"), "utf8")).abi,
  wallet
);

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

    // Encrypt PDF
    const pdfBuffer = Buffer.from(await pdf.arrayBuffer());
    const encryptedPdf = CryptoJS.AES.encrypt(pdfBuffer.toString("base64"), "secret-key-123").toString();

    // Upload to Pinata
    const ipfsRes = await pinata.pinFileToIPFS(Buffer.from(encryptedPdf), {
      pinataMetadata: { name: "patient_ehr.pdf" },
    });
    const ipfsHash = ipfsRes.IpfsHash;

    // Generate ZK Proof (your working code)
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

    return NextResponse.json({ qr: `https://yourapp.vercel.app/verify/${wallet.address}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}