#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🔍 Debugging user accounts in your database...\n');

// Run convex query to get all users
const query = spawn('npx', ['convex', 'query', 'auth:debugUserAccounts'], {
  stdio: 'inherit',
  shell: true
});

query.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Query completed successfully');
    console.log('\n📖 To search for a specific email, run:');
    console.log('npx convex query auth:debugFindUsersByEmail --email "your-test@email.com"');
  } else {
    console.error('\n❌ Query failed with exit code', code);
  }
});