import { defineSchema, defineTable } from "convex/schema";

import { v } from "convex/values";

export default defineSchema({
  Human: defineTable({
    type: v.literal("Human"),
    id: v.string(),
    name: v.string(),
    friends: v.array(v.union(v.id("Human"), v.id("Droid"))),
    appearsIn: v.array(v.number()),
    homePlanet: v.optional(v.string()),
  }),
  Droid: defineTable({
    type: v.literal("Droid"),
    id: v.string(),
    name: v.string(),
    friends: v.array(v.union(v.id("Human"), v.id("Droid"))),
    appearsIn: v.array(v.number()),
    primaryFunction: v.string(),
  }),
});
