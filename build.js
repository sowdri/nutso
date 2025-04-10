#!/usr/bin/env node

const esbuild = require('esbuild');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Make sure the dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Clean up previous build
console.log('🧹 Cleaning up previous build...');
try {
  fs.rmSync('dist', { recursive: true, force: true });
  fs.mkdirSync('dist');
} catch (err) {
  console.error('Error during cleanup:', err);
}

// Build CommonJS version
console.log('🔨 Building CommonJS version...');
esbuild.buildSync({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/main.js',
  bundle: true,
  platform: 'node',
  target: 'node14',
  format: 'cjs',
  sourcemap: true,
  minify: false,
  external: [], // List any external dependencies here if needed
});

// Build ESM version
console.log('🔨 Building ESM version...');
esbuild.buildSync({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/module.js',
  bundle: true,
  platform: 'neutral',
  target: 'es2018',
  format: 'esm',
  sourcemap: true,
  minify: false,
  external: [], // List any external dependencies here if needed
});

// Generate TypeScript declaration file using dts-bundle-generator with config
console.log('📝 Generating bundled TypeScript declaration file...');
try {
  execSync('npx dts-bundle-generator --config dts-bundle-generator.config.json', { stdio: 'inherit' });
} catch (e) {
  console.error('Error generating TypeScript declarations:', e);
  process.exit(1);
}

// Success message
console.log('✅ Build completed successfully!');

// Log the output files
console.log('\nOutput files:');
const listFiles = (dir, indent = '') => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      console.log(`${indent}📁 ${file}/`);
      listFiles(filePath, `${indent}  `);
    } else {
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`${indent}📄 ${file} (${sizeKB} KB)`);
    }
  });
};

listFiles('dist'); 