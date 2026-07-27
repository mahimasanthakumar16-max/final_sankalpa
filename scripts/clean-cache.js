const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '../.next/dev/cache'),
  path.join(__dirname, '../.next/cache'),
  path.join(__dirname, '../tsconfig.tsbuildinfo')
];

targets.forEach(targetPath => {
  if (fs.existsSync(targetPath)) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`[Clean] Cleared cache folder: ${targetPath}`);
    } catch (err) {
      console.warn(`[Clean] Could not remove ${targetPath}: ${err.message}`);
    }
  }
});
