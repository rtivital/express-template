import { openApiSpec } from '../openapi';
import fs from 'node:fs';
import path from 'node:path';

function exportOpenApiSpec() {
  const outputPath = path.join(process.cwd(), 'openapi.json');

  console.log('📝 Exporting OpenAPI specification...\n');

  try {
    // Write the spec to a JSON file
    fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, undefined, 2), 'utf8');

    console.log(`✅ OpenAPI specification exported to: ${outputPath}`);
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

    // Show summary
    const pathCount = Object.keys(openApiSpec.paths).length;
    let totalEndpoints = 0;

    for (const methods of Object.values(openApiSpec.paths)) {
      for (const method of Object.keys(methods)) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
          totalEndpoints++;
        }
      }
    }

    console.log(`📋 Summary:`);
    console.log(`   - ${pathCount} paths`);
    console.log(`   - ${totalEndpoints} endpoints`);
    console.log(`   - ${Object.keys(openApiSpec.components?.schemas || {}).length} schemas`);

    console.log('\n✅ Export complete!');
  } catch (error) {
    console.error('❌ Error exporting OpenAPI specification:', error);
    throw error;
  }
}

exportOpenApiSpec();
