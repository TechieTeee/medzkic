"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

interface PatientData {
  allergies: string;
  conditions: string;
  medications: string;
  dnrStatus: boolean;
  emergencyContact: string;
  pcpName: string;
  pcpContact: string;
}

export default function Verify() {
  const [badge, setBadge] = useState<File | null>(null);
  const [data, setData] = useState<PatientData | null>(null);
  const params = useParams();
  const patient = params.patient as string;

  const handleVerify = async () => {
    if (!badge) {
      alert("Upload a badge!");
      return;
    }
    const formData = new FormData();
    formData.append("badge", badge);
    formData.append("patientAddress", patient);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Fetch error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">MedZKic - Responder</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setBadge(e.target.files?.[0] || null)}
        className="border p-2 w-full mb-2"
      />
      <button onClick={handleVerify} className="bg-green-500 text-white p-2 rounded w-full">
        Verify
      </button>
      {data && (
        <div className="mt-4">
          <p>Allergies: {data.allergies}</p>
          <p>Conditions: {data.conditions}</p>
          <p>Medications: {data.medications}</p>
          <p>DNR: {data.dnrStatus ? "Yes" : "No"}</p>
          <p>Emergency Contact: {data.emergencyContact}</p>
          <p>PCP: {data.pcpName} ({data.pcpContact})</p>
        </div>
      )}
    </div>
  );
}