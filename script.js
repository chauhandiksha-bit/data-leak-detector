function checkData() {
  const input = document.getElementById("dataInput").value.trim();
  const result = document.getElementById("result");

  // Reset classes
  result.className = "result";
  result.classList.remove("hidden", "safe", "danger", "warning");

  if (!input) {
    result.classList.add("warning");
    result.innerHTML = "⚠️ Please paste some text to scan first.";
    return;
  }

  const warnings = [];

  // Check 1: Email address detected
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = input.match(emailRegex);
  if (emails) {
    warnings.push(`🔴 Email address detected: <strong>${emails[0]}</strong> — may be leaked personal data`);
  }

  // Check 2: Phone number detected (Indian format)
  const phoneRegex = /(\+91[\s-]?)?[6-9]\d{9}/g;
  const phones = input.match(phoneRegex);
  if (phones) {
    warnings.push(`🔴 Phone number detected: <strong>${phones[0]}</strong> — personal contact info exposed`);
  }

  // Check 3: Aadhar card number (12 digits)
  const aadharRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  if (aadharRegex.test(input)) {
    warnings.push("🔴 Possible <strong>Aadhar card number</strong> detected — highly sensitive data!");
  }

  // Check 4: PAN card number
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;
  if (panRegex.test(input)) {
    warnings.push("🔴 Possible <strong>PAN card number</strong> detected — sensitive financial data!");
  }

  // Check 5: Credit/Debit card number (16 digits)
  const cardRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  if (cardRegex.test(input)) {
    warnings.push("🔴 Possible <strong>credit/debit card number</strong> detected — financial data at risk!");
  }

  // Check 6: Password patterns
  const passwordRegex = /password\s*[=:]\s*\S+/i;
  if (passwordRegex.test(input)) {
    warnings.push("🔴 Possible <strong>password</strong> found in plain text — change it immediately!");
  }

  // Check 7: OTP detected
  const otpRegex = /\b(otp|one.?time.?password)\s*[=:is]?\s*\d{4,6}\b/i;
  if (otpRegex.test(input)) {
    warnings.push("🔴 <strong>OTP</strong> detected in text — never share OTPs with anyone!");
  }

  // Check 8: Bank account number (9-18 digits)
  const bankRegex = /\baccount\s*(no|number|num)?[:\s]*\d{9,18}\b/i;
  if (bankRegex.test(input)) {
    warnings.push("🔴 Possible <strong>bank account number</strong> detected — sensitive financial data!");
  }

  // Check 9: IFSC code
  const ifscRegex = /\b[A-Z]{4}0[A-Z0-9]{6}\b/g;
  if (ifscRegex.test(input)) {
    warnings.push("🟡 Possible <strong>IFSC code</strong> detected — bank branch information exposed");
  }

  // Check 10: IP address
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
  if (ipRegex.test(input)) {
    warnings.push("🟡 <strong>IP address</strong> detected — network information exposed");
  }

  // Check 11: Date of birth pattern
  const dobRegex = /\b(dob|date of birth|born on)\s*[=:is]?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/i;
  if (dobRegex.test(input)) {
    warnings.push("🟡 Possible <strong>date of birth</strong> detected — personal information exposed");
  }

  // Show result
  if (warnings.length === 0) {
    result.classList.add("safe");
    result.innerHTML = `
      ✅ <strong>No Sensitive Data Found!</strong><br><br>
      This text does not appear to contain any leaked sensitive information.<br>
      <small>⚡ Always be careful about sharing personal information online!</small>
    `;
  } else if (warnings.length <= 2) {
    result.classList.add("warning");
    result.innerHTML = `
      ⚠️ <strong>Sensitive Data Detected! (${warnings.length} warning${warnings.length > 1 ? "s" : ""})</strong><br><br>
      ${warnings.join("<br>")}<br><br>
      <small>🔎 Remove or protect this information immediately.</small>
    `;
  } else {
    result.classList.add("danger");
    result.innerHTML = `
      🚨 <strong>MAJOR DATA LEAK DETECTED! (${warnings.length} leaks found)</strong><br><br>
      ${warnings.join("<br>")}<br><br>
      <small>❌ This text contains highly sensitive data. Do NOT share this with anyone!</small>
    `;
  }
}

// Allow pressing Enter key to trigger check
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("dataInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.ctrlKey) checkData();
  });
});
