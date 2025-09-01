#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');

    for (const line of envLines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [key, ...valueParts] = trimmedLine.split('=');
            const value = valueParts.join('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        }
    }
}

// Check if token exists
if (!process.env.CLOUDFLARED_TOKEN) {
    console.error('❌ CLOUDFLARED_TOKEN not found in .env file');
    process.exit(1);
}

console.log('🚀 Starting Cloudflare tunnel with token from .env...');

// Spawn cloudflared process
const cloudflared = spawn(
    'cloudflared',
    ['tunnel', 'run', '--token', process.env.CLOUDFLARED_TOKEN],
    {
        stdio: 'inherit',
        env: { ...process.env, TUNNEL_URL: 'http://localhost:5173' },
    }
);

// Handle process events
cloudflared.on('error', error => {
    console.error('❌ Failed to start cloudflared:', error.message);
    process.exit(1);
});

cloudflared.on('close', code => {
    console.log(`📤 Cloudflared process exited with code ${code}`);
    process.exit(code);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping tunnel...');
    cloudflared.kill('SIGINT');
});
