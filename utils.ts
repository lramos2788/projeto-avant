import { PatientData } from "./types";

// Simple encoding to Base64 to avoid extremely long URLs where possible,
// though for this amount of data, a backend is usually preferred.
// We verify that window.btoa and JSON are available.

export const encodeData = (data: PatientData): string => {
  try {
    const json = JSON.stringify(data);
    // Encode UTF-8 characters properly
    const utf8Bytes = new TextEncoder().encode(json);
    const binaryString = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join("");
    return btoa(binaryString);
  } catch (e) {
    console.error("Failed to encode data", e);
    return "";
  }
};

export const decodeData = (hash: string): PatientData | null => {
  try {
    const cleanHash = hash.replace(/^#/, '');
    if (!cleanHash) return null;
    
    const binaryString = atob(cleanHash);
    const utf8Bytes = new Uint8Array(Array.from(binaryString, (char) => char.charCodeAt(0)));
    const json = new TextDecoder().decode(utf8Bytes);
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode data", e);
    return null;
  }
};

export const downloadJSON = (data: PatientData, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};