// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    avatarColor: v.optional(v.string()),
    avatarStorageId: v.optional(v.id('_storage')),
    // mark as optional so we can remove them safely
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
  })
    // keep indexes for now; we’ll drop them after data is clean
    .index('email', ['email']),
});
