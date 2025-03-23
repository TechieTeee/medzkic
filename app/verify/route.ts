import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import path from "path";

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
    const patientAddress = formData.get("patientAddress") as string;
    // const badge = formData.get("badge") as File; // Unused for now

    if (!patientAddress) {
      return NextResponse.json({ error: "Missing patientAddress" }, { status: 400 });
    }

    // Mock responder proof (replace with real logic later)
    const responderProof = "0xmockresponder";

    const [allergies, conditions, medications, dnrStatus, emergencyContact, pcpName, pcpContact] =
      await contract.getPatientData(patientAddress, responderProof);

    return NextResponse.json({
      allergies,
      conditions,
      medications,
      dnrStatus,
      emergencyContact,
      pcpName,
      pcpContact,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}