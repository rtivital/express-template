import { openApiSpec } from '../openapi';

function validateOpenApiSpec() {
  console.log('🔍 Validating OpenAPI Specification...\n');

  // Validate basic structure
  if (!openApiSpec.openapi) {
    console.error('❌ Missing OpenAPI version');
    throw new Error('Missing OpenAPI version');
  }
  console.log(`✅ OpenAPI Version: ${openApiSpec.openapi}`);

  if (!openApiSpec.info) {
    console.error('❌ Missing info section');
    throw new Error('Missing info section');
  }
  console.log(`✅ API Title: ${openApiSpec.info.title}`);
  console.log(`✅ API Version: ${openApiSpec.info.version}`);

  // Validate paths
  if (!openApiSpec.paths || Object.keys(openApiSpec.paths).length === 0) {
    console.error('❌ No paths defined');
    throw new Error('No paths defined');
  }

  const pathCount = Object.keys(openApiSpec.paths).length;
  console.log(`✅ Paths defined: ${pathCount}`);

  // Count endpoints by method
  const endpointsByMethod: Record<string, number> = {};
  let totalEndpoints = 0;

  for (const [_path, methods] of Object.entries(openApiSpec.paths)) {
    for (const method of Object.keys(methods)) {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        endpointsByMethod[method] = (endpointsByMethod[method] || 0) + 1;
        totalEndpoints++;
      }
    }
  }

  console.log(`✅ Total endpoints: ${totalEndpoints}`);
  console.log('   Breakdown by method:');
  for (const [method, count] of Object.entries(endpointsByMethod)) {
    console.log(`   - ${method.toUpperCase()}: ${count}`);
  }

  // Validate components
  if (!openApiSpec.components) {
    console.error('❌ Missing components section');
    throw new Error('Missing components section');
  }
  console.log('✅ Components section defined');

  // Validate security schemes
  if (!openApiSpec.components.securitySchemes) {
    console.error('❌ Missing security schemes');
    throw new Error('Missing security schemes');
  }
  const securitySchemes = Object.keys(openApiSpec.components.securitySchemes);
  console.log(`✅ Security schemes: ${securitySchemes.join(', ')}`);

  // Validate schemas
  if (!openApiSpec.components.schemas) {
    console.error('❌ Missing schemas');
    throw new Error('Missing schemas');
  }
  const schemas = Object.keys(openApiSpec.components.schemas);
  console.log(`✅ Schemas defined: ${schemas.length}`);
  console.log(`   Schemas: ${schemas.join(', ')}`);

  console.log('\n✅ OpenAPI specification is valid!');
}

validateOpenApiSpec();
