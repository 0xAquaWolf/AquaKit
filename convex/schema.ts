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
  }).index('email', ['email']),
});
