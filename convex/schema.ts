import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    avatarColor: v.optional(v.string()),
  }).index('email', ['email']),
});
