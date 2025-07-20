"use client";

import React from "react";

export default function AIFormFillingPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", minHeight: "600px" }}>
      <iframe
        src="http://localhost:5005"
        title="AI Form Filling"
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="camera; microphone; clipboard-write"
      />
    </div>
  );
} 