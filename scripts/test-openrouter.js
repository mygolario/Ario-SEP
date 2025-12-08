const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Load Env
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = null;
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/OPENROUTER_API_KEY="?([^"\n]+)"?/);
    apiKey = match ? match[1] : null;
} catch (e) {
    console.error("Error reading .env.local", e.message);
}

if (!apiKey) {
    console.error("Could not find OPENROUTER_API_KEY in .env.local");
    process.exit(1);
}

const models = {
  PLAN_A: "google/gemini-2.0-flash-001",
  PLAN_B: "openai/gpt-4o",
  MERGER: "anthropic/claude-3.5-sonnet",
};

async function testModel(name, modelId) {
    console.log(`Testing ${name} (${modelId})...`);
    return new Promise((resolve, reject) => {
        const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Test Script'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ ${name} Success`);
                    resolve(true);
                } else {
                    console.error(`❌ ${name} Failed: ${res.statusCode} - ${data}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`❌ ${name} Error: ${e.message}`);
            resolve(false);
        });

        req.write(JSON.stringify({
            model: modelId,
            messages: [{ role: 'user', content: 'Hi' }]
        }));
        req.end();
    });
}

async function run() {
    for (const [name, id] of Object.entries(models)) {
        await testModel(name, id);
    }
}

run();
