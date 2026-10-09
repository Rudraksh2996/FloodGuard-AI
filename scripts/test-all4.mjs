import fs from 'fs';

async function run() {
  console.log("== 4. ANALYZE ==");
  const imgBuffer = fs.readFileSync('test-image.jpg');
  const imgBase64 = imgBuffer.toString('base64');
  
  let res = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: imgBase64 })
  });
  let data = await res.json();
  console.log("Analyze response:", JSON.stringify(data).substring(0, 500));
}
run();
