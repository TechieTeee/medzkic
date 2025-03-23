"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";

export default function Page() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [pcpName, setPcpName] = useState("");
  const [pcpContact, setPcpContact] = useState("");
  const [qr, setQr] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!pdf || !emergencyContact || !pcpName || !pcpContact) {
      setError("Please fill all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("emergencyContact", emergencyContact);
    formData.append("pcpName", pcpName);
    formData.append("pcpContact", pcpContact);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Upload failed.");
      }

      const data = await res.json();
      setQr(data.qr);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/375b03a1-8a7d-4597-b333-2ffdf1b27f1a.png"
              alt="MedZKic Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="text-2xl font-bold text-blue-900">MedZKic</span>
          </div>
          <nav className="space-x-6">
            <a href="#background" className="text-teal-500 hover:text-teal-700 transition-colors">Background</a>
            <a href="#benefits" className="text-teal-500 hover:text-teal-700 transition-colors">Benefits</a>
            <a href="#impact" className="text-teal-500 hover:text-teal-700 transition-colors">Impact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 cinematic-section">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4 animate-fade-in glow-text">
            MedZKic: Revolutionizing Healthcare Trust
          </h1>
          <p className="text-xl mb-8">
            Secure, private, and cutting-edge medical records for the future.
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <Image
                src="/pexels-rdne-6519880.jpg"
                alt="Healthcare Innovation"
                width={1200}
                height={800}
                className="rounded-lg shadow-lg image-glow"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upload Form */}
      <section className="py-16 bg-white">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            Upload Your Medical Record
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Emergency Contact"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              value={pcpName}
              onChange={(e) => setPcpName(e.target.value)}
              placeholder="Primary Care Physician Name"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              value={pcpContact}
              onChange={(e) => setPcpContact(e.target.value)}
              placeholder="PCP Contact"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleUpload}
              className="w-full bg-teal-500 text-white p-3 rounded-md hover:bg-teal-600 transition-colors"
            >
              Secure Upload
            </button>
            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            {qr && (
              <div className="mt-6 text-center">
                <p className="text-blue-900 mb-2">Your Secure QR Code:</p>
                <QRCode value={qr} className="mx-auto" />
                <p className="text-sm text-gray-600 mt-2">{qr}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section id="background" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Background</h2>
          <p className="text-lg mb-6">
            MedZKic harnesses zero-knowledge proofs and blockchain technology to secure patient data,
            overcoming the inefficiencies and vulnerabilities of traditional electronic health record systems.
            We’re pioneering a new era of healthcare innovation.
          </p>
          {/* Gallery */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-full sm:w-1/2 md:w-1/3 max-w-xs h-64 overflow-hidden">
              <Image
                src="/pexels-laura-james-6098047.jpg"
                alt="Healthcare Tech 1"
                width={400}
                height={300}
                className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300 object-cover w-full h-full"
              />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 max-w-xs h-64 overflow-hidden">
              <Image
                src="/pexels-mart-production-7088526.jpg"
                alt="Healthcare Tech 2"
                width={400}
                height={600}
                className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300 object-cover w-full h-full"
              />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 max-w-xs h-64 overflow-hidden">
              <Image
                src="/pexels-tima-miroshnichenko-5452268.jpg"
                alt="Healthcare Tech 3"
                width={400}
                height={300}
                className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300 object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Benefits</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li className="bg-gray-50 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-teal-500">Privacy</h3>
              <p>ZK proofs ensure sensitive data stays confidential.</p>
            </li>
            <li className="bg-gray-50 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-teal-500">Security</h3>
              <p>Encrypted records on IPFS and blockchain prevent breaches.</p>
            </li>
            <li className="bg-gray-50 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-teal-500">Accessibility</h3>
              <p>First responders access critical info instantly.</p>
            </li>
            <li className="bg-gray-50 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-teal-500">Efficiency</h3>
              <p>Streamlines care, reducing delays and errors.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 bg-gray-100 cinematic-section">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Why This Matters</h2>
          <p className="text-lg mb-4">
            Medical errors are the third leading cause of death in the US, costing over $20 billion annually
            (Johns Hopkins, 2016). Inefficiencies in healthcare waste $760 billion yearly (JAMA, 2019).
            MedZKic addresses these critical challenges:
          </p>
          <ul className="space-y-4 mb-8">
            <li>
              <strong>Problem:</strong> Fragmented, insecure EHRs delay care and risk lives.
            </li>
            <li>
              <strong>Solution:</strong> A decentralized, encrypted platform for instant, trusted access.
            </li>
            <li>
              <strong>Impact:</strong> Could reduce errors by 30%, saving over $6 billion and countless lives
              (projected estimate based on error reduction studies).
            </li>
          </ul>
          <div className="bg-blue-900 py-12 flex justify-center items-center">
            <div className="w-full max-w-md mx-auto">
              <Image
                src="/pexels-cottonbro-6191532.jpg"
                alt="Healthcare Impact"
                width={400}
                height={600}
                className="rounded-lg shadow-lg image-glow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2025 MedZKic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}