#!/usr/bin/env node

/**
 * Setup Admin Configuration Script
 *
 * This script helps you configure admin users for your AquaKit application.
 * It will guide you through setting up the ADMIN_EMAILS environment variable
 * in your Convex deployment.
 */

const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  console.log('🔧 AquaKit Admin Setup\n');
  console.log(
    'This script will help you configure admin users for your application.\n'
  );

  try {
    // Get admin emails
    const adminEmailsInput = await question(
      'Enter admin email addresses (comma-separated):\n' +
        'Example: john@company.com,jane@company.com\n' +
        'Admin emails: '
    );

    if (!adminEmailsInput.trim()) {
      console.log('❌ No admin emails provided. Exiting.');
      rl.close();
      return;
    }

    // Validate email format
    const adminEmails = adminEmailsInput
      .split(',')
      .map((email) => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const email of adminEmails) {
      if (!emailRegex.test(email)) {
        console.log(`❌ Invalid email format: ${email}`);
        rl.close();
        return;
      }
    }

    console.log(`\n📧 Admin emails to configure: ${adminEmails.join(', ')}`);

    // Confirm deployment
    const deploymentChoice = await question(
      '\nWhich deployment would you like to configure?\n' +
        '1. Development (recommended for testing)\n' +
        '2. Production\n' +
        'Enter choice (1 or 2): '
    );

    let deploymentFlag = '';
    if (deploymentChoice === '1') {
      console.log('🔧 Configuring development deployment...');
    } else if (deploymentChoice === '2') {
      console.log('🚀 Configuring production deployment...');

      const confirmProd = await question(
        'Are you sure you want to configure production? (yes/no): '
      );

      if (confirmProd.toLowerCase() !== 'yes') {
        console.log('❌ Production setup cancelled.');
        rl.close();
        return;
      }
    } else {
      console.log('❌ Invalid choice. Exiting.');
      rl.close();
      return;
    }

    // Set environment variable
    console.log('\n🔄 Setting ADMIN_EMAILS environment variable...');

    const envArgs = ['env', 'set', 'ADMIN_EMAILS', adminEmailsInput];
    if (deploymentFlag) {
      envArgs.push(deploymentFlag);
    }

    await runCommand('npx', ['convex', ...envArgs]);

    console.log('\n✅ Admin emails configured successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure your admin users have accounts in the system');
    console.log('2. Visit the admin dashboard at /admin');
    console.log('3. Click "Initialize Admin Roles" to set admin permissions');
    console.log(
      '4. Admin users will now see the "🔧 Admin" button in the navigation\n'
    );
  } catch (error) {
    console.error('❌ Error setting up admin configuration:', error.message);
  } finally {
    rl.close();
  }
}

main();
