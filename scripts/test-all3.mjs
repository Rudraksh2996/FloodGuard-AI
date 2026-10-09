import fs from 'fs';
import https from 'https';

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
  });
}

async function run() {
  console.log("== 4. ANALYZE ==");
  const imgBuffer = await downloadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png");
  const imgBase64 = imgBuffer.toString('base64');
  
  let res = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: imgBase64 })
  });
  let data = await res.json();
  console.log("Analyze response:", JSON.stringify(data).substring(0, 200));

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
