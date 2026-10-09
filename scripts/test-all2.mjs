import fs from 'fs';

async function run() {
  console.log("== 4. ANALYZE ==");
  // We need a dummy image. I'll just base64 encode a tiny valid JPEG.
  const dummyJpeg = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAANSURBVBhXY3jP4PgfAAWpA40b9m74AAAAAElFTkSuQmCC"; // Technically a 1x1 PNG, let's see if rekognition rejects it.
  let res = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: dummyJpeg })
  });
  let data = await res.json();
  console.log("Analyze response:", data);

  console.log("\n== 5. DISPATCH ==");
  res = await fetch("http://localhost:3000/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: 4, nodeName: "DTU Main Gate", fri: 0.92, drainStatus: "Choke", action: "Dispatch" })
  });
  data = await res.json();
  console.log("Dispatch response 1:", data);

  res = await fetch("http://localhost:3000/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: 4, nodeName: "DTU Main Gate", fri: 0.92, drainStatus: "Choke", action: "Dispatch" })
  });
  let status = res.status;
  data = await res.json();
  console.log(`Dispatch response 2 (Status ${status}):`, data);
}
run();
