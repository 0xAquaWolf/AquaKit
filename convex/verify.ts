// convex/verify.ts
import { query } from './_generated/server';

export const anyDeprecatedUserFieldsLeft = query(async (ctx) => {
  const users = await ctx.db.query('users').collect();
  return users.some(
    (u: any) =>
      'banned' in u || 'banReason' in u || 'banExpires' in u || 'role' in u
  );
});
