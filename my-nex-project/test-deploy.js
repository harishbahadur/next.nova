#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Tests all critical API endpoints before deploying to Vercel
 */

const http = require("http");

const BASE_URL = "http://localhost:3000";
let allTestsPassed = true;

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", reject);

    if (postData) {
      req.write(JSON.stringify(postData));
    }

    req.end();
  });
}

async function testFuriganaAPI() {
  console.log("\n🧪 Testing Furigana API...");

  try {
    const result = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/furigana",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { text: "日本の学校で勉強する" }
    );

    if (result.status === 200 && result.data.furigana) {
      console.log("   ✅ Furigana API works!");
      console.log(
        "   📝 Sample output:",
        JSON.stringify(result.data.furigana.slice(0, 3), null, 2)
      );
      return true;
    } else {
      console.log("   ❌ Furigana API failed:", result);
      return false;
    }
  } catch (error) {
    console.log("   ❌ Error:", error.message);
    return false;
  }
}

async function testTranslateAPI() {
  console.log("\n🧪 Testing Translation API...");

  try {
    const result = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/translate",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { text: "Hello", source: "en", target: "ja" }
    );

    if (result.status === 200 && result.data.translatedText) {
      console.log("   ✅ Translation API works!");
      console.log("   📝 Translation:", result.data.translatedText);
      return true;
    } else {
      console.log("   ❌ Translation API failed:", result);
      return false;
    }
  } catch (error) {
    console.log("   ❌ Error:", error.message);
    return false;
  }
}

async function runTests() {
  console.log("🚀 Running Pre-Deployment Tests...");
  console.log("📍 Target:", BASE_URL);

  const furiganaTest = await testFuriganaAPI();
  const translateTest = await testTranslateAPI();

  allTestsPassed = furiganaTest && translateTest;

  console.log("\n" + "=".repeat(50));
  if (allTestsPassed) {
    console.log("✅ ALL TESTS PASSED! Ready to deploy to Vercel!");
    console.log("=".repeat(50));
    process.exit(0);
  } else {
    console.log("❌ SOME TESTS FAILED! Fix issues before deploying.");
    console.log("=".repeat(50));
    process.exit(1);
  }
}

// Wait a bit for server to be ready
setTimeout(runTests, 2000);
