Here’s a clean, repo-ready summary you can drop into a `docs/convex-migrations.md` (or similar).

---

# Convex: Removing Deprecated Fields & Indexes (Zero-Downtime)

**Goal:** Remove `banned`, `banReason`, `banExpires`, and `role` from the `users` table (and drop related indexes) safely in **dev** and **prod**.

> Core idea: make fields **optional**, run an **online migration** to unset them, then **tighten the schema** and re-deploy. ([Stack by Convex](https://stack.convex.dev/intro-to-migrations?utm_source=chatgpt.com 'Intro to Migrations - Stack by Convex'))

---

## 0) Install & wire the Migrations component

```bash
npm i @convex-dev/migrations
```

```ts
// convex/convex.config.ts
import migrations from '@convex-dev/migrations/convex.config';
import { defineApp } from 'convex/server';

const app = defineApp();
app.use(migrations);
export default app;
```

The component runs batched, **stateful** online migrations and tracks progress so they don’t re-apply unless you reset state. You can run from CLI and pass `--prod` for production. ([Convex](https://www.convex.dev/components/migrations?utm_source=chatgpt.com 'Migrations'))

---

## 1) Transitional schema (make fields optional)

Temporarily allow the old fields so they can be removed from data first:

```ts
// convex/schema.ts (transitional)
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    avatarColor: v.optional(v.string()),
    avatarStorageId: v.optional(v.id('_storage')),
    banExpires: v.optional(v.float64()),
    banReason: v.optional(v.string()),
    banned: v.optional(v.boolean()),
    email: v.string(),
    lastAuthMethod: v.optional(
      v.union(
        v.literal('email'),
        v.literal('google'),
        v.literal('github'),
        v.literal('discord')
      )
    ),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal('admin'), v.literal('user'))),
  })
    .index('banned', ['banned'])
    .index('email', ['email'])
    .index('role', ['role']),
});
```

> Convex won’t let you deploy a schema that **removes** a field while data still contains that field. Make it `v.optional(...)`, migrate data, then remove it. ([Stack by Convex](https://stack.convex.dev/intro-to-migrations?utm_source=chatgpt.com 'Intro to Migrations - Stack by Convex'))

Deploy this transitional schema to the target deployment (dev first):

```bash
npx convex deploy
```

> `npx convex deploy` pushes **functions, indexes, and schema**. ([Convex Developer Hub](https://docs.convex.dev/cli?utm_source=chatgpt.com 'CLI | Convex Developer Hub'))

---

## 2) Define the migration (unset only when present)

```ts
// convex/migrations.ts
import { Migrations } from '@convex-dev/migrations';

import { components } from './_generated/api';
import type { DataModel } from './_generated/dataModel';

export const migrations = new Migrations<DataModel>(components.migrations);

function hasDeprecated(u: any) {
  return 'banned' in u || 'banReason' in u || 'banExpires' in u || 'role' in u;
}

export const clearDeprecatedUserFields = migrations.define({
  table: 'users',
  migrateOne: (_ctx, user: any) => {
    if (!hasDeprecated(user)) return; // no-op
    return {
      banned: undefined,
      banReason: undefined,
      banExpires: undefined,
      role: undefined,
    };
  },
});

// Runner if you prefer: migrations.runner()
export const run = migrations.runner();
```

> In Convex, `db.patch(id, { field: undefined })` **removes** that field. (This is the one case where `undefined` is significant.) ([Convex Developer Hub](https://docs.convex.dev/database/writing-data?utm_source=chatgpt.com 'Writing Data | Convex Developer Hub'))

Run it in **dev**:

```bash
# optional smoke test
npx convex run migrations:run '{fn:"migrations:clearDeprecatedUserFields", dryRun:true}'

# execute
npx convex run migrations:run '{fn:"migrations:clearDeprecatedUserFields"}'
```

If you ever see “Migration already done,” that’s because the component tracks state; to re-run you can reset via the provided cursor or rename the migration. ([Convex](https://www.convex.dev/components/migrations?utm_source=chatgpt.com 'Migrations'))

---

## 3) Verify (optional helper)

```ts
// convex/verify.ts
import { query } from './_generated/server';

export const anyDeprecatedUserFieldsLeft = query(async (ctx) => {
  const users = await ctx.db.query('users').collect();
  return users.some(
    (u: any) =>
      'banned' in u || 'banReason' in u || 'banExpires' in u || 'role' in u
  );
});
```

Run:

```bash
npx convex run verify:anyDeprecatedUserFieldsLeft
```

---

## 4) Finalize schema (remove fields & drop indexes)

Once data is clean, remove the fields and unused indexes:

```ts
// convex/schema.ts (final)
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    avatarColor: v.optional(v.string()),
    avatarStorageId: v.optional(v.id('_storage')),
    email: v.string(),
    lastAuthMethod: v.optional(
      v.union(
        v.literal('email'),
        v.literal('google'),
        v.literal('github'),
        v.literal('discord')
      )
    ),
    name: v.optional(v.string()),
  }).index('email', ['email']),
});
```

```bash
npx convex deploy
```

> On deploy, Convex **deletes indexes** that are no longer present in your schema—ensure your code no longer queries them. ([Convex Developer Hub](https://docs.convex.dev/database/reading-data/indexes/?utm_source=chatgpt.com 'Indexes | Convex Developer Hub'))

---

## 5) Production rollout

1. **Deploy transitional schema to prod** (fields optional; indexes intact):

   ```bash
   npx convex deploy
   ```

2. **Run the migration in prod**:

   ```bash
   # dry run
   npx convex run migrations:run '{fn:"migrations:clearDeprecatedUserFields", dryRun:true}' --prod
   # execute
   npx convex run migrations:run '{fn:"migrations:clearDeprecatedUserFields"}' --prod
   ```

   > Use `--prod` to target the production deployment for `run` and `logs`. ([Convex](https://www.convex.dev/components/migrations?utm_source=chatgpt.com 'Migrations'), [Convex Developer Hub](https://docs.convex.dev/cli?utm_source=chatgpt.com 'CLI | Convex Developer Hub'))

3. **Verify (optional)**:

   ```bash
   npx convex run verify:anyDeprecatedUserFieldsLeft --prod
   ```

4. **Finalize schema in prod** (remove fields & indexes) and redeploy:

   ```bash
   npx convex deploy
   ```

---

## Troubleshooting notes

- **Schema validation failed: “Object contains extra field … not in the validator.”**  
   This happens if you try to deploy the **final** schema while prod still has data with the old fields. Deploy the **transitional** schema, run the migration to unset fields, then deploy the **final** schema. ([Stack by Convex](https://stack.convex.dev/intro-to-migrations?utm_source=chatgpt.com 'Intro to Migrations - Stack by Convex'))
- **Migration says “already done.”**  
   The migrations component tracks state to prevent double-runs. Re-run with the suggested cursor reset or give the migration a new name if you need to re-apply. ([Convex](https://www.convex.dev/components/migrations?utm_source=chatgpt.com 'Migrations'))
