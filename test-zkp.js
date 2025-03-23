import { buildMimcSponge } from "circomlibjs";

async function generateProof() {
  const allergyHash = BigInt("123456789"); // Mock allergy hash
  const secret = BigInt("987654321");     // Patient secret

  const mimc = await buildMimcSponge();
  const result = mimc.multiHash([allergyHash, secret]);
  const proof = mimc.F.toString(result);

  console.log("MiMC Proof:", "0x" + BigInt(proof).toString(16));
}

generateProof();