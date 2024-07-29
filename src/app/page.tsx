"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch media URLs");
      }

      const data = await response.json();
      await downloadMedia(data.mediaUrls);
    } catch (error) {
      setError(error.message);
    }
  };

  const downloadMedia = async (urls: any) => {
    for (const [index, url] of urls.entries()) {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `media-${index + 1}.${blob.type.split("/")[1]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }
  };

  return (
    <div>
      <h1>Instagram Downloader</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Instagram URL"
          style={{ color: "#000" }}
          required
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            backgroundColor: "blue",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Download
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
