#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { specs } from '../src/swagger.js';

// Ensure docs directory exists
const docsDir = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Generate OpenAPI spec file
const specPath = path.join(docsDir, 'openapi.json');
fs.writeFileSync(specPath, JSON.stringify(specs, null, 2));

console.log('✅ OpenAPI specification generated at:', specPath);
console.log('📖 Documentation will be available at:');
console.log('   - Swagger UI: http://localhost:3000/api-docs');
console.log('   - Static JSON spec:', specPath);
