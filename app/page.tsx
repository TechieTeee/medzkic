"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

export default function Home() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [pcpName, setPcpName] = useState("");
  const [pcpContact, setPcpContact] = useState("");
  const [qr, setQr] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    console.log("Upload clicked", { pdf, emergencyContact, pcpName, pcpContact });
    if (!pdf || !emergencyContact || !pcpName || !pcpContact) {
      const message = "Please fill all fields!";
      console.log(message);
      alert(message);
      setError(message);
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("emergencyContact", emergencyContact);
    formData.append("pcpName", pcpName);
    formData.append("pcpContact", pcpContact);

    try {
      console.log("Sending fetch to /api/upload");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log("Fetch response:", res.status, res.statusText);
      const data = await res.json();
      if (res.ok) {
        console.log("Upload successful:", data);
        setQr(data.qr);
        setError(null);
      } else {
        console.error("API error:", data.error);
        setError(data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError((err as Error).message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">MedZKic - Patient Upload</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          console.log("File selected:", file?.name);
          setPdf(file);
        }}
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
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Upload
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {qr && (
        <div className="mt-4">
          <QRCode value={qr} className="mx-auto" />
          <p className="text-center mt-2">{qr}</p>
        </div>
      )}
    </div>
  );
}