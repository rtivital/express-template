# OpenAPI Auto-Generation Guide

This project uses `@asteasolutions/zod-to-openapi` to auto-generate OpenAPI docs from Zod schemas. Zod schemas validate runtime data AND generate documentation—one source of truth, fully type-safe.

## How It Works

Each module has two files:
- `[module]-schema.ts` - Zod schemas with `.openapi()` metadata
- `[module]-routes.ts` - Route registrations using `registerRoute()`

Core infrastructure:
- `src/openapi/registry.ts` - Global registry
- `src/openapi/route-helper.ts` - Helper to register routes
- `src/openapi.ts` - Imports route registrations and generates spec

## Adding a New Endpoint

**Step 1: Define schemas with OpenAPI metadata**

```typescript
// src/modules/items/items-schema.ts
import z from 'zod';
import { registry } from '@/openapi/registry';

export const CreateItemSchema = z
  .object({
    name: z.string().openapi({ description: 'Item name', example: 'My Item' }),
    price: z.number().openapi({ description: 'Price in USD', example: 29.99 }),
  })
  .openapi('CreateItem');

export const ItemSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'My Item' }),
    price: z.number().openapi({ example: 29.99 }),
  })
  .openapi('Item');

// Register schemas for reuse
registry.register('CreateItem', CreateItemSchema);
registry.register('Item', ItemSchema);
```

**Step 2: Register routes**

```typescript
// src/modules/items/items-routes.ts
import { registerRoute } from '@/openapi/route-helper';
import { IdObjectSchema } from '@/validation';
import { CreateItemSchema, ItemSchema } from './items-schema';

export function registerItemRoutes() {
  registerRoute({
    method: 'post',
    path: '/api/v1/items',
    summary: 'Create item',
    tags: ['Items'],
    requiresAuth: true,
    request: { body: CreateItemSchema },
    responses: {
      201: { description: 'Created', schema: ItemSchema },
      401: { description: 'Unauthorized' },
    },
  });

  registerRoute({
    method: 'get',
    path: '/api/v1/items/{id}',
    summary: 'Get item',
    tags: ['Items'],
    requiresAuth: true,
    request: { params: IdObjectSchema },
    responses: {
      200: { description: 'Success', schema: ItemSchema },
      404: { description: 'Not found' },
    },
  });
}
```

**Step 3: Import in main OpenAPI file**

```typescript
// src/openapi.ts
import { registerItemRoutes } from './modules/items/items-routes';
// ... other imports

registerHealthRoutes();
registerUserRoutes();
registerItemRoutes(); // Add this

export const openApiSpec = generateOpenApiDocument();
```

**Step 4: Implement controller (unchanged)**

Controllers work exactly as before:

```typescript
// src/modules/items/items-controller.ts
ItemsController.post('/api/v1/items', validate(CreateItemSchema), sessionGuard, async (req, res) => {
  const item = await createItem(req.body);
  res.status(201).json(item);
});
```

## Common Patterns

**Paginated endpoints:**
```typescript
import { PaginationParamsSchema } from '@/validation';

registerRoute({
  request: { query: PaginationParamsSchema },
  // ...
});
```

**Multiple path parameters:**
```typescript
const ParamsSchema = z.object({ userId: IntIdSchema, itemId: IntIdSchema });

registerRoute({
  path: '/api/v1/users/{userId}/items/{itemId}',
  request: { params: ParamsSchema, body: UpdateSchema },
  // ...
});
```

## Useful Commands

```bash
# Validate generated spec
yarn openapi:validate

# Export to openapi.json (for Postman, etc.)
yarn openapi:export

# View Swagger UI
yarn dev
# Then visit http://localhost:4512/docs

# Run tests (includes OpenAPI tests)
yarn test
```

## Troubleshooting

**Schema not in Swagger?**
- Add `.openapi('SchemaName')` to definition
- Call `registry.register('SchemaName', schema)`
- Restart dev server

**Endpoint not showing?**
- Import route function in `src/openapi.ts`
- Call the function before `generateOpenApiDocument()`
- Match path/method with controller
