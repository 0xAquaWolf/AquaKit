// convex/migrations.ts
import { Migrations } from '@convex-dev/migrations';

import { components } from './_generated/api';
import type { DataModel, Doc } from './_generated/dataModel';

export const migrations = new Migrations<DataModel>(components.migrations);

// Helper: does a user doc contain any deprecated keys?
function hasDeprecated(u: any) {
  return 'banned' in u || 'banReason' in u || 'banExpires' in u || 'role' in u;
}

export const clearDeprecatedUserFields = migrations.define({
  table: 'users',
  // Only patch docs that actually have any of the keys.
  //@ts-ignore
  migrateOne: (ctx, user: Doc<'users'>) => {
    console.log('user', user);
    console.log(ctx);
    if (!hasDeprecated(user)) return; // no-op for this doc
    return {
      banned: undefined,
      banReason: undefined,
      banExpires: undefined,
      role: undefined,
    };
  },
});

// Optional runner
export const run = migrations.runner();
