"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

export default function Home() {
  const [pdf, setPdf] = useState<File | null>(null); // Fix type
  const [emergencyContact, setEmergencyContact] = useState("");
  const [pcpName, setPcpName] = useState("");
  const [pcpContact, setPcpContact] = useState("");
  const [qr, setQr] = useState("");

  const handleUpload = async () => {
    if (!pdf || !emergencyContact || !pcpName || !pcpContact) {
      alert("Please fill all fields!");
      return;
    }
    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("emergencyContact", emergencyContact);
    formData.append("pcpName", pcpName);
    formData.append("pcpContact", pcpContact);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setQr(data.qr);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">MedZKic - Patient Upload</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files?.[0] || null)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        value={emergencyContact}
        onChange={(e) => setEmergencyContact(e.target.value)}
        placeholder="Emergency Contact"
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        value={pcpName}
        onChange={(e) => setPcpName(e.target.value)}
        placeholder="PCP Name"
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        value={pcpContact}
        onChange={(e) => setPcpContact(e.target.value)}
        placeholder="PCP Contact"
        className="border p-2 w-full mb-2"
      />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded w-full">
        Upload
      </button>
      {qr && <QRCode value={qr} className="mt-4 mx-auto" />}
    </div>
  );
}