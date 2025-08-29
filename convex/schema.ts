import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    avatarStorageId: v.optional(v.id('_storage')),
    avatarColor: v.optional(v.string()),
    lastAuthMethod: v.optional(
      v.union(
        v.literal('email'),
        v.literal('google'),
        v.literal('github'),
        v.literal('discord')
      )
    ),
    role: v.optional(v.union(v.literal('admin'), v.literal('user'))),
    // Admin plugin fields for user banning
    banned: v.optional(v.boolean()),
    banReason: v.optional(v.string()),
    banExpires: v.optional(v.number()), // Unix timestamp
  })
    .index('email', ['email'])
    .index('role', ['role'])
    .index('banned', ['banned']),
});
