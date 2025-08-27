#!/usr/bin/env node
/**
 * Environment Setup Script for AquaKit
 *
 * This script helps you set up environment variables for different deployments.
 * Run with: node scripts/setup-env.js [dev|prod]
 */

const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const environments = {
  dev: {
    SITE_URL: 'http://localhost:3000',
    // Add more dev-specific defaults
  },
  prod: {
    SITE_URL: 'https://your-production-domain.com',
    // Add more prod-specific defaults
  },
};

const requiredVars = [
  'SITE_URL',
  'BETTER_AUTH_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];

async function setEnvVar(env, name, value) {
  return new Promise((resolve, reject) => {
    const cmd = env === 'prod' ? 'convex env set' : 'convex env set --dev';
    const proc = spawn('npx', [cmd.split(' '), name, value].flat(), {
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Failed to set ${name}`));
    });
  });
}

async function main() {
  const env = process.argv[2] || 'dev';

  if (!['dev', 'prod'].includes(env)) {
    console.error('Usage: node setup-env.js [dev|prod]');
    process.exit(1);
  }

  console.log(`\n🚀 Setting up ${env.toUpperCase()} environment variables\n`);

  for (const varName of requiredVars) {
    const defaultValue = environments[env][varName] || '';
    const currentValue = await question(
      `${varName} ${defaultValue ? `(default: ${defaultValue})` : ''}: `
    );

    const value = currentValue.trim() || defaultValue;

    if (value) {
      try {
        await setEnvVar(env, varName, value);
        console.log(`✅ Set ${varName}`);
      } catch (error) {
        console.error(`❌ Failed to set ${varName}:`, error.message);
      }
    } else {
      console.log(`⚠️  Skipped ${varName} (no value provided)`);
    }
  }

  console.log(`\n✨ ${env.toUpperCase()} environment setup complete!\n`);
  rl.close();
}

main().catch(console.error);
