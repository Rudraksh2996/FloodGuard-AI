const fs = require('fs');
const path = require('path');

function run() {
  const csvPath = path.join(__dirname, 'floodguard-app_accessKeys.csv');
  const envPath = path.join(__dirname, '.env.local');

  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found');
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n').map(l => l.replace(/[\r\s'"]/g, '').trim()).filter(l => l);

  if (lines.length < 2) {
    console.error('Invalid CSV format');
    process.exit(1);
  }

  const keys = lines[1].split(',');
  const accessKeyId = keys[0];
  const secretAccessKey = keys[1];

  const envLines = [
    `AWS_REGION=ap-south-1`,
    `AWS_ACCESS_KEY_ID=${accessKeyId}`,
    `AWS_SECRET_ACCESS_KEY=${secretAccessKey}`,
    `SNS_TOPIC_ARN=arn:aws:sns:ap-south-1:065241263488:FloodGuardAlertTopic`,
    `DDB_TABLE=FloodGuardState`
  ];

  fs.writeFileSync(envPath, envLines.join('\n'));

  // Validation
  let isValid = true;
  if (!accessKeyId.startsWith('AKIA')) {
    console.log('FAIL: Key ID must start with AKIA');
    isValid = false;
  } else if (accessKeyId.length !== 20) {
    console.log('FAIL: Key ID must be 20 characters');
    isValid = false;
  } else {
    console.log('PASS: Key ID validation');
  }

  if (secretAccessKey.length !== 40) {
    console.log('FAIL: Secret must be 40 characters');
    isValid = false;
  } else {
    console.log('PASS: Secret validation');
  }

  const envCheck = fs.readFileSync(envPath, 'utf8');
  if (envCheck.includes(' ') || envCheck.includes('"') || envCheck.includes("'")) {
    console.log('FAIL: Whitespace or quotes found in .env.local');
    isValid = false;
  } else {
    console.log('PASS: Format validation');
  }

  if (isValid) {
    fs.unlinkSync(csvPath);
    console.log('SUCCESS: CSV deleted');
  }
}

run();
