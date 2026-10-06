import fs from 'node:fs';

fs.mkdirSync('public', { recursive: true });
fs.copyFileSync('favicon.svg', 'public/favicon.svg');
