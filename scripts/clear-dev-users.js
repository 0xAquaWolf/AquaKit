#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🚨 DEVELOPMENT USER CLEANUP SCRIPT 🚨\n');
  console.log('This script will DELETE ALL USERS from your development database.');
  console.log('This is IRREVERSIBLE and should ONLY be used in development!\n');

  // Check current environment
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_SITE_URL || '';
  
  if (convexUrl.includes('prod') || convexUrl.includes('production')) {
    console.error('❌ ERROR: This script detected a production environment!');
    console.error('Production URLs detected in environment variables.');
    console.error('This script is ONLY for development use.');
    process.exit(1);
  }

  console.log(`🔍 Current Convex URL: ${convexUrl}`);
  console.log('📝 Environment check passed - appears to be development\n');

  // First confirmation
  const confirm1 = await askQuestion('Are you sure you want to delete ALL users? (type "yes" to continue): ');
  if (confirm1.toLowerCase() !== 'yes') {
    console.log('Operation cancelled.');
    rl.close();
    return;
  }

  // Second confirmation with specific phrase
  const confirm2 = await askQuestion('Type "DELETE_ALL_USERS_CONFIRM" to proceed: ');
  if (confirm2 !== 'DELETE_ALL_USERS_CONFIRM') {
    console.log('Operation cancelled - confirmation phrase not matched.');
    rl.close();
    return;
  }

  console.log('\n🗑️ Starting user deletion...\n');
  rl.close();

  // Run the Convex mutation
  const mutation = spawn('npx', [
    'convex', 
    'mutation', 
    'auth:devClearAllUsers',
    '--confirmDeletion', 'DELETE_ALL_USERS_CONFIRM',
    '--environment', 'development'
  ], {
    stdio: 'inherit',
    shell: true
  });

  mutation.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ User cleanup completed successfully!');
      console.log('🧪 You can now test account linking with a clean database.');
      console.log('\n📖 To verify the database is empty, run:');
      console.log('npx convex query auth:debugUserAccounts');
    } else {
      console.error('\n❌ User cleanup failed with exit code', code);
      console.error('Check the error messages above for details.');
    }
  });
}

main().catch(console.error);